/// <reference types="vite/client" />
import { GoogleGenAI } from '@google/genai';
import { Interaction, RecommendationResult } from '../types';
import { generateMockRecommendation } from './mockAIService';

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ENV_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string) || 'gemini-1.5-flash';

export const HAS_ENV_KEY = typeof ENV_API_KEY === 'string' && ENV_API_KEY.trim().length > 0;

/**
 * Service to request recommendations from the Google Gemini API using the @google/genai SDK.
 * Falls back gracefully to mock responses if key is not configured or in case of errors.
 */
export async function generateAIRecommendation(
  interactions: Interaction[],
  currentReelId: string,
  userFeedback: { topicPenalties: Record<string, number>; topicBoosts: Record<string, number> },
  customApiKey?: string,
  activeModes = { learningMode: false, careerMode: false, makeUseful: false }
): Promise<{ result: RecommendationResult; mode: 'Gemini AI' | 'Demo Heuristics' }> {
  
  const activeKey = (customApiKey && customApiKey.trim().length > 0) ? customApiKey : ENV_API_KEY;

  if (!activeKey || activeKey.trim().length === 0) {
    return {
      result: generateMockRecommendation(interactions, currentReelId, userFeedback, activeModes),
      mode: 'Demo Heuristics'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: activeKey });
    
    const contextString = interactions.map(i => {
      return `ReelID: ${i.reelId}, Action: ${i.type}, Timestamp: ${new Date(i.timestamp).toISOString()}`;
    }).join('\n');

    const prompt = `
You are ScrollIQ, an intelligent, career-oriented educational recommendation system underneath a unified tech shorts feed.
The student is watching short videos. We want to convert their scroll into active, high-value technical learning.

Interaction history (includes micro-signals):
${contextString}

Current Reel ID: ${currentReelId}
Topic penalties (Not Interested): ${JSON.stringify(userFeedback.topicPenalties)}
Topic boosts: ${JSON.stringify(userFeedback.topicBoosts)}

Active Platform Modes:
- Learning Mode: ${activeModes.learningMode ? 'ACTIVE (prioritize educational value, sequential progression pathways, heavily penalize clickbait)' : 'INACTIVE'}
- Career Mode: ${activeModes.careerMode ? 'ACTIVE (prioritize system design, Cloud, DSA, and devops)' : 'INACTIVE'}
- Make My Feed More Useful: ${activeModes.makeUseful ? 'ACTIVE (boost CS fundamentals and career readiness, penalize memes)' : 'INACTIVE'}

STRICT REQUIREMENT:
If the user interacts with developer vlogs, Java memes, and interview jokes, DO NOT recommend a shallow "Java meme". Recommend a broader category like "Data Structures & Algorithms" or "System Design".
If the current reel is clickbait (e.g. "10 AI Tools that Guarantee a Job"), flag high clickbait risk and recommend grounded educational content instead.

Return a JSON object conforming exactly to this schema:
{
  "currentReel": {
    "id": "string",
    "title": "string"
  },
  "detectedInterest": {
    "topic": "string (the broad cluster name)",
    "confidence": "High" | "Medium" | "Low",
    "evidence": ["string explaining why this interest was inferred"]
  },
  "recommendation": {
    "title": "string (the recommended educational content title)",
    "topic": "string (the subtopic)",
    "category": "AI" | "DSA" | "Java" | "HLD" | "Cybersecurity" | "Cloud" | "Hardware" | "Career" | "Other",
    "why": "string (bridge connection explanation, factoring in the active learning/career modes)",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "learningMinutes": 15
  },
  "qualityAssessment": {
    "qualityScore": 0.90, // score from 0.0 to 1.0
    "hypeRisk": "Low" | "Medium" | "High",
    "reason": "string explaining clickbait/hype factors"
  }
}
`;

    const response = await ai.models.generateContent({
      model: ENV_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const json = JSON.parse(text) as RecommendationResult;
    
    if (!json.detectedInterest || !json.recommendation || !json.qualityAssessment) {
      throw new Error("Invalid structure returned by Gemini API");
    }

    return {
      result: json,
      mode: 'Gemini AI'
    };

  } catch (error) {
    console.error("Gemini API call failed. Falling back to local intelligence.", error);
    return {
      result: generateMockRecommendation(interactions, currentReelId, userFeedback, activeModes),
      mode: 'Demo Heuristics'
    };
  }
}
