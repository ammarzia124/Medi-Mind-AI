import { z, ZodError, ZodSchema } from 'zod';
import {
  SymptomAnalysisSchema,
  LabAnalysisSchema,
  type SymptomAnalysis,
  type LabAnalysis,
} from './schemas';

/**
 * MediMind AI - Safe Validation Utilities
 * 
 * CRITICAL RULE: Never blindly render raw model output.
 * 
 * All AI output MUST pass through these validators before rendering.
 * If validation fails, a safe fallback is returned instead of crashing
 * or rendering potentially unsafe content.
 */

// ============================================================================
// GENERIC SAFE VALIDATION
// ============================================================================

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  error: string;
  issues: Array<{ path: string; message: string }>;
}

export type SafeResult<T> = ValidationResult<T> | ValidationFailure;

/**
 * Safely validates data against a Zod schema.
 * Returns structured result instead of throwing.
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): SafeResult<T> {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const issues: Array<{ path: string; message: string }> = [];
      for (const issue of error.issues) {
        const pathArr = (issue.path as unknown as Array<string | number>) ?? [];
        issues.push({
          path: pathArr.map(String).join('.'),
          message: issue.message,
        });
      }
      return {
        success: false,
        error: 'Validation failed',
        issues,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
      issues: [],
    };
  }
}

/**
 * Validates and returns data, or null if invalid.
 * Useful when you want to check validity without fallback.
 */
export function tryValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): T | null {
  const result = safeValidate(schema, data);
  if (result.success) {
    return result.data;
  }
  return null;
}

/**
 * Validates and throws if invalid. Use only at system boundaries
 * where invalid data should crash (e.g., backend before sending response).
 */
export function strictValidate<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context: string = 'data'
): T {
  try {
    return schema.parse(data);
  } catch (error: unknown) {
    let message: string;
    if (error instanceof ZodError) {
      const issueStrings: string[] = [];
      for (const issue of error.issues) {
        const pathArr = (issue.path as unknown as Array<string | number>) ?? [];
        issueStrings.push(`${pathArr.map(String).join('.')}: ${issue.message}`);
      }
      message = `Invalid ${context}: ${issueStrings.join(', ')}`;
    } else {
      message = `Invalid ${context}: ${error instanceof Error ? error.message : 'unknown error'}`;
    }
    
    console.error(`[MediMind Validation Error] ${message}`);
    throw new Error(message);
  }
}

// ============================================================================
// SYMPTOM ANALYSIS VALIDATION
// ============================================================================

/**
 * Default fallback symptom analysis - used when AI output fails validation.
 * This is ALWAYS safe to render and directs users to professional care.
 */
export const FALLBACK_SYMPTOM_ANALYSIS: SymptomAnalysis = {
  severity: 3,
  urgency: 'doctor_soon',
  summary: 'We were unable to analyze your symptoms with confidence. For your safety, please consult a healthcare professional who can properly evaluate your condition.',
  possible_explanations: [
    'Many conditions can cause similar symptoms',
    'Only a healthcare professional can provide an accurate assessment',
    'Self-diagnosis can be unreliable and potentially harmful',
  ],
  warning_signs: [
    '⚠️ Symptoms that worsen rapidly',
    '⚠️ Severe pain or discomfort',
    '⚠️ Difficulty breathing',
    '⚠️ High fever',
    '⚠️ Confusion or loss of consciousness',
  ],
  recommended_action: 'Please consult a qualified healthcare professional for proper evaluation. If you are experiencing a medical emergency, call emergency services immediately.',
  self_care: [
    '💧 Stay hydrated',
    '🛌 Get adequate rest',
    '📝 Note your symptoms and their progression',
    '📞 Contact a healthcare provider',
  ],
  disclaimer: '⚕️ This is a fallback response because the analysis could not be completed. This is NOT a medical diagnosis. Please consult a qualified healthcare professional.',
};

/**
 * Validates symptom analysis output with safe fallback.
 * NEVER throws - always returns valid SymptomAnalysis.
 */
export function validateSymptomAnalysis(
  data: unknown,
  options: { logErrors?: boolean } = {}
): SymptomAnalysis {
  const result = safeValidate(SymptomAnalysisSchema, data);
  
  if (result.success) {
    return result.data;
  }
  
  if (options.logErrors !== false) {
    console.warn(
      '[MediMind] Symptom analysis validation failed, using fallback:',
      result.issues
    );
  }
  
  return FALLBACK_SYMPTOM_ANALYSIS;
}

// ============================================================================
// LAB ANALYSIS VALIDATION
// ============================================================================

/**
 * Default fallback lab analysis - used when AI output fails validation.
 */
export const FALLBACK_LAB_ANALYSIS: LabAnalysis = {
  severity: 3,
  urgency: 'doctor_soon',
  overall_status: 'unreadable',
  results: [
    {
      test_name: 'Lab Results',
      result_value: '—',
      status: 'unreadable',
      what_is_this: 'Lab results provide information about your health.',
      what_it_means: 'We were unable to interpret these results automatically.',
      what_to_do: 'Please consult your healthcare provider for proper evaluation.',
    },
  ],
  summary: {
    in_simple_words: [
      'We were unable to analyze your lab results with confidence.',
      'Lab results require professional interpretation.',
      'Please consult a healthcare provider for proper evaluation.',
    ],
  },
  disclaimer: '⚕️ This is a fallback response because the analysis could not be completed. This is NOT a medical diagnosis. Please consult a qualified healthcare professional.',
  confidence_score: 0,
  language: 'en',
};

/**
 * Validates lab analysis output with safe fallback.
 * NEVER throws - always returns valid LabAnalysis.
 */
export function validateLabAnalysis(
  data: unknown,
  options: { logErrors?: boolean } = {}
): LabAnalysis {
  const result = safeValidate(LabAnalysisSchema, data);
  
  if (result.success) {
    return result.data;
  }
  
  if (options.logErrors !== false) {
    console.warn(
      '[MediMind] Lab analysis validation failed, using fallback:',
      result.issues
    );
  }
  
  return FALLBACK_LAB_ANALYSIS;
}

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

/**
 * Sanitizes user input to prevent XSS attacks.
 * Used before sending to AI service.
 */
export function sanitizeInput(input: string, maxLength: number = 2000): string {
  return input
    .trim()
    .substring(0, maxLength)
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove null bytes
    .replace(/\0/g, '');
}

/**
 * Sanitizes AI output text before rendering.
 * Removes potentially dangerous HTML while preserving safe content.
 */
export function sanitizeOutput(text: string): string {
  return text
    // Escape HTML entities to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // But allow emoji (which are safe)
    .replace(/&lt;(🚨|⚠️|💧|🛌|🧊|💊|👀|🛁|👕|🌡️|🍯|💨|🚭|🗣️|😴|🚶|🥗|🧘|🍞|🚫|🫚|🔥|🪑|⏰|🛏️|📋|📁|📅|🔄|💊|👨‍⚕️|☀️|🐟|ℹ️|📞|🪑|🚨|📝|🏃|📓|🍎|📊|⏰|💊|ℹ️|🚶‍♂️|🚶‍♀️)&gt;/g, '$1');
}

/**
 * Validates that a string is safe to render.
 * Returns the string if safe, or a fallback message if not.
 */
export function safeText(
  text: unknown,
  fallback: string = 'Information unavailable'
): string {
  if (typeof text !== 'string') return fallback;
  if (text.length === 0) return fallback;
  if (text.length > 5000) return fallback;
  return text;
}

/**
 * Validates that an array is safe to render.
 * Returns the array if safe, or an empty array if not.
 */
export function safeArray<T>(
  arr: unknown,
  itemValidator: (item: unknown) => item is T = (x): x is T => typeof x === 'string'
): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(itemValidator);
}
