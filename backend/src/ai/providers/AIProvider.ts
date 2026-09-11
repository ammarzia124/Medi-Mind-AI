/**
 * AI Provider Interface
 * 
 * Abstract interface for AI model providers.
 * This allows easy switching between different AI providers
 * without changing the core application logic.
 */

import { SymptomAnalysis, LabAnalysis } from '../validators/schemas';

export interface AIProvider {
  /**
   * Provider name for identification
   */
  readonly name: string;

  /**
   * Analyze symptoms and return structured response
   */
  analyzeSymptoms(input: string): Promise<SymptomAnalysis>;

  /**
   * Analyze lab report and return structured response
   */
  analyzeLabReport(input: string): Promise<LabAnalysis>;

  /**
   * Check if provider is available and configured
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get provider configuration
   */
  getConfig(): AIProviderConfig;
}

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface AIProviderFactory {
  create(config: AIProviderConfig): AIProvider;
}

/**
 * AI Provider Registry
 * 
 * Manages available AI providers and their instantiation
 */
export class AIProviderRegistry {
  private static providers: Map<string, AIProviderFactory> = new Map();
  private static activeProvider: AIProvider | null = null;

  /**
   * Register a new AI provider
   */
  static register(name: string, factory: AIProviderFactory): void {
    this.providers.set(name, factory);
  }

  /**
   * Get a provider by name
   */
  static getProvider(name: string, config: AIProviderConfig): AIProvider {
    const factory = this.providers.get(name);
    if (!factory) {
      throw new Error(`AI provider '${name}' not found`);
    }
    return factory.create(config);
  }

  /**
   * Set the active provider
   */
  static setActiveProvider(provider: AIProvider): void {
    this.activeProvider = provider;
  }

  /**
   * Get the active provider
   */
  static getActiveProvider(): AIProvider | null {
    return this.activeProvider;
  }

  /**
   * List all registered providers
   */
  static listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
