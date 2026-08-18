import { InteractionType } from '../types';

export interface RecommendationConfig {
  weights: Record<InteractionType | 'short_view' | 'replay' | 'follow_creator' | 'follow_topic', number>;
  explorationMix: {
    personalized: number; // content matching inferred interest
    adjacent: number;     // adjacent tech domains
    educational: number;  // computer science fundamentals
    exploratory: number;  // randomized discovery content
  };
  decayRate: number; // Decay multiplier per previous interaction (count-based decay)
  timeDecayHalfLifeMs: number; // Time-based decay half life (e.g. 5 minutes in ms)
  learningModeBoost: {
    educationalValueWeight: number;
    careerRelevanceWeight: number;
    technicalDepthWeight: number;
    hypePenaltyWeight: number;
  };
  careerModeBoost: {
    targetCategories: string[];
    priorityWeight: number;
  };
}

export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
  // Configured scoring system to match historical unit tests and prompt preferences
  weights: {
    'skip': -1.5,
    'short_view': -0.5,
    'watch_partial': 1.0,
    'watch_complete': 2.0,
    'replay': 1.5,
    'like': 2.5,
    'save': 3.0,
    'share': 2.0,
    'follow_creator': 2.5,
    'follow_topic': 3.0
  },
  explorationMix: {
    personalized: 0.70,
    adjacent: 0.15,
    educational: 0.10,
    exploratory: 0.05
  },
  decayRate: 0.95, // interest score decays by multiplying with 0.95 for each historical event
  timeDecayHalfLifeMs: 5 * 60 * 1000, // 5 minutes half-life
  learningModeBoost: {
    educationalValueWeight: 3.0,
    careerRelevanceWeight: 1.5,
    technicalDepthWeight: 2.0,
    hypePenaltyWeight: -2.5
  },
  careerModeBoost: {
    targetCategories: ['DSA', 'Cloud', 'HLD', 'Cybersecurity', 'AI', 'Developer Tools', 'Career'],
    priorityWeight: 2.5
  }
};

export const ALL_CLUSTERS = [
  'Software Engineering',
  'AI & Machine Learning',
  'Cloud Computing',
  'Data Structures & Algorithms',
  'Hardware',
  'Cybersecurity',
  'Game Development',
  'Career Development'
];

export const CLUSTER_MAPPING: Record<string, string[]> = {
  'java': ['Software Engineering'],
  'cpp': ['Software Engineering'],
  'python': ['Software Engineering', 'AI & Machine Learning'],
  'programming': ['Software Engineering'],
  'coding': ['Software Engineering'],
  'coding interviews': ['Software Engineering', 'Career Development'],
  'software engineering': ['Software Engineering', 'Career Development'],
  'web development': ['Software Engineering'],
  'databases': ['Software Engineering', 'Cloud Computing'],
  'postgresql': ['Software Engineering', 'Cloud Computing'],
  'indexing': ['Software Engineering', 'Cloud Computing'],
  'scaling': ['Software Engineering', 'Cloud Computing'],
  'hld': ['Software Engineering', 'Cloud Computing'],
  'load-balancers': ['Software Engineering', 'Cloud Computing'],
  'sharding': ['Software Engineering', 'Cloud Computing'],
  'system-design': ['Software Engineering', 'Cloud Computing'],
  'ai': ['AI & Machine Learning'],
  'machine-learning': ['AI & Machine Learning'],
  'transformers': ['AI & Machine Learning'],
  'deep-learning': ['AI & Machine Learning'],
  'chatgpt': ['AI & Machine Learning'],
  'generative ai': ['AI & Machine Learning'],
  'nocode': ['AI & Machine Learning', 'Career Development'],
  'dsa': ['Data Structures & Algorithms'],
  'algorithms': ['Data Structures & Algorithms'],
  'binary-search': ['Data Structures & Algorithms'],
  'hashmaps': ['Data Structures & Algorithms'],
  'dynamic-programming': ['Data Structures & Algorithms'],
  'homelab': ['Hardware'],
  'servers': ['Hardware', 'Cloud Computing'],
  'clusters': ['Hardware', 'Cloud Computing'],
  'raspberrypi': ['Hardware'],
  'laptop': ['Hardware'],
  'developer hardware': ['Hardware'],
  'cybersecurity': ['Cybersecurity'],
  'hacking': ['Cybersecurity'],
  'game-dev': ['Game Development'],
  'gamedev': ['Game Development'],
  'gaming': ['Game Development'],
  'career': ['Career Development', 'Software Engineering'],
  'career development': ['Career Development', 'Software Engineering'],
  'resume-building': ['Career Development'],
  'job-hunting': ['Career Development'],
  'career advice': ['Career Development'],
  'career-guarantees': ['Career Development']
};

// Map of topics to adjacent discovery targets
export const ADJACENT_TOPICS_MAP: Record<string, string[]> = {
  'Software Engineering': ['Cloud Computing', 'Data Structures & Algorithms', 'Career Development'],
  'AI & Machine Learning': ['Software Engineering', 'Cloud Computing'],
  'Cloud Computing': ['Software Engineering', 'Cybersecurity'],
  'Data Structures & Algorithms': ['Software Engineering', 'Game Development'],
  'Hardware': ['Software Engineering', 'Cloud Computing'],
  'Game Development': ['Software Engineering', 'Data Structures & Algorithms'],
  'Career Development': ['Software Engineering']
};

// Sequenced Learning Paths
export const LEARNING_PATHS: Record<string, string[]> = {
  'Software Engineering': [
    'Programming Fundamentals',
    'Version Control with Git',
    'Building REST APIs',
    'Database Indexing & Schema Design',
    'System Design Fundamentals'
  ],
  'AI & Machine Learning': [
    'Intro to Python Programming',
    'Linear Algebra & Calculus',
    'Neural Networks from Scratch',
    'Attention Mechanisms & Transformers',
    'Deploying ML models'
  ],
  'Cloud Computing': [
    'Linux Command Line Basics',
    'Virtual Machines & Containers',
    'Docker & Kubernetes Scale',
    'Serverless Functions & APIs',
    'Architecting Multi-region Databases'
  ],
  'Data Structures & Algorithms': [
    'Time & Space Complexity (Big-O)',
    'Arrays, Lists & HashMaps',
    'Sorting & Searching Algorithms',
    'Trees, Graphs & Traversals',
    'Dynamic Programming Patterns'
  ]
};

export type FeedContentMode = 'live' | 'curated' | 'demo';
