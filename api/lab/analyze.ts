import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock lab analysis for serverless function
function analyzeLabReport(input: string) {
  const lower = input.toLowerCase();
  
  // Cholesterol
  if (lower.includes('cholesterol') || lower.includes('ldl')) {
    return {
      severity: 3,
      urgency: 'doctor_soon',
      summary: 'Some of these values are outside typical reference ranges. This may suggest areas that could benefit from attention.',
      results: [
        {
          test_name: 'Total Cholesterol',
          result_value: '240',
          result_unit: 'mg/dL',
          reference_range: '<200',
          status: 'high',
          confidence: 0.9,
          what_is_this: 'Cholesterol is a fatty substance in your blood. Your body needs some cholesterol, but too much may increase health risks.',
          what_it_means: 'Your cholesterol level of 240 mg/dL is above the typical range. High cholesterol may be associated with increased health risks over time.',
          what_to_do: 'Consider discussing dietary changes with your doctor. They may recommend reducing saturated fats and increasing physical activity.',
        },
        {
          test_name: 'LDL (Bad Cholesterol)',
          result_value: '155',
          result_unit: 'mg/dL',
          reference_range: '<100',
          status: 'high',
          confidence: 0.9,
          what_is_this: 'LDL cholesterol is often called "bad" cholesterol because high levels can build up in arteries.',
          what_it_means: 'Your LDL level of 155 mg/dL is above the typical optimal level. Higher LDL levels may be associated with plaque buildup in arteries.',
          what_to_do: 'Discuss with your doctor about lifestyle changes and whether medication might be appropriate.',
        },
      ],
      overall_status: 'some_abnormal',
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
      confidence_score: 0.9,
      language: 'en',
    };
  }
  
  // Vitamin D
  if (lower.includes('vitamin d')) {
    return {
      severity: 2,
      urgency: 'doctor_soon',
      summary: 'This value is below the typical reference range. Low Vitamin D is very common and usually easily addressed.',
      results: [
        {
          test_name: 'Vitamin D (25-OH)',
          result_value: '18',
          result_unit: 'ng/mL',
          reference_range: '30-100',
          status: 'low',
          confidence: 0.9,
          what_is_this: 'Vitamin D helps your body absorb calcium and supports bone health, immune function, and mood.',
          what_it_means: 'Your Vitamin D level of 18 ng/mL is below the typical range. Low Vitamin D is very common and usually easily addressed.',
          what_to_do: 'Discuss supplementation with your doctor. They may recommend 1000-4000 IU daily. Getting 15-20 minutes of sunlight daily may also help.',
        },
      ],
      overall_status: 'some_abnormal',
      disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
      confidence_score: 0.9,
      language: 'en',
    };
  }
  
  // Default
  return {
    severity: 3,
    urgency: 'doctor_soon',
    summary: 'Based on the information provided, these results appear generally within typical ranges.',
    results: [
      {
        test_name: 'Test Result',
        result_value: '—',
        result_unit: '',
        reference_range: '',
        status: 'normal',
        confidence: 0.9,
        what_is_this: 'This is a placeholder result. Please provide specific lab values for accurate analysis.',
        what_it_means: 'Based on the information provided, this appears to be within acceptable ranges.',
        what_to_do: 'Share specific values from your full report for more detailed insights.',
      },
    ],
    overall_status: 'normal',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
    confidence_score: 0.9,
    language: 'en',
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

    if (input.length > 10000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input: input must not exceed 10000 characters' 
      });
    }

    const result = analyzeLabReport(input);
    
    return res.status(200).json({
      success: true,
       result,
      message: 'Lab report analyzed successfully',
    });
  } catch (error) {
    console.error('Lab analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze lab report' 
    });
  }
}
