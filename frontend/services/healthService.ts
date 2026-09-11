// Health analysis service
// This would connect to backend API in production

import { SymptomResult, LabAnalysis } from '../types';

export const healthService = {
  async analyzeSymptoms(input: string): Promise<SymptomResult> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock analysis
    return {
      causes: ['Common viral illness', 'Stress-related symptoms'],
      severity: 'low',
      recommendation: 'Monitor symptoms and practice self-care.',
      whenToSeeDoctor: 'See a doctor if symptoms worsen or persist.',
      selfCare: ['Rest and stay hydrated', 'Eat nutritious meals'],
      careNavigation: 'selfCare',
    };
  },

  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Return mock analysis
    return {
      results: [
        {
          name: 'Test Result',
          value: 'Normal',
          unit: '',
          status: 'normal',
          explanation: 'Results appear within acceptable ranges.',
        },
      ],
      summary: 'Your lab results appear generally within normal ranges.',
      nextSteps: ['Discuss results with your doctor', 'Continue regular check-ups'],
    };
  },
};
