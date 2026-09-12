import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Heart, Menu, X, ArrowRight, Shield, Clock, FlaskConical, Stethoscope, Brain, Activity, ChevronRight, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

// Animated section wrapper
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0D9488] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-[#0D9488]">MediMind AI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#0D9488] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#0D9488] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0F766E] hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-[#0D9488] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { navigate('/auth'); setMobileOpen(false); }}
              className="mt-2 w-full bg-[#0D9488] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              Get Started Free
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Gradient blob background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#CCFBF1] to-[#F0FDFA] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#CCFBF1] to-transparent rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-[#134E4A] leading-tight mb-6"
            >
              Understand Your Health.{' '}
              <span className="text-[#0D9488]">Know What To Do Next.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              MediMind AI turns confusing medical reports and symptoms into simple, clear guidance — in English and Urdu.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate('/auth')}
                className="bg-[#0D9488] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0F766E] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#0D9488]/20"
              >
                Start Free
              </button>
              <a
                href="#how-it-works"
                className="border-2 border-[#0D9488] text-[#0D9488] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0D9488] hover:text-white transition-all duration-200"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          {/* Right: Animated Mockup Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white border border-[#CCFBF1] rounded-3xl shadow-2xl p-6 max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F0FDFA] rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div>
                  <p className="font-semibold text-[#134E4A]">CBC Report</p>
                  <p className="text-xs text-gray-500">Simplified by MediMind AI</p>
                </div>
              </div>

              {/* Fake lab results */}
              <div className="space-y-3">
                {[
                  { name: 'Hemoglobin', value: '13.2 g/dL', status: 'normal', color: 'text-[#22C55E]' },
                  { name: 'WBC Count', value: '11,500 /µL', status: 'slightly high', color: 'text-[#F59E0B]' },
                  { name: 'Platelets', value: '245,000 /µL', status: 'normal', color: 'text-[#22C55E]' },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className="flex items-center justify-between p-3 bg-[#F8FFFE] rounded-xl"
                  >
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#134E4A]">{item.value}</span>
                      <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 p-4 bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-xl"
              >
                <div className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-[#0D9488] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#134E4A] leading-relaxed">
                    <span className="font-semibold">AI Summary:</span> Your hemoglobin is healthy. WBC is slightly elevated, which may indicate a mild infection. Monitor for symptoms.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Problem Section
function ProblemSection() {
  const problems = [
    { emoji: '🧾', title: 'You received a lab report full of numbers you don\'t understand' },
    { emoji: '🔍', title: 'You searched Google and got 50 conflicting articles' },
    { emoji: '😰', title: 'You still don\'t know if it\'s serious or not' },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] mb-4">Sound familiar?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">You're not alone. Most people struggle to understand their health data.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-white border border-[#CCFBF1] rounded-2xl shadow-sm p-8 text-center hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
                <div className="text-5xl mb-4">{problem.emoji}</div>
                <p className="text-gray-700 leading-relaxed">{problem.title}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: Stethoscope, title: 'Check Symptoms', description: 'Describe how you feel. Get urgency guidance instantly.', color: 'bg-[#0D9488]/10 text-[#0D9488]' },
    { icon: FlaskConical, title: 'Lab Report Reader', description: 'Upload any report. AI reads and explains it simply.', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
    { icon: Activity, title: 'Medication Safety', description: 'Enter your medicines. Check for interactions.', color: 'bg-[#8B5CF6]/10 text-[#8B5CF6]' },
    { icon: Heart, title: 'Health Timeline', description: 'All your health history, organized in one place.', color: 'bg-[#EC4899]/10 text-[#EC4899]' },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#F8FFFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] mb-4">Everything you need to understand your health</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Powerful AI tools to help you make sense of your health data.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-white border border-[#CCFBF1] rounded-2xl shadow-sm p-8 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 h-full">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#134E4A] mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { number: '1', title: 'Upload or describe', description: 'Share your symptoms or lab report with MediMind AI.' },
    { number: '2', title: 'AI analyzes safely', description: 'Our AI processes your health information securely.' },
    { number: '3', title: 'Get simple guidance', description: 'Receive clear explanations and recommended next steps.' },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] mb-4">As easy as 1-2-3</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to understand your health better.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Dotted connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-[#CCFBF1]" />

          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.15} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xl font-bold mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-[#134E4A] mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Multilingual Section
function MultilingualSection() {
  return (
    <section className="py-16 md:py-24 bg-[#F8FFFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A] mb-4">Healthcare in your language</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Understand your health in the language you're most comfortable with.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* English Card */}
          <AnimatedSection delay={0}>
            <div className="bg-white border border-[#CCFBF1] rounded-2xl shadow-sm p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🇬🇧</span>
                <span className="font-semibold text-[#134E4A]">English</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#F8FFFE] rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Hemoglobin</p>
                  <p className="text-sm font-medium text-[#134E4A]">13.2 g/dL — <span className="text-[#22C55E]">Normal</span></p>
                </div>
                <div className="p-3 bg-[#F8FFFE] rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">WBC Count</p>
                  <p className="text-sm font-medium text-[#134E4A]">11,500 /µL — <span className="text-[#F59E0B]">Slightly High</span></p>
                </div>
                <div className="p-3 bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-xl mt-4">
                  <p className="text-sm text-[#134E4A]"><span className="font-semibold">AI Summary:</span> Your hemoglobin is healthy. WBC is slightly elevated — may indicate a mild infection.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Urdu Card */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white border border-[#CCFBF1] rounded-2xl shadow-sm p-6 h-full" dir="rtl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🇵🇰</span>
                <span className="font-semibold text-[#134E4A]">اردو</span>
              </div>
              <div className="space-y-3" style={{ fontFamily: '"Noto Nastaliq Urdu", serif', lineHeight: '2.2' }}>
                <div className="p-3 bg-[#F8FFFE] rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">ہیموگلوبن</p>
                  <p className="text-sm font-medium text-[#134E4A]">13.2 g/dL — <span className="text-[#22C55E]">نارمل</span></p>
                </div>
                <div className="p-3 bg-[#F8FFFE] rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">WBC کاؤنٹ</p>
                  <p className="text-sm font-medium text-[#134E4A]">11,500 /µL — <span className="text-[#F59E0B]">تھوڑا زیادہ</span></p>
                </div>
                <div className="p-3 bg-[#0D9488]/5 border border-[#0D9488]/20 rounded-xl mt-4">
                  <p className="text-sm text-[#134E4A]"><span className="font-semibold">AI خلاصہ:</span> آپ کا ہیموگلوبن صحت مند ہے۔ WBC تھوڑا زیادہ ہے — ہلکی عفونت کی نشانی ہو سکتی ہے۔</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to understand your health?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands who are already taking control of their health understanding.</p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-[#0D9488] px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Open MediMind Free
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer id="about" className="py-12 border-t border-[#CCFBF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-bold text-[#0D9488]">MediMind AI</span>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-gray-500 text-center md:text-left max-w-md">
            Not a replacement for doctors. Always consult a healthcare professional.
          </p>

          {/* Copyright */}
          <p className="text-sm text-gray-400">&copy; 2026 MediMind AI</p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FFFE]">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MultilingualSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
