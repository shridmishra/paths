import { z } from 'zod';

export const updateProgressSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    questionId: z.string().uuid('Invalid question ID'),
    completed: z.boolean().optional(),
    score: z.number().int().optional(),
  }),
});

export const getProgressSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});

export const deleteProgressSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid progress ID'),
  }),
});
