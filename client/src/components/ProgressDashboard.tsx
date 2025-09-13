import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, BookOpen, Target } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import achievementBadge from '@assets/generated_images/Achievement_Badge_Icon_a648ffe6.png';

export default function ProgressDashboard() {
  const { progress } = useProgress();
  const { t } = useLanguage();

  const quizScores = Object.values(progress.quizScores);
  const averageScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;

  const stats = [
    {
      title: t('progress.points'),
      value: progress.totalPoints,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: t('progress.lessons-completed'),
      value: progress.completedLessons.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: t('progress.quiz-accuracy'),
      value: `${averageScore}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <img 
          src={achievementBadge} 
          alt="Achievement Badge" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-2" data-testid="text-progress-title">
          {t('progress.title')}
        </h1>
        <p className="text-muted-foreground">
          Keep learning to unlock more achievements!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover-elevate" data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {progress.completedLessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.completedLessons.map((lessonId, index) => (
                <Badge key={index} variant="secondary" data-testid={`badge-completed-lesson-${index}`}>
                  {lessonId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}