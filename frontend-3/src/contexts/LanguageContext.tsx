import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'marathi' | 'hindi' | 'english';

type UserRole = 'admin' | 'student';

type LanguageContextType = {
  language: Language;
  role: UserRole;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  role: 'admin' | 'student' | null;
}

export function LanguageProvider({ children, role }: LanguageProviderProps) {
    // Set initial language based on role
  // Default to admin if no role is set
  const effectiveRole: UserRole = role === 'student' ? 'student' : 'admin';
  const [language, setLanguageState] = useState<Language>(effectiveRole === 'student' ? 'english' : 'marathi');

  // Update language - enforces role-based restrictions
  const setLanguage = (lang: Language) => {
    // For admin role, only allow Marathi
    if (role === 'admin' && lang !== 'marathi') {
      console.warn('Admin role must use Marathi language');
      return;
    }
    // For student/member role, only allow English
    if (role === 'student' && lang !== 'english') {
      console.warn('Student role must use English language');
      return;
    }
    setLanguageState(lang);
  };

  // Clear previous language settings
  useEffect(() => {
    localStorage.removeItem('messmitra-language');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, role: effectiveRole }}>
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
