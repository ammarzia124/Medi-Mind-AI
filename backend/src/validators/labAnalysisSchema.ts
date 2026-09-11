import { z } from 'zod';

/**
 * Lab Report Analysis Schemas
 * 
 * Structured output for lab report analysis with safety validation.
 * All fields are required to ensure consistent, safe output.
 */

// Individual lab result schema
export const LabResultItemSchema = z.object({
  test_name: z.string().min(1, 'Test name is required'),
  result_value: z.string().min(1, 'Result value is required'),
  result_unit: z.string().optional(),
  reference_range: z.string().optional(),
  status: z.enum(['normal', 'low', 'high', 'critical', 'unreadable']),
  confidence: z.number().min(0).max(1).optional(),
  
  // Simple explanations
  what_is_this: z.string().min(10, 'Explanation required'),
  what_it_means: z.string().min(10, 'Meaning explanation required'),
  what_to_do: z.string().min(10, 'Recommendation required'),
});

export type LabResultItem = z.infer<typeof LabResultItemSchema>;

// Complete lab analysis schema
export const LabAnalysisSchema = z.object({
  // Metadata
  report_date: z.string().optional(),
  facility_name: z.string().optional(),
  
  // Results
  results: z.array(LabResultItemSchema).min(1, 'At least one result required'),
  
  // Overall assessment
  overall_status: z.enum(['normal', 'some_abnormal', 'concerning', 'unreadable']),
  severity: z.number().min(1).max(5),
  urgency: z.enum(['self_care', 'monitor', 'doctor_soon', 'urgent', 'emergency']),
  
  // Summary in simple language
  summary: z.object({
    in_simple_words: z.array(z.string().min(10)).min(3).max(5),
  }),
  
  // Safety
  disclaimer: z.string().min(50, 'Disclaimer required'),
  confidence_score: z.number().min(0).max(1),
  
  // Language
  language: z.enum(['en', 'ur']),
});

export type LabAnalysis = z.infer<typeof LabAnalysisSchema>;

// Input schema for lab analysis
export const LabAnalysisInputSchema = z.object({
  text_content: z.string().min(10, 'Text content required'),
  language: z.enum(['en', 'ur']).default('en'),
  file_name: z.string().optional(),
});

export type LabAnalysisInput = z.infer<typeof LabAnalysisInputSchema>;

/**
 * Validate lab analysis output
 */
export function validateLabAnalysis(data: unknown): LabAnalysis {
  return LabAnalysisSchema.parse(data);
}

/**
 * Safe validation with fallback
 */
export function safeValidateLabAnalysis(data: unknown): {
  success: boolean;
  data?: LabAnalysis;
  error?: string;
} {
  try {
    const validated = LabAnalysisSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof z.ZodError 
        ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        : 'Validation failed'
    };
  }
}
