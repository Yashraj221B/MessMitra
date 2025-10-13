import { useLanguage } from '../contexts/LanguageContext';

interface BilingualTextProps {
  text: string;
}

export function BilingualText({ text }: BilingualTextProps) {
  // Parse text like "होम (Home)" or "मेन्यू (Menu)"
  const match = text.match(/^(.+?)\s*\(([^)]+)\)$/);
  const { role } = useLanguage();
  
  if (!match) {
    // No parentheses found, return text as-is
    return <>{text}</>;
  }
  
  const [, marathiText, englishText] = match;

  // Return English text for students, Marathi text for admin
  if (role === 'student') {
    return <>{englishText}</>;
  } else {
    return <>{marathiText}</>;
  }
}
