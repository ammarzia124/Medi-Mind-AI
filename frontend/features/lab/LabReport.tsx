import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  FlaskConical,
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type LabAnalysis,
  severityToLabel,
  severityToEmoji,
  urgencyToLabel,
} from '../../lib/schemas';

const MOCK_REPORTS: Record<string, LabAnalysis> = {
  cbc: {
    severity: 2,
    urgency: 'self_care',
    overall_status: 'normal',
    results: [
      {
        test_name: 'Hemoglobin',
        result_value: '13.2',
        result_unit: 'g/dL',
        reference_range: '12.0-16.0',
        status: 'normal',
        what_is_this: 'Hemoglobin is a protein in red blood cells that carries oxygen throughout your body.',
        what_it_means: 'Your hemoglobin level is within the normal range, suggesting your blood is carrying oxygen properly.',
        what_to_do: 'Continue maintaining a healthy lifestyle. No specific action needed for this result.',
      },
      {
        test_name: 'WBC Count',
        result_value: '11.5',
        result_unit: 'K/µL',
        reference_range: '4.5-11.0',
        status: 'high',
        what_is_this: 'White blood cells (WBC) help your body fight infections.',
        what_it_means: 'Your WBC is slightly elevated, which may indicate your body is fighting an infection or inflammation.',
        what_to_do: 'Monitor for symptoms like fever, fatigue, or signs of infection. If concerned, consult your doctor.',
      },
      {
        test_name: 'Platelets',
        result_value: '245',
        result_unit: 'K/µL',
        reference_range: '150-400',
        status: 'normal',
        what_is_this: 'Platelets help your blood clot and prevent bleeding.',
        what_it_means: 'Your platelet count is within normal range, indicating normal clotting ability.',
        what_to_do: 'No action needed. Continue your normal activities.',
      },
    ],
    summary: {
      in_simple_words: [
        'Your blood test results are generally normal.',
        'Your white blood cell count is slightly elevated, which may indicate a mild infection.',
        'No immediate action is needed, but monitor for any symptoms.',
      ],
    },
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Always consult a healthcare professional for proper interpretation of lab results.',
    confidence_score: 0.85,
    language: 'en',
  },
  cholesterol: {
    severity: 3,
    urgency: 'doctor_soon',
    overall_status: 'some_abnormal',
    results: [
      {
        test_name: 'Total Cholesterol',
        result_value: '240',
        result_unit: 'mg/dL',
        reference_range: '<200',
        status: 'high',
        what_is_this: 'Total cholesterol measures all the cholesterol in your blood.',
        what_it_means: 'Your total cholesterol is elevated, which may increase cardiovascular risk over time.',
        what_to_do: 'Schedule a follow-up with your doctor to discuss dietary changes and possible medication.',
      },
      {
        test_name: 'LDL Cholesterol',
        result_value: '155',
        result_unit: 'mg/dL',
        reference_range: '<100',
        status: 'high',
        what_is_this: 'LDL is often called "bad" cholesterol because high levels can lead to plaque buildup in arteries.',
        what_it_means: 'Your LDL is significantly elevated, which is a concern for heart health.',
        what_to_do: 'Consult your doctor about lifestyle changes and whether medication is appropriate.',
      },
      {
        test_name: 'HDL Cholesterol',
        result_value: '45',
        result_unit: 'mg/dL',
        reference_range: '>40',
        status: 'normal',
        what_is_this: 'HDL is often called "good" cholesterol because it helps remove other forms of cholesterol.',
        what_it_means: 'Your HDL is within acceptable range, providing some protective benefit.',
        what_to_do: 'Continue healthy habits. Regular exercise can help maintain or improve HDL levels.',
      },
    ],
    summary: {
      in_simple_words: [
        'Your cholesterol levels show some areas of concern.',
        'LDL (bad cholesterol) is elevated, which may affect heart health.',
        'A doctor visit is recommended to discuss these results.',
      ],
    },
    disclaimer: '⚕️ This information is for educational purposes only and is NOT a medical diagnosis. Always consult a healthcare professional for proper interpretation of lab results.',
    confidence_score: 0.9,
    language: 'en',
  },
};

const REPORT_OPTIONS = [
  { key: 'cbc', label: 'CBC Report', labelUr: 'CBC رپورٹ', emoji: '🩸' },
  { key: 'cholesterol', label: 'Cholesterol Panel', labelUr: 'کولیسٹرول پینل', emoji: '🫀' },
];

export default function LabReport() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const result = selectedReport ? MOCK_REPORTS[selectedReport] : null;

  const handleSelect = (key: string) => {
    setSelectedReport(key);
    setShowResults(false);
    setTimeout(() => setShowResults(true), 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FFFE]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#CCFBF1] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#134E4A]">
              {language === 'en' ? '🧪 Lab Reports' : '🧪 لیب رپورٹس'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Understand your lab results' : 'اپنے لیب کے نتائج سمجھیں'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Upload area */}
        <div className="bg-white border-2 border-dashed border-[#CCFBF1] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-[#0D9488]" />
          </div>
          <h3 className="text-lg font-semibold text-[#134E4A] mb-2">
            {language === 'en' ? 'Upload Lab Report' : 'لیب رپورٹ اپلوڈ کریں'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {language === 'en'
              ? 'Upload a photo or PDF of your lab report for AI analysis'
              : 'AI تجزیے کے لیے اپنی لیب رپورٹ کی تصویر یا PDF اپلوڈ کریں'}
          </p>
          <button className="px-6 py-3 rounded-xl bg-[#0D9488] text-white font-semibold hover:bg-[#0F766E] transition-all">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {language === 'en' ? 'Choose File' : 'فائل منتخب کریں'}
            </div>
          </button>
        </div>

        {/* Or select a demo */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">
            {language === 'en' ? '— or try a demo report —' : '— یا ڈیمو رپورٹ آزمائیں —'}
          </p>
          <div className="flex gap-3 justify-center">
            {REPORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-medium transition-all ${
                  selectedReport === opt.key
                    ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                {language === 'en' ? opt.label : opt.labelUr}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {showResults && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Urgency banner */}
              <div className={`rounded-2xl p-5 border ${
                result.urgency === 'emergency' ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' :
                result.urgency === 'urgent' ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]' :
                result.urgency === 'doctor_soon' ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]' :
                'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                    {result.urgency === 'emergency' || result.urgency === 'urgent' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{urgencyToLabel(result.urgency)}</p>
                  </div>
                </div>
              </div>

              {/* Severity */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {language === 'en' ? 'Severity' : 'شدت'}
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0FDFA]">
                  <span className="text-lg">{severityToEmoji(result.severity)}</span>
                  <span className="font-semibold text-sm text-[#134E4A]">
                    {severityToLabel(result.severity)} ({result.severity}/5)
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {language === 'en' ? 'Summary' : 'خلاصہ'}
                </h3>
                <div className="space-y-2">
                  {result.summary.in_simple_words.map((line, i) => (
                    <p key={i} className="text-sm text-[#134E4A] leading-relaxed">• {line}</p>
                  ))}
                </div>
              </div>

              {/* Individual results */}
              {result.results.map((item, idx) => (
                <div key={idx} className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-[#134E4A]">{item.test_name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'normal' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      item.status === 'high' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                      item.status === 'low' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#134E4A]">{item.result_value}</span>
                    <span className="text-sm text-gray-500">{item.result_unit}</span>
                    {item.reference_range && (
                      <span className="text-xs text-gray-400 ml-auto">Ref: {item.reference_range}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.what_it_means}</p>
                </div>
              ))}

              {/* Disclaimer */}
              <div className="bg-[#F8FFFE] border border-[#CCFBF1] rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">{result.disclaimer}</p>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setSelectedReport(null); setShowResults(false); }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 transition-all"
              >
                {language === 'en' ? 'View another report' : 'دیکھیں دیگر رپورٹ'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
