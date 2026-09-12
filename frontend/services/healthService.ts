// Legacy health service - unused, kept for compatibility

export const healthService = {
  async analyzeSymptoms(_input: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      severity: 2,
      urgency: 'self_care' as const,
      summary: 'Mock analysis result.',
      possible_explanations: ['Common viral illness'],
      warning_signs: ['Monitor symptoms'],
      recommended_action: 'Consult a healthcare professional.',
      self_care: ['Rest and stay hydrated'],
      disclaimer: 'For educational purposes only.',
    };
  },

  async analyzeLabReport(_input: string) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    return {
      severity: 2,
      urgency: 'self_care' as const,
      overall_status: 'normal' as const,
      results: [
        {
          test_name: 'Test Result',
          result_value: 'Normal',
          status: 'normal' as const,
          what_is_this: 'Lab result.',
          what_it_means: 'Results appear within acceptable ranges.',
          what_to_do: 'Discuss with your doctor.',
        },
      ],
      summary: { in_simple_words: ['Results appear normal.'] },
      disclaimer: 'For educational purposes only.',
      confidence_score: 0.8,
      language: 'en' as const,
    };
  },
};
