import { SymptomResult, LabAnalysis } from '../../../types';
import { config } from '../config';

/**
 * AI Service - Handles integration with AI/ML models for health analysis
 * 
 * IMPORTANT: This service NEVER provides medical diagnoses.
 * All responses use probabilistic, non-definitive language.
 * Emergency situations are clearly flagged with strong recommendations.
 * 
 * In production, this would connect to:
 * - OpenAI GPT-4 for natural language analysis
 * - Custom trained models for symptom classification
 * - Medical knowledge bases for evidence-based recommendations
 */
export class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.ai.apiKey;
    this.model = config.ai.model;
  }

  async analyzeSymptoms(input: string): Promise<SymptomResult> {
    // TODO: Implement actual AI integration
    // For now, use rule-based analysis with cautious language
    
    const lower = input.toLowerCase();
    
    // EMERGENCY symptoms - Clear, urgent language
    if (lower.includes('chest pain') || lower.includes('difficulty breathing') || lower.includes('severe bleeding') || lower.includes('unconscious')) {
      return {
        possibleExplanations: [
          'This may be associated with a potential cardiac event',
          'Severe respiratory issues can present this way',
          'This could indicate a medical emergency requiring immediate attention',
        ],
        severity: 'high',
        whatThisMaySuggest: 'These symptoms may be consistent with a serious medical condition that requires immediate emergency medical evaluation. It is impossible to determine the exact cause without proper medical examination.',
        warningSigns: [
          '🚨 These symptoms may indicate a medical emergency',
          '🚨 Do not delay seeking care',
          '🚨 Call emergency services immediately',
        ],
        suggestedNextStep: 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services (911 in US, 112 in Europe, 999 in UK, 115 in Pakistan) or go to the nearest emergency room. Do not drive yourself.',
        selfCareOptions: [
          '🚨 Call emergency services NOW',
          '🪑 Sit or lie down in a comfortable position',
          '📞 Do not hang up until instructed by emergency dispatcher',
          '🚫 Do not attempt to drive yourself to the hospital',
        ],
        careNavigation: 'emergency',
      };
    }

    // Common symptoms with cautious language
    if (lower.includes('headache')) {
      return {
        possibleExplanations: [
          'This may be associated with tension or stress',
          'Dehydration can sometimes cause headaches',
          'Lack of sleep may contribute to this symptom',
          'Eye strain from screens is a common factor',
        ],
        severity: 'low',
        whatThisMaySuggest: 'Headaches can have many causes. Most are related to common factors like stress, dehydration, or lack of sleep. However, persistent or severe headaches may warrant medical attention.',
        warningSigns: [
          '⚠️ Sudden, severe headache (worst headache of your life)',
          '⚠️ Headache with vision changes or confusion',
          '⚠️ Headache with fever and stiff neck',
          '⚠️ Headache after head injury',
        ],
        suggestedNextStep: 'If this is a new or unusual headache, or if you experience any warning signs above, please consult a healthcare professional.',
        selfCareOptions: [
          '💧 Stay hydrated by drinking water',
          '🛌 Rest in a quiet, dark room',
          '🧊 Apply a cold compress to your forehead',
          '💊 Over-the-counter pain relief may help (follow package directions)',
        ],
        careNavigation: 'selfCare',
      };
    }

    if (lower.includes('fever')) {
      return {
        possibleExplanations: [
          'This may be associated with a viral infection',
          'Bacterial infections can cause fever',
          'Inflammatory conditions may present with fever',
        ],
        severity: 'moderate',
        whatThisMaySuggest: 'Fever is your body\'s way of responding to infection or illness. While often a sign that your immune system is working, persistent or high fever may indicate a condition that needs medical evaluation.',
        warningSigns: [
          '⚠️ Temperature above 103°F (39.4°C)',
          '⚠️ Fever lasting more than 3 days',
          '⚠️ Severe headache with fever',
          '⚠️ Difficulty breathing',
        ],
        suggestedNextStep: 'Monitor your temperature and symptoms. If you experience any warning signs or if fever persists, please seek medical care.',
        selfCareOptions: [
          '💧 Rest and stay well-hydrated',
          '🛁 Take lukewarm baths to help reduce temperature',
          '👕 Wear light, breathable clothing',
          '🌡️ Monitor temperature regularly',
        ],
        careNavigation: 'routine',
      };
    }

    // Default response with cautious language
    return {
      possibleExplanations: [
        'This may be associated with a common viral illness',
        'Stress-related symptoms are possible',
        'Environmental factors may play a role',
      ],
      severity: 'low',
      whatThisMaySuggest: 'Based on your description, this appears to possibly be a mild condition. However, only a healthcare professional can provide a proper diagnosis after evaluation.',
      warningSigns: [
        '⚠️ Symptoms worsening over time',
        '⚠️ New or unusual symptoms developing',
        '⚠️ Symptoms persisting more than a week',
      ],
      suggestedNextStep: 'Monitor your symptoms. If they worsen, persist, or if you develop new concerning symptoms, please consult a healthcare professional.',
      selfCareOptions: [
        '🛌 Rest and stay hydrated',
        '🥗 Eat nutritious meals',
        '📝 Monitor your symptoms and note any changes',
      ],
      careNavigation: 'selfCare',
    };
  }

  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    // TODO: Implement actual AI integration
    // For now, use rule-based analysis with cautious language
    
    const lower = input.toLowerCase();

    if (lower.includes('cholesterol') || lower.includes('ldl')) {
      return {
        results: [
          {
            name: 'Total Cholesterol',
            value: '240',
            unit: 'mg/dL',
            status: 'abnormal',
            whatThisMayMean: 'This value is above the typical recommended level (below 200 mg/dL). Elevated cholesterol may be associated with increased cardiovascular risk over time, but many factors affect heart health.',
          },
          {
            name: 'LDL (Bad Cholesterol)',
            value: '155',
            unit: 'mg/dL',
            status: 'abnormal',
            whatThisMayMean: 'This is above the typical optimal level (below 100 mg/dL). Higher LDL levels may be associated with plaque buildup in arteries, but individual risk varies.',
          },
        ],
        summary: 'Some of these values are outside typical reference ranges. This may suggest areas that could benefit from attention, but only a healthcare professional can assess your individual risk.',
        whatThisMaySuggest: 'These results may indicate elevated cholesterol levels, which some studies have associated with long-term cardiovascular risk. However, cholesterol levels are just one factor among many that affect heart health.',
        nextSteps: [
          '👨‍⚕️ Schedule a follow-up with your doctor to discuss these results',
          '🥗 Consider discussing dietary modifications with your doctor',
          '🚶‍♂️ Ask your doctor about appropriate physical activity',
          '🔄 Your doctor may recommend retesting in 3-6 months',
        ],
        importantNote: 'Cholesterol levels are just one piece of your overall health picture. Many factors affect cardiovascular health, and treatment decisions should be made with your doctor.',
      };
    }

    if (lower.includes('vitamin d')) {
      return {
        results: [
          {
            name: 'Vitamin D (25-OH)',
            value: '18',
            unit: 'ng/mL',
            status: 'abnormal',
            whatThisMayMean: 'This value is below the typical reference range (30-100 ng/mL). Low Vitamin D is very common and may be associated with various health factors.',
          },
        ],
        summary: 'This value is below the typical reference range. Low Vitamin D is very common and usually easily addressed.',
        whatThisMaySuggest: 'This result may suggest low Vitamin D levels, which is a common finding. Vitamin D is important for bone health and other bodily functions.',
        nextSteps: [
          '👨‍⚕️ Discuss supplementation with your doctor (typical doses range from 1000-4000 IU/day)',
          '☀️ Ask your doctor about safe sun exposure',
          '🐟 Consider Vitamin D-rich foods (fatty fish, fortified milk)',
          '🔄 Your doctor may recommend rechecking levels in 3 months',
        ],
        importantNote: 'Vitamin D needs vary by individual. Your doctor can recommend the appropriate approach based on your specific situation.',
      };
    }

    // Default response
    return {
      results: [
        {
          name: 'Test Result',
          value: '—',
          unit: '',
          status: 'normal',
          whatThisMayMean: 'Based on the information provided, this appears to be within acceptable ranges. However, complete interpretation requires the full lab report.',
        },
      ],
      summary: 'Based on the information provided, these results appear generally within typical ranges. However, for a complete interpretation, specific values from your full report would be needed.',
      whatThisMaySuggest: 'Without complete information, it\'s difficult to provide specific insights. Lab results should always be interpreted in the context of your overall health by a qualified healthcare professional.',
      nextSteps: [
        '📋 Share specific values from your full report for more detailed insights',
        '👨‍⚕️ Discuss these results with your doctor at your next visit',
        '📁 Keep a copy of your results for your records',
      ],
      importantNote: 'Lab results should always be interpreted by a healthcare professional who knows your medical history and can consider all relevant factors.',
    };
  }
}

export const aiService = new AIService();
