import { z } from 'zod';
import { WorkCategory, WorkType, WorkStatus } from '@prisma/client';

const workBaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.nativeEnum(WorkCategory, { message: 'Invalid category' }),
  type: z.nativeEnum(WorkType, { message: 'Invalid type' }),
  year: z.number().int().min(1900, 'Year must be after 1900').max(2100, 'Year must be before 2100'),
  client: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.nativeEnum(WorkStatus).optional().default(WorkStatus.DRAFT),
  coverImageUrl: z.string().url('Cover image URL must be a valid URL').min(1, 'Cover image is required'),
  externalUrl: z.string().url('External URL must be a valid URL').optional().or(z.literal('')),
  images: z.array(z.object({
    url: z.string().url('Image URL must be a valid URL'),
    order: z.number().int().min(0).optional().default(0),
  })).optional().default([]),
});

export const createWorkSchema = z.object({
  body: workBaseSchema.extend({
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case').optional(), // Auto-generated if not provided
  }),
});

export const updateWorkSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid work ID format'),
  }),
  body: workBaseSchema.partial().extend({
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case').optional(),
  }),
});