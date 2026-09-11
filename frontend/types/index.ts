export type Language = 'en' | 'ur';

export type Page = 'home' | 'symptoms' | 'lab' | 'timeline';

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
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  date: Date;
  severity?: 'low' | 'moderate' | 'high';
}
