import { z } from 'zod';

// Section schema for lessons
export const LessonSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(1)
});

// Complete lesson schema
export const LessonContentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string().min(1),
  sections: z.array(LessonSectionSchema).min(1),
  summary: z.array(z.string().min(1)).min(1),
  // Optional semantic content version (increments on meaning-level changes)
  version: z.number().int().positive().optional(),
  audiences: z.array(z.enum(['school','college'])).optional(),
  learningObjectives: z.array(z.string().min(1)).optional(),
  tags: z.array(z.string().min(1)).optional(),
  relatedLessons: z.array(z.string().min(1)).optional(),
  // Lightweight graph links (can include lessons, quizzes, future enrichment ids)
  relatedIds: z.array(z.string().min(1)).optional(),
  sourceArticles: z.array(z.object({ ref: z.string().min(1), note: z.string().optional() })).optional(),
  complexityIndex: z.number().min(0).max(1).optional()
});

// Quiz question schema
export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  type: z.enum(['multiple-choice', 'true-false', 'multiple-select']),
  options: z.array(z.string().min(1)).min(2),
  // correctAnswer: number for single index or array of numbers for multiple-select
  correctAnswer: z.union([z.number().int().nonnegative(), z.array(z.number().int().nonnegative()).min(1)]),
  explanation: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.number().int().positive(),
  hint: z.string().optional()
});

export const QuizContentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  questions: z.array(QuizQuestionSchema).min(1),
  version: z.number().int().positive().optional(),
  audiences: z.array(z.enum(['school','college'])).optional(),
  relatedArticles: z.array(z.string().min(1)).optional(),
  relatedIds: z.array(z.string().min(1)).optional(),
  cognitiveLevel: z.enum(['recall','comprehension','application','analysis','evaluation']).optional(),
  targetObjectives: z.array(z.string().min(1)).optional(),
  sourceArticles: z.array(z.object({ ref: z.string().min(1), note: z.string().optional() })).optional()
});

export const ManifestLessonEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  file: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string(),
  icon: z.string(),
  audiences: z.array(z.enum(['school','college'])).optional()
});

export const ManifestQuizEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  file: z.string(),
  category: z.string(),
  audiences: z.array(z.enum(['school','college'])).optional()
});

export const ContentManifestSchema = z.object({
  version: z.number().int().positive(),
  generatedAt: z.string().optional(),
  lessons: z.array(ManifestLessonEntrySchema),
  quizzes: z.array(ManifestQuizEntrySchema)
});

export type LessonContent = z.infer<typeof LessonContentSchema>;
export type QuizContent = z.infer<typeof QuizContentSchema>;
export type ContentManifest = z.infer<typeof ContentManifestSchema>;
