import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement, getCategoryColor } from '@shared/achievements';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const categoryColor = getCategoryColor(achievement.category);
  const { t } = useLanguage();

  useEffect(() => {
    // Animate in
    setIsVisible(true);
    
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={cn(
        'fixed top-4 right-4 z-50 transition-all duration-300 transform',
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}
      data-testid="notification-achievement"
    >
      <Card className="w-80 bg-background border-2 border-primary shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className="text-3xl flex-shrink-0">
              {achievement.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant="default" 
                  className={`bg-${categoryColor}-100 text-${categoryColor}-800 text-xs`}
                  data-testid="badge-achievement-category"
                >
                  {t('achievements.notification.title')}
                </Badge>
                
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-close-notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Achievement Details */}
              <h3 
                className="font-semibold text-lg mb-1 leading-tight"
                data-testid="text-achievement-title"
              >
                {achievement.title}
              </h3>
              
              <p 
                className="text-sm text-muted-foreground mb-3 leading-relaxed"
                data-testid="text-achievement-description"
              >
                {achievement.description}
              </p>
              
              {/* Points */}
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-yellow-100 text-yellow-800"
                  data-testid="badge-achievement-points"
                >
                  +{achievement.points} {t('achievements.notification.points')}
                </Badge>
                
                <span className="text-xs text-muted-foreground">
                  {t(`achievements.category.${achievement.category}`)} {t('achievements.category-achievements').toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}