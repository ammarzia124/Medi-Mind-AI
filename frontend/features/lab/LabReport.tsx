import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  FlaskConical, 
  ArrowLeft, 
  Upload, 
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  TrendingUp,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type LabAnalysis,
  type LabResultStatus,
  severityToLabel,
  severityToEmoji,
  severityToColorClass,
  urgencyToLabel,
  urgencyToColorClass,
} from '../../lib/schemas';
import {
  validateLabAnalysis,
  sanitizeInput,
} from '../../lib/validators';

// ============================================================================
// LAB DATABASE - All entries follow the validated schema structure
// ============================================================================

const labDatabase: Record<string, LabAnalysis> = {
  hemoglobin: {
    severity: 2,
    urgency: 'self_care',
    summary: 'These values appear to be within typical reference ranges. However, reference ranges can vary by lab, age, and sex.',
    results: [
      { name: 'Hemoglobin', value: '12.5', unit: 'g/dL', status: 'within_reference_range', what_this_may_mean: 'This value falls within the typical reference range. Hemoglobin helps carry oxygen in your blood.' },
      { name: 'Red Blood Cell Count', value: '4.7', unit: 'million/µL', status: 'within_reference_range', what_this_may_mean: 'This appears to be within the typical range, suggesting normal red blood cell production.' },
    ],
    warning_signs: [
      '⚠️ Significant changes from previous results',
      '⚠️ Values far outside reference ranges',
      '⚠️ New symptoms accompanying lab changes',
    ],
    recommended_action: 'Discuss these results with your doctor at your next appointment. Only a healthcare professional can interpret these in the context of your overall health.',
    next_steps: [
      '📋 Discuss these results with your doctor',
      '💧 Continue maintaining a balanced diet',
      '🏃‍♂️ Stay active and hydrated',
      '📅 Follow your doctor\'s recommended schedule for future tests',
    ],
    important_note: 'Lab results should always be interpreted by a healthcare professional who knows your medical history. Reference ranges vary between laboratories.',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
  },
  cholesterol: {
    severity: 3,
    urgency: 'doctor_soon',
    summary: 'Some of these values are outside typical reference ranges. This may suggest areas that could benefit from attention, but only a healthcare professional can assess your individual risk.',
    results: [
      { name: 'Total Cholesterol', value: '240', unit: 'mg/dL', status: 'outside_reference_range', what_this_may_mean: 'This value is above the typical recommended level (below 200 mg/dL). Elevated cholesterol may be associated with increased cardiovascular risk over time.' },
      { name: 'LDL (Bad Cholesterol)', value: '155', unit: 'mg/dL', status: 'outside_reference_range', what_this_may_mean: 'This is above the typical optimal level (below 100 mg/dL). Higher LDL levels may be associated with plaque buildup in arteries.' },
      { name: 'HDL (Good Cholesterol)', value: '45', unit: 'mg/dL', status: 'within_reference_range', what_this_may_mean: 'This appears to be within the acceptable range (above 40 mg/dL). HDL may help remove other forms of cholesterol.' },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', status: 'outside_reference_range', what_this_may_mean: 'This is above the typical range (below 150 mg/dL). Elevated triglycerides may be associated with dietary factors.' },
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
      '💊 Do NOT start any medication without consulting your doctor',
    ],
    important_note: 'Cholesterol levels are just one piece of your overall health picture. Many factors affect cardiovascular health, and treatment decisions should be made with your doctor.',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
  },
  blood_sugar: {
    severity: 4,
    urgency: 'doctor_soon',
    summary: 'These values are above typical reference ranges and may warrant further evaluation. However, blood sugar levels can be affected by many factors.',
    results: [
      { name: 'Fasting Blood Sugar', value: '135', unit: 'mg/dL', status: 'outside_reference_range', what_this_may_mean: 'This value is above the typical normal range (70-100 mg/dL). Values in this range may sometimes be associated with pre-diabetes or diabetes, but a single test is not diagnostic.' },
      { name: 'HbA1c', value: '6.2', unit: '%', status: 'outside_reference_range', what_this_may_mean: 'This reflects average blood sugar over approximately 3 months. According to some guidelines, this range may be associated with pre-diabetes, but confirmation requires medical evaluation.' },
    ],
    warning_signs: [
      '⚠️ Values significantly above reference ranges',
      '⚠️ Increased thirst or urination',
      '⚠️ Unexplained weight changes',
      '⚠️ Blurred vision or fatigue',
    ],
    recommended_action: 'See your doctor promptly for a comprehensive evaluation. They can determine if additional testing is needed.',
    next_steps: [
      '👨‍⚕️ See your doctor promptly for evaluation',
      '🍎 Discuss dietary considerations with your doctor',
      '🏃‍♂️ Ask about appropriate physical activity',
      '📊 Your doctor may recommend additional testing',
      '📝 Keep a log of your symptoms',
    ],
    important_note: 'Blood sugar levels can fluctuate due to many factors. These results should be evaluated by a healthcare professional who can consider your complete medical picture.',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
  },
  vitamin_d: {
    severity: 2,
    urgency: 'doctor_soon',
    summary: 'This value is below the typical reference range. Low Vitamin D is very common and usually easily addressed.',
    results: [
      { name: 'Vitamin D (25-OH)', value: '18', unit: 'ng/mL', status: 'outside_reference_range', what_this_may_mean: 'This value is below the typical reference range (30-100 ng/mL). Low Vitamin D is very common and may be associated with various health factors.' },
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
      'ℹ️ This is very common and usually easily managed',
    ],
    important_note: 'Vitamin D needs vary by individual. Your doctor can recommend the appropriate approach based on your specific situation.',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
  },
  thyroid: {
    severity: 3,
    urgency: 'doctor_soon',
    summary: 'These results may suggest thyroid function that is outside typical ranges. Thyroid conditions are common and usually manageable.',
    results: [
      { name: 'TSH', value: '6.5', unit: 'mIU/L', status: 'outside_reference_range', what_this_may_mean: 'This value is above the typical reference range (0.4-4.0 mIU/L). Elevated TSH may sometimes be associated with an underactive thyroid.' },
      { name: 'Free T4', value: '0.7', unit: 'ng/dL', status: 'outside_reference_range', what_this_may_mean: 'This is slightly below the typical range (0.8-1.8 ng/dL), which may sometimes support the possibility of hypothyroidism.' },
    ],
    warning_signs: [
      '⚠️ Unexplained weight changes',
      '⚠️ Fatigue or sensitivity to cold',
      '⚠️ Dry skin or hair changes',
      '⚠️ Mood changes or depression',
    ],
    recommended_action: 'See your doctor to discuss these results. Thyroid conditions are common and usually treatable.',
    next_steps: [
      '👨‍⚕️ See your doctor to discuss these results',
      '💊 If hypothyroidism is confirmed, treatment is typically straightforward',
      '⏰ Medication (if prescribed) is usually taken on an empty stomach',
      '🔄 Thyroid levels are typically rechecked 6-8 weeks after starting treatment',
      'ℹ️ Many people manage thyroid conditions successfully',
    ],
    important_note: 'Thyroid function is complex and can be influenced by many factors. These results should be evaluated by a healthcare professional.',
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
  },
};

const DEFAULT_LAB_ANALYSIS: LabAnalysis = {
  severity: 3,
  urgency: 'doctor_soon',
  summary: 'Based on the information provided, these results appear generally within typical ranges. However, for a complete interpretation, specific values from your full report would be needed.',
  results: [
    { name: 'Test Result', value: '—', unit: '', status: 'within_reference_range', what_this_may_mean: 'Based on the information provided, this appears to be within acceptable ranges. However, complete interpretation requires the full lab report.' },
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
    '📅 Continue with regular health check-ups',
  ],
  important_note: 'Lab results should always be interpreted by a healthcare professional who knows your medical history and can consider all relevant factors.',
  disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Only a qualified healthcare professional can interpret your lab results.',
};

// ============================================================================
// ANALYSIS FUNCTION - Returns validated output
// ============================================================================

function analyzeLabReport(input: string): LabAnalysis {
  const lower = input.toLowerCase();
  
  let rawResult: LabAnalysis;
  
  if (lower.includes('hemoglobin') || lower.includes('cbc') || lower.includes('blood count') || lower.includes('rbc')) {
    rawResult = labDatabase.hemoglobin;
  } else if (lower.includes('cholesterol') || lower.includes('lipid') || lower.includes('ldl') || lower.includes('hdl')) {
    rawResult = labDatabase.cholesterol;
  } else if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('diabetes') || lower.includes('hba1c')) {
    rawResult = labDatabase.blood_sugar;
  } else if (lower.includes('vitamin d') || lower.includes('vit d')) {
    rawResult = labDatabase.vitamin_d;
  } else if (lower.includes('thyroid') || lower.includes('tsh') || lower.includes('t4')) {
    rawResult = labDatabase.thyroid;
  } else {
    rawResult = DEFAULT_LAB_ANALYSIS;
  }
  
  // CRITICAL: Validate the output through Zod before returning
  return validateLabAnalysis(rawResult);
}

// ============================================================================
// COMPONENT
// ============================================================================

export function LabReport() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<LabAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    // Sanitize input before processing
    const sanitizedInput = sanitizeInput(input);
    
    setTimeout(() => {
      const result = analyzeLabReport(sanitizedInput);
      // The analysis is already validated by analyzeLabReport
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1800);
  };

  const getStatusStyle = (status: LabResultStatus) => {
    switch (status) {
      case 'within_reference_range': 
        return { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle, label: t('normal') };
      case 'outside_reference_range': 
        return { bg: 'bg-warning/10', text: 'text-warning', icon: AlertTriangle, label: t('abnormal') };
      case 'significantly_outside_range': 
        return { bg: 'bg-critical/10', text: 'text-critical', icon: XCircle, label: t('critical') };
      default: 
        return { bg: 'bg-border', text: 'text-text-secondary', icon: CheckCircle, label: '' };
    }
  };

  const quickTests = [
    'Hemoglobin / CBC',
    'Cholesterol Panel',
    'Blood Sugar / HbA1c',
    'Vitamin D',
    'Thyroid (TSH)',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => { setAnalysis(null); setInput(''); }}
          className="p-2 rounded-xl hover:bg-primary-50 text-text-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('labTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('labSubtitle')}</p>
        </div>
      </div>

      {/* Input Section */}
      {!analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Upload Area */}
          <div className="bg-surface border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary-light transition-colors cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <p className="font-medium text-text-primary mb-1">{t('uploadReport')}</p>
            <p className="text-sm text-text-secondary">{t('orDescribe')}</p>
          </div>

          {/* Text Input */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('labPlaceholder')}
              className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light transition-all"
            />
            
            <div className="flex flex-wrap gap-2 mt-4">
              {quickTests.map((test, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(test)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  {test}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('analyzing')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('analyzeBtn')}
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Results - Only rendered if validation passed */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Urgency Banner */}
            <div className={`border rounded-2xl p-5 ${urgencyToColorClass(analysis.urgency)}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                  {analysis.urgency === 'emergency' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : analysis.urgency === 'urgent' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {urgencyToLabel(analysis.urgency)}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {analysis.recommended_action}
                  </p>
                </div>
              </div>
            </div>

            {/* Severity */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('severityLevel')}</h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${severityToColorClass(analysis.severity)}`}>
                <span className="text-lg">{severityToEmoji(analysis.severity)}</span>
                <span className="font-semibold text-sm">
                  {severityToLabel(analysis.severity)} ({analysis.severity}/5)
                </span>
              </div>
            </div>

            {/* Important Note Banner */}
            <div className="bg-info/5 border border-info/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-info mb-1">Important Note</h3>
                  <p className="text-sm text-text-primary leading-relaxed">{analysis.important_note}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('whatThisMaySuggestLab')}</h3>
              <p className="text-sm text-text-primary leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Individual Results */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-4">{t('results')}</h3>
              <div className="space-y-3">
                {analysis.results.map((result, idx) => {
                  const status = getStatusStyle(result.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        result.status === 'within_reference_range' ? 'border-success/20 bg-success/5' :
                        result.status === 'outside_reference_range' ? 'border-warning/20 bg-warning/5' :
                        'border-critical/20 bg-critical/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{result.name}</p>
                          <p className="text-lg font-bold text-text-primary">
                            {result.value} <span className="text-xs font-normal text-text-secondary">{result.unit}</span>
                          </p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${status.text}`} />
                          <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mt-2">
                        <span className="font-medium">What this may mean: </span>
                        {result.what_this_may_mean}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-warning mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('warningSigns')}
              </h3>
              <div className="space-y-2">
                {analysis.warning_signs.map((sign, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-sm text-text-primary leading-relaxed">{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-info/5 border border-info/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-info mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('nextSteps')}
              </h3>
              <div className="space-y-2">
                {analysis.next_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-sm text-text-primary">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-background border border-border rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">{analysis.disclaimer}</p>
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={() => { setAnalysis(null); setInput(''); }}
              className="w-full py-3 rounded-xl border border-border text-text-secondary font-medium hover:bg-background transition-all"
            >
              {t('back')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
