import { z } from 'zod';

/**
 * Backend Zod Schemas - Mirrors frontend/lib/schemas.ts
 * 
 * These schemas are used to validate AI output BEFORE sending to the client.
 * This ensures that invalid AI output never reaches the frontend.
 */

export const SeveritySchema = z
  .number()
  .int()
  .min(1)
  .max(5);

export const UrgencySchema = z.enum([
  'emergency',
  'urgent',
  'doctor_soon',
  'monitor',
  'self_care',
]);

export const SymptomAnalysisSchema = z.object({
  severity: SeveritySchema,
  urgency: UrgencySchema,
  summary: z.string().min(10).max(1000),
  possible_explanations: z.array(z.string().min(3).max(200)).min(1).max(10),
  warning_signs: z.array(z.string().min(5).max(300)).min(1).max(10),
  recommended_action: z.string().min(10).max(500),
  self_care: z.array(z.string().min(3).max(200)).min(0).max(10),
  disclaimer: z.string().min(10).max(500),
});

export type SymptomAnalysis = z.infer<typeof SymptomAnalysisSchema>;

export const LabResultStatusSchema = z.enum([
  'within_reference_range',
  'outside_reference_range',
  'significantly_outside_range',
]);

export const LabResultItemSchema = z.object({
  name: z.string().min(1).max(200),
  value: z.string().min(1).max(50),
  unit: z.string().max(50).default(''),
  status: LabResultStatusSchema,
  what_this_may_mean: z.string().min(10).max(500),
});

export const LabAnalysisSchema = z.object({
  severity: SeveritySchema,
  urgency: UrgencySchema,
  summary: z.string().min(10).max(1000),
  results: z.array(LabResultItemSchema).min(1).max(20),
  warning_signs: z.array(z.string().min(5).max(300)).min(1).max(10),
  recommended_action: z.string().min(10).max(500),
  next_steps: z.array(z.string().min(3).max(200)).min(1).max(10),
  important_note: z.string().min(10).max(500),
  disclaimer: z.string().min(10).max(500),
});

export type LabAnalysis = z.infer<typeof LabAnalysisSchema>;

/**
 * Validates data and throws if invalid.
 * Used at backend boundaries to ensure only valid data is sent.
 */
export function validateOrThrow<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    const message = error instanceof z.ZodError
      ? `Invalid ${context}: ${error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      : `Invalid ${context}: ${error instanceof Error ? error.message : 'unknown error'}`;
    
    console.error(`[MediMind Backend Validation Error] ${message}`);
    throw new Error(message);
  }
}
