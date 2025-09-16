import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { createTranslator, type SupportedLanguage } from '../i18n';

type Language = SupportedLanguage;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  error: Error | null;
}

// All translations are now externalized under client/src/i18n

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function BaseLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('education-for-democracy-language');
      return (saved as Language) || 'en';
    } catch (error) {
      console.error('Failed to load language preference:', error);
      return 'en';
    }
  });

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('education-for-democracy-language', language);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to save language preference');
      setError(err);
      console.error('Language Context Error:', err);
    }
  }, [language]);

  const toggleLanguage = () => {
    try {
      setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'));
      setError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to toggle language');
      setError(err);
      console.error('Language Context Error:', err);
    }
  };

  const [translator, setTranslator] = useState<((key: string) => string) | null>(null);

  useEffect(() => {
    let active = true;
    createTranslator(language, { fallback: 'en' })
      .then((tfn) => {
        if (active) setTranslator(() => tfn);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load translations'));
      });
    return () => {
      active = false;
    };
  }, [language]);

  const t = useCallback(
    (key: string) => {
      if (!translator) return key; // loading state
      return translator(key);
    },
    [translator]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, error }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export the base provider directly
export const LanguageProvider = BaseLanguageProvider;

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
