// Re-export validated types from schemas
export type {
  SymptomAnalysis,
  LabAnalysis,
  Severity,
  Urgency,
  LabResultStatus,
  LabResultItem,
} from '../validators/schemas';

export interface TimelineEntry {
  id: string;
  userId: string;
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  severity?: 'low' | 'moderate' | 'high';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string | null;
  languagePreference: string;
  createdAt: Date;
  updatedAt: Date;
}
