import React from 'react';
import Glossary from '../components/Glossary';
import { useLanguage } from '@/contexts/LanguageContext';

const GlossaryPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3" data-testid="text-glossary-title">
            {t('glossary.title') || 'Glossary of Constitutional Terms'}
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            {t('glossary.description') ||
              'Explore important constitutional and civic terms with concise bilingual explanations.'}
          </p>
        </header>
        <Glossary />
      </div>
    </div>
  );
};

export default GlossaryPage;
