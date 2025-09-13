import ProgressDashboard from '../ProgressDashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function ProgressDashboardExample() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <div className="p-8 bg-background">
          <ProgressDashboard />
        </div>
      </ProgressProvider>
    </LanguageProvider>
  );
}