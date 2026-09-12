import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

function buildMockResult(input: string) {
  const lower = input.toLowerCase();

  if (lower.includes('chest') || lower.includes('heart') || lower.includes('breathing difficulty')) {
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
      recommended_action: 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services (911 in US, 112 in Europe, 999 in UK, 115 in Pakistan) or go to the nearest emergency room.',
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
        '💊 Over-the-counter pain relief may help (follow package directions)',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };
  }

  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) {
    return {
      severity: 3,
      urgency: 'monitor',
      summary: "Fever is your body's way of responding to infection or illness. While often a sign that your immune system is working, persistent or high fever may indicate a condition that needs medical evaluation.",
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

  // Default
  return {
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
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { input, language = 'en' } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid input: input must be a non-empty string' });
    }

    if (input.length < 3) {
      return res.status(400).json({ success: false, message: 'Input must be at least 3 characters' });
    }

    if (input.length > 5000) {
      return res.status(400).json({ success: false, message: 'Input must not exceed 5000 characters' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // If no Groq API key, use mock
    if (!groqApiKey) {
      const result = buildMockResult(input);
      return res.status(200).json({ success: true, data: result, message: 'Analyzed (mock)' });
    }

    // Call Groq API
    const langInstruction = language === 'ur'
      ? '\n\nIMPORTANT: The user prefers Urdu. Respond in English but the summary and recommended_action should be written so they can be easily translated. Keep all medical terms in English.'
      : '';

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
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
      console.error('Groq API error:', response.status, await response.text());
      // Fallback to mock on API error
      const result = buildMockResult(input);
      return res.status(200).json({ success: true, data: result, message: 'Analyzed (fallback)' });
    }

    const groqData = await response.json();
    const content = groqData.choices?.[0]?.message?.content;

    if (!content) {
      const result = buildMockResult(input);
      return res.status(200).json({ success: true, data: result, message: 'Analyzed (fallback)' });
    }

    // Parse and validate the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const result = buildMockResult(input);
      return res.status(200).json({ success: true, data: result, message: 'Analyzed (fallback)' });
    }

    // Ensure required fields exist with defaults
    const result = {
      severity: typeof parsed.severity === 'number' ? Math.min(5, Math.max(1, parsed.severity)) : 2,
      urgency: ['emergency', 'urgent', 'doctor_soon', 'monitor', 'self_care'].includes(parsed.urgency) ? parsed.urgency : 'self_care',
      summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 1000) : 'Unable to generate summary.',
      possible_explanations: Array.isArray(parsed.possible_explanations) ? parsed.possible_explanations.slice(0, 10) : ['Please consult a healthcare professional.'],
      warning_signs: Array.isArray(parsed.warning_signs) ? parsed.warning_signs.slice(0, 10) : ['If symptoms worsen, seek medical care.'],
      recommended_action: typeof parsed.recommended_action === 'string' ? parsed.recommended_action.slice(0, 500) : 'Consult a healthcare professional.',
      self_care: Array.isArray(parsed.self_care) ? parsed.self_care.slice(0, 10) : [],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can diagnose your condition.',
    };

    return res.status(200).json({ success: true, data: result, message: 'Symptoms analyzed successfully' });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze symptoms' });
  }
}
