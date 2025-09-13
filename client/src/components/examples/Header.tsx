import Header from '../Header';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function HeaderExample() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <Header />
      </ProgressProvider>
    </LanguageProvider>
  );
}