import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SymptomResult {
  causes: string[];
  severity: 'low' | 'moderate' | 'high';
  recommendation: string;
  whenToSeeDoctor: string;
  selfCare: string[];
  careNavigation: 'emergency' | 'urgent' | 'routine' | 'selfCare';
}

const symptomDatabase: Record<string, SymptomResult> = {
  headache: {
    causes: ['Tension or stress', 'Dehydration', 'Lack of sleep', 'Eye strain from screens', 'Sinus pressure'],
    severity: 'low',
    recommendation: 'Most headaches are caused by common factors like stress or dehydration. Try resting in a dark room and drinking water.',
    whenToSeeDoctor: 'See a doctor if the headache is severe, sudden, or accompanied by vision changes, fever, or neck stiffness.',
    selfCare: ['Drink plenty of water', 'Rest in a quiet, dark room', 'Apply a cold compress to your forehead', 'Take over-the-counter pain relief if needed', 'Reduce screen time'],
    careNavigation: 'selfCare',
  },
  fever: {
    causes: ['Viral infection (cold/flu)', 'Bacterial infection', 'Inflammatory condition', 'Reaction to medication', 'Heat exhaustion'],
    severity: 'moderate',
    recommendation: 'A fever is your body\'s way of fighting infection. Monitor your temperature and stay hydrated.',
    whenToSeeDoctor: 'See a doctor if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe headache, rash, or difficulty breathing.',
    selfCare: ['Rest and stay hydrated', 'Take lukewarm baths', 'Wear light clothing', 'Use fever-reducing medication as directed', 'Monitor temperature regularly'],
    careNavigation: 'routine',
  },
  cough: {
    causes: ['Common cold', 'Allergies', 'Dry air', 'Acid reflux', 'Asthma'],
    severity: 'low',
    recommendation: 'Most coughs are caused by viral infections and resolve on their own within 1-2 weeks.',
    whenToSeeDoctor: 'See a doctor if cough lasts more than 3 weeks, produces blood, or is accompanied by chest pain or difficulty breathing.',
    selfCare: ['Stay hydrated with warm fluids', 'Use honey (for adults) to soothe throat', 'Use a humidifier', 'Avoid irritants like smoke', 'Rest your voice'],
    careNavigation: 'selfCare',
  },
  fatigue: {
    causes: ['Poor sleep quality', 'Stress or anxiety', 'Iron deficiency (anemia)', 'Dehydration', 'Thyroid issues'],
    severity: 'moderate',
    recommendation: 'Persistent fatigue may indicate an underlying condition. Consider getting basic blood work done.',
    whenToSeeDoctor: 'See a doctor if fatigue persists for more than 2 weeks despite adequate rest, or is accompanied by weight changes or mood changes.',
    selfCare: ['Maintain a consistent sleep schedule', 'Exercise regularly (even light walks)', 'Eat balanced meals', 'Stay hydrated', 'Manage stress through relaxation techniques'],
    careNavigation: 'routine',
  },
  chest: {
    causes: ['Muscle strain', 'Anxiety or panic', 'Acid reflux (GERD)', 'Costochondritis', 'Cardiac concerns'],
    severity: 'high',
    recommendation: 'Chest pain should always be taken seriously. While many causes are not dangerous, some require immediate attention.',
    whenToSeeDoctor: 'Seek emergency care immediately if chest pain is severe, radiates to arm/jaw, or is accompanied by shortness of breath, sweating, or dizziness.',
    selfCare: ['If mild and muscular: rest and avoid strain', 'Practice deep breathing', 'Avoid heavy meals if reflux-related', 'Note when pain occurs and what triggers it'],
    careNavigation: 'emergency',
  },
  stomach: {
    causes: ['Indigestion', 'Food intolerance', 'Gastritis', 'Stress', 'Viral gastroenteritis'],
    severity: 'low',
    recommendation: 'Most stomach discomfort is related to diet or mild infections. Focus on gentle foods and hydration.',
    whenToSeeDoctor: 'See a doctor if pain is severe, persistent (more than a few days), or accompanied by blood in stool, unexplained weight loss, or persistent vomiting.',
    selfCare: ['Eat small, bland meals (BRAT diet)', 'Stay hydrated with clear fluids', 'Avoid spicy, fatty, or acidic foods', 'Rest', 'Ginger tea may help with nausea'],
    careNavigation: 'selfCare',
  },
  back: {
    causes: ['Muscle strain', 'Poor posture', 'Herniated disc', 'Sedentary lifestyle', 'Age-related changes'],
    severity: 'moderate',
    recommendation: 'Back pain is very common and often related to posture or muscle strain. Gentle movement usually helps more than rest.',
    whenToSeeDoctor: 'See a doctor if pain radiates down the leg, causes numbness/weakness, or follows an injury. Seek urgent care if you lose bladder/bowel control.',
    selfCare: ['Apply heat or ice to the affected area', 'Gentle stretching and walking', 'Maintain good posture', 'Avoid prolonged sitting', 'Sleep on a supportive mattress'],
    careNavigation: 'routine',
  },
  default: {
    causes: ['Common viral illness', 'Stress-related symptoms', 'Environmental factors', 'Mild allergic reaction', 'Temporary imbalance'],
    severity: 'low',
    recommendation: 'Based on your description, this appears to be a mild condition. Monitor your symptoms and practice self-care.',
    whenToSeeDoctor: 'See a doctor if symptoms worsen, persist for more than a week, or if you develop new concerning symptoms.',
    selfCare: ['Rest and stay hydrated', 'Eat nutritious meals', 'Monitor your symptoms', 'Avoid strenuous activity', 'Keep a symptom diary'],
    careNavigation: 'selfCare',
  }
};

function analyzeSymptoms(input: string): SymptomResult {
  const lower = input.toLowerCase();
  
  if (lower.includes('chest') || lower.includes('heart') || lower.includes('breathing difficulty')) {
    return symptomDatabase.chest;
  }
  if (lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine')) {
    return symptomDatabase.headache;
  }
  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('hot')) {
    return symptomDatabase.fever;
  }
  if (lower.includes('cough') || lower.includes('throat') || lower.includes('cold')) {
    return symptomDatabase.cough;
  }
  if (lower.includes('tired') || lower.includes('fatigue') || lower.includes('exhausted') || lower.includes('weak')) {
    return symptomDatabase.fatigue;
  }
  if (lower.includes('stomach') || lower.includes('belly') || lower.includes('nausea') || lower.includes('vomit') || lower.includes('diarrhea')) {
    return symptomDatabase.stomach;
  }
  if (lower.includes('back') || lower.includes('spine') || lower.includes('waist')) {
    return symptomDatabase.back;
  }
  
  return symptomDatabase.default;
}

export function SymptomChecker() {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const analysis = analyzeSymptoms(input);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'high': return 'text-critical bg-critical/10';
      default: return 'text-text-secondary bg-border';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return CheckCircle;
      case 'moderate': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getCareNavigationColor = (nav: string) => {
    switch (nav) {
      case 'emergency': return 'bg-critical/10 border-critical/30 text-critical';
      case 'urgent': return 'bg-warning/10 border-warning/30 text-warning';
      case 'routine': return 'bg-info/10 border-info/30 text-info';
      case 'selfCare': return 'bg-success/10 border-success/30 text-success';
      default: return 'bg-border';
    }
  };

  const quickSymptoms = [
    { icon: Brain, label: language === 'en' ? 'Headache' : 'سر درد' },
    { icon: Thermometer, label: language === 'en' ? 'Fever' : 'بخار' },
    { icon: Wind, label: language === 'en' ? 'Cough' : 'کھانسی' },
    { icon: Droplets, label: language === 'en' ? 'Fatigue' : 'تھکاوٹ' },
    { icon: Eye, label: language === 'en' ? 'Stomach' : 'پیٹ' },
    { icon: Zap, label: language === 'en' ? 'Back Pain' : 'کمر درد' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => { setResult(null); setInput(''); }}
          className="p-2 rounded-xl hover:bg-primary-50 text-text-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('symptomTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('symptomSubtitle')}</p>
        </div>
      </div>

      {/* Input Section */}
      {!result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('symptomPlaceholder')}
            className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light transition-all"
          />
          
          {/* Quick symptom buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {quickSymptoms.map((symptom, idx) => (
              <button
                key={idx}
                onClick={() => setInput(symptom.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary text-xs font-medium hover:bg-primary-100 transition-colors"
              >
                <symptom.icon className="w-3 h-3" />
                {symptom.label}
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
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Care Navigation Banner */}
            <div className={`border rounded-2xl p-5 ${getCareNavigationColor(result.careNavigation)}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  result.careNavigation === 'emergency' ? 'bg-critical/20' :
                  result.careNavigation === 'urgent' ? 'bg-warning/20' :
                  result.careNavigation === 'routine' ? 'bg-info/20' : 'bg-success/20'
                }`}>
                  {result.careNavigation === 'emergency' && <AlertTriangle className="w-5 h-5" />}
                  {result.careNavigation === 'urgent' && <AlertTriangle className="w-5 h-5" />}
                  {result.careNavigation === 'routine' && <Heart className="w-5 h-5" />}
                  {result.careNavigation === 'selfCare' && <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {result.careNavigation === 'emergency' && t('visitER')}
                    {result.careNavigation === 'urgent' && t('visitUrgent')}
                    {result.careNavigation === 'routine' && t('visitDoctor')}
                    {result.careNavigation === 'selfCare' && t('homeRemedy')}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {result.careNavigation === 'emergency' ? t('emergency') :
                     result.careNavigation === 'urgent' ? t('urgent') :
                     result.careNavigation === 'routine' ? t('routine') :
                     t('selfCare')}
                  </p>
                </div>
              </div>
            </div>

            {/* Severity */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('severityLevel')}</h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSeverityColor(result.severity)}`}>
                {(() => {
                  const Icon = getSeverityIcon(result.severity);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="font-semibold text-sm">
                  {result.severity === 'low' && `🟢 ${t('low')}`}
                  {result.severity === 'moderate' && `🟡 ${t('moderate')}`}
                  {result.severity === 'high' && `🔴 ${t('high')}`}
                </span>
              </div>
            </div>

            {/* Possible Causes */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('possibleCauses')}</h3>
              <div className="space-y-2">
                {result.causes.map((cause, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary-light" />
                    <span className="text-sm text-text-primary">{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('recommendation')}</h3>
              <p className="text-sm text-text-primary leading-relaxed">{result.recommendation}</p>
            </div>

            {/* When to See Doctor */}
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-warning mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('whenToSeeDoctor')}
              </h3>
              <p className="text-sm text-text-primary leading-relaxed">{result.whenToSeeDoctor}</p>
            </div>

            {/* Self Care */}
            <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-success mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t('selfCareTips')}
              </h3>
              <div className="space-y-2">
                {result.selfCare.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span className="text-sm text-text-primary">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={() => { setResult(null); setInput(''); }}
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
