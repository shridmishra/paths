/**
 * TypeScript types for API data structures
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Path {
  id: string;
  title: string;
  description: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  pathId: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'interview';
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
  userId: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  completionRate: number;
}

// Request/Response types

export interface CreateUserRequest {
  email: string;
  name?: string;
}

export interface CreatePathRequest {
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  userId: string;
}

export interface CreateTopicRequest {
  title: string;
  description?: string;
  order: number;
  pathId: string;
}

export interface CreateQuestionRequest {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'interview';
  topicId: string;
}

export interface CreateProgressRequest {
  userId: string;
  questionId: string;
  completed: boolean;
  score?: number;
}

export interface UpdateProgressRequest {
  completed?: boolean;
  score?: number;
}
