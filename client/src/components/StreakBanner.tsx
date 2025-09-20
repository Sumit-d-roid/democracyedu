import { Flame, X, Trophy, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { diffInDays, normalizeDate } from '@/lib/streak';

export default function StreakBanner() {
  const { progress } = useProgress();
  const { t } = useLanguage();
  const [dismissedToday, setDismissedToday] = useState<boolean>(false);

  const todayKey = useMemo(() => normalizeDate(new Date()).toISOString().slice(0, 10), []);

  useEffect(() => {
    try {
      const dismissedOn = sessionStorage.getItem('streak-banner-dismissed-on');
      setDismissedToday(dismissedOn === todayKey);
    } catch {
      // ignore
    }
  }, [todayKey]);

  const last = progress.lastActiveAt ? new Date(progress.lastActiveAt) : null;
  const daysSince = last ? diffInDays(new Date(), last) : Infinity; // Infinity -> never started

  // Decide banner variant and copy
  let show = false;
  let title = '';
  let description = '';
  let highlight = '';

  if (!dismissedToday) {
    if (!last) {
      show = true;
      title = 'Start your learning streak';
      description = 'Complete a lesson section or take a quiz to begin your streak.';
      highlight = '🔥 Day 1 awaits';
    } else if (daysSince === 1) {
      show = true;
      title = 'Keep your streak alive';
      description = 'You learned yesterday. Do one activity today to continue your streak.';
      highlight = `🔥 ${progress.streakDays}d streak`;
    } else if (daysSince >= 2) {
      show = true;
      title = 'Restart your streak';
      description = 'Missed a day. Jump back in with a quick activity.';
      highlight = `🏁 Best: ${progress.bestStreak} days`;
    }
  }

  if (!show) return null;

  const onDismiss = () => {
    try {
      sessionStorage.setItem('streak-banner-dismissed-on', todayKey);
    } catch {
      // ignore
    }
    setDismissedToday(true);
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="shrink-0 text-amber-600 dark:text-amber-400"><Flame className="w-5 h-5" /></div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight">{title}</div>
          <div className="text-xs text-muted-foreground leading-snug">{description}</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 mr-1 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200">
            <Flame className="w-3 h-3" /> {highlight}
          </span>
          <a href="/lessons" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-600 text-white hover:brightness-110 transition">
            <Trophy className="w-3.5 h-3.5" /> Learn
          </a>
          <a href="/quiz" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border bg-background hover:bg-accent transition">
            <Target className="w-3.5 h-3.5" /> Quiz
          </a>
        </div>
        <button aria-label="Dismiss streak reminder" onClick={onDismiss} className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
