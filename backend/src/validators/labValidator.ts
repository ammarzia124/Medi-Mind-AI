import { z } from 'zod';

export const analyzeLabReportSchema = z.object({
  input: z.string()
    .min(3, 'Lab report description must be at least 3 characters')
    .max(5000, 'Lab report description must not exceed 5000 characters'),
});

export type AnalyzeLabReportInput = z.infer<typeof analyzeLabReportSchema>;
