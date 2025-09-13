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
}

export default function LessonCard({ id, title, description, icon, difficulty, estimatedTime }: LessonCardProps) {
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
    <Card className="hover-elevate" data-testid={`card-lesson-${id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl" role="img" aria-label="lesson icon">{icon}</div>
          <div className="flex gap-2">
            <Badge variant="secondary" className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('lessons.completed')}
              </Badge>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3" data-testid={`text-lesson-title-${id}`}>
          {title}
        </h3>
        {estimatedTime && (
          <p className="text-sm text-muted-foreground mb-2">
            ⏱️ {estimatedTime}
          </p>
        )}
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          onClick={handleStartLesson}
          className="w-full"
          variant={isCompleted ? "secondary" : "default"}
          data-testid={`button-start-lesson-${id}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('lessons.completed')}
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