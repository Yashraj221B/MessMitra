import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'marathi' | 'hindi' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  role: 'admin' | 'student' | null;
}

export function LanguageProvider({ children, role }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language or use default based on role
    const savedLanguage = localStorage.getItem('messmitra-language') as Language;
    if (savedLanguage) {
      return savedLanguage;
    }
    // Default: Marathi for admin, English for student, Marathi for null (pre-selection)
    if (role === 'admin') return 'marathi';
    if (role === 'student') return 'english';
    // Before role selection, default to Marathi (will be overridden when role is selected)
    return 'marathi';
  });

  // Update language and persist to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('messmitra-language', lang);
  };

  // Sync with localStorage changes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('messmitra-language') as Language;
    if (savedLanguage && savedLanguage !== language) {
      setLanguageState(savedLanguage);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
