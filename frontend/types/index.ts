export type Language = 'en' | 'ur';

export type Page = 'home' | 'symptoms' | 'lab' | 'timeline';

export interface SymptomResult {
  possibleExplanations: string[];
  severity: 'low' | 'moderate' | 'high';
  whatThisMaySuggest: string;
  warningSigns: string[];
  suggestedNextStep: string;
  selfCareOptions: string[];
  careNavigation: 'emergency' | 'urgent' | 'routine' | 'selfCare';
  emergencyMessage?: string;
}

export interface LabResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  whatThisMayMean: string;
}

export interface LabAnalysis {
  results: LabResult[];
  summary: string;
  whatThisMaySuggest: string;
  nextSteps: string[];
  importantNote: string;
}

export interface TimelineEntry {
  id: string;
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  date: Date;
  severity?: 'low' | 'moderate' | 'high';
}
