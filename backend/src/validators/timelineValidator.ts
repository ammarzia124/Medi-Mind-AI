import { z } from 'zod';

export const createTimelineEntrySchema = z.object({
  type: z.enum(['symptom', 'lab', 'note', 'medication']),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  severity: z.enum(['low', 'moderate', 'high']).optional(),
});

export type CreateTimelineEntryInput = z.infer<typeof createTimelineEntrySchema>;
