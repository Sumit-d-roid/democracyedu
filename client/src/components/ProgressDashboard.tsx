import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, BookOpen, Target, Play, Brain, Flame } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import achievementBadge from '@assets/generated_images/Achievement_Badge_Icon_a648ffe6.png';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function ProgressDashboard() {
  const { progress, markLessonComplete, recordQuizScore, setDailyGoal } = useProgress();
  const { t } = useLanguage();
  const [testing, setTesting] = useState(false);

  const quizScores = Object.values(progress.quizScores);
  const averageScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;

  // Test API integration
  const handleTestLessonComplete = async () => {
    setTesting(true);
    try {
      await markLessonComplete('api-test-lesson');
      alert('✅ Lesson completion sent to API! Check browser console for details.');
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test failed - check console for details. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTesting(false);
    }
  };

  const handleTestQuizResult = async () => {
    setTesting(true);
    try {
      const randomScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      await recordQuizScore('api-test-quiz', randomScore);
      alert(`✅ Quiz result (${randomScore}%) sent to API! Check browser console for details.`);
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test failed - check console for details. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setTesting(false);
    }
  };

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
    {
      title: 'Current Streak',
      value: `${progress.streakDays} days` as any,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center pt-4 pb-10 px-4">
        <img
          src={achievementBadge}
          alt="Achievement Badge"
          className="w-24 h-24 mx-auto mb-5 drop-shadow-sm"
        />
        <h1 className="h2 mb-3 text-gradient-primary" data-testid="text-progress-title">
          {t('progress.title')}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
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
                {stat.icon === Flame && (
                  <div className="text-xs text-muted-foreground mt-1">Best: {progress.bestStreak} days</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Daily Goal Settings */}
      <Card className="hover-elevate">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('progress.set-daily-goal') || 'Set daily goal'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3 max-w-sm">
            <label htmlFor="daily-goal" className="text-sm text-muted-foreground">
              {t('progress.daily-goal-target') || 'Daily target'}
            </label>
            <Input
              id="daily-goal"
              type="number"
              inputMode="numeric"
              min={1}
              max={200}
              step={1}
              value={progress.dailyGoal}
              aria-label={(t('progress.daily-goal-target') || 'Daily target') as string}
              data-testid="input-daily-goal"
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!Number.isNaN(val)) setDailyGoal(val);
              }}
              className="w-28"
              aria-describedby="daily-goal-help"
            />
            <div id="daily-goal-help" className="text-xs text-muted-foreground">
              {t('progress.daily-goal-help') || 'Points per day'}
            </div>
          </div>
        </CardContent>
      </Card>

      {progress.completedLessons.length > 0 && (
        <Card className="shadow-lift transition-base">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              Completed Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {progress.completedLessons.map((lessonId, index) => (
                <Badge key={index} variant="secondary" className="text-xs md:text-sm" data-testid={`badge-completed-lesson-${index}`}>
                  {lessonId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Integration Test Section */}
      <Card className="shadow-lift transition-base border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            API Integration Test
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Test the backend progress tracking endpoints. Check browser console for API responses.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleTestLessonComplete}
              disabled={testing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {testing ? 'Testing...' : 'Test Lesson Complete'}
            </Button>
            <Button
              onClick={handleTestQuizResult}
              disabled={testing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {testing ? 'Testing...' : 'Test Quiz Result'}
            </Button>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> These buttons will send test data to the backend API endpoints. 
              Open browser DevTools → Console to see the API requests and responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}