import { useCallback, useState, useEffect, ReactNode, createContext, useContext } from 'react';
import type {
  Course,
  Module,
  Lesson,
  Assessment,
  LearningPath,
  LearningProfile,
  ContentProgress,
  AssessmentResult,
  CompletionStatus,
  ContentType,
  DifficultyLevel,
} from '../types/learning';

interface LearningState {
  courses: Course[];
  learningPaths: LearningPath[];
  currentCourse?: Course;
  currentModule?: Module;
  currentLesson?: Lesson;
  userProfile?: LearningProfile;
  loading: boolean;
  error: Error | null;
}

interface LearningContextValue extends LearningState {
  // Content Management
  loadCourse: (courseId: string) => Promise<Course>;
  loadModule: (moduleId: string) => Promise<Module>;
  loadLesson: (lessonId: string) => Promise<Lesson>;

  // Progress Tracking
  updateProgress: (
    contentId: string,
    status: CompletionStatus,
    data?: Partial<ContentProgress>
  ) => Promise<void>;
  submitAssessment: (
    assessmentId: string,
    answers: Record<string, string | string[]>
  ) => Promise<AssessmentResult>;

  // Learning Paths
  enrollInPath: (pathId: string) => Promise<void>;
  switchPath: (pathId: string) => Promise<void>;
  getNextContent: () => Promise<{ type: ContentType; id: string } | null>;

  // User Profile
  updatePreferences: (preferences: Partial<LearningProfile['preferences']>) => Promise<void>;

  // Analytics
  getRecommendations: () => Promise<Course[]>;
  getProgress: (courseId?: string) => Promise<ContentProgress[]>;
  getStatistics: () => Promise<LearningProfile['statistics']>;
}

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

const initialState: LearningState = {
  courses: [],
  learningPaths: [],
  loading: false,
  error: null,
};

interface LearningProviderProps {
  children: ReactNode;
  userId?: string;
}

export function LearningProvider({ children, userId }: LearningProviderProps) {
  const [error, setError] = useState<Error | null>(null);

  // Utility function for API calls with error handling
  const apiCall = useCallback(
    async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      try {
        const response = await fetch(`/api/learning/${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }

        return response.json();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        console.error('Learning Context Error:', err);
        throw err;
      }
    },
    []
  );

  // Content Management Methods
  const loadCourse = useCallback(
    async (courseId: string): Promise<Course> => {
      return apiCall<Course>(`courses/${courseId}`);
    },
    [apiCall]
  );

  const loadModule = useCallback(
    async (moduleId: string): Promise<Module> => {
      return apiCall<Module>(`modules/${moduleId}`);
    },
    [apiCall]
  );

  const loadLesson = useCallback(
    async (lessonId: string): Promise<Lesson> => {
      return apiCall<Lesson>(`lessons/${lessonId}`);
    },
    [apiCall]
  );

  // Progress Tracking Methods
  const updateProgress = useCallback(
    async (
      contentId: string,
      status: CompletionStatus,
      data?: Partial<ContentProgress>
    ): Promise<void> => {
      if (!userId) throw new Error('User must be authenticated');

      await apiCall('progress', {
        method: 'POST',
        body: JSON.stringify({
          contentId,
          status,
          ...data,
          userId,
        }),
      });
    },
    [apiCall, userId]
  );

  const submitAssessment = useCallback(
    async (
      assessmentId: string,
      answers: Record<string, string | string[]>
    ): Promise<AssessmentResult> => {
      if (!userId) throw new Error('User must be authenticated');

      const result = await apiCall<AssessmentResult>('assessment/submit', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId,
          answers,
          userId,
        }),
      });

      return result;
    },
    [apiCall, userId]
  );

  // Learning Path Methods
  const enrollInPath = useCallback(
    async (pathId: string): Promise<void> => {
      if (!userId) throw new Error('User must be authenticated');

      await apiCall('paths/enroll', {
        method: 'POST',
        body: JSON.stringify({
          pathId,
          userId,
        }),
      });
    },
    [apiCall, userId]
  );

  const switchPath = useCallback(
    async (pathId: string): Promise<void> => {
      if (!userId) throw new Error('User must be authenticated');

      await apiCall('paths/switch', {
        method: 'POST',
        body: JSON.stringify({
          pathId,
          userId,
        }),
      });
    },
    [apiCall, userId]
  );

  const getNextContent = useCallback(async (): Promise<{
    type: ContentType;
    id: string;
  } | null> => {
    if (!userId) throw new Error('User must be authenticated');

    return apiCall('content/next', {
      method: 'GET',
    });
  }, [apiCall, userId]);

  // User Profile Methods
  const updatePreferences = useCallback(
    async (preferences: Partial<LearningProfile['preferences']>): Promise<void> => {
      if (!userId) throw new Error('User must be authenticated');

      await apiCall('profile/preferences', {
        method: 'PATCH',
        body: JSON.stringify(preferences),
      });
    },
    [apiCall, userId]
  );

  // Analytics Methods
  const getRecommendations = useCallback(async (): Promise<Course[]> => {
    if (!userId) throw new Error('User must be authenticated');

    return apiCall('recommendations');
  }, [apiCall, userId]);

  const getProgress = useCallback(
    async (courseId?: string): Promise<ContentProgress[]> => {
      if (!userId) throw new Error('User must be authenticated');

      return apiCall('progress', {
        method: 'GET',
        ...(courseId ? { params: { courseId } } : {}),
      });
    },
    [apiCall, userId]
  );

  const getStatistics = useCallback(async (): Promise<LearningProfile['statistics']> => {
    if (!userId) throw new Error('User must be authenticated');

    return apiCall('statistics');
  }, [apiCall, userId]);

  const value: LearningContextValue = {
    ...initialState,
    error,
    loadCourse,
    loadModule,
    loadLesson,
    updateProgress,
    submitAssessment,
    enrollInPath,
    switchPath,
    getNextContent,
    updatePreferences,
    getRecommendations,
    getProgress,
    getStatistics,
  };

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

// Hook to access the entire learning context
export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

// Specialized hooks for specific learning state
export function useCurrentCourse() {
  const context = useLearning();
  return context.currentCourse;
}

export function useCurrentLesson() {
  const context = useLearning();
  return context.currentLesson;
}

export function useLearningProgress() {
  const context = useLearning();
  return {
    updateProgress: context.updateProgress,
    getProgress: context.getProgress,
    getStatistics: context.getStatistics,
  };
}

export function useLearningPath() {
  const context = useLearning();
  return {
    enrollInPath: context.enrollInPath,
    switchPath: context.switchPath,
    getNextContent: context.getNextContent,
  };
}

// Custom hooks for specific features
export function useAssessment() {
  const { submitAssessment } = useLearning();
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);

  const startAssessment = useCallback(async (assessmentId: string) => {
    try {
      // Load assessment details
      const response = await fetch(`/api/learning/assessment/${assessmentId}`);
      if (!response.ok) {
        throw new Error(`Failed to load assessment: ${response.statusText}`);
      }
      const assessment = await response.json();
      setCurrentAssessment(assessment);
    } catch (error) {
      console.error('Assessment loading error:', error);
      throw error;
    }
  }, []);

  return {
    currentAssessment,
    startAssessment,
    submitAssessment,
  };
}

export function useRecommendations() {
  const { getRecommendations } = useLearning();
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const courses = await getRecommendations();
        setRecommendations(courses);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [getRecommendations]);

  return { recommendations, loading };
}
