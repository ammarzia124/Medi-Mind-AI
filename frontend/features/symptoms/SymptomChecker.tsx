import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Send,
  Thermometer,
  Brain,
  Droplets,
  Wind,
  Eye,
  Zap,
  Info,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type SymptomAnalysis,
  severityToLabel,
  severityToEmoji,
  severityToColorClass,
  urgencyToLabel,
  urgencyToColorClass,
  isEmergencyUrgency,
} from '../../lib/schemas';
import { symptomService } from '../../services/symptomService';

type Step = 'input' | 'loading' | 'results';

const DURATION_OPTIONS = [
  { value: 'today', labelEn: 'Today', labelUr: 'آج' },
  { value: '2-3 days', labelEn: '2-3 days', labelUr: '2-3 دن' },
  { value: '1 week', labelEn: '1 week', labelUr: '1 ہفتہ' },
  { value: 'more than 1 week', labelEn: 'More than 1 week', labelUr: '1 ہفتے سے زیادہ' },
];

const SEVERITY_EMOJIS = ['😊', '🙂', '😐', '😟', '😰', '😣', '😖', '🤒', '🤕', '🤢'];

export function SymptomChecker() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(3);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const quickSymptoms = [
    { icon: Brain, label: language === 'en' ? 'Headache' : 'سر درد', keyword: 'headache' },
    { icon: Thermometer, label: language === 'en' ? 'Fever' : 'بخار', keyword: 'fever' },
    { icon: Wind, label: language === 'en' ? 'Cough' : 'کھانسی', keyword: 'cough' },
    { icon: Droplets, label: language === 'en' ? 'Fatigue' : 'تھکاوٹ', keyword: 'fatigue' },
    { icon: Eye, label: language === 'en' ? 'Nausea' : 'متلی', keyword: 'nausea' },
    { icon: Zap, label: language === 'en' ? 'Chest Pain' : 'سینے میں درد', keyword: 'chest' },
  ];

  const loadingSteps = [
    language === 'en' ? 'Reading your symptoms...' : 'آپ کی علامات پڑھ رہا ہے...',
    language === 'en' ? 'Analyzing urgency level...' : 'فوریت کی سطح کا تجزیہ کر رہا ہے...',
    language === 'en' ? 'Preparing guidance...' : 'رہنمائی تیار کر رہا ہے...',
  ];

  useEffect(() => {
    if (step !== 'loading') return;

    const timers: NodeJS.Timeout[] = [];
    loadingSteps.forEach((_, i) => {
      timers.push(
        setTimeout(() => setLoadingStep(i), i * 800)
      );
    });

    timers.push(
      setTimeout(async () => {
        const fullInput = [
          input,
          duration ? `Duration: ${duration}` : '',
          `Severity: ${severity}/10`,
        ].filter(Boolean).join('. ');

        try {
          const analysis = await symptomService.analyzeSymptoms(fullInput, language);
          setResult(analysis);
          setStep('results');
        } catch {
          setStep('input');
        }
      }, loadingSteps.length * 800 + 200)
    );

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setLoadingStep(0);
    setStep('loading');
  };

  const handleChipClick = (keyword: string) => {
    setInput((prev) => {
      if (prev.toLowerCase().includes(keyword)) return prev;
      return prev ? `${prev}, ${keyword}` : keyword;
    });
  };

  const handleReset = () => {
    setStep('input');
    setInput('');
    setDuration('');
    setSeverity(3);
    setResult(null);
    setLoadingStep(0);
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
              {language === 'en' ? '🩺 Symptom Checker' : '🩺 علامات چیکر'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'AI-powered health guidance' : 'AI سے محرک صحت رہنمائی'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Input */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Heading */}
              <div>
                <h2 className="text-2xl font-bold text-[#134E4A] mb-1">
                  {language === 'en' ? 'How are you feeling?' : 'آپ کیسے محسوس کر رہے ہیں؟'}
                </h2>
                <p className="text-sm text-gray-500">
                  {language === 'en'
                    ? 'Describe your symptoms in your own words. Be as specific as you can.'
                    : 'اپنی علامات الفاظ میں بیان کریں۔ جتنا ممکن ہو مخصوص بتائیں۔'}
                </p>
              </div>

              {/* Textarea */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'e.g. I have had a fever since yesterday and feel very weak and tired...'
                      : 'مثلاً میرو کل سے بخار ہے اور مجھے بہت کمزوری محسوس ہو رہی ہے...'
                  }
                  className="w-full min-h-[120px] p-4 rounded-xl border-2 border-gray-200 bg-[#F8FFFE] text-[#134E4A] placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all text-base"
                  dir={language === 'ur' ? 'rtl' : 'ltr'}
                />

                {/* Quick symptom chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickSymptoms.map((symptom) => (
                    <button
                      key={symptom.keyword}
                      onClick={() => handleChipClick(symptom.keyword)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F0FDFA] text-[#0D9488] text-sm font-medium hover:bg-[#CCFBF1] transition-colors border border-[#CCFBF1]"
                    >
                      <symptom.icon className="w-4 h-4" />
                      {symptom.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#134E4A] mb-3">
                  <Clock className="w-4 h-4 text-[#0D9488]" />
                  {language === 'en' ? 'How long have you had these symptoms?' : 'آپ کو یہ علامات کب سے ہیں؟'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDuration(opt.value)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                        duration === opt.value
                          ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {language === 'en' ? opt.labelEn : opt.labelUr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Slider */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-[#134E4A]">
                    {language === 'en' ? 'Pain level' : 'درد کی سطح'}
                  </span>
                  <span className="text-2xl">{SEVERITY_EMOJIS[severity - 1]}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#0D9488]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{language === 'en' ? 'Mild' : 'ہلکا'}</span>
                  <span className="font-medium text-[#0D9488]">{severity}/10</span>
                  <span>{language === 'en' ? 'Severe' : 'شدید'}</span>
                </div>
              </div>

              {/* Language toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => {}}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    language === 'en' ? 'bg-white text-[#0D9488] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {}}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    language === 'ur' ? 'bg-white text-[#0D9488] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  اردو
                </button>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!input.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#0D9488] text-white py-4 rounded-xl text-lg font-semibold hover:bg-[#0F766E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0D9488]/20"
              >
                <Send className="w-5 h-5" />
                {language === 'en' ? 'Analyze Symptoms' : 'علامات کا تجزیہ کریں'}
              </button>
            </motion.div>
          )}

          {/* STEP 2: Loading */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-[#CCFBF1] rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-[#0D9488] animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-[#134E4A]">
                  {language === 'en' ? 'Analyzing your symptoms...' : 'آپ کی علامات کا تجزیہ ہو رہا ہے...'}
                </h3>
              </div>

              <div className="space-y-4">
                {loadingSteps.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={loadingStep >= i ? { opacity: 1, x: 0 } : { opacity: 0.3, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      loadingStep >= i
                        ? 'bg-[#22C55E] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {loadingStep >= i ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-all ${
                      loadingStep >= i ? 'text-[#134E4A]' : 'text-gray-400'
                    }`}>
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Results */}
          {step === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
              role="region"
              aria-label="Symptom analysis results"
            >
              {/* Emergency Banner */}
              {isEmergencyUrgency(result.urgency) && (
                <div className="bg-[#EF4444] border-2 border-[#EF4444] rounded-2xl p-6 animate-pulse" role="alert">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-2">
                        {language === 'en' ? 'POSSIBLE MEDICAL EMERGENCY' : 'ممکنہ طبی ہنگامی صورتحال'}
                      </h3>
                      <p className="text-white font-semibold leading-relaxed mb-3">
                        {result.summary}
                      </p>
                      <div className="p-3 bg-white/90 rounded-xl">
                        <p className="text-sm font-bold text-[#134E4A]">
                          {language === 'en'
                            ? '📞 Call emergency services NOW or go to the nearest emergency room.'
                            : '📞 ابھی ایمرجنسی سروسز کو کال کریں یا قریب ترین ایمرجنسی روم جائیں۔'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          {language === 'en'
                            ? 'Emergency numbers: 911 (US) • 112 (Europe) • 999 (UK) • 115 (Pakistan) • 108 (India)'
                            : 'ایمرجنسی نمبرز: 911 • 112 • 999 • 115 • 108'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Urgency Banner */}
              <div className={`border rounded-2xl p-5 ${urgencyToColorClass(result.urgency)}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                    {isEmergencyUrgency(result.urgency) || result.urgency === 'urgent' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : result.urgency === 'doctor_soon' ? (
                      <Heart className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{urgencyToLabel(result.urgency)}</p>
                    <p className="text-xs opacity-80 mt-0.5">{result.recommended_action}</p>
                  </div>
                </div>
              </div>

              {/* Severity */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {language === 'en' ? 'Severity Level' : 'شدت کی سطح'}
                </h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${severityToColorClass(result.severity)}`}>
                  <span className="text-lg">{severityToEmoji(result.severity)}</span>
                  <span className="font-semibold text-sm">
                    {severityToLabel(result.severity)} ({result.severity}/5)
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {language === 'en' ? 'What this may suggest' : 'یہ کیا ظاہر کر سکتا ہے'}
                </h3>
                <p className="text-sm text-[#134E4A] leading-relaxed">{result.summary}</p>
              </div>

              {/* Possible Explanations */}
              <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {language === 'en' ? 'Possible Explanations' : 'ممکنہ وضاحتیں'}
                </h3>
                <div className="space-y-2">
                  {result.possible_explanations.map((explanation, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F8FFFE] transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#0D9488] mt-2 flex-shrink-0" />
                      <span className="text-sm text-[#134E4A]">{explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Signs */}
              <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-[#F59E0B] mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {language === 'en' ? 'Warning Signs' : 'Warning Signs'}
                </h3>
                <div className="space-y-2">
                  {result.warning_signs.map((sign, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2">
                      <span className="text-sm text-[#134E4A] leading-relaxed">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self Care */}
              {result.self_care.length > 0 && (
                <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-[#22C55E] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'en' ? 'Self Care Options' : 'Self Care Options'}
                  </h3>
                  <div className="space-y-2">
                    {result.self_care.map((option, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2">
                        <span className="text-sm text-[#134E4A]">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-[#F8FFFE] border border-[#CCFBF1] rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">{result.disclaimer}</p>
                </div>
              </div>

              {/* Try Again */}
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl border-2 border-[#CCFBF1] text-gray-600 font-medium hover:bg-[#F8FFFE] transition-all"
              >
                {language === 'en' ? 'Check Another Symptom' : 'دوسرا علامت چیک کریں'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
