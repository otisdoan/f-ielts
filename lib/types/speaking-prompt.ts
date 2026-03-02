export type SpeakingPart = 1 | 2 | 3;

export interface SpeakingPrompt {
  id?: string;
  title: string;
  part: SpeakingPart;
  topic: string;
  promptText: string;
  bulletPoints?: string[]; // For Part 2: "You should say..." points
  followUpQuestions?: string[]; // For Part 3: Discussion questions
  preparationTime: number; // In seconds (usually 60 for Part 2, 0 for others)
  speakingTime: number; // In seconds (recommended speaking duration)
  tips?: string[]; // Speaking tips for this prompt
  targetBand: number;
  createdBy?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpeakingAttempt {
  id?: string;
  promptId: string;
  userId: string;
  audioUrl: string; // URL to recorded audio file
  duration: number; // Actual recording duration in seconds
  transcript?: string; // Speech-to-text transcript (if available)
  aiFeedback?: {
    overallScore: number; // 0-9 band score
    fluencyScore: number;
    pronunciationScore: number;
    vocabularyScore: number;
    grammarScore: number;
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
  };
  createdAt?: string;
}
