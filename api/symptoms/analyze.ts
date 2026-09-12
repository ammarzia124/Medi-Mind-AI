import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock symptom analysis for serverless function
function analyzeSymptoms(input: string) {
  const lower = input.toLowerCase();
  
  // Emergency symptoms
  if (lower.includes('chest pain') || lower.includes('difficulty breathing') || 
      lower.includes('severe bleeding') || lower.includes('unconscious')) {
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
  
  // Headache
  if (lower.includes('headache')) {
    return {
      severity: 2,
      urgency: 'self_care',
      summary: 'Headaches can have many causes. Most are related to common factors like stress, dehydration, or lack of sleep.',
      possible_explanations: [
        'This may be associated with tension or stress',
        'Dehydration can sometimes cause headaches',
        'Lack of sleep may contribute to this symptom',
      ],
      warning_signs: [
        '⚠️ Sudden, severe headache',
        '⚠️ Headache with vision changes',
        '⚠️ Headache with fever and stiff neck',
      ],
      recommended_action: 'If this is a new or unusual headache, consult a healthcare professional.',
      self_care: [
        '💧 Stay hydrated',
        '🛌 Rest in a quiet, dark room',
        '🧊 Apply a cold compress',
      ],
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis.',
    };
  }
  
  // Default
  return {
    severity: 2,
    urgency: 'self_care',
    summary: 'Based on your description, this appears to possibly be a mild condition.',
    possible_explanations: [
      'This may be associated with a common viral illness',
      'Stress-related symptoms are possible',
    ],
    warning_signs: [
      '⚠️ Symptoms worsening over time',
      '⚠️ New or unusual symptoms developing',
    ],
    recommended_action: 'Monitor your symptoms. If they worsen or persist, consult a healthcare professional.',
    self_care: [
      '🛌 Rest and stay hydrated',
      '🥗 Eat nutritious meals',
    ],
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis.',
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { input } = req.body;
    
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input: input must be a non-empty string' 
      });
    }

    if (input.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input: input must be at least 3 characters' 
      });
    }

    if (input.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input: input must not exceed 5000 characters' 
      });
    }

    const result = analyzeSymptoms(input);
    
    return res.status(200).json({
      success: true,
       result,
      message: 'Symptoms analyzed successfully',
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze symptoms' 
    });
  }
}
