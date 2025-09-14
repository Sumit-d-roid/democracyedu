import { createContext, useContext, useCallback, ReactNode } from 'react';
import { createSelectableContext } from '../hooks/use-context-selector';
import { useError } from './ErrorContext';
import { useAuth } from './AuthContext';
import { useAppState } from './AppStateContext';
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
  DifficultyLevel
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
  updateProgress: (contentId: string, status: CompletionStatus, data?: Partial<ContentProgress>) => Promise<void>;
  submitAssessment: (assessmentId: string, answers: Record<string, string | string[]>) => Promise<AssessmentResult>;
  
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

const { Provider, useContextSelector, useEntireContext } = createSelectableContext<LearningContextValue>('Learning');

const initialState: LearningState = {
  courses: [],
  learningPaths: [],
  loading: false,
  error: null,
};

export function LearningProvider({ children }: { children: ReactNode }) {
  const { addError } = useError();
  const { user } = useAuth();
  const { addNotification } = useAppState();

  // Utility function for API calls with error handling
  const apiCall = useCallback(async <T,>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
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
      addError('LearningContext', err);
      throw err;
    }
  }, [addError]);

  // Content Management Methods
  const loadCourse = useCallback(async (courseId: string): Promise<Course> => {
    return apiCall<Course>(`courses/${courseId}`);
  }, [apiCall]);

  const loadModule = useCallback(async (moduleId: string): Promise<Module> => {
    return apiCall<Module>(`modules/${moduleId}`);
  }, [apiCall]);

  const loadLesson = useCallback(async (lessonId: string): Promise<Lesson> => {
    return apiCall<Lesson>(`lessons/${lessonId}`);
  }, [apiCall]);

  // Progress Tracking Methods
  const updateProgress = useCallback(async (
    contentId: string,
    status: CompletionStatus,
    data?: Partial<ContentProgress>
  ): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    await apiCall('progress', {
      method: 'POST',
      body: JSON.stringify({
        contentId,
        status,
        ...data,
        userId: user.id,
      }),
    });

    addNotification('Progress updated', 'success');
  }, [apiCall, user, addNotification]);

  const submitAssessment = useCallback(async (
    assessmentId: string,
    answers: Record<string, string | string[]>
  ): Promise<AssessmentResult> => {
    if (!user) throw new Error('User must be authenticated');

    const result = await apiCall<AssessmentResult>('assessment/submit', {
      method: 'POST',
      body: JSON.stringify({
        assessmentId,
        answers,
        userId: user.id,
      }),
    });

    const message = result.score >= 70 
      ? '🎉 Great job on the assessment!' 
      : 'Keep practicing, you\'ll get there!';
    addNotification(message, result.score >= 70 ? 'success' : 'info');

    return result;
  }, [apiCall, user, addNotification]);

  // Learning Path Methods
  const enrollInPath = useCallback(async (pathId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    await apiCall('paths/enroll', {
      method: 'POST',
      body: JSON.stringify({
        pathId,
        userId: user.id,
      }),
    });

    addNotification('Successfully enrolled in learning path', 'success');
  }, [apiCall, user, addNotification]);

  const switchPath = useCallback(async (pathId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    await apiCall('paths/switch', {
      method: 'POST',
      body: JSON.stringify({
        pathId,
        userId: user.id,
      }),
    });

    addNotification('Learning path updated', 'success');
  }, [apiCall, user, addNotification]);

  const getNextContent = useCallback(async (): Promise<{ type: ContentType; id: string } | null> => {
    if (!user) throw new Error('User must be authenticated');

    return apiCall('content/next', {
      method: 'GET',
    });
  }, [apiCall, user]);

  // User Profile Methods
  const updatePreferences = useCallback(async (
    preferences: Partial<LearningProfile['preferences']>
  ): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    await apiCall('profile/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });

    addNotification('Learning preferences updated', 'success');
  }, [apiCall, user, addNotification]);

  // Analytics Methods
  const getRecommendations = useCallback(async (): Promise<Course[]> => {
    if (!user) throw new Error('User must be authenticated');

    return apiCall('recommendations');
  }, [apiCall, user]);

  const getProgress = useCallback(async (courseId?: string): Promise<ContentProgress[]> => {
    if (!user) throw new Error('User must be authenticated');

    return apiCall('progress', {
      method: 'GET',
      ...(courseId ? { params: { courseId } } : {}),
    });
  }, [apiCall, user]);

  const getStatistics = useCallback(async (): Promise<LearningProfile['statistics']> => {
    if (!user) throw new Error('User must be authenticated');

    return apiCall('statistics');
  }, [apiCall, user]);

  const value: LearningContextValue = {
    ...initialState,
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

  return <Provider value={value}>{children}</Provider>;
}

// Hook to access the entire learning context
export function useLearning() {
  return useEntireContext();
}

// Specialized hooks for specific learning state
export function useCurrentCourse() {
  return useContextSelector(state => state.currentCourse);
}

export function useCurrentLesson() {
  return useContextSelector(state => state.currentLesson);
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
    // Load assessment details
    const assessment = await apiCall<Assessment>(`assessment/${assessmentId}`);
    setCurrentAssessment(assessment);
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