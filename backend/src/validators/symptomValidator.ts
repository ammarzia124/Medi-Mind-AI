import { z } from 'zod';

export const analyzeSymptomsSchema = z.object({
  input: z.string()
    .min(3, 'Symptom description must be at least 3 characters')
    .max(2000, 'Symptom description must not exceed 2000 characters'),
});

export type AnalyzeSymptomsInput = z.infer<typeof analyzeSymptomsSchema>;
