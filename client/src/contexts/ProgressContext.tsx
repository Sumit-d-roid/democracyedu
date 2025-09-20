import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { achievements, Achievement } from '@shared/achievements';
import { updateStreak } from '@/lib/streak';
import { applyDailyIncrement } from '@/lib/dailyGoal';
import { useOfflineSupport } from '../hooks/use-offline-support';
import { progressAPI } from '@/lib/progressApi';
import { toast } from '@/hooks/use-toast';

interface ProgressData {
  totalPoints: number;
  dailyPoints: number;
  dailyGoal: number;
  dailyDate?: string | null;
  completedLessons: string[];
  completedSections: Record<string, string[]>; // lessonId -> sectionIds[]
  quizScores: Record<string, number>;
  unlockedAchievements: string[];
  perfectQuizzes: string[]; // quizIds with 100% score
  lastLessonCompletionTime?: number; // timestamp for dedication achievements
  // Streak fields
  lastActiveAt?: number | null;
  streakDays: number;
  bestStreak: number;
}

interface ProgressContextType {
  progress: ProgressData;
  addPoints: (points: number) => void;
  setDailyGoal: (goal: number) => void;
  markLessonComplete: (lessonId: string) => Promise<void>;
  markSectionComplete: (lessonId: string, sectionId: string) => void;
  isSectionComplete: (lessonId: string, sectionId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  recordQuizScore: (quizId: string, score: number) => Promise<void>;
  resetProgress: () => void;
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  checkForNewAchievements: () => Achievement[];
  getTotalSectionsCompleted: () => number;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const defaultProgress: ProgressData = {
  totalPoints: 0,
  dailyPoints: 0,
  dailyGoal: 20,
  dailyDate: null,
  completedLessons: [],
  completedSections: {},
  quizScores: {},
  unlockedAchievements: [],
  perfectQuizzes: [],
  lastActiveAt: null,
  streakDays: 0,
  bestStreak: 0,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export function ProgressProvider({ children, onAchievementUnlocked }: ProgressProviderProps) {
  const { isOnline, saveOfflineProgress, syncOfflineProgress } = useOfflineSupport();
  const didToastDailyGoalRef = useRef<string | null>(null);
  
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('education-for-democracy-progress');
    if (saved) {
      const parsedProgress = JSON.parse(saved);
      // Migrate old progress data to include new fields
      return {
        ...defaultProgress,
        ...parsedProgress,
        dailyPoints: parsedProgress.dailyPoints ?? 0,
        dailyGoal: parsedProgress.dailyGoal ?? 20,
        dailyDate: parsedProgress.dailyDate ?? null,
        unlockedAchievements: parsedProgress.unlockedAchievements || [],
        perfectQuizzes: parsedProgress.perfectQuizzes || [],
        lastActiveAt: parsedProgress.lastActiveAt ?? null,
        streakDays: parsedProgress.streakDays ?? 0,
        bestStreak: parsedProgress.bestStreak ?? 0,
      };
    }
    return defaultProgress;
  });

  // Sync with localStorage and handle offline storage
  useEffect(() => {
    // Always save to localStorage
    localStorage.setItem('education-for-democracy-progress', JSON.stringify(progress));
    
    // If offline, save to IndexedDB for later sync
    if (!isOnline) {
      saveOfflineProgress(progress);
    }
  }, [progress, isOnline, saveOfflineProgress]);

  // Try to sync when we come back online
  useEffect(() => {
    if (isOnline) {
      syncOfflineProgress();
    }
  }, [isOnline, syncOfflineProgress]);

  const addPoints = (points: number) => {
    setProgress(prev => {
      const nextDaily = applyDailyIncrement({ dailyPoints: prev.dailyPoints, dailyGoal: prev.dailyGoal, dailyDate: prev.dailyDate }, points);
      return {
        ...prev,
        totalPoints: prev.totalPoints + points,
        dailyPoints: nextDaily.dailyPoints,
        dailyDate: nextDaily.dailyDate,
        dailyGoal: nextDaily.dailyGoal,
      };
    });
  };

  const setDailyGoal = (goal: number) => {
    const next = Math.max(1, Math.min(200, Math.round(goal)));
    setProgress(prev => ({
      ...prev,
      dailyGoal: next,
      // keep same dailyDate and dailyPoints; not resetting progress on change
    }));
  };

  const markLessonComplete = async (lessonId: string) => {
    const now = Date.now();
    setProgress(prev => {
      const streak = updateStreak({ lastActiveAt: prev.lastActiveAt, streakDays: prev.streakDays, bestStreak: prev.bestStreak }, now);
      const nextDaily = applyDailyIncrement({ dailyPoints: prev.dailyPoints, dailyGoal: prev.dailyGoal, dailyDate: prev.dailyDate }, 5);
      return {
        ...prev,
        completedLessons: prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        lastLessonCompletionTime: now,
        lastActiveAt: streak.lastActiveAt,
        streakDays: streak.streakDays,
        bestStreak: streak.bestStreak,
        dailyPoints: nextDaily.dailyPoints,
        dailyDate: nextDaily.dailyDate,
        dailyGoal: nextDaily.dailyGoal,
        totalPoints: prev.totalPoints + 10,
      };
    });

    // Sync with API
    try {
      if (isOnline) {
        await progressAPI.markLessonComplete({
          lessonId,
          userId: progressAPI.getUserId(),
          completed: true
        });
        console.log('Lesson completion synced with API:', lessonId);
      }
    } catch (error) {
      console.error('Failed to sync lesson completion with API:', error);
      // Continue with local storage - offline support will handle sync later
    }
  };

  const recordQuizScore = async (quizId: string, score: number) => {
    const now = Date.now();
    setProgress(prev => {
      const streak = updateStreak({ lastActiveAt: prev.lastActiveAt, streakDays: prev.streakDays, bestStreak: prev.bestStreak }, now);
      const nextDaily = applyDailyIncrement({ dailyPoints: prev.dailyPoints, dailyGoal: prev.dailyGoal, dailyDate: prev.dailyDate }, 3);
      const newPerfectQuizzes = score === 100 && !prev.perfectQuizzes.includes(quizId)
        ? [...prev.perfectQuizzes, quizId]
        : prev.perfectQuizzes;
      
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: score
        },
        perfectQuizzes: newPerfectQuizzes,
        lastActiveAt: streak.lastActiveAt,
        streakDays: streak.streakDays,
        bestStreak: streak.bestStreak,
        dailyPoints: nextDaily.dailyPoints,
        dailyDate: nextDaily.dailyDate,
        dailyGoal: nextDaily.dailyGoal,
        totalPoints: prev.totalPoints + Math.round(score / 10),
      };
    });

    // Sync with API
    try {
      if (isOnline) {
        // Assuming a standard quiz has 10 questions and we calculate correctAnswers from score
        const totalQuestions = 10; // Default, should be passed as parameter in real implementation
        const correctAnswers = Math.round((score / 100) * totalQuestions);
        
        await progressAPI.recordQuizResult({
          quizId,
          userId: progressAPI.getUserId(),
          score,
          totalQuestions,
          correctAnswers
        });
        console.log('Quiz result synced with API:', { quizId, score });
      }
    } catch (error) {
      console.error('Failed to sync quiz result with API:', error);
      // Continue with local storage - offline support will handle sync later
    }
  };

  const markSectionComplete = (lessonId: string, sectionId: string) => {
    const now = Date.now();
    setProgress(prev => {
      const streak = updateStreak({ lastActiveAt: prev.lastActiveAt, streakDays: prev.streakDays, bestStreak: prev.bestStreak }, now);
      const nextDaily = applyDailyIncrement({ dailyPoints: prev.dailyPoints, dailyGoal: prev.dailyGoal, dailyDate: prev.dailyDate }, 2);
      const lessonSections = prev.completedSections[lessonId] || [];
      const newSections = lessonSections.includes(sectionId) 
        ? lessonSections 
        : [...lessonSections, sectionId];
      
      return {
        ...prev,
        completedSections: {
          ...prev.completedSections,
          [lessonId]: newSections
        },
        lastActiveAt: streak.lastActiveAt,
        streakDays: streak.streakDays,
        bestStreak: streak.bestStreak,
        dailyPoints: nextDaily.dailyPoints,
        dailyDate: nextDaily.dailyDate,
        dailyGoal: nextDaily.dailyGoal,
        totalPoints: prev.totalPoints + 2,
      };
    });
  };

  const isSectionComplete = (lessonId: string, sectionId: string) => {
    const lessonSections = progress.completedSections[lessonId] || [];
    return lessonSections.includes(sectionId);
  };

  const isLessonComplete = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const checkAchievementUnlocked = useCallback((achievement: Achievement, currentProgress: ProgressData): boolean => {
    const { requirement } = achievement;
    
    switch (requirement.type) {
      case 'lessons_completed':
        if (requirement.lessonId) {
          return currentProgress.completedLessons.includes(requirement.lessonId);
        }
        
        // Check for time-based dedication achievements
        if (achievement.id === 'early_bird' && currentProgress.lastLessonCompletionTime) {
          const completionDate = new Date(currentProgress.lastLessonCompletionTime);
          const hour = completionDate.getHours();
          return currentProgress.completedLessons.length >= requirement.value && hour >= 6 && hour < 11;
        }
        
        if (achievement.id === 'night_owl' && currentProgress.lastLessonCompletionTime) {
          const completionDate = new Date(currentProgress.lastLessonCompletionTime);
          const hour = completionDate.getHours();
          return currentProgress.completedLessons.length >= requirement.value && hour >= 18 && hour < 23;
        }
        
        return currentProgress.completedLessons.length >= requirement.value;
      
      case 'sections_completed':
        const totalSections = Object.values(currentProgress.completedSections)
          .reduce((sum, sections) => sum + sections.length, 0);
        return totalSections >= requirement.value;
      
      case 'quiz_score':
        return Object.values(currentProgress.quizScores).some(score => score >= requirement.value);
      
      case 'points_earned':
        return currentProgress.totalPoints >= requirement.value;
      case 'streak_days':
        return (currentProgress.streakDays || 0) >= requirement.value;
      
      case 'perfect_quizzes':
        return currentProgress.perfectQuizzes.length >= requirement.value;
      
      default:
        return false;
    }
  }, []);

  const checkForNewAchievements = useCallback((): Achievement[] => {
    const newAchievements: Achievement[] = [];
    
    // Ensure unlockedAchievements exists
    const unlockedAchievements = progress.unlockedAchievements || [];
    
    for (const achievement of achievements) {
      if (!unlockedAchievements.includes(achievement.id) && 
          checkAchievementUnlocked(achievement, progress)) {
        newAchievements.push(achievement);
      }
    }
    
    if (newAchievements.length > 0) {
      setProgress(prev => ({
        ...prev,
        unlockedAchievements: [...(prev.unlockedAchievements || []), ...newAchievements.map(a => a.id)],
        totalPoints: prev.totalPoints + newAchievements.reduce((sum, achievement) => sum + achievement.points, 0)
      }));
      
      // Notify about new achievements
      newAchievements.forEach(achievement => {
        if (onAchievementUnlocked) {
          onAchievementUnlocked(achievement);
        }
      });
    }
    
    return newAchievements;
  }, [progress, checkAchievementUnlocked, onAchievementUnlocked]);

  const getUnlockedAchievements = useCallback((): Achievement[] => {
    const unlockedAchievements = progress.unlockedAchievements || [];
    return achievements.filter(achievement => 
      unlockedAchievements.includes(achievement.id)
    );
  }, [progress.unlockedAchievements]);

  const getLockedAchievements = useCallback((): Achievement[] => {
    const unlockedAchievements = progress.unlockedAchievements || [];
    return achievements.filter(achievement => 
      !unlockedAchievements.includes(achievement.id)
    );
  }, [progress.unlockedAchievements]);

  const getTotalSectionsCompleted = useCallback((): number => {
    return Object.values(progress.completedSections)
      .reduce((sum, sections) => sum + sections.length, 0);
  }, [progress.completedSections]);

  // Check for achievements when progress changes
  useEffect(() => {
    checkForNewAchievements();
  }, [progress.completedLessons, progress.totalPoints, progress.quizScores, progress.perfectQuizzes, progress.lastLessonCompletionTime, checkForNewAchievements]);

  // Celebrate when daily goal is completed (once per day, persisted)
  useEffect(() => {
    const goal = progress.dailyGoal || 0;
    const pts = progress.dailyPoints || 0;
    const key = progress.dailyDate || null;
    // read persisted toast day
    const persisted = typeof localStorage !== 'undefined' ? localStorage.getItem('education-for-democracy-daily-goal-toast') : null;
    const alreadyToastedFor = didToastDailyGoalRef.current || persisted;
    const completed = goal > 0 && pts >= goal;
    // Fire once per date key
    if (completed && key && alreadyToastedFor !== key) {
      didToastDailyGoalRef.current = key;
      try {
        localStorage.setItem('education-for-democracy-daily-goal-toast', key);
      } catch {}
      toast({
        title: 'Daily goal reached! 🎯',
        description: `Great job hitting ${pts}/${goal} today. Keep the streak going!`,
      });
    }
    // Reset the guard if date changes back (e.g., midnight reset)
    if (key && alreadyToastedFor && alreadyToastedFor !== key) {
      didToastDailyGoalRef.current = null;
      try {
        localStorage.removeItem('education-for-democracy-daily-goal-toast');
      } catch {}
    }
  }, [progress.dailyPoints, progress.dailyGoal, progress.dailyDate]);

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      addPoints, 
      setDailyGoal,
      markLessonComplete, 
      markSectionComplete,
      isSectionComplete,
      isLessonComplete,
      recordQuizScore, 
      resetProgress,
      getUnlockedAchievements,
      getLockedAchievements,
      checkForNewAchievements,
      getTotalSectionsCompleted,
      onAchievementUnlocked
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}