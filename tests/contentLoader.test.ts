import { describe, it, expect, beforeAll } from 'vitest';
import {
  loadManifest,
  listLessons,
  listQuizzes,
  loadLesson,
  loadQuiz,
  preloadAllContent,
  clearContentCache,
} from '../shared/contentLoader';

describe('content loader', () => {
  beforeAll(() => {
    clearContentCache();
  });

  it('loads the manifest', async () => {
    const manifest = await loadManifest();
    expect(manifest.version).toBeGreaterThan(0);
    expect(manifest.lessons.length).toBeGreaterThan(0);
  });

  it('lists lessons with summary fields', async () => {
    const lessons = await listLessons();
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons[0]).toHaveProperty('id');
    expect(lessons[0]).toHaveProperty('difficulty');
  });

  it('lists quizzes with summary fields', async () => {
    const quizzes = await listQuizzes();
    expect(Array.isArray(quizzes)).toBe(true);
    expect(quizzes[0]).toHaveProperty('id');
  });

  it('loads an individual lesson and validates structure', async () => {
    const lesson = await loadLesson('fundamental-rights');
    expect(lesson.sections.length).toBeGreaterThan(0);
    expect(lesson.summary.length).toBeGreaterThan(0);
  });

  it('loads an individual quiz and validates structure', async () => {
    const quiz = await loadQuiz('fundamental-rights');
    expect(quiz.questions.length).toBeGreaterThan(0);
  });

  it('can preload all content', async () => {
    const preload = await preloadAllContent();
    expect(preload.lessons).toBeGreaterThan(0);
    expect(preload.quizzes).toBeGreaterThan(0);
  });
});
