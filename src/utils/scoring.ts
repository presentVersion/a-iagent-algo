import { Interaction, LatentCluster, Reel } from '../types';
import { DEMO_REELS } from '../data/demoReels';
import { DEFAULT_RECOMMENDATION_CONFIG, CLUSTER_MAPPING, ALL_CLUSTERS, LEARNING_PATHS } from '../services/recommendationConfig';

/**
 * Calculates user interest profile with recency decay.
 * Older events contribute less weight.
 */
export function calculateDecayedInterests(
  interactions: Interaction[],
  userFeedback: { topicPenalties: Record<string, number>; topicBoosts: Record<string, number> },
  decayRate = DEFAULT_RECOMMENDATION_CONFIG.decayRate,
  customWeights?: Record<string, number>
): LatentCluster[] {
  const clusterScores: Record<string, { score: number; evidence: Set<string>; reasons: string[] }> = {};

  // Initialize
  ALL_CLUSTERS.forEach(cluster => {
    clusterScores[cluster] = { score: 0, evidence: new Set(), reasons: [] };
  });

  // Sort interactions by timestamp ascending (oldest first)
  const sortedInteractions = [...interactions].sort((a, b) => a.timestamp - b.timestamp);

  sortedInteractions.forEach((interaction) => {
    const reel = DEMO_REELS.find(r => r.id === interaction.reelId);
    if (!reel) return;

    // Retrieve interaction weight
    const activeWeights = customWeights || DEFAULT_RECOMMENDATION_CONFIG.weights;
    const rawWeight = activeWeights[interaction.type] || 0.5;

    // Apply count-based decay: multiply all previous scores by decayRate
    ALL_CLUSTERS.forEach(cluster => {
      if (clusterScores[cluster]) {
        clusterScores[cluster].score *= decayRate;
      }
    });

    // Find matching clusters for this reel
    const matchingClusters = new Set<string>();
    const keysToTest = [
      reel.domain.toLowerCase(),
      reel.topic.toLowerCase(),
      ...reel.subtopics.map(s => s.toLowerCase())
    ];

    keysToTest.forEach(key => {
      if (CLUSTER_MAPPING[key]) {
        CLUSTER_MAPPING[key].forEach(c => matchingClusters.add(c));
      }
    });

    // Add current event weight to matching clusters
    matchingClusters.forEach(cluster => {
      const data = clusterScores[cluster];
      if (data) {
        data.score += rawWeight;
        if (rawWeight > 0) {
          data.evidence.add(reel.title);
          const verb = interaction.type === 'like' ? 'liked' :
                       interaction.type === 'save' ? 'saved' :
                       interaction.type === 'share' ? 'shared' :
                       interaction.type === 'watch_complete' ? 'watched fully' : 'viewed';
          const reasonStr = `✓ ${verb} "${reel.title}"`;
          if (!data.reasons.includes(reasonStr)) {
            data.reasons.push(reasonStr);
          }
        } else if (rawWeight < 0) {
          const reasonStr = `✗ skipped "${reel.title}"`;
          if (!data.reasons.includes(reasonStr)) {
            data.reasons.push(reasonStr);
          }
        }
      }
    });
  });

  // Apply boosts and penalties, sort descending
  return Object.entries(clusterScores)
    .map(([name, data]) => {
      let finalScore = data.score;
      if (userFeedback.topicBoosts[name]) {
        finalScore += userFeedback.topicBoosts[name];
      }
      if (userFeedback.topicPenalties[name]) {
        finalScore -= userFeedback.topicPenalties[name];
      }
      return {
        name,
        score: Number(Math.max(finalScore, -10).toFixed(2)),
        evidenceCount: data.evidence.size,
        reasons: data.reasons
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Assesses hype level and quality
 */
export function assessQualityAndHype(reel: Reel) {
  let hypeRisk: "Low" | "Medium" | "High" = "Low";
  let reason = "Presents technical concepts with grounded claims.";

  if (reel.hypeScore > 0.8) {
    hypeRisk = "High";
    reason = "Contains exaggerated career or monetary outcome promises.";
  } else if (reel.hypeScore > 0.4) {
    hypeRisk = "Medium";
    reason = "Uses sensationalized clickbait headers.";
  }

  return {
    qualityScore: reel.qualityScore,
    hypeRisk,
    reason
  };
}

/**
 * Scans if the user has completed a stage in a learning path.
 * Returns the next recommended learning path topic.
 */
export function getNextLearningPathStep(
  interactions: Interaction[],
  primaryCluster: string
): string | null {
  const path = LEARNING_PATHS[primaryCluster];
  if (!path) return null;

  // Find all reels matching this cluster that the user watched fully
  const completedReelTitles = interactions
    .filter(i => i.type === 'watch_complete' || i.type === 'save')
    .map(i => DEMO_REELS.find(r => r.id === i.reelId)?.title || '');

  // Find the first step in the path not completed
  for (let i = 0; i < path.length; i++) {
    const stepName = path[i];
    // Check if user watched a reel containing this step in the title or subtopics
    const stepCompleted = completedReelTitles.some(t => 
      t.toLowerCase().includes(stepName.toLowerCase())
    );
    if (!stepCompleted) {
      return stepName;
    }
  }

  return path[path.length - 1]; // Return final step if everything is done
}

/**
 * Main Algorithm: Rank candidates using ScrollIQ Latent Inference
 */
export function scoreReelScrollIQ(
  reel: Reel,
  primaryInterest: string,
  adjacentInterests: string[],
  activeModes: { learningMode: boolean; careerMode: boolean; makeUseful: boolean },
  previouslyViewedIds: string[]
): number {
  let score = 0;

  // 1. Base Score derived from Quality & Hype Penalty
  score += reel.qualityScore * 2.0;
  score -= reel.hypeScore * 1.5;

  // 2. Interest Matching
  const keyMatches = [
    reel.domain.toLowerCase(),
    reel.topic.toLowerCase(),
    ...reel.subtopics.map(s => s.toLowerCase())
  ];

  let matchesPrimary = false;
  let matchesAdjacent = false;

  keyMatches.forEach(key => {
    const clusters = CLUSTER_MAPPING[key] || [];
    if (clusters.includes(primaryInterest)) {
      matchesPrimary = true;
    }
    if (clusters.some(c => adjacentInterests.includes(c))) {
      matchesAdjacent = true;
    }
  });

  if (matchesPrimary) {
    score += 5.0; // Primary interest boost
  } else if (matchesAdjacent) {
    score += 2.5; // Adjacent interest discovery boost
  }

  // 3. Learning Mode Boosts
  if (activeModes.learningMode) {
    score += reel.educationalValue * DEFAULT_RECOMMENDATION_CONFIG.learningModeBoost.educationalValueWeight;
    score += reel.technicalDepth * 0.5; // Technical depth bonus
    score -= reel.hypeScore * Math.abs(DEFAULT_RECOMMENDATION_CONFIG.learningModeBoost.hypePenaltyWeight);
  }

  // 4. Career Mode Boosts
  if (activeModes.careerMode) {
    const isTarget = DEFAULT_RECOMMENDATION_CONFIG.careerModeBoost.targetCategories.includes(reel.category) ||
                     DEFAULT_RECOMMENDATION_CONFIG.careerModeBoost.targetCategories.includes(reel.topic);
    if (isTarget) {
      score += DEFAULT_RECOMMENDATION_CONFIG.careerModeBoost.priorityWeight;
    }
  }

  // 5. Make My Feed More Useful Boost
  if (activeModes.makeUseful) {
    score += reel.educationalValue * 2.0;
    score += reel.careerRelevance * 2.0;
    score -= reel.entertainmentValue * 1.5; // downgrade pure entertainment
  }

  // 6. Previously Viewed Repetition Penalty
  if (previouslyViewedIds.includes(reel.id)) {
    score -= 10.0;
  }

  return Number(score.toFixed(2));
}

/**
 * Baseline Naive Algorithm: Keyword-based matching
 * Simply matches keywords in titles/description to the last watched reel
 */
export function scoreReelKeywordOnly(
  reel: Reel,
  lastReel: Reel,
  previouslyViewedIds: string[]
): number {
  let score = 0;
  
  // Exact topic matching
  if (reel.topic.toLowerCase() === lastReel.topic.toLowerCase()) {
    score += 8.0;
  }
  
  // Tag intersection
  const tagIntersection = reel.subtopics.filter(t => lastReel.subtopics.includes(t));
  score += tagIntersection.length * 2.0;

  // High engagement bias (prefers clickbait virality)
  score += reel.entertainmentValue * 4.0;
  score += reel.hypeScore * 3.0; // Naive algorithms reward hype clickbait!

  // Previously Viewed Repetition Penalty (smaller penalty, leads to bubbles)
  if (previouslyViewedIds.includes(reel.id)) {
    score -= 2.0;
  }

  return Number(score.toFixed(2));
}

export function inferLatentInterests(
  interactions: Interaction[],
  userFeedback: { topicPenalties: Record<string, number>; topicBoosts: Record<string, number> },
  decayRate?: number,
  customWeights?: Record<string, number>
): LatentCluster[] {
  return calculateDecayedInterests(interactions, userFeedback, decayRate, customWeights);
}
