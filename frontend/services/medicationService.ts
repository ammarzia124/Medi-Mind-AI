import apiClient from './apiClient';
import { z } from 'zod';

// Medication interaction schema
export const MedicationInteractionSchema = z.object({
  severity: z.number().int().min(1).max(5),
  interaction_type: z.string(),
  description: z.string(),
  recommendation: z.string(),
});

export type MedicationInteraction = z.infer<typeof MedicationInteractionSchema>;

export interface CheckInteractionsRequest {
  medications: string[];
}

export interface CheckInteractionsResponse {
  success: boolean;
  data: {
    interactions: MedicationInteraction[];
    summary: string;
  };
  message?: string;
}

export const medicationService = {
  /**
   * Check for medication interactions
   */
  async checkInteractions(medications: string[]): Promise<{
    interactions: MedicationInteraction[];
    summary: string;
  }> {
    const response = await apiClient.post<CheckInteractionsResponse>('/medications/interactions', {
      medications,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to check interactions');
    }
    
    return response.data.data;
  },
};
