// Content Types
export type ContentType = 'text' | 'video' | 'audio' | 'quiz' | 'exercise' | 'interactive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type CompletionStatus = 'not-started' | 'in-progress' | 'completed';

// Base interfaces for all content types
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  difficulty: DifficultyLevel;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  language: string;
  estimatedDuration: number; // in minutes
}

export interface Media {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  title: string;
  description?: string;
}

// Prerequisites and dependencies
export interface Prerequisite {
  id: string;
  type: 'course' | 'module' | 'lesson';
  requiredScore?: number; // Minimum score needed if applicable
  requiredStatus?: CompletionStatus;
}

// Assessment Types
export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'matching' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  showFeedback?: boolean;
}

// Content Structure Types
export interface Lesson extends BaseContent {
  content: string;
  media?: Media[];
  prerequisites?: Prerequisite[];
  assessment?: Assessment;
  order: number;
  moduleId: string;
}

export interface Module extends BaseContent {
  lessons: Lesson[];
  prerequisites?: Prerequisite[];
  assessment?: Assessment;
  order: number;
  courseId: string;
}

export interface Course extends BaseContent {
  modules: Module[];
  prerequisites?: Prerequisite[];
  finalAssessment?: Assessment;
  certification?: {
    title: string;
    description: string;
    validityPeriod?: number; // in months
  };
  instructors: string[];
}

// Learning Path Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: {
    courseId: string;
    order: number;
    required: boolean;
  }[];
  recommendedDuration: number; // in weeks
  targetAudience: string[];
  outcomes: string[];
}

// Progress Tracking Types
export interface ContentProgress {
  contentId: string;
  contentType: 'course' | 'module' | 'lesson';
  status: CompletionStatus;
  score?: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  attempts?: number;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  answers: {
    questionId: string;
    answer: string | string[];
    correct: boolean;
    points: number;
  }[];
  feedback?: string;
  completedAt: Date;
  timeSpent: number; // in minutes
  attempt: number;
}

// User Learning Profile
export interface LearningProfile {
  userId: string;
  preferences: {
    contentTypes: ContentType[];
    difficulty: DifficultyLevel;
    dailyGoal: number; // in minutes
    language: string;
    notifications: boolean;
  };
  progress: {
    courses: ContentProgress[];
    modules: ContentProgress[];
    lessons: ContentProgress[];
  };
  assessments: AssessmentResult[];
  achievements: string[];
  certifications: {
    id: string;
    courseId: string;
    earnedAt: Date;
    expiresAt?: Date;
  }[];
  statistics: {
    totalTimeSpent: number;
    averageScore: number;
    completedItems: number;
    streakDays: number;
  };
}
