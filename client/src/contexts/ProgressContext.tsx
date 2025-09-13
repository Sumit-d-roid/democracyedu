import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { achievements, Achievement } from '@shared/achievements';

interface ProgressData {
  totalPoints: number;
  completedLessons: string[];
  completedSections: Record<string, string[]>; // lessonId -> sectionIds[]
  quizScores: Record<string, number>;
  unlockedAchievements: string[];
  perfectQuizzes: string[]; // quizIds with 100% score
  lastLessonCompletionTime?: number; // timestamp for dedication achievements
}

interface ProgressContextType {
  progress: ProgressData;
  addPoints: (points: number) => void;
  markLessonComplete: (lessonId: string) => void;
  markSectionComplete: (lessonId: string, sectionId: string) => void;
  isSectionComplete: (lessonId: string, sectionId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  recordQuizScore: (quizId: string, score: number) => void;
  resetProgress: () => void;
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  checkForNewAchievements: () => Achievement[];
  getTotalSectionsCompleted: () => number;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const defaultProgress: ProgressData = {
  totalPoints: 0,
  completedLessons: [],
  completedSections: {},
  quizScores: {},
  unlockedAchievements: [],
  perfectQuizzes: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export function ProgressProvider({ children, onAchievementUnlocked }: ProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressData>(() => {
  const saved = localStorage.getItem('education-for-democracy-progress');
    if (saved) {
      const parsedProgress = JSON.parse(saved);
      // Migrate old progress data to include new fields
      return {
        ...defaultProgress,
        ...parsedProgress,
        unlockedAchievements: parsedProgress.unlockedAchievements || [],
        perfectQuizzes: parsedProgress.perfectQuizzes || []
      };
    }
    return defaultProgress;
  });

  useEffect(() => {
  localStorage.setItem('education-for-democracy-progress', JSON.stringify(progress));
  }, [progress]);

  const addPoints = (points: number) => {
    setProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  const markLessonComplete = (lessonId: string) => {
    const now = Date.now();
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId],
      lastLessonCompletionTime: now
    }));
  };

  const recordQuizScore = (quizId: string, score: number) => {
    setProgress(prev => {
      const newPerfectQuizzes = score === 100 && !prev.perfectQuizzes.includes(quizId)
        ? [...prev.perfectQuizzes, quizId]
        : prev.perfectQuizzes;
      
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: score
        },
        perfectQuizzes: newPerfectQuizzes
      };
    });
  };

  const markSectionComplete = (lessonId: string, sectionId: string) => {
    setProgress(prev => {
      const lessonSections = prev.completedSections[lessonId] || [];
      const newSections = lessonSections.includes(sectionId) 
        ? lessonSections 
        : [...lessonSections, sectionId];
      
      return {
        ...prev,
        completedSections: {
          ...prev.completedSections,
          [lessonId]: newSections
        }
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

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      addPoints, 
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