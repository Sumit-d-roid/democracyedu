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
  // Progressive learning continuum (optional during migration, 1=basic,10=advanced)
  level: z.number().int().min(1).max(10).optional(),
  sections: z.array(LessonSectionSchema).min(1),
  summary: z.array(z.string().min(1)).min(1),
  // Traceability to constitutional articles / parts
  sourceRefs: z.array(z.object({ article: z.string().min(1), part: z.string().optional(), note: z.string().optional() })).optional()
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
  level: z.number().int().min(1).max(10).optional(),
  sourceRefs: z.array(z.object({ article: z.string().min(1), part: z.string().optional(), note: z.string().optional() })).optional()
});

export const ManifestLessonEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  file: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string(),
  icon: z.string(),
  level: z.number().int().min(1).max(10).optional()
});

export const ManifestQuizEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  file: z.string(),
  category: z.string()
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
