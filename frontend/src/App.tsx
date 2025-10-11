import { AppRouter } from './router';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider role={null}>
        <AppRouter />
        <Toaster />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
