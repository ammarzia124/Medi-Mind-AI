import { SymptomAnalysis, LabAnalysis, validateOrThrow, SymptomAnalysisSchema, LabAnalysisSchema } from '../validators/schemas';
import { config } from '../config';

/**
 * AI Service - Handles integration with AI/ML models for health analysis
 * 
 * CRITICAL SAFETY RULES:
 * 1. NEVER provides medical diagnoses
 * 2. All output is validated through Zod before returning
 * 3. Uses probabilistic language: "This may be associated with..."
 * 4. For emergencies, clearly advises immediate medical care
 * 5. NEVER encourages users to delay emergency treatment
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

  async analyzeSymptoms(input: string): Promise<SymptomAnalysis> {
    // TODO: Implement actual AI integration
    // For now, use rule-based analysis with cautious language
    
    const lower = input.toLowerCase();
    let rawResult: SymptomAnalysis;
    
    // EMERGENCY symptoms - Clear, urgent language
    if (lower.includes('chest pain') || lower.includes('difficulty breathing') || lower.includes('severe bleeding') || lower.includes('unconscious')) {
      rawResult = {
        severity: 5,
        urgency: 'emergency',
        summary: 'These symptoms may be consistent with a serious medical condition that requires immediate emergency medical evaluation. It is impossible to determine the exact cause without proper medical examination.',
        possible_explanations: [
          'This may be associated with a potential cardiac event',
          'Severe respiratory issues can present this way',
          'This could indicate a medical emergency requiring immediate attention',
        ],
        warning_signs: [
          '🚨 These symptoms may indicate a medical emergency',
          '🚨 Do not delay seeking care',
          '🚨 Call emergency services immediately',
        ],
        recommended_action: 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services (911 in US, 112 in Europe, 999 in UK, 115 in Pakistan) or go to the nearest emergency room. Do not drive yourself.',
        self_care: [
          '🚨 Call emergency services NOW',
          '🪑 Sit or lie down in a comfortable position',
          '📞 Do not hang up until instructed by emergency dispatcher',
          '🚫 Do not attempt to drive yourself to the hospital',
        ],
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. For chest pain or difficulty breathing, seek emergency medical care immediately.',
      };
    } else if (lower.includes('headache')) {
      rawResult = {
        severity: 2,
        urgency: 'self_care',
        summary: 'Headaches can have many causes. Most are related to common factors like stress, dehydration, or lack of sleep. However, persistent or severe headaches may warrant medical attention.',
        possible_explanations: [
          'This may be associated with tension or stress',
          'Dehydration can sometimes cause headaches',
          'Lack of sleep may contribute to this symptom',
          'Eye strain from screens is a common factor',
        ],
        warning_signs: [
          '⚠️ Sudden, severe headache (worst headache of your life)',
          '⚠️ Headache with vision changes or confusion',
          '⚠️ Headache with fever and stiff neck',
          '⚠️ Headache after head injury',
        ],
        recommended_action: 'If this is a new or unusual headache, or if you experience any warning signs above, please consult a healthcare professional.',
        self_care: [
          '💧 Stay hydrated by drinking water',
          '🛌 Rest in a quiet, dark room',
          '🧊 Apply a cold compress to your forehead',
          '💊 Over-the-counter pain relief may help (follow package directions)',
        ],
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
      };
    } else if (lower.includes('fever')) {
      rawResult = {
        severity: 3,
        urgency: 'monitor',
        summary: 'Fever is your body\'s way of responding to infection or illness. While often a sign that your immune system is working, persistent or high fever may indicate a condition that needs medical evaluation.',
        possible_explanations: [
          'This may be associated with a viral infection',
          'Bacterial infections can cause fever',
          'Inflammatory conditions may present with fever',
        ],
        warning_signs: [
          '⚠️ Temperature above 103°F (39.4°C)',
          '⚠️ Fever lasting more than 3 days',
          '⚠️ Severe headache with fever',
          '⚠️ Difficulty breathing',
        ],
        recommended_action: 'Monitor your temperature and symptoms. If you experience any warning signs or if fever persists, please seek medical care.',
        self_care: [
          '💧 Rest and stay well-hydrated',
          '🛁 Take lukewarm baths to help reduce temperature',
          '👕 Wear light, breathable clothing',
          '🌡️ Monitor temperature regularly',
        ],
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
      };
    } else {
      // Default response with cautious language
      rawResult = {
        severity: 2,
        urgency: 'self_care',
        summary: 'Based on your description, this appears to possibly be a mild condition. However, only a healthcare professional can provide a proper diagnosis after evaluation.',
        possible_explanations: [
          'This may be associated with a common viral illness',
          'Stress-related symptoms are possible',
          'Environmental factors may play a role',
        ],
        warning_signs: [
          '⚠️ Symptoms worsening over time',
          '⚠️ New or unusual symptoms developing',
          '⚠️ Symptoms persisting more than a week',
        ],
        recommended_action: 'Monitor your symptoms. If they worsen, persist, or if you develop new concerning symptoms, please consult a healthcare professional.',
        self_care: [
          '🛌 Rest and stay hydrated',
          '🥗 Eat nutritious meals',
          '📝 Monitor your symptoms and note any changes',
        ],
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
      };
    }
    
    // CRITICAL: Validate output through Zod before returning
    // This ensures invalid AI output NEVER reaches the client
    return validateOrThrow(SymptomAnalysisSchema, rawResult, 'symptom analysis');
  }

  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    // TODO: Implement actual AI integration
    const lower = input.toLowerCase();
    let rawResult: LabAnalysis;

    if (lower.includes('cholesterol') || lower.includes('ldl')) {
      rawResult = {
        severity: 3,
        urgency: 'doctor_soon',
        summary: 'Some of these values are outside typical reference ranges. This may suggest areas that could benefit from attention, but only a healthcare professional can assess your individual risk.',
        results: [
          {
            name: 'Total Cholesterol',
            value: '240',
            unit: 'mg/dL',
            status: 'outside_reference_range',
            what_this_may_mean: 'This value is above the typical recommended level (below 200 mg/dL). Elevated cholesterol may be associated with increased cardiovascular risk over time, but many factors affect heart health.',
          },
          {
            name: 'LDL (Bad Cholesterol)',
            value: '155',
            unit: 'mg/dL',
            status: 'outside_reference_range',
            what_this_may_mean: 'This is above the typical optimal level (below 100 mg/dL). Higher LDL levels may be associated with plaque buildup in arteries, but individual risk varies.',
          },
        ],
        warning_signs: [
          '⚠️ Multiple values outside reference ranges',
          '⚠️ Family history of heart disease',
          '⚠️ Other cardiovascular risk factors present',
        ],
        recommended_action: 'Schedule a follow-up with your doctor to discuss these results. They can assess your individual risk and recommend appropriate steps.',
        next_steps: [
          '👨‍⚕️ Schedule a follow-up with your doctor',
          '🥗 Consider discussing dietary modifications',
          '🚶‍♂️ Ask your doctor about appropriate physical activity',
          '🔄 Your doctor may recommend retesting in 3-6 months',
        ],
        important_note: 'Cholesterol levels are just one piece of your overall health picture. Many factors affect cardiovascular health, and treatment decisions should be made with your doctor.',
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
      };
    } else if (lower.includes('vitamin d')) {
      rawResult = {
        severity: 2,
        urgency: 'doctor_soon',
        summary: 'This value is below the typical reference range. Low Vitamin D is very common and usually easily addressed.',
        results: [
          {
            name: 'Vitamin D (25-OH)',
            value: '18',
            unit: 'ng/mL',
            status: 'outside_reference_range',
            what_this_may_mean: 'This value is below the typical reference range (30-100 ng/mL). Low Vitamin D is very common and may be associated with various health factors.',
          },
        ],
        warning_signs: [
          '⚠️ Bone pain or muscle weakness',
          '⚠️ Frequent infections',
          '⚠️ Fatigue or mood changes',
        ],
        recommended_action: 'Discuss supplementation with your doctor. This is very common and usually easily managed.',
        next_steps: [
          '👨‍⚕️ Discuss supplementation with your doctor',
          '☀️ Ask your doctor about safe sun exposure',
          '🐟 Consider Vitamin D-rich foods',
          '🔄 Your doctor may recommend rechecking levels in 3 months',
        ],
        important_note: 'Vitamin D needs vary by individual. Your doctor can recommend the appropriate approach based on your specific situation.',
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
      };
    } else {
      // Default response
      rawResult = {
        severity: 3,
        urgency: 'doctor_soon',
        summary: 'Based on the information provided, these results appear generally within typical ranges. However, for a complete interpretation, specific values from your full report would be needed.',
        results: [
          {
            name: 'Test Result',
            value: '—',
            unit: '',
            status: 'within_reference_range',
            what_this_may_mean: 'Based on the information provided, this appears to be within acceptable ranges. However, complete interpretation requires the full lab report.',
          },
        ],
        warning_signs: [
          '⚠️ Any result marked as abnormal should be discussed with your doctor',
          '⚠️ Lab results should never be interpreted in isolation',
          '⚠️ Reference ranges vary between laboratories',
        ],
        recommended_action: 'Discuss these results with your doctor at your next visit. They can provide proper interpretation in the context of your overall health.',
        next_steps: [
          '📋 Share specific values from your full report for more detailed insights',
          '👨‍⚕️ Discuss these results with your doctor',
          '📁 Keep a copy of your results for your records',
        ],
        important_note: 'Lab results should always be interpreted by a healthcare professional who knows your medical history and can consider all relevant factors.',
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
      };
    }
    
    // CRITICAL: Validate output through Zod before returning
    return validateOrThrow(LabAnalysisSchema, rawResult, 'lab analysis');
  }
}

export const aiService = new AIService();
