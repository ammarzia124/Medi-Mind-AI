import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LabResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  explanation: string;
}

interface LabAnalysis {
  results: LabResult[];
  summary: string;
  nextSteps: string[];
}

const labDatabase: Record<string, LabAnalysis> = {
  hemoglobin: {
    results: [
      { name: 'Hemoglobin', value: '12.5', unit: 'g/dL', status: 'normal', explanation: 'Your hemoglobin level is within the normal range. This protein in red blood cells carries oxygen throughout your body.' },
      { name: 'Red Blood Cell Count', value: '4.7', unit: 'million/µL', status: 'normal', explanation: 'Your RBC count is normal, indicating healthy production of red blood cells.' },
    ],
    summary: 'Your blood count results look healthy. Hemoglobin and red blood cell counts are within normal ranges, meaning your body is getting adequate oxygen.',
    nextSteps: ['Continue maintaining a balanced diet rich in iron', 'Stay hydrated', 'Next routine blood test in 6-12 months', 'No immediate action needed'],
  },
  cholesterol: {
    results: [
      { name: 'Total Cholesterol', value: '240', unit: 'mg/dL', status: 'abnormal', explanation: 'Your total cholesterol is slightly above the recommended level (below 200 mg/dL). This may increase cardiovascular risk over time.' },
      { name: 'LDL (Bad Cholesterol)', value: '155', unit: 'mg/dL', status: 'abnormal', explanation: 'LDL cholesterol is above optimal (below 100 mg/dL). High LDL can build up in arteries.' },
      { name: 'HDL (Good Cholesterol)', value: '45', unit: 'mg/dL', status: 'normal', explanation: 'HDL cholesterol is within acceptable range (above 40 mg/dL). This helps remove bad cholesterol.' },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', status: 'abnormal', explanation: 'Triglycerides are slightly elevated (normal below 150 mg/dL). This is often related to diet.' },
    ],
    summary: 'Your cholesterol levels show some areas that need attention. Total cholesterol and LDL are above optimal ranges, which may increase long-term heart health risks.',
    nextSteps: ['Schedule a follow-up with your doctor', 'Consider dietary changes (reduce saturated fats)', 'Increase physical activity (30 min/day walking)', 'Consider retesting in 3 months', 'Discuss with doctor if medication is appropriate'],
  },
  blood_sugar: {
    results: [
      { name: 'Fasting Blood Sugar', value: '135', unit: 'mg/dL', status: 'abnormal', explanation: 'Your fasting blood sugar is above normal (70-100 mg/dL). This range (100-125) suggests pre-diabetes, and above 126 may indicate diabetes.' },
      { name: 'HbA1c', value: '6.2', unit: '%', status: 'abnormal', explanation: 'Your HbA1c indicates average blood sugar over 3 months. Normal is below 5.7%, pre-diabetes is 5.7-6.4%, diabetes is 6.5%+.' },
    ],
    summary: 'Your blood sugar results indicate pre-diabetes or early diabetes. This means your body is having difficulty managing sugar levels. This is manageable with lifestyle changes.',
    nextSteps: ['See your doctor for a comprehensive diabetes evaluation', 'Reduce sugar and refined carbohydrate intake', 'Exercise regularly (at least 150 min/week)', 'Monitor blood sugar at home if advised', 'Consider consulting a nutritionist'],
  },
  vitamin_d: {
    results: [
      { name: 'Vitamin D (25-OH)', value: '18', unit: 'ng/mL', status: 'abnormal', explanation: 'Your Vitamin D level is low. Normal is 30-100 ng/mL. Vitamin D is essential for bone health, immune function, and mood.' },
    ],
    summary: 'Your Vitamin D level is below optimal. This is very common and usually easily corrected with supplementation and sun exposure.',
    nextSteps: ['Discuss Vitamin D supplementation with your doctor (typically 1000-4000 IU/day)', 'Get 15-20 minutes of sunlight daily', 'Include Vitamin D-rich foods (fatty fish, fortified milk)', 'Recheck levels in 3 months', 'No emergency — this is very common and treatable'],
  },
  thyroid: {
    results: [
      { name: 'TSH', value: '6.5', unit: 'mIU/L', status: 'abnormal', explanation: 'Your TSH is above normal (0.4-4.0 mIU/L). Elevated TSH suggests your thyroid may be underactive (hypothyroidism).' },
      { name: 'Free T4', value: '0.7', unit: 'ng/dL', status: 'abnormal', explanation: 'Free T4 is slightly below normal (0.8-1.8 ng/dL), confirming possible hypothyroidism.' },
    ],
    summary: 'Your thyroid results suggest an underactive thyroid (hypothyroidism). This is a common condition that is easily treated with daily medication.',
    nextSteps: ['See your doctor for thyroid medication discussion', 'Medication (levothyroxine) is typically prescribed', 'Take medication on an empty stomach', 'Recheck thyroid levels in 6-8 weeks after starting treatment', 'This is very manageable — many people live well with thyroid medication'],
  },
  default: {
    results: [
      { name: 'Test Result', value: '—', unit: '', status: 'normal', explanation: 'Based on the information provided, your results appear to be within acceptable ranges.' },
    ],
    summary: 'Your lab results appear generally within normal ranges. However, for a complete interpretation, please share the specific values from your report.',
    nextSteps: ['Share specific values for a detailed analysis', 'Discuss results with your doctor at your next visit', 'Keep a copy of your results for reference', 'Continue regular health check-ups'],
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
            {/* Summary */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('whatItMeans')}</h3>
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
                      <p className="text-xs text-text-secondary leading-relaxed mt-2">{result.explanation}</p>
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
                    <span className="w-5 h-5 rounded-full bg-info/20 text-info flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
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
