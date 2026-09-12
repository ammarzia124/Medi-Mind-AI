import { SymptomAnalysis } from '../lib/schemas';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const SYSTEM_PROMPT = `You are a medical symptom analysis AI assistant. Analyze the user's symptoms and return a JSON response with the following structure:

{
  "severity": <number 1-5>,
  "urgency": "<emergency|urgent|doctor_soon|monitor|self_care>",
  "summary": "<2-3 sentence overview of what the symptoms may indicate>",
  "possible_explanations": ["<explanation 1>", "<explanation 2>", ...],
  "warning_signs": ["<warning 1>", "<warning 2>", ...],
  "recommended_action": "<clear next step recommendation>",
  "self_care": ["<self-care option 1>", "<self-care option 2>", ...],
  "disclaimer": "⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition."
}

Rules:
- severity: 1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Critical
- urgency: emergency=call 911 NOW, urgent=see doctor within 24h, doctor_soon=schedule visit in days, monitor=watch at home, self_care=home remedies OK
- For chest pain, difficulty breathing, severe bleeding, loss of consciousness → severity=5, urgency=emergency
- Return ONLY valid JSON, no markdown, no code blocks
- Include 3-5 possible explanations, 3-5 warning signs, 3-5 self-care options
- Use simple, clear language
- Always include the disclaimer`;

const FALLBACK_RESULT: SymptomAnalysis = {
  severity: 2,
  urgency: 'self_care',
  summary: 'Based on your description, this appears to possibly be a mild condition. However, only a healthcare professional can provide a proper diagnosis after evaluation.',
  possible_explanations: [
    'This may be associated with a common viral illness',
    'Stress-related symptoms are possible',
    'Environmental factors may play a role',
    'Mild allergic reaction is a possibility',
  ],
  warning_signs: [
    '⚠️ Symptoms worsening over time',
    '⚠️ New or unusual symptoms developing',
    '⚠️ Symptoms persisting more than a week',
    '⚠️ High fever or severe pain',
  ],
  recommended_action: 'Monitor your symptoms. If they worsen, persist, or if you develop new concerning symptoms, please consult a healthcare professional.',
  self_care: [
    '🛌 Rest and stay hydrated',
    '🥗 Eat nutritious meals',
    '📝 Monitor your symptoms and note any changes',
    '📓 Keep a symptom diary to track patterns',
  ],
  disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
};

function buildLocalFallback(input: string): SymptomAnalysis {
  const lower = input.toLowerCase();

  if (lower.includes('chest') || lower.includes('heart') || lower.includes('breathing')) {
    return {
      severity: 5,
      urgency: 'emergency',
      summary: 'These symptoms may be consistent with a serious medical condition that requires immediate emergency medical evaluation.',
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
      recommended_action: 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services or go to the nearest emergency room.',
      self_care: [
        '🚨 Call emergency services NOW',
        '🪑 Sit or lie down in a comfortable position',
        '📞 Do not hang up until instructed by emergency dispatcher',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. For chest pain or difficulty breathing, seek emergency medical care immediately.',
    };
  }

  if (lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine')) {
    return {
      severity: 2,
      urgency: 'self_care',
      summary: 'Headaches can have many causes. Most are related to common factors like stress, dehydration, or lack of sleep.',
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
        '💊 Over-the-counter pain relief may help',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) {
    return {
      severity: 3,
      urgency: 'monitor',
      summary: "Fever is your body's way of responding to infection or illness. While often a sign that your immune system is working, persistent or high fever may need medical evaluation.",
      possible_explanations: [
        'This may be associated with a viral infection (cold/flu)',
        'Bacterial infections can cause fever',
        'Inflammatory conditions may present with fever',
      ],
      warning_signs: [
        '⚠️ Temperature above 103°F (39.4°C)',
        '⚠️ Fever lasting more than 3 days',
        '⚠️ Severe headache with fever',
        '⚠️ Rash appearing with fever',
      ],
      recommended_action: 'Monitor your temperature and symptoms. If you experience any warning signs or if fever persists, please seek medical care.',
      self_care: [
        '💧 Rest and stay well-hydrated',
        '🛁 Take lukewarm baths to help reduce temperature',
        '💊 Fever-reducing medication as directed on package',
        '🌡️ Monitor temperature regularly',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('cough') || lower.includes('throat') || lower.includes('cold')) {
    return {
      severity: 2,
      urgency: 'self_care',
      summary: 'Cough is a common symptom that can have many causes. Most coughs from viral infections resolve on their own within 1-2 weeks.',
      possible_explanations: [
        'This may be associated with a common cold',
        'Allergies can cause coughing',
        'Dry air may irritate your throat',
        'Asthma may present with cough',
      ],
      warning_signs: [
        '⚠️ Cough lasting more than 3 weeks',
        '⚠️ Coughing up blood',
        '⚠️ Chest pain with coughing',
        '⚠️ Difficulty breathing or wheezing',
      ],
      recommended_action: 'If your cough persists, worsens, or is accompanied by warning signs, please consult a healthcare professional.',
      self_care: [
        '💧 Stay hydrated with warm fluids',
        '🍯 Honey may help soothe throat',
        '💨 Use a humidifier to add moisture to air',
        '🚭 Avoid irritants like smoke',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('tired') || lower.includes('fatigue') || lower.includes('exhausted') || lower.includes('weak')) {
    return {
      severity: 3,
      urgency: 'doctor_soon',
      summary: 'Fatigue can have many underlying causes. While often related to lifestyle factors, persistent fatigue may indicate a condition that needs medical evaluation.',
      possible_explanations: [
        'This may be associated with poor sleep quality',
        'Stress or anxiety can cause fatigue',
        'Iron deficiency (anemia) is a possible cause',
        'Thyroid issues can sometimes present as fatigue',
      ],
      warning_signs: [
        '⚠️ Fatigue persisting more than 2 weeks despite rest',
        '⚠️ Unexplained weight changes',
        '⚠️ Significant mood changes',
        '⚠️ Fatigue interfering with daily activities',
      ],
      recommended_action: 'If fatigue persists or is affecting your daily life, consider scheduling a visit with a healthcare professional.',
      self_care: [
        '😴 Maintain a consistent sleep schedule',
        '🚶‍♂️ Exercise regularly (even light walks)',
        '🥗 Eat balanced, nutritious meals',
        '💧 Stay well-hydrated',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('stomach') || lower.includes('belly') || lower.includes('nausea') || lower.includes('vomit')) {
    return {
      severity: 2,
      urgency: 'self_care',
      summary: 'Stomach discomfort can have many causes, often related to diet or mild infections. Most cases resolve with rest and gentle care.',
      possible_explanations: [
        'This may be associated with indigestion',
        'Food intolerance is a possible cause',
        'Gastritis (stomach inflammation) may be involved',
        'Viral gastroenteritis is another possibility',
      ],
      warning_signs: [
        '⚠️ Severe or worsening pain',
        '⚠️ Blood in stool or vomit',
        '⚠️ Persistent vomiting (more than 24 hours)',
        '⚠️ Pain lasting more than a few days',
      ],
      recommended_action: 'If you experience warning signs or if symptoms persist, please consult a healthcare professional.',
      self_care: [
        '🍞 Eat small, bland meals (BRAT diet)',
        '💧 Stay hydrated with clear fluids',
        '🚫 Avoid spicy, fatty, or acidic foods temporarily',
        '🫚 Ginger tea may help with nausea',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('back') || lower.includes('spine') || lower.includes('waist')) {
    return {
      severity: 3,
      urgency: 'doctor_soon',
      summary: 'Back pain is very common and often related to posture or muscle strain. While usually not serious, some types may need medical evaluation.',
      possible_explanations: [
        'This may be associated with muscle strain',
        'Poor posture can contribute to back pain',
        'Herniated disc is a possible cause',
        'Sedentary lifestyle may be a factor',
      ],
      warning_signs: [
        '⚠️ Pain radiating down the leg',
        '⚠️ Numbness or weakness in legs',
        '⚠️ Pain following an injury',
        '⚠️ Loss of bladder or bowel control (EMERGENCY)',
      ],
      recommended_action: 'If you experience warning signs, especially loss of bladder/bowel control, seek medical care immediately.',
      self_care: [
        '🔥 Apply heat or ice to the affected area',
        '🚶‍♂️ Gentle stretching and walking may help',
        '🪑 Maintain good posture',
        '⏰ Avoid prolonged sitting',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  return FALLBACK_RESULT;
}

export const symptomService = {
  async analyzeSymptoms(input: string, language: string = 'en'): Promise<SymptomAnalysis> {
    if (!GROQ_API_KEY) {
      console.warn('No Groq API key found, using local fallback');
      return buildLocalFallback(input);
    }

    try {
      const langInstruction = language === 'ur'
        ? '\n\nIMPORTANT: The user prefers Urdu. Respond in English but keep language simple for translation. Keep all medical terms in English.'
        : '';

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + langInstruction },
            { role: 'user', content: `Analyze these symptoms: ${input}` },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        console.error('Groq API error:', response.status);
        return buildLocalFallback(input);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        return buildLocalFallback(input);
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(content);
      } catch {
        return buildLocalFallback(input);
      }

      return {
        severity: typeof parsed.severity === 'number' ? Math.min(5, Math.max(1, parsed.severity)) : 2,
        urgency: ['emergency', 'urgent', 'doctor_soon', 'monitor', 'self_care'].includes(parsed.urgency as string)
          ? (parsed.urgency as SymptomAnalysis['urgency'])
          : 'self_care',
        summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 1000) : 'Unable to generate summary.',
        possible_explanations: Array.isArray(parsed.possible_explanations) ? parsed.possible_explanations.slice(0, 10) : ['Please consult a healthcare professional.'],
        warning_signs: Array.isArray(parsed.warning_signs) ? parsed.warning_signs.slice(0, 10) : ['If symptoms worsen, seek medical care.'],
        recommended_action: typeof parsed.recommended_action === 'string' ? parsed.recommended_action.slice(0, 500) : 'Consult a healthcare professional.',
        self_care: Array.isArray(parsed.self_care) ? parsed.self_care.slice(0, 10) : [],
        disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
      };
    } catch (error) {
      console.error('Groq API call failed:', error);
      return buildLocalFallback(input);
    }
  },
};
