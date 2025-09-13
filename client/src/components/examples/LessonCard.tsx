import LessonCard from '../LessonCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function LessonCardExample() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <div className="p-8 bg-background">
          <div className="max-w-md">
            <LessonCard
              id="fundamental-rights"
              titleKey="lessons.fundamental-rights"
              description="Learn about the fundamental rights guaranteed by Nepal's Constitution, including civil liberties and human rights protections."
              icon="⚖️"
              difficulty="beginner"
            />
          </div>
        </div>
      </ProgressProvider>
    </LanguageProvider>
  );
}