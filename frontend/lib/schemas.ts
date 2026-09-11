import { z } from 'zod';

/**
 * MediMind AI - Strict Zod Schemas for AI Output Validation
 * 
 * IMPORTANT: These schemas are the single source of truth for AI output.
 * - Backend validates before sending responses
 * - Frontend validates before rendering
 * - Raw model output is NEVER rendered directly
 * - Validation failures return safe fallback data
 */

// ============================================================================
// SYMPTOM ANALYSIS SCHEMA
// ============================================================================

/**
 * Severity scale: 1-5
 * 1 = Very Low (minor discomfort)
 * 2 = Low (mild, self-care appropriate)
 * 3 = Moderate (monitor, consider doctor visit)
 * 4 = High (should see doctor soon)
 * 5 = Critical (emergency care needed)
 */
export const SeveritySchema = z
  .number()
  .int()
  .min(1, 'Severity must be at least 1')
  .max(5, 'Severity must be at most 5');

export type Severity = z.infer<typeof SeveritySchema>;

/**
 * Urgency levels - determines care navigation
 */
export const UrgencySchema = z.enum([
  'emergency',        // Seek emergency care immediately
  'urgent',           // Seek urgent care within 24 hours
  'doctor_soon',      // Schedule doctor visit within days
  'monitor',          // Monitor symptoms at home
  'self_care',        // Self-care measures appropriate
]);

export type Urgency = z.infer<typeof UrgencySchema>;

/**
 * Complete symptom analysis schema - matches required output structure
 */
export const SymptomAnalysisSchema = z.object({
  severity: SeveritySchema,
  urgency: UrgencySchema,
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(1000, 'Summary must not exceed 1000 characters'),
  possible_explanations: z
    .array(z.string().min(3).max(200))
    .min(1, 'At least one possible explanation required')
    .max(10, 'Maximum 10 possible explanations'),
  warning_signs: z
    .array(z.string().min(5).max(300))
    .min(1, 'At least one warning sign required')
    .max(10, 'Maximum 10 warning signs'),
  recommended_action: z
    .string()
    .min(10, 'Recommended action must be at least 10 characters')
    .max(500, 'Recommended action must not exceed 500 characters'),
  self_care: z
    .array(z.string().min(3).max(200))
    .min(0)
    .max(10, 'Maximum 10 self-care items'),
  disclaimer: z
    .string()
    .min(10, 'Disclaimer must be at least 10 characters')
    .max(500, 'Disclaimer must not exceed 500 characters'),
});

export type SymptomAnalysis = z.infer<typeof SymptomAnalysisSchema>;

// ============================================================================
// LAB REPORT ANALYSIS SCHEMA
// ============================================================================

export const LabResultStatusSchema = z.enum([
  'normal',
  'low',
  'high',
  'critical',
  'unreadable',
]);

export type LabResultStatus = z.infer<typeof LabResultStatusSchema>;

export const LabResultItemSchema = z.object({
  test_name: z.string().min(1).max(200),
  result_value: z.string().min(1).max(50),
  result_unit: z.string().max(50).optional(),
  reference_range: z.string().max(100).optional(),
  status: LabResultStatusSchema,
  confidence: z.number().min(0).max(1).optional(),
  what_is_this: z.string().min(10).max(500),
  what_it_means: z.string().min(10).max(500),
  what_to_do: z.string().min(10).max(500),
});

export type LabResultItem = z.infer<typeof LabResultItemSchema>;

export const OverallStatusSchema = z.enum([
  'normal',
  'some_abnormal',
  'concerning',
  'unreadable',
]);

export type OverallStatus = z.infer<typeof OverallStatusSchema>;

export const LabAnalysisSchema = z.object({
  report_date: z.string().optional(),
  facility_name: z.string().optional(),
  results: z
    .array(LabResultItemSchema)
    .min(1, 'At least one lab result required')
    .max(20, 'Maximum 20 lab results'),
  overall_status: OverallStatusSchema,
  severity: SeveritySchema,
  urgency: z.enum(['self_care', 'monitor', 'doctor_soon', 'urgent', 'emergency']),
  summary: z.object({
    in_simple_words: z.array(z.string().min(10)).min(3).max(5),
  }),
  disclaimer: z.string().min(50, 'Disclaimer required'),
  confidence_score: z.number().min(0).max(1),
  language: z.enum(['en', 'ur']),
});

export type LabAnalysis = z.infer<typeof LabAnalysisSchema>;

// ============================================================================
// API RESPONSE WRAPPER SCHEMA
// ============================================================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
    validated_at: z.string().datetime().optional(),
  });

// ============================================================================
// SEVERITY HELPERS
// ============================================================================

export function severityToLabel(severity: Severity): string {
  switch (severity) {
    case 1: return 'Very Low';
    case 2: return 'Low';
    case 3: return 'Moderate';
    case 4: return 'High';
    case 5: return 'Critical';
    default: return 'Unknown';
  }
}

export function severityToEmoji(severity: Severity): string {
  switch (severity) {
    case 1: return '🟢';
    case 2: return '🟢';
    case 3: return '🟡';
    case 4: return '🟠';
    case 5: return '🔴';
    default: return '⚪';
  }
}

export function severityToColorClass(severity: Severity): string {
  switch (severity) {
    case 1:
    case 2: return 'text-success bg-success/10';
    case 3: return 'text-warning bg-warning/10';
    case 4:
    case 5: return 'text-critical bg-critical/10';
    default: return 'text-text-secondary bg-border';
  }
}

export function urgencyToLabel(urgency: Urgency): string {
  switch (urgency) {
    case 'emergency': return 'Emergency Care';
    case 'urgent': return 'Urgent Care';
    case 'doctor_soon': return 'Doctor Visit Soon';
    case 'monitor': return 'Monitor at Home';
    case 'self_care': return 'Self-Care';
    default: return 'Unknown';
  }
}

export function urgencyToColorClass(urgency: Urgency): string {
  switch (urgency) {
    case 'emergency': return 'bg-critical/10 border-critical/30 text-critical';
    case 'urgent': return 'bg-warning/10 border-warning/30 text-warning';
    case 'doctor_soon': return 'bg-info/10 border-info/30 text-info';
    case 'monitor': return 'bg-primary-50 border-primary/20 text-primary';
    case 'self_care': return 'bg-success/10 border-success/30 text-success';
    default: return 'bg-border';
  }
}

export function isEmergencyUrgency(urgency: Urgency): boolean {
  return urgency === 'emergency';
}

export function isHighSeverity(severity: Severity): boolean {
  return severity >= 4;
}
