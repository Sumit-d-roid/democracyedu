import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import AchievementBadge from '@/components/AchievementBadge';
import { achievements, getAchievementsByCategory, Achievement } from '@shared/achievements';

export default function Achievements() {
  const { t } = useLanguage();
  const { getUnlockedAchievements, getLockedAchievements, progress, getTotalSectionsCompleted } =
    useProgress();
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category']>('learning');

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const totalAchievements = achievements.length;
  const completionPercentage = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  const categoryData = [
    { id: 'learning', label: t('achievements.category.learning'), icon: Trophy, color: 'blue' },
    { id: 'progress', label: t('achievements.category.progress'), icon: Target, color: 'green' },
    { id: 'mastery', label: t('achievements.category.mastery'), icon: Star, color: 'purple' },
    {
      id: 'dedication',
      label: t('achievements.category.dedication'),
      icon: Heart,
      color: 'orange',
    },
  ] as const;

  const getCurrentProgress = (achievement: Achievement): number => {
    const { requirement } = achievement;

    switch (requirement.type) {
      case 'lessons_completed':
        if (requirement.lessonId) {
          return progress.completedLessons.includes(requirement.lessonId) ? 1 : 0;
        }
        return progress.completedLessons.length;

      case 'sections_completed':
        return getTotalSectionsCompleted();

      case 'quiz_score':
        const maxScore = Math.max(...Object.values(progress.quizScores), 0);
        return maxScore;

      case 'points_earned':
        return progress.totalPoints;

      case 'perfect_quizzes':
        return (progress.perfectQuizzes || []).length;

      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-achievements-title">
            {t('achievements.title')}
          </h1>
          <p className="text-muted-foreground mb-6">{t('achievements.guide.desc')}</p>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-unlocked-count">
                  {unlockedAchievements.length}
                </div>
                <div className="text-sm text-muted-foreground">{t('achievements.unlocked')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold" data-testid="text-total-count">
                  {totalAchievements}
                </div>
                <div className="text-sm text-muted-foreground">{t('achievements.total')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div
                  className="text-2xl font-bold text-green-600"
                  data-testid="text-completion-percentage"
                >
                  {completionPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">{t('achievements.completion')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div
                  className="text-2xl font-bold text-yellow-600"
                  data-testid="text-achievement-points"
                >
                  {unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('achievements.points-earned')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as Achievement['category'])}
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categoryData.map((category) => {
              const categoryAchievements = getAchievementsByCategory(category.id);
              const unlockedInCategory = categoryAchievements.filter((a) =>
                unlockedAchievements.some((ua) => ua.id === a.id)
              ).length;

              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                  data-testid={`tab-category-${category.id}`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {unlockedInCategory}/{categoryAchievements.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Achievement Grids by Category */}
          {categoryData.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="w-5 h-5" />
                    {category.label} {t('achievements.category-achievements')}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getAchievementsByCategory(category.id).map((achievement) => {
                      const isUnlocked = unlockedAchievements.some(
                        (ua) => ua.id === achievement.id
                      );
                      const currentProgress = getCurrentProgress(achievement);

                      return (
                        <div key={achievement.id} className="relative">
                          <AchievementBadge
                            achievement={achievement}
                            unlocked={isUnlocked}
                            size="large"
                            showProgress={!isUnlocked}
                            currentValue={currentProgress}
                          />

                          {/* Achievement Details Tooltip/Card */}
                          <div className="mt-2 text-center">
                            <h4
                              className="font-medium text-sm mb-1 break-words leading-snug px-1"
                              data-testid={`text-title-${achievement.id}`}
                              style={{ wordBreak: 'break-word' }}
                            >
                              {achievement.title}
                            </h4>
                            <p
                              className="text-xs text-muted-foreground leading-relaxed line-clamp-4 px-2"
                              data-testid={`text-description-${achievement.id}`}
                            >
                              {achievement.description}
                            </p>

                            {!isUnlocked && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Progress: {currentProgress}/{achievement.requirement.value}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {unlockedAchievements
                  .slice(-6)
                  .reverse()
                  .map((achievement) => (
                    <div key={achievement.id} className="flex-shrink-0">
                      <AchievementBadge achievement={achievement} unlocked={true} size="medium" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Earn Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-500" />
                  Learning
                </h4>
                <p className="text-sm text-muted-foreground">
                  Complete lessons and explore different topics about Nepal's Constitution to unlock
                  learning achievements.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Progress
                </h4>
                <p className="text-sm text-muted-foreground">
                  Make steady progress by completing sections and earning points to unlock progress
                  achievements.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  Mastery
                </h4>
                <p className="text-sm text-muted-foreground">
                  Demonstrate deep understanding by scoring high on quizzes and completing all
                  content.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-500" />
                  Dedication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Show consistent learning habits and dedication to civic education.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
