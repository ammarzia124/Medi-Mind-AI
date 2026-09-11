export interface SymptomResult {
  possibleExplanations: string[];
  severity: 'low' | 'moderate' | 'high';
  whatThisMaySuggest: string;
  warningSigns: string[];
  suggestedNextStep: string;
  selfCareOptions: string[];
  careNavigation: 'emergency' | 'urgent' | 'routine' | 'selfCare';
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
