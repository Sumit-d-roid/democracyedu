import LessonCard from '@/components/LessonCard';
import { useLanguage } from '@/contexts/LanguageContext';
import fundamentalRightsIcon from '@assets/generated_images/Fundamental_Rights_Lesson_Icon_aa971e94.png';
import governmentStructureIcon from '@assets/generated_images/Government_Structure_Lesson_Icon_b84c9620.png';

export default function Lessons() {
  const { t } = useLanguage();

  // todo: remove mock functionality - replace with real lesson data
  const lessons = [
    {
      id: 'fundamental-rights',
      titleKey: 'lessons.fundamental-rights',
      description: 'Learn about the fundamental rights guaranteed by Nepal\'s Constitution, including civil liberties and human rights protections.',
      icon: '⚖️',
      difficulty: 'beginner' as const,
    },
    {
      id: 'government-structure',
      titleKey: 'lessons.government-structure', 
      description: 'Understand the structure of Nepal\'s government including the executive, legislative, and judicial branches.',
      icon: '🏛️',
      difficulty: 'intermediate' as const,
    },
    {
      id: 'federal-system',
      titleKey: 'lessons.federal-system',
      description: 'Explore Nepal\'s federal system with provinces, local governments, and power distribution.',
      icon: '🗺️',
      difficulty: 'advanced' as const,
    },
  ];

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
              titleKey={lesson.titleKey}
              description={lesson.description}
              icon={lesson.icon}
              difficulty={lesson.difficulty}
            />
          ))}
        </div>
      </div>
    </div>
  );
}