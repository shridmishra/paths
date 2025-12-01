import { z } from 'zod';

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    order: z.number().int().optional(),
    pathId: z.string().uuid('Invalid path ID'),
  }),
});

export const updateTopicSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid topic ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().optional(),
    order: z.number().int().optional(),
  }),
});

export const getTopicSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid topic ID'),
  }),
});
