import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, t as translate, supportedLanguages, type LanguageConfig } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  languageConfig: LanguageConfig;
  availableLanguages: LanguageConfig[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translate(key as any, language);
  };

  const languageConfig = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  const isRTL = languageConfig.direction === 'rtl';
  const direction = languageConfig.direction;

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    direction,
    languageConfig,
    availableLanguages: supportedLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
