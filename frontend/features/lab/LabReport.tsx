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

interface LabResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  whatThisMayMean: string;
}

interface LabAnalysis {
  results: LabResult[];
  summary: string;
  whatThisMaySuggest: string;
  nextSteps: string[];
  importantNote: string;
}

const labDatabase: Record<string, LabAnalysis> = {
  hemoglobin: {
    results: [
      { name: 'Hemoglobin', value: '12.5', unit: 'g/dL', status: 'normal', whatThisMayMean: 'This value falls within the typical reference range. Hemoglobin helps carry oxygen in your blood.' },
      { name: 'Red Blood Cell Count', value: '4.7', unit: 'million/µL', status: 'normal', whatThisMayMean: 'This appears to be within the typical range, suggesting normal red blood cell production.' },
    ],
    summary: 'These values appear to be within typical reference ranges. However, reference ranges can vary by lab, age, and sex.',
    whatThisMaySuggest: 'Based on these values, there may not be immediate concerns. However, only your doctor can interpret these results in the context of your overall health, medical history, and other factors.',
    nextSteps: [
      '📋 Discuss these results with your doctor at your next appointment',
      '💧 Continue maintaining a balanced diet',
      '🏃‍♂️ Stay active and hydrated',
      '📅 Follow your doctor\'s recommended schedule for future tests',
    ],
    importantNote: 'Lab results should always be interpreted by a healthcare professional who knows your medical history. Reference ranges vary between laboratories.',
  },
  cholesterol: {
    results: [
      { name: 'Total Cholesterol', value: '240', unit: 'mg/dL', status: 'abnormal', whatThisMayMean: 'This value is above the typical recommended level (below 200 mg/dL). Elevated cholesterol may be associated with increased cardiovascular risk over time.' },
      { name: 'LDL (Bad Cholesterol)', value: '155', unit: 'mg/dL', status: 'abnormal', whatThisMayMean: 'This is above the typical optimal level (below 100 mg/dL). Higher LDL levels may be associated with plaque buildup in arteries.' },
      { name: 'HDL (Good Cholesterol)', value: '45', unit: 'mg/dL', status: 'normal', whatThisMayMean: 'This appears to be within the acceptable range (above 40 mg/dL). HDL may help remove other forms of cholesterol.' },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', status: 'abnormal', whatThisMayMean: 'This is above the typical range (below 150 mg/dL). Elevated triglycerides may be associated with dietary factors and other health conditions.' },
    ],
    summary: 'Some of these values are outside typical reference ranges. This may suggest areas that could benefit from attention, but only a healthcare professional can assess your individual risk.',
    whatThisMaySuggest: 'These results may indicate elevated cholesterol levels, which some studies have associated with long-term cardiovascular risk. However, cholesterol levels are just one factor among many that affect heart health.',
    nextSteps: [
      '👨‍⚕️ Schedule a follow-up with your doctor to discuss these results',
      '🥗 Consider discussing dietary modifications with your doctor or a nutritionist',
      '🚶‍♂️ Ask your doctor about appropriate physical activity for you',
      '🔄 Your doctor may recommend retesting in 3-6 months',
      '💊 Do NOT start any medication without consulting your doctor',
    ],
    importantNote: 'Cholesterol levels are just one piece of your overall health picture. Many factors affect cardiovascular health, and treatment decisions should be made with your doctor.',
  },
  blood_sugar: {
    results: [
      { name: 'Fasting Blood Sugar', value: '135', unit: 'mg/dL', status: 'abnormal', whatThisMayMean: 'This value is above the typical normal range (70-100 mg/dL). Values in this range may sometimes be associated with pre-diabetes or diabetes, but a single test is not diagnostic.' },
      { name: 'HbA1c', value: '6.2', unit: '%', status: 'abnormal', whatThisMayMean: 'This reflects average blood sugar over approximately 3 months. According to some guidelines, this range may be associated with pre-diabetes (5.7-6.4%) or diabetes (6.5%+), but confirmation requires medical evaluation.' },
    ],
    summary: 'These values are above typical reference ranges and may warrant further evaluation. However, blood sugar levels can be affected by many factors including recent meals, stress, and illness.',
    whatThisMaySuggest: 'These results may suggest elevated blood sugar levels. While this can sometimes be associated with pre-diabetes or diabetes, only proper medical evaluation can determine if this is the case for you.',
    nextSteps: [
      '👨‍⚕️ See your doctor promptly for a comprehensive evaluation',
      '🍎 Discuss dietary considerations with your doctor',
      '🏃‍♂️ Ask about appropriate physical activity',
      '📊 Your doctor may recommend additional testing for confirmation',
      '📝 Keep a log of your symptoms and any related factors',
    ],
    importantNote: 'Blood sugar levels can fluctuate due to many factors. These results should be evaluated by a healthcare professional who can consider your complete medical picture.',
  },
  vitamin_d: {
    results: [
      { name: 'Vitamin D (25-OH)', value: '18', unit: 'ng/mL', status: 'abnormal', whatThisMayMean: 'This value is below the typical reference range (30-100 ng/mL). Low Vitamin D is very common and may be associated with various health factors.' },
    ],
    summary: 'This value is below the typical reference range. Low Vitamin D is very common and usually easily addressed.',
    whatThisMaySuggest: 'This result may suggest low Vitamin D levels, which is a common finding. Vitamin D is important for bone health and other bodily functions.',
    nextSteps: [
      '👨‍⚕️ Discuss supplementation with your doctor (typical doses range from 1000-4000 IU/day)',
      '☀️ Ask your doctor about safe sun exposure',
      '🐟 Consider Vitamin D-rich foods (fatty fish, fortified milk)',
      '🔄 Your doctor may recommend rechecking levels in 3 months',
      'ℹ️ This is very common and usually easily managed',
    ],
    importantNote: 'Vitamin D needs vary by individual. Your doctor can recommend the appropriate approach based on your specific situation.',
  },
  thyroid: {
    results: [
      { name: 'TSH', value: '6.5', unit: 'mIU/L', status: 'abnormal', whatThisMayMean: 'This value is above the typical reference range (0.4-4.0 mIU/L). Elevated TSH may sometimes be associated with an underactive thyroid (hypothyroidism).' },
      { name: 'Free T4', value: '0.7', unit: 'ng/dL', status: 'abnormal', whatThisMayMean: 'This is slightly below the typical range (0.8-1.8 ng/dL), which may sometimes support the possibility of hypothyroidism.' },
    ],
    summary: 'These results may suggest thyroid function that is outside typical ranges. Thyroid conditions are common and usually manageable.',
    whatThisMaySuggest: 'These results may be consistent with an underactive thyroid (hypothyroidism), which is a common and usually treatable condition. However, thyroid function can be affected by many factors and requires proper medical evaluation.',
    nextSteps: [
      '👨‍⚕️ See your doctor to discuss these results',
      '💊 If hypothyroidism is confirmed, treatment is typically straightforward',
      '⏰ Medication (if prescribed) is usually taken on an empty stomach',
      '🔄 Thyroid levels are typically rechecked 6-8 weeks after starting treatment',
      'ℹ️ Many people manage thyroid conditions successfully with proper medical care',
    ],
    importantNote: 'Throid function is complex and can be influenced by many factors. These results should be evaluated by a healthcare professional.',
  },
  default: {
    results: [
      { name: 'Test Result', value: '—', unit: '', status: 'normal', whatThisMayMean: 'Based on the information provided, this appears to be within acceptable ranges. However, complete interpretation requires the full lab report.' },
    ],
    summary: 'Based on the information provided, these results appear generally within typical ranges. However, for a complete interpretation, specific values from your full report would be needed.',
    whatThisMaySuggest: 'Without complete information, it\'s difficult to provide specific insights. Lab results should always be interpreted in the context of your overall health by a qualified healthcare professional.',
    nextSteps: [
      '📋 Share specific values from your full report for more detailed insights',
      '👨‍⚕️ Discuss these results with your doctor at your next visit',
      '📁 Keep a copy of your results for your records',
      '📅 Continue with regular health check-ups as recommended',
    ],
    importantNote: 'Lab results should always be interpreted by a healthcare professional who knows your medical history and can consider all relevant factors.',
  }
};

function analyzeLabReport(input: string): LabAnalysis {
  const lower = input.toLowerCase();
  
  if (lower.includes('hemoglobin') || lower.includes('cbc') || lower.includes('blood count') || lower.includes('rbc')) {
    return labDatabase.hemoglobin;
  }
  if (lower.includes('cholesterol') || lower.includes('lipid') || lower.includes('ldl') || lower.includes('hdl')) {
    return labDatabase.cholesterol;
  }
  if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('diabetes') || lower.includes('hba1c')) {
    return labDatabase.blood_sugar;
  }
  if (lower.includes('vitamin d') || lower.includes('vit d')) {
    return labDatabase.vitamin_d;
  }
  if (lower.includes('thyroid') || lower.includes('tsh') || lower.includes('t4')) {
    return labDatabase.thyroid;
  }
  
  return labDatabase.default;
}

export function LabReport() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<LabAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = analyzeLabReport(input);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1800);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'normal': return { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle, label: t('normal') };
      case 'abnormal': return { bg: 'bg-warning/10', text: 'text-warning', icon: AlertTriangle, label: t('abnormal') };
      case 'critical': return { bg: 'bg-critical/10', text: 'text-critical', icon: XCircle, label: t('critical') };
      default: return { bg: 'bg-border', text: 'text-text-secondary', icon: CheckCircle, label: '' };
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
            
            {/* Quick test buttons */}
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

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Important Note Banner */}
            <div className="bg-info/5 border border-info/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-info mb-1">Important Note</h3>
                  <p className="text-sm text-text-primary leading-relaxed">{analysis.importantNote}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('whatThisMaySuggestLab')}</h3>
              <p className="text-sm text-text-primary leading-relaxed">{analysis.whatThisMaySuggest}</p>
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
                        result.status === 'normal' ? 'border-success/20 bg-success/5' :
                        result.status === 'abnormal' ? 'border-warning/20 bg-warning/5' :
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
                        {result.whatThisMayMean}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-info/5 border border-info/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-info mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('nextSteps')}
              </h3>
              <div className="space-y-2">
                {analysis.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-sm text-text-primary">{step}</span>
                  </div>
                ))}
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

      {/* Disclaimer */}
      <div className="bg-background border border-border rounded-xl p-4">
        <p className="text-xs text-text-secondary text-center">{t('disclaimer')}</p>
      </div>
    </div>
  );
}
