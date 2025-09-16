import { useBookmarks } from '@/contexts/BookmarksContext';
import { useToast } from '@/hooks/use-toast';
function BookmarkButton({ lessonId }: { lessonId: string }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  function handleClick() {
    toggleBookmark(lessonId);
    toast({
      title: isBookmarked(lessonId) ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: isBookmarked(lessonId)
        ? 'Lesson removed from your favorites.'
        : 'Lesson added to your favorites.',
      duration: 3000,
    });
  }
  const active = isBookmarked(lessonId);
  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove Bookmark' : 'Add Bookmark'}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium transition-base bg-background hover-elevate ${active ? 'text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' : 'text-muted-foreground'}`}
    >
      {active ? '★' : '☆'}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="relative group">
              <LessonCard
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                icon={lesson.icon}
                difficulty={lesson.difficulty}
                estimatedTime={lesson.estimatedTime}
              />
              <div className="absolute top-2 right-2 z-10">
                <BookmarkButton lessonId={lesson.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
