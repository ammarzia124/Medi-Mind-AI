import apiClient from './apiClient';
import { LabAnalysis } from '../lib/schemas';

export interface AnalyzeLabReportRequest {
  input: string;
}

export interface AnalyzeLabReportResponse {
  success: boolean;
  data: LabAnalysis;
  message?: string;
}

export interface LabHistoryItem {
  id: string;
  input: string;
  result: LabAnalysis;
  createdAt: string;
}

export const labService = {
  /**
   * Analyze lab report using AI
   */
  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    const response = await apiClient.post<AnalyzeLabReportResponse>('/lab/analyze', {
      input,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to analyze lab report');
    }
    
    return response.data.data;
  },

  /**
   * Get lab analysis history
   */
  async getLabHistory(): Promise<LabHistoryItem[]> {
    const response = await apiClient.get<{ success: boolean; data: LabHistoryItem[] }>('/lab/history');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch lab history');
    }
    
    return response.data.data;
  },
};
