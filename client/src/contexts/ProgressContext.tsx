import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProgressData {
  totalPoints: number;
  completedLessons: string[];
  completedSections: Record<string, string[]>; // lessonId -> sectionIds[]
  quizScores: Record<string, number>;
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
}

const defaultProgress: ProgressData = {
  totalPoints: 0,
  completedLessons: [],
  completedSections: {},
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