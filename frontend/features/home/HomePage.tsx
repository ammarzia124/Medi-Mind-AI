import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Heart, 
  FlaskConical, 
  Clock, 
  ArrowRight, 
  Shield, 
  Activity,
  Stethoscope,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

type Page = 'home' | 'symptoms' | 'lab' | 'timeline';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      id: 'symptoms' as Page,
      icon: Heart,
      title: t('checkSymptoms'),
      description: t('checkSymptomsDesc'),
      color: 'bg-primary-50 text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      id: 'lab' as Page,
      icon: FlaskConical,
      title: t('analyzeLab'),
      description: t('analyzeLabDesc'),
      color: 'bg-info/10 text-info',
      iconBg: 'bg-info/10',
    },
    {
      id: 'timeline' as Page,
      icon: Clock,
      title: t('healthTimeline'),
      description: t('healthTimelineDesc'),
      color: 'bg-success/10 text-success',
      iconBg: 'bg-success/10',
    },
  ];

  const features = [
    { icon: Shield, text: 'Private & Secure' },
    { icon: Brain, text: 'AI-Powered Analysis' },
    { icon: Stethoscope, text: 'Doctor-Guided' },
    { icon: Activity, text: 'Health Tracking' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-white"
      >
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {t('welcomeTitle')}
          </h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
            {t('welcomeSubtitle')}
          </p>
          <button
            onClick={() => onNavigate('symptoms')}
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg shadow-primary-dark/20"
          >
            {t('checkSymptoms')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-10 right-40 w-20 h-20 bg-white/5 rounded-full" />
      </motion.section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onNavigate(action.id)}
              className="group bg-surface border border-border rounded-2xl p-6 text-left hover:border-primary-light hover:shadow-md hover:shadow-primary/5 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-text-secondary">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-surface border border-border rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-text-secondary">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
        <p className="text-sm text-text-secondary text-center">
          {t('generalDisclaimer')}
        </p>
      </div>
    </div>
  );
}
