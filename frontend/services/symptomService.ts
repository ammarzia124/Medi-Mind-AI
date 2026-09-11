import apiClient from './apiClient';
import { SymptomAnalysis } from '../lib/schemas';

export interface AnalyzeSymptomsRequest {
  input: string;
}

export interface AnalyzeSymptomsResponse {
  success: boolean;
  data: SymptomAnalysis;
  message?: string;
}

export interface SymptomHistoryItem {
  id: string;
  input: string;
  result: SymptomAnalysis;
  createdAt: string;
}

export const symptomService = {
  /**
   * Analyze symptoms using AI
   */
  async analyzeSymptoms(input: string): Promise<SymptomAnalysis> {
    const response = await apiClient.post<AnalyzeSymptomsResponse>('/symptoms/analyze', {
      input,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to analyze symptoms');
    }
    
    return response.data.data;
  },

  /**
   * Get symptom analysis history
   */
  async getSymptomHistory(): Promise<SymptomHistoryItem[]> {
    const response = await apiClient.get<{ success: boolean; data: SymptomHistoryItem[] }>('/symptoms/history');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch symptom history');
    }
    
    return response.data.data;
  },
};
