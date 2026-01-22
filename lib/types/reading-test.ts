
export type QuestionType =
  | 'fill-in-blank'  // Matching existing code usage
  | 'true-false-not-given'
  | 'multiple-choice'
  | 'matching'
  | 'summary-completion'; // New type

// New structure for Grouped Questions
export interface QuestionPart {
  id: string;
  type: QuestionType;
  instruction: string;
  content?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  questionNumber: number;
  type?: string; // Optional if inherited from part
  text?: string;
  statement?: string; // T/F
  options?: string[];
  correctAnswer: string;
  blankNumber?: number; // legacy
}

export interface ReadingTest {
  id?: string;
  title: string;
  targetBand: number;
  duration: number; // minutes
  passageContent: string;
  questions: (Question | QuestionPart)[]; // Supports flat or grouped
  createdBy?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | number | Record<string, string>;
}
