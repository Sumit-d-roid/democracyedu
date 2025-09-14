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

export default function LessonCard({ id, title, description, icon, difficulty, estimatedTime, category = 'Constitutional Rights', progress = 0 }: LessonCardProps) {
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
    <Card className="hover-elevate transition-all duration-300 hover:shadow-lg" data-testid={`card-lesson-${id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-2">
            <div className="text-4xl bg-primary/10 p-3 rounded-lg" role="img" aria-label="lesson icon">
              {icon}
            </div>
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="secondary" className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
            {isCompleted ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('lessons.completed')}
              </Badge>
            ) : progress > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {Math.round(progress)}% {t('lessons.inProgress')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold" data-testid={`text-lesson-title-${id}`}>
            {title}
          </h3>
          
          <div className="flex items-center gap-4">
            {estimatedTime && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="text-primary">⏱️</span> {estimatedTime}
              </p>
            )}
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${isCompleted ? 100 : progress}%` }}
              />
            </div>
          </div>
          
          <p className="text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          onClick={handleStartLesson}
          className="w-full transition-all duration-300 hover:scale-105"
          variant={isCompleted ? "secondary" : "default"}
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