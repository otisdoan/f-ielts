export type ListeningQuestionType =
  | 'fill-in-blank'
  | 'multiple-choice'
  | 'matching'
  | 'map-diagram-labeling'
  | 'form-completion';

export interface ListeningQuestion {
  id: string;
  questionNumber: number;
  type: ListeningQuestionType;
  text?: string;
  label?: string;
  options?: string[];
  correctAnswer: string;
}

export interface ListeningPartContext {
  title?: string;
  prefilledData?: Record<string, string>;
  imageUrl?: string;
}

export interface ListeningPart {
  partNumber: number;
  title: string;
  instruction: string;
  context?: ListeningPartContext;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id?: string;
  title: string;
  targetBand: number;
  duration: number; // minutes
  audioUrl: string;
  audioDuration: number; // seconds
  canReplay: boolean;
  parts: ListeningPart[];
  createdBy?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListeningStudentAnswer {
  questionId: string;
  answer: string;
}

export interface ListeningTestSubmission {
  testId: string;
  answers: ListeningStudentAnswer[];
  timeTaken: number; // seconds
}
