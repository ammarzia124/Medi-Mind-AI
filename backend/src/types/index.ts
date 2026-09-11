export interface SymptomResult {
  causes: string[];
  severity: 'low' | 'moderate' | 'high';
  recommendation: string;
  whenToSeeDoctor: string;
  selfCare: string[];
  careNavigation: 'emergency' | 'urgent' | 'routine' | 'selfCare';
}

export interface LabResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  explanation: string;
}

export interface LabAnalysis {
  results: LabResult[];
  summary: string;
  nextSteps: string[];
}

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
