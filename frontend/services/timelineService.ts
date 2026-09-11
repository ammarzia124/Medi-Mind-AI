import apiClient from './apiClient';
import { z } from 'zod';

// Timeline entry schema
export const TimelineEntrySchema = z.object({
  id: z.string(),
  event_type: z.enum(['symptom', 'lab', 'medication', 'note', 'appointment']),
  title: z.string(),
  description: z.string().optional(),
  event_date: z.string(),
  severity: z.enum(['low', 'moderate', 'high']).optional(),
  related_consultation_id: z.string().optional(),
  related_lab_report_id: z.string().optional(),
  related_medication_id: z.string().optional(),
  created_at: z.string(),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

export interface CreateTimelineEntryRequest {
  event_type: 'symptom' | 'lab' | 'medication' | 'note' | 'appointment';
  title: string;
  description?: string;
  event_date: string;
  severity?: 'low' | 'moderate' | 'high';
  related_consultation_id?: string;
  related_lab_report_id?: string;
  related_medication_id?: string;
}

export interface TimelineResponse {
  success: boolean;
  data: TimelineEntry[];
  message?: string;
}

export const timelineService = {
  /**
   * Get timeline entries
   */
  async getTimeline(): Promise<TimelineEntry[]> {
    const response = await apiClient.get<TimelineResponse>('/timeline');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch timeline');
    }
    
    return response.data.data;
  },

  /**
   * Create a new timeline entry
   */
  async createEntry(entry: CreateTimelineEntryRequest): Promise<TimelineEntry> {
    const response = await apiClient.post<{ success: boolean; data: TimelineEntry }>('/timeline', entry);
    
    if (!response.data.success) {
      throw new Error('Failed to create timeline entry');
    }
    
    return response.data.data;
  },

  /**
   * Delete a timeline entry
   */
  async deleteEntry(id: string): Promise<void> {
    const response = await apiClient.delete<{ success: boolean }>(`/timeline/${id}`);
    
    if (!response.data.success) {
      throw new Error('Failed to delete timeline entry');
    }
  },
};
