import LessonCard from '@/components/LessonCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { lessonContents } from '@shared/lessonContent';

export default function Lessons() {
  const { t } = useLanguage();

  const lessons = Object.values(lessonContents);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" data-testid="text-lessons-title">
          {t('lessons.title')}
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              description={lesson.description}
              icon={lesson.icon}
              difficulty={lesson.difficulty}
              estimatedTime={lesson.estimatedTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}