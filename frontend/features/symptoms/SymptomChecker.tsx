import { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SymptomResult {
  possibleExplanations: string[];
  severity: 'low' | 'moderate' | 'high';
  whatThisMaySuggest: string;
  warningSigns: string[];
  suggestedNextStep: string;
  selfCareOptions: string[];
  careNavigation: 'emergency' | 'urgent' | 'routine' | 'selfCare';
  emergencyMessage?: string;
}

const symptomDatabase: Record<string, SymptomResult> = {
  headache: {
    possibleExplanations: [
      'This may be associated with tension or stress',
      'Dehydration can sometimes cause headaches',
      'Lack of sleep may contribute to this symptom',
      'Eye strain from screens is a common factor',
      'Sinus pressure may be a possible cause',
    ],
    severity: 'low',
    whatThisMaySuggest: 'Headaches can have many causes. Most are related to common factors like stress, dehydration, or lack of sleep. However, persistent or severe headaches may warrant medical attention.',
    warningSigns: [
      '⚠️ Sudden, severe headache (worst headache of your life)',
      '⚠️ Headache with vision changes or confusion',
      '⚠️ Headache with fever and stiff neck',
      '⚠️ Headache after head injury',
      '⚠️ Headache that worsens over time',
    ],
    suggestedNextStep: 'If this is a new or unusual headache, or if you experience any warning signs above, please consult a healthcare professional.',
    selfCareOptions: [
      '💧 Stay hydrated by drinking water',
      '🛌 Rest in a quiet, dark room',
      '🧊 Apply a cold compress to your forehead',
      '💊 Over-the-counter pain relief may help (follow package directions)',
      '👀 Reduce screen time and take breaks',
    ],
    careNavigation: 'selfCare',
  },
  fever: {
    possibleExplanations: [
      'This may be associated with a viral infection (cold/flu)',
      'Bacterial infections can cause fever',
      'Inflammatory conditions may present with fever',
      'Some medications can cause fever as a side effect',
      'Heat exhaustion is another possibility',
    ],
    severity: 'moderate',
    whatThisMaySuggest: 'Fever is your body\'s way of responding to infection or illness. While often a sign that your immune system is working, persistent or high fever may indicate a condition that needs medical evaluation.',
    warningSigns: [
      '⚠️ Temperature above 103°F (39.4°C)',
      '⚠️ Fever lasting more than 3 days',
      '⚠️ Severe headache with fever',
      '⚠️ Rash appearing with fever',
      '⚠️ Difficulty breathing',
      '⚠️ Confusion or extreme drowsiness',
    ],
    suggestedNextStep: 'Monitor your temperature and symptoms. If you experience any warning signs or if fever persists, please seek medical care.',
    selfCareOptions: [
      '💧 Rest and stay well-hydrated',
      '🛁 Take lukewarm baths to help reduce temperature',
      '👕 Wear light, breathable clothing',
      '💊 Fever-reducing medication as directed on package',
      '🌡️ Monitor temperature regularly',
    ],
    careNavigation: 'routine',
  },
  cough: {
    possibleExplanations: [
      'This may be associated with a common cold',
      'Allergies can cause coughing',
      'Dry air may irritate your throat',
      'Acid reflux is sometimes a cause',
      'Asthma may present with cough',
    ],
    severity: 'low',
    whatThisMaySuggest: 'Cough is a common symptom that can have many causes. Most coughs from viral infections resolve on their own within 1-2 weeks, but persistent cough may need evaluation.',
    warningSigns: [
      '⚠️ Cough lasting more than 3 weeks',
      '⚠️ Coughing up blood',
      '⚠️ Chest pain with coughing',
      '⚠️ Difficulty breathing or wheezing',
      '⚠️ High fever with cough',
    ],
    suggestedNextStep: 'If your cough persists, worsens, or is accompanied by warning signs, please consult a healthcare professional.',
    selfCareOptions: [
      '💧 Stay hydrated with warm fluids',
      '🍯 Honey may help soothe throat (for adults and children over 1 year)',
      '💨 Use a humidifier to add moisture to air',
      '🚭 Avoid irritants like smoke',
      '🗣️ Rest your voice',
    ],
    careNavigation: 'selfCare',
  },
  fatigue: {
    possibleExplanations: [
      'This may be associated with poor sleep quality',
      'Stress or anxiety can cause fatigue',
      'Iron deficiency (anemia) is a possible cause',
      'Dehydration may contribute to tiredness',
      'Thyroid issues can sometimes present as fatigue',
    ],
    severity: 'moderate',
    whatThisMaySuggest: 'Fatigue can have many underlying causes. While often related to lifestyle factors, persistent fatigue may indicate a condition that would benefit from medical evaluation.',
    warningSigns: [
      '⚠️ Fatigue persisting more than 2 weeks despite rest',
      '⚠️ Unexplained weight changes',
      '⚠️ Significant mood changes',
      '⚠️ Difficulty concentrating',
      '⚠️ Fatigue interfering with daily activities',
    ],
    suggestedNextStep: 'If fatigue persists or is affecting your daily life, consider scheduling a visit with a healthcare professional for evaluation.',
    selfCareOptions: [
      '😴 Maintain a consistent sleep schedule',
      '🚶‍♂️ Exercise regularly (even light walks can help)',
      '🥗 Eat balanced, nutritious meals',
      '💧 Stay well-hydrated',
      '🧘‍♀️ Practice stress management techniques',
    ],
    careNavigation: 'routine',
  },
  chest: {
    possibleExplanations: [
      'This may be associated with muscle strain',
      'Anxiety or panic can cause chest discomfort',
      'Acid reflux (GERD) is a common cause',
      'Costochondritis (rib cartilage inflammation) is possible',
      '⚠️ Cardiac concerns must be considered',
    ],
    severity: 'high',
    whatThisMaySuggest: 'Chest pain or discomfort should ALWAYS be taken seriously. While many causes are not dangerous, some require immediate emergency medical attention. It is impossible to determine the cause without proper medical evaluation.',
    warningSigns: [
      '🚨 SEVERE chest pain or pressure',
      '🚨 Pain radiating to arm, jaw, neck, or back',
      '🚨 Shortness of breath',
      '🚨 Sweating, nausea, or dizziness',
      '🚨 Pain that comes on suddenly',
    ],
    suggestedNextStep: 'DO NOT DELAY. If you are experiencing severe chest pain or any warning signs above, seek emergency medical care IMMEDIATELY. Call emergency services (911 in US, 112 in Europe, 999 in UK) or go to the nearest emergency room.',
    selfCareOptions: [
      '🚨 DO NOT attempt to drive yourself if experiencing severe symptoms',
      '📞 Call emergency services immediately',
      '🪑 Sit or lie down in a comfortable position',
      '🧘‍♂️ Try to stay calm while waiting for help',
    ],
    careNavigation: 'emergency',
    emergencyMessage: '🚨 POSSIBLE MEDICAL EMERGENCY: Chest pain can be a sign of a serious condition. Seek emergency medical care IMMEDIATELY. Do not delay treatment.',
  },
  stomach: {
    possibleExplanations: [
      'This may be associated with indigestion',
      'Food intolerance is a possible cause',
      'Gastritis (stomach inflammation) may be involved',
      'Stress can affect digestion',
      'Viral gastroenteritis is another possibility',
    ],
    severity: 'low',
    whatThisMaySuggest: 'Stomach discomfort can have many causes, often related to diet or mild infections. Most cases resolve with rest and gentle care, but some symptoms may need medical evaluation.',
    warningSigns: [
      '⚠️ Severe or worsening pain',
      '⚠️ Blood in stool or vomit',
      '⚠️ Unexplained weight loss',
      '⚠️ Persistent vomiting (more than 24 hours)',
      '⚠️ Pain lasting more than a few days',
    ],
    suggestedNextStep: 'If you experience warning signs or if symptoms persist, please consult a healthcare professional.',
    selfCareOptions: [
      '🍞 Eat small, bland meals (BRAT diet: Bananas, Rice, Applesauce, Toast)',
      '💧 Stay hydrated with clear fluids',
      '🚫 Avoid spicy, fatty, or acidic foods temporarily',
      '🛌 Get adequate rest',
      '🫚 Ginger tea may help with nausea',
    ],
    careNavigation: 'selfCare',
  },
  back: {
    possibleExplanations: [
      'This may be associated with muscle strain',
      'Poor posture can contribute to back pain',
      'Herniated disc is a possible cause',
      'Sedentary lifestyle may be a factor',
      'Age-related changes can affect the back',
    ],
    severity: 'moderate',
    whatThisMaySuggest: 'Back pain is very common and often related to posture or muscle strain. While usually not serious, some types of back pain may need medical evaluation.',
    warningSigns: [
      '⚠️ Pain radiating down the leg',
      '⚠️ Numbness or weakness in legs',
      '⚠️ Pain following an injury',
      '⚠️ Loss of bladder or bowel control (EMERGENCY)',
      '⚠️ Pain that doesn\'t improve with rest',
    ],
    suggestedNextStep: 'If you experience warning signs, especially loss of bladder/bowel control, seek medical care immediately. For persistent pain, consider scheduling a visit with a healthcare professional.',
    selfCareOptions: [
      '🔥 Apply heat or ice to the affected area',
      '🚶‍♂️ Gentle stretching and walking may help',
      '🪑 Maintain good posture',
      '⏰ Avoid prolonged sitting',
      '🛏️ Sleep on a supportive mattress',
    ],
    careNavigation: 'routine',
  },
  default: {
    possibleExplanations: [
      'This may be associated with a common viral illness',
      'Stress-related symptoms are possible',
      'Environmental factors may play a role',
      'Mild allergic reaction is a possibility',
      'Temporary imbalance may be a factor',
    ],
    severity: 'low',
    whatThisMaySuggest: 'Based on your description, this appears to possibly be a mild condition. However, only a healthcare professional can provide a proper diagnosis after evaluation.',
    warningSigns: [
      '⚠️ Symptoms worsening over time',
      '⚠️ New or unusual symptoms developing',
      '⚠️ Symptoms persisting more than a week',
      '⚠️ Symptoms interfering with daily activities',
      '⚠️ High fever or severe pain',
    ],
    suggestedNextStep: 'Monitor your symptoms. If they worsen, persist, or if you develop new concerning symptoms, please consult a healthcare professional.',
    selfCareOptions: [
      '🛌 Rest and stay hydrated',
      '🥗 Eat nutritious meals',
      '📝 Monitor your symptoms and note any changes',
      '🏃‍♂️ Avoid strenuous activity if feeling unwell',
      '📓 Keep a symptom diary to track patterns',
    ],
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
            {/* Emergency Banner - Most Prominent */}
            {result.careNavigation === 'emergency' && result.emergencyMessage && (
              <div className="bg-critical border-2 border-critical rounded-2xl p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-critical/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-critical" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-critical text-lg mb-2">
                      {language === 'en' ? 'POSSIBLE MEDICAL EMERGENCY' : 'ممکنہ طبی ہنگامی صورتحال'}
                    </h3>
                    <p className="text-critical font-semibold leading-relaxed">
                      {result.emergencyMessage}
                    </p>
                    <div className="mt-4 p-3 bg-white/90 rounded-xl">
                      <p className="text-sm font-bold text-text-primary">
                        {language === 'en' 
                          ? '📞 Call emergency services NOW or go to the nearest emergency room. Do not delay.'
                          : '📞 ابھی ایمرجنسی سروسز کو کال کریں یا قریب ترین ایمرجنسی روم جائیں۔ تاخیر نہ کریں۔'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Care Navigation Banner */}
            {result.careNavigation !== 'emergency' && (
              <div className={`border rounded-2xl p-5 ${getCareNavigationColor(result.careNavigation)}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.careNavigation === 'urgent' ? 'bg-warning/20' :
                    result.careNavigation === 'routine' ? 'bg-info/20' : 'bg-success/20'
                  }`}>
                    {result.careNavigation === 'urgent' && <AlertTriangle className="w-5 h-5" />}
                    {result.careNavigation === 'routine' && <Heart className="w-5 h-5" />}
                    {result.careNavigation === 'selfCare' && <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {result.careNavigation === 'urgent' && t('visitUrgent')}
                      {result.careNavigation === 'routine' && t('visitDoctor')}
                      {result.careNavigation === 'selfCare' && t('homeRemedy')}
                    </p>
                    <p className="text-xs opacity-80 mt-0.5">
                      {result.careNavigation === 'urgent' ? t('urgent') :
                       result.careNavigation === 'routine' ? t('routine') :
                       t('selfCare')}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Possible Explanations */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('possibleExplanations')}</h3>
              <div className="space-y-2">
                {result.possibleExplanations.map((explanation, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-background transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary-light mt-2 flex-shrink-0" />
                    <span className="text-sm text-text-primary">{explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What This May Suggest */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-secondary mb-3">{t('whatThisMaySuggest')}</h3>
              <p className="text-sm text-text-primary leading-relaxed">{result.whatThisMaySuggest}</p>
            </div>

            {/* Warning Signs */}
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-warning mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('warningSigns')}
              </h3>
              <div className="space-y-2">
                {result.warningSigns.map((sign, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-sm text-text-primary leading-relaxed">{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Next Step */}
            <div className="bg-info/5 border border-info/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-info mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t('suggestedNextStep')}
              </h3>
              <p className="text-sm text-text-primary leading-relaxed">{result.suggestedNextStep}</p>
            </div>

            {/* Self Care Options */}
            <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-success mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t('selfCareOptions')}
              </h3>
              <div className="space-y-2">
                {result.selfCareOptions.map((option, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-sm text-text-primary">{option}</span>
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
