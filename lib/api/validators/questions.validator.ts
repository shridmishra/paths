import { z } from 'zod';

export const createQuestionSchema = z.object({
  body: z.object({
    question: z.string().min(3, 'Question must be at least 3 characters'),
    answer: z.string().min(1, 'Answer is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    type: z.enum(['quiz', 'interview']).optional(),
    topicId: z.string().uuid('Invalid topic ID'),
  }),
});

export const updateQuestionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid question ID'),
  }),
  body: z.object({
    question: z.string().min(3, 'Question must be at least 3 characters').optional(),
    answer: z.string().min(1, 'Answer is required').optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    type: z.enum(['quiz', 'interview']).optional(),
  }),
});

export const getQuestionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid question ID'),
  }),
});

export const getQuestionsSchema = z.object({
  query: z.object({
    type: z.enum(['quiz', 'interview']).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    topicId: z.string().uuid('Invalid topic ID').optional(),
  }),
});
