import { MobileContainer } from './components/MobileContainer';
import { AppRouter } from './router';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider role={null}>
        <MobileContainer>
          <AppRouter />
          <Toaster />
        </MobileContainer>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
