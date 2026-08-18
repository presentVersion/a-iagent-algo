import { describe, it, expect } from 'vitest';
import { inferLatentInterests, assessQualityAndHype } from '../utils/scoring';
import { generateMockRecommendation } from '../services/mockAIService';
import { Interaction, Reel } from '../types';

describe('ScrollSense AI Recommendation Engine Tests', () => {

  describe('Unit Tests: Interaction Scoring & Interest Clustering', () => {
    it('should return 0 score and default structures when no interactions occur', () => {
      const result = inferLatentInterests([], { topicPenalties: {}, topicBoosts: {} });
      expect(result.length).toBeGreaterThan(0);
      result.forEach(cluster => {
        expect(cluster.score).toBe(0);
        expect(cluster.evidenceCount).toBe(0);
      });
    });

    it('should calculate score weights correctly based on interaction types', () => {
      const interactions: Interaction[] = [
        { reelId: 'reel-1', type: 'like', timestamp: Date.now() }, // Java topic: Software Engineering
        { reelId: 'reel-2', type: 'skip', timestamp: Date.now() } // SWE lifestyle topic: Software Engineering, Career
      ];
      
      const result = inferLatentInterests(interactions, { topicPenalties: {}, topicBoosts: {} }, 1.0);
      
      const sweCluster = result.find(c => c.name === 'Software Engineering');
      const careerCluster = result.find(c => c.name === 'Career Development');
      
      // reel-1: like (+2.5) -> Software Engineering, Career Development
      // reel-2: skip (-1.5) -> Software Engineering, Career Development
      // Software Engineering = 2.5 - 1.5 = 1.0
      // Career Development = 2.5 - 1.5 = 1.0
      expect(sweCluster?.score).toBe(1.0);
      expect(careerCluster?.score).toBe(1.0);
    });

    it('should apply topic penalties and boosts correctly', () => {
      const interactions: Interaction[] = [
        { reelId: 'reel-1', type: 'like', timestamp: Date.now() } // Software Engineering
      ];
      
      const penalties = { 'Software Engineering': 5 }; // penalty decreases score by 5
      const boosts = { 'Software Engineering': 10 }; // boost increases score by 10
      
      const resultNormal = inferLatentInterests(interactions, { topicPenalties: {}, topicBoosts: {} }, 1.0);
      const resultModified = inferLatentInterests(interactions, { topicPenalties: penalties, topicBoosts: boosts }, 1.0);
      
      const normalScore = resultNormal.find(c => c.name === 'Software Engineering')?.score || 0;
      const modifiedScore = resultModified.find(c => c.name === 'Software Engineering')?.score || 0;
      
      expect(modifiedScore).toBe(normalScore - 5 + 10);
    });
  });

  describe('Unit Tests: Hype Assessment & Quality Filter', () => {
    it('should flag clickbait reels with HIGH hype risk', () => {
      const clickbaitReel = {
        title: "10 AI Tools That Will Guarantee You a Job in 2026",
        hypeScore: 0.95,
        qualityScore: 0.15,
        description: "land a $200k job guaranteed!"
      };
      
      const assessment = assessQualityAndHype(clickbaitReel as Reel);
      expect(assessment.hypeRisk).toBe('High');
      expect(assessment.reason).toContain('Contains exaggerated career or monetary outcome promises');
    });

    it('should flag educational content with LOW hype risk', () => {
      const eduReel = {
        title: "Why Big-O Notation Actually Matters",
        hypeScore: 0.05,
        qualityScore: 0.95,
        description: "Visualizing O(1), O(N), and O(N^2)"
      };
      
      const assessment = assessQualityAndHype(eduReel as Reel);
      expect(assessment.hypeRisk).toBe('Low');
    });
  });

  describe('Integration Tests: Trap Scenario Demonstration', () => {
    it('should pass the Trap Test by inferring Software Engineering instead of Java specifically', () => {
      // Load interactions simulating the Trap Test:
      // Java meme (reel-1), SWE lifestyle (reel-2), Coding interview joke (reel-3), Laptop comparison (reel-4)
      const interactions: Interaction[] = [
        { reelId: 'reel-1', type: 'like', timestamp: Date.now() },
        { reelId: 'reel-2', type: 'watch_complete', timestamp: Date.now() },
        { reelId: 'reel-3', type: 'save', timestamp: Date.now() },
        { reelId: 'reel-4', type: 'watch_complete', timestamp: Date.now() }
      ];
      
      const interests = inferLatentInterests(interactions, { topicPenalties: {}, topicBoosts: {} });
      const topInterest = interests[0];
      
      // Top interest should be Software Engineering, not Java (which isn't even a main cluster name, but clustered under SWE)
      expect(topInterest.name).toBe('Software Engineering');
      
      // Let's run mock recommendation engine on this interaction trace
      const recommendation = generateMockRecommendation(interactions, 'reel-3', { topicPenalties: {}, topicBoosts: {} });
      
      expect(recommendation.detectedInterest.topic).toBe('Software Engineering');
      expect(recommendation.recommendation.category).toBe('DSA'); // Instead of Java meme compilation, recommend algorithmic interview patterns
      expect(recommendation.recommendation.title).toBe('How DSA Patterns Actually Help in Coding Interviews');
    });
  });

  describe('Edge Cases', () => {
    it('should gracefully fallback to default recommendations if interactions are conflictual or empty', () => {
      const recommendation = generateMockRecommendation([], 'reel-1', { topicPenalties: {}, topicBoosts: {} });
      expect(recommendation.detectedInterest.topic).toBe('Software Engineering');
      expect(recommendation.recommendation.title).toBeDefined();
    });

    it('should override recommendations when current reel is highly hyped clickbait', () => {
      const recommendation = generateMockRecommendation([], 'reel-9', { topicPenalties: {}, topicBoosts: {} });
      expect(recommendation.qualityAssessment.hypeRisk).toBe('Low'); // Recommended reel should be safe (low hype risk)
      expect(recommendation.recommendation.category).toBe('AI'); // Standardized guide rather than clickbait
      expect(recommendation.recommendation.title).toBe('How AI Coding Assistants Actually Affect Developer Workflows');
    });
  });

});
