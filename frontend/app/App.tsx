import { useState, lazy, Suspense } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme, rtlTheme } from '../theme/theme';
import { 
  Heart, 
  FlaskConical, 
  Clock, 
  Home, 
  Globe,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Code splitting with React.lazy for better performance
const HomePage = lazy(() => import('../features/home/HomePage').then(module => ({ default: module.HomePage })));
const SymptomChecker = lazy(() => import('../features/symptoms/SymptomChecker').then(module => ({ default: module.SymptomChecker })));
const LabReport = lazy(() => import('../features/lab/LabReport').then(module => ({ default: module.LabReport })));
const Timeline = lazy(() => import('../features/timeline/Timeline').then(module => ({ default: module.Timeline })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

type Page = 'home' | 'symptoms' | 'lab' | 'timeline';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, isRTL, direction, availableLanguages } = useLanguage();

  const navItems: { id: Page; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'symptoms', icon: Heart, label: t('symptoms') },
    { id: 'lab', icon: FlaskConical, label: t('labReports') },
    { id: 'timeline', icon: Clock, label: t('timeline') },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'symptoms': return <SymptomChecker />;
      case 'lab': return <LabReport />;
      case 'timeline': return <Timeline />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  // Wrap page rendering with Suspense for lazy loading
  const renderPageWithSuspense = () => (
    <Suspense fallback={<PageLoader />}>
      {renderPage()}
    </Suspense>
  );

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'urdu-text' : ''}`} 
      dir={direction}
      lang={language}
    >
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-main"
      >
        {t('skipToMain')}
      </a>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border" role="banner">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary">{t('appName')}</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px]
                  ${currentPage === item.id 
                    ? 'bg-primary-50 text-primary' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-50/50'
                  }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentIndex = availableLanguages.findIndex(l => l.code === language);
                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                setLanguage(availableLanguages[nextIndex].code);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-primary-50/50 transition-all min-h-[44px]"
              aria-label={t('language')}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">
                {availableLanguages.find(l => l.code !== language)?.nativeName || 'Language'}
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-primary-50/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? t('closeMenu') : t('mobileMenu')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
              id="mobile-menu"
            >
              <nav className="px-4 py-3 flex flex-col gap-1" role="navigation" aria-label="Mobile menu">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px]
                      ${currentPage === item.id 
                        ? 'bg-primary-50 text-primary' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-primary-50/50'
                      }`}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPageWithSuspense()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-50" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[64px] min-h-[44px]
                ${currentPage === item.id 
                  ? 'text-primary' 
                  : 'text-text-secondary'
                }`}
              aria-current={currentPage === item.id ? 'page' : undefined}
              aria-label={item.label}
            >
              <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'stroke-[2.5px]' : ''}`} aria-hidden="true" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Disclaimer Footer */}
      <footer className="hidden md:block border-t border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <p className="text-xs text-text-secondary text-center">{t('generalDisclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProviderWrapper>
        <AppContent />
      </ThemeProviderWrapper>
    </LanguageProvider>
  );
}

// Theme provider wrapper that switches between LTR and RTL themes
function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  return (
    <ThemeProvider theme={isRTL ? rtlTheme : theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
