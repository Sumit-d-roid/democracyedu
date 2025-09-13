import FeaturesSection from '../FeaturesSection';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function FeaturesSectionExample() {
  return (
    <LanguageProvider>
      <FeaturesSection />
    </LanguageProvider>
  );
}