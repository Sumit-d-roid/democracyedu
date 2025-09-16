import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  category?: string;
  progress?: number;
}

export default function LessonCard({
  id,
  title,
  description,
  icon,
  difficulty,
  estimatedTime,
  category = 'Constitutional Rights',
  progress = 0,
}: LessonCardProps) {
  const { isLessonComplete } = useProgress();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const isCompleted = isLessonComplete(id);

  const handleStartLesson = () => {
    setLocation(`/lessons/${id}`);
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Card
      className="hover-elevate transition-base hover:shadow-md flex flex-col"
      data-testid={`card-lesson-${id}`}
    >
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-3xl shrink-0"
            aria-hidden
          >
            <span className="translate-y-[1px]">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold leading-snug mb-1"
              data-testid={`text-lesson-title-${id}`}
            >
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
              <Badge variant="outline" className="px-2 py-0.5 leading-none">
                {category}
              </Badge>
              <Badge
                variant="secondary"
                className={`${difficultyColors[difficulty]} px-2 py-0.5 leading-none`}
              >
                {difficulty}
              </Badge>
              {isCompleted && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 leading-none flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  {t('lessons.completed')}
                </Badge>
              )}
              {!isCompleted && progress > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 leading-none"
                >
                  {Math.round(progress)}% {t('lessons.inProgress')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-3">
            {estimatedTime && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <span aria-hidden>⏱️</span>
                {estimatedTime}
              </span>
            )}
            <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${isCompleted ? 100 : progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-5 pb-5">
        <Button
          onClick={handleStartLesson}
          className="w-full transition-base"
          variant={isCompleted ? 'secondary' : 'default'}
          data-testid={`button-start-lesson-${id}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('lessons.review')}
            </>
          ) : progress > 0 ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t('lessons.continue')}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t('lessons.start')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
