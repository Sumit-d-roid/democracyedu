import { useBookmarks } from '@/contexts/BookmarksContext';
function BookmarkButton({ lessonId }: { lessonId: string }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  return (
    <button
      className={`ml-2 px-2 py-1 rounded ${isBookmarked(lessonId) ? 'bg-yellow-300' : 'bg-gray-200'}`}
      onClick={() => toggleBookmark(lessonId)}
      aria-label={isBookmarked(lessonId) ? 'Remove Bookmark' : 'Add Bookmark'}
    >
      {isBookmarked(lessonId) ? '★' : '☆'}
    </button>
  );
}
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
            <div key={lesson.id} className="flex items-center">
              <LessonCard
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                icon={lesson.icon}
                difficulty={lesson.difficulty}
                estimatedTime={lesson.estimatedTime}
              />
              <BookmarkButton lessonId={lesson.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}