import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProgressData {
  totalPoints: number;
  completedLessons: string[];
  quizScores: Record<string, number>;
}

interface ProgressContextType {
  progress: ProgressData;
  addPoints: (points: number) => void;
  markLessonComplete: (lessonId: string) => void;
  recordQuizScore: (quizId: string, score: number) => void;
  resetProgress: () => void;
}

const defaultProgress: ProgressData = {
  totalPoints: 0,
  completedLessons: [],
  quizScores: {},
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('democracyedu-progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('democracyedu-progress', JSON.stringify(progress));
  }, [progress]);

  const addPoints = (points: number) => {
    setProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  const markLessonComplete = (lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId]
    }));
  };

  const recordQuizScore = (quizId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: score
      }
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      addPoints, 
      markLessonComplete, 
      recordQuizScore, 
      resetProgress 
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