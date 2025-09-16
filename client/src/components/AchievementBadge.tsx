import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Achievement, getCategoryColor } from '@shared/achievements';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  currentValue?: number;
}

export default function AchievementBadge({
  achievement,
  unlocked,
  size = 'medium',
  showProgress = false,
  currentValue = 0,
}: AchievementBadgeProps) {
  const categoryColor = getCategoryColor(achievement.category);
  const progress = Math.min((currentValue / achievement.requirement.value) * 100, 100);

  const sizeClasses = {
    small: 'w-16 h-20',
    medium: 'w-24 h-28',
    large: 'w-32 h-36',
  };

  const iconSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <Card
      className={cn(
        sizeClasses[size],
        'relative transition-all duration-300 cursor-default',
        unlocked ? 'hover-elevate bg-card border-2' : 'opacity-50 bg-muted border-dashed'
      )}
      data-testid={`badge-achievement-${achievement.id}`}
    >
      <CardContent className="p-2 h-full flex flex-col items-center justify-center text-center">
        {/* Achievement Icon */}
        <div
          className={cn(iconSizes[size], 'mb-1', unlocked ? 'grayscale-0' : 'grayscale')}
          data-testid={`icon-achievement-${achievement.id}`}
        >
          {achievement.icon}
        </div>

        {/* Achievement Title */}
        <h4
          className={cn(textSizes[size], 'font-semibold mb-1 leading-tight line-clamp-2')}
          data-testid={`text-achievement-title-${achievement.id}`}
        >
          {achievement.title}
        </h4>

        {/* Points Badge */}
        <Badge
          variant="secondary"
          className={cn(
            'text-xs px-1 py-0',
            unlocked && `bg-${categoryColor}-100 text-${categoryColor}-800`
          )}
          data-testid={`badge-points-${achievement.id}`}
        >
          +{achievement.points}
        </Badge>

        {/* Progress Bar (if showing progress) */}
        {showProgress && !unlocked && (
          <div className="w-full mt-1">
            <div className="w-full bg-muted rounded-full h-1">
              <div
                className={`bg-${categoryColor}-500 h-1 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
                data-testid={`progress-achievement-${achievement.id}`}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentValue}/{achievement.requirement.value}
            </div>
          </div>
        )}

        {/* Unlocked Indicator */}
        {unlocked && (
          <div
            className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            data-testid={`indicator-unlocked-${achievement.id}`}
          >
            ✓
          </div>
        )}
      </CardContent>
    </Card>
  );
}
