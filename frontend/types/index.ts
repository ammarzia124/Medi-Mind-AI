export type Language = 'en' | 'ur';

export type Page = 'home' | 'symptoms' | 'lab' | 'timeline';

// Re-export validated types from schemas
export type {
  SymptomAnalysis,
  LabAnalysis,
  LabResultItem,
  Severity,
  Urgency,
  LabResultStatus,
} from '../lib/schemas';

export interface TimelineEntry {
  id: string;
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  date: Date;
  severity?: 'low' | 'moderate' | 'high';
}
