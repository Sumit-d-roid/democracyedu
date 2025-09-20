import { Target, CheckCircle2, X } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';

export default function DailyGoalBar({ onClose }: { onClose?: () => void }) {
  const { progress } = useProgress();
  const { t } = useLanguage();

  const safeT = (key: string, fallback: string) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const goal = Math.max(0, progress.dailyGoal || 0);
  const current = Math.max(0, progress.dailyPoints || 0);
  const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  const completed = goal > 0 && current >= goal;

  return (
    <div
      className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="region"
      aria-label={safeT('progress.daily-goal', 'Daily Goal')}
    >
      <div className="container px-4 py-2 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-medium text-foreground">
              {safeT('progress.daily-goal', 'Daily Goal')}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            {completed ? (
              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {safeT('progress.completed', 'Completed')}
              </span>
            ) : null}
            <span className="tabular-nums text-foreground" aria-live="polite">
              {current}/{goal} ({percent}%)
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={safeT('general.hide', 'Hide')}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border hover-elevate transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <Progress value={percent} aria-label="Daily goal progress" />
      </div>
    </div>
  );
}
