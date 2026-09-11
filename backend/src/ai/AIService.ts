/**
 * AI Service
 * 
 * Main AI service that uses the provider pattern and safety pipeline.
 * This is the single entry point for all AI operations.
 */

import { SymptomAnalysis, LabAnalysis } from '../validators/schemas';
import { AIProviderRegistry, AIProviderConfig } from './providers/AIProvider';
import { MockAIProviderFactory } from './providers/MockProvider';
import { AISafetyPipeline } from './AISafetyPipeline';
import { config } from '../config';
import { logger } from '../utils/logger';

class AIService {
  private pipeline: AISafetyPipeline;
  private initialized: boolean = false;

  constructor() {
    // Register available providers
    AIProviderRegistry.register('mock', MockAIProviderFactory);
    
    // Initialize with mock provider for now
    // In production, this would use OpenAI or other providers
    const providerConfig: AIProviderConfig = {
      apiKey: config.ai.apiKey,
      model: config.ai.model,
      temperature: 0.7,
      maxTokens: 1000,
      timeout: 30000,
    };

    const provider = AIProviderRegistry.getProvider('mock', providerConfig);
    AIProviderRegistry.setActiveProvider(provider);
    
    this.pipeline = new AISafetyPipeline(provider);
    this.initialized = true;
    
    logger.info('AI Service initialized', { provider: provider.name });
  }

  /**
   * Analyze symptoms through the safety pipeline
   */
  async analyzeSymptoms(input: string): Promise<SymptomAnalysis> {
    if (!this.initialized) {
      throw new Error('AI Service not initialized');
    }

    logger.info('Analyzing symptoms', { inputLength: input.length });
    
    const result = await this.pipeline.processSymptomAnalysis(input);
    
    logger.info('Symptom analysis completed', { 
      severity: result.severity, 
      urgency: result.urgency 
    });
    
    return result;
  }

  /**
   * Analyze lab report through the safety pipeline
   */
  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    if (!this.initialized) {
      throw new Error('AI Service not initialized');
    }

    logger.info('Analyzing lab report', { inputLength: input.length });
    
    const result = await this.pipeline.processLabReportAnalysis(input);
    
    logger.info('Lab report analysis completed', { 
      severity: result.severity, 
      urgency: result.urgency,
      resultsCount: result.results.length
    });
    
    return result;
  }

  /**
   * Check if AI service is available
   */
  async isAvailable(): Promise<boolean> {
    const provider = AIProviderRegistry.getActiveProvider();
    if (!provider) {
      return false;
    }
    return await provider.isAvailable();
  }

  /**
   * Get current provider info
   */
  getProviderInfo(): { name: string; available: boolean } {
    const provider = AIProviderRegistry.getActiveProvider();
    if (!provider) {
      return { name: 'none', available: false };
    }
    return {
      name: provider.name,
      available: true,
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
