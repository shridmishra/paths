import { z } from 'zod';

export const createPathSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    category: z.string().optional(),
    userId: z.string().uuid('Invalid user ID'),
  }),
});

export const updatePathSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid path ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    category: z.string().optional(),
  }),
});

export const getPathSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid path ID'),
  }),
});
