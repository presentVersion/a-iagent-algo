export interface Reel {
  id: string;
  title: string;
  category: string;
  topic: string;
  creator: string;
  description: string;
  thumbnailColor: string; // fallback color
  youtubeId: string; // YouTube Shorts Video ID for iframe embeds
  subtopics: string[];
  domain: string;
  intent: string;
  context: string;
  technicalDepth: number; // 1 to 5
  educationalValue: number; // 0 to 1
  careerRelevance: number; // 0 to 1
  entertainmentValue: number; // 0 to 1
  qualityScore: number; // 0 to 1
  hypeScore: number; // 0 to 1
}

export type InteractionType = 'watch_complete' | 'watch_partial' | 'like' | 'save' | 'share' | 'skip';

export interface Interaction {
  reelId: string;
  type: InteractionType;
  timestamp: number;
}

export interface RecommendationResult {
  currentReel: {
    id: string;
    title: string;
  };
  detectedInterest: {
    topic: string;
    confidence: "High" | "Medium" | "Low";
    evidence: string[];
  };
  recommendation: {
    title: string;
    topic: string;
    category:
      | "AI"
      | "DSA"
      | "Java"
      | "HLD"
      | "Cybersecurity"
      | "Cloud"
      | "Hardware"
      | "Career"
      | "Other";
    why: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    learningMinutes?: number;
  };
  qualityAssessment: {
    qualityScore: number;
    hypeRisk: "Low" | "Medium" | "High";
    reason: string;
  };
}

export interface LatentCluster {
  name: string;
  score: number;
  evidenceCount: number;
  reasons: string[];
}

export interface ImpactMetrics {
  reelsDiscovered: number;
  topicsExplored: number;
  careerTopicsFound: number;
  learningMinutes: number;
  educationalRatio: number;
}

export type UserRole = 'login' | 'student' | 'creator';
