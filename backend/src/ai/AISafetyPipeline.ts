/**
 * AI Safety Pipeline
 * 
 * Implements a multi-stage safety pipeline for AI requests:
 * 1. Input Validation
 * 2. Safety Preprocessing (prompt injection detection)
 * 3. AI Model Processing
 * 4. Structured Output Validation
 * 5. Safety Postprocessing
 * 6. User Response
 */

import { z } from 'zod';
import { SymptomAnalysis, LabAnalysis, SymptomAnalysisSchema, LabAnalysisSchema } from '../validators/schemas';
import { AIProvider } from './providers/AIProvider';
import { logger } from '../utils/logger';

export class AISafetyPipeline {
  private provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  /**
   * Process symptom analysis through the safety pipeline
   */
  async processSymptomAnalysis(input: string): Promise<SymptomAnalysis> {
    try {
      // Stage 1: Input Validation
      const validatedInput = this.validateSymptomInput(input);

      // Stage 2: Safety Preprocessing
      const safeInput = this.safetyPreprocessing(validatedInput);

      // Stage 3: AI Model Processing
      const rawResult = await this.provider.analyzeSymptoms(safeInput);

      // Stage 4: Structured Output Validation
      const validatedOutput = this.validateSymptomOutput(rawResult);

      // Stage 5: Safety Postprocessing
      const safeOutput = this.safetyPostprocessing(validatedOutput);

      // Stage 6: Return User Response
      return safeOutput;
    } catch (error) {
      logger.error('AI Safety Pipeline error', { error, input });
      throw error;
    }
  }

  /**
   * Process lab report analysis through the safety pipeline
   */
  async processLabReportAnalysis(input: string): Promise<LabAnalysis> {
    try {
      // Stage 1: Input Validation
      const validatedInput = this.validateLabInput(input);

      // Stage 2: Safety Preprocessing
      const safeInput = this.safetyPreprocessing(validatedInput);

      // Stage 3: AI Model Processing
      const rawResult = await this.provider.analyzeLabReport(safeInput);

      // Stage 4: Structured Output Validation
      const validatedOutput = this.validateLabOutput(rawResult);

      // Stage 5: Safety Postprocessing
      const safeOutput = this.safetyPostprocessingLab(validatedOutput);

      // Stage 6: Return User Response
      return safeOutput;
    } catch (error) {
      logger.error('AI Safety Pipeline error', { error, input });
      throw error;
    }
  }

  /**
   * Stage 1: Validate symptom input
   */
  private validateSymptomInput(input: string): string {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input: input must be a non-empty string');
    }

    if (input.length < 3) {
      throw new Error('Invalid input: input must be at least 3 characters');
    }

    if (input.length > 5000) {
      throw new Error('Invalid input: input must not exceed 5000 characters');
    }

    return input;
  }

  /**
   * Stage 1: Validate lab input
   */
  private validateLabInput(input: string): string {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input: input must be a non-empty string');
    }

    if (input.length < 3) {
      throw new Error('Invalid input: input must be at least 3 characters');
    }

    if (input.length > 10000) {
      throw new Error('Invalid input: input must not exceed 10000 characters');
    }

    return input;
  }

  /**
   * Stage 2: Safety Preprocessing
   * Detect and remove potential prompt injection attempts
   */
  private safetyPreprocessing(input: string): string {
    // Detect prompt injection patterns
    const injectionPatterns = [
      /ignore previous instructions/i,
      /you are now/i,
      /act as/i,
      /pretend you/i,
      /system prompt/i,
      /developer mode/i,
      /jailbreak/i,
      /DAN mode/i,
      /forget everything/i,
      /new instructions/i,
    ];

    const hasInjection = injectionPatterns.some(pattern => pattern.test(input));
    
    if (hasInjection) {
      logger.warn('Potential prompt injection detected', { input });
      // Log but don't block - treat as regular input
      // The AI model should handle this appropriately
    }

    // Remove potential injection phrases
    let sanitized = input;
    sanitized = sanitized.replace(/ignore (all |previous )?instructions/gi, '');
    sanitized = sanitized.replace(/you are now (a |an )?/gi, '');
    sanitized = sanitized.replace(/act as (a |an )?/gi, '');
    sanitized = sanitized.replace(/pretend (you are |to be )?/gi, '');

    return sanitized.trim();
  }

  /**
   * Stage 4: Validate symptom output structure
   */
  private validateSymptomOutput(output: unknown): SymptomAnalysis {
    try {
      return SymptomAnalysisSchema.parse(output);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Symptom output validation failed', { errors: error.errors });
        throw new Error('AI output validation failed: invalid structure');
      }
      throw error;
    }
  }

  /**
   * Stage 4: Validate lab output structure
   */
  private validateLabOutput(output: unknown): LabAnalysis {
    try {
      return LabAnalysisSchema.parse(output);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Lab output validation failed', { errors: error.errors });
        throw new Error('AI output validation failed: invalid structure');
      }
      throw error;
    }
  }

  /**
   * Stage 5: Safety Postprocessing for symptoms
   * Ensure medical safety compliance
   */
  private safetyPostprocessing(output: SymptomAnalysis): SymptomAnalysis {
    // Verify disclaimer is present
    if (!output.disclaimer || output.disclaimer.length < 10) {
      logger.warn('Missing or insufficient disclaimer in symptom analysis');
      output.disclaimer = '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.';
    }

    // Verify no definitive diagnoses
    const definitivePatterns = [
      /you have \w+/i,
      /you are diagnosed with/i,
      /this is \w+/i,
      /the diagnosis is/i,
    ];

    const hasDefinitiveDiagnosis = definitivePatterns.some(pattern => 
      pattern.test(output.summary) || 
      output.possible_explanations.some(exp => pattern.test(exp))
    );

    if (hasDefinitiveDiagnosis) {
      logger.warn('Definitive diagnosis detected in symptom analysis');
      // Log but don't modify - the AI should handle this
    }

    // Verify emergency handling
    if (output.urgency === 'emergency') {
      if (!output.recommended_action.toLowerCase().includes('emergency')) {
        logger.warn('Emergency urgency without emergency recommendation');
      }
    }

    return output;
  }

  /**
   * Stage 5: Safety Postprocessing for lab reports
   * Ensure medical safety compliance
   */
  private safetyPostprocessingLab(output: LabAnalysis): LabAnalysis {
    // Verify disclaimer is present
    if (!output.disclaimer || output.disclaimer.length < 10) {
      logger.warn('Missing or insufficient disclaimer in lab analysis');
      output.disclaimer = '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.';
    }

    // Verify important note is present
    if (!output.important_note || output.important_note.length < 10) {
      logger.warn('Missing or insufficient important note in lab analysis');
      output.important_note = 'Lab results should always be interpreted by a healthcare professional who knows your medical history and can consider all relevant factors.';
    }

    // Verify no invented reference ranges
    const resultsWithMissingRanges = output.results.filter(result => 
      !result.what_this_may_mean.includes('reference range') &&
      result.status !== 'within_reference_range'
    );

    if (resultsWithMissingRanges.length > 0) {
      logger.warn('Lab results without reference range information');
    }

    return output;
  }
}
