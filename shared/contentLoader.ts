import { promises as fs } from 'fs';
import path from 'path';
import { ContentManifestSchema, LessonContentSchema, QuizContentSchema, type ContentManifest, type LessonContent, type QuizContent } from './contentSchemas';

// Simple in-memory caches. In production with multiple processes you'd swap for a shared cache.
const manifestCache: { value?: ContentManifest; mtimeMs?: number } = {};
const lessonCache = new Map<string, LessonContent>();
const quizCache = new Map<string, QuizContent>();

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');

async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function loadManifest(force = false): Promise<ContentManifest> {
  const manifestPath = path.join(CONTENT_ROOT, 'manifest.json');
  const stat = await fs.stat(manifestPath);
  if (!force && manifestCache.value && manifestCache.mtimeMs === stat.mtimeMs) {
    return manifestCache.value;
  }
  const json = await readJSON<any>(manifestPath);
  const parsed = ContentManifestSchema.parse(json);
  manifestCache.value = parsed;
  manifestCache.mtimeMs = stat.mtimeMs;
  return parsed;
}

export async function listLessons(): Promise<Pick<LessonContent, 'id' | 'title' | 'difficulty' | 'estimatedTime' | 'icon'>[]> {
  const manifest = await loadManifest();
  return manifest.lessons.map(l => ({ id: l.id, title: l.title, difficulty: l.difficulty, estimatedTime: l.estimatedTime, icon: l.icon }));
}

export async function listQuizzes(): Promise<Pick<QuizContent, 'id' | 'title' | 'category'>[]> {
  const manifest = await loadManifest();
  return manifest.quizzes.map(q => ({ id: q.id, title: q.title, category: q.category }));
}

export async function loadLesson(id: string, force = false): Promise<LessonContent> {
  if (!force && lessonCache.has(id)) return lessonCache.get(id)!;
  const manifest = await loadManifest();
  const entry = manifest.lessons.find(l => l.id === id);
  if (!entry) throw new Error(`Lesson not found: ${id}`);
  const lessonPath = path.join(CONTENT_ROOT, entry.file);
  const json = await readJSON<any>(lessonPath);
  const parsed = LessonContentSchema.parse(json);
  lessonCache.set(id, parsed);
  return parsed;
}

export async function loadQuiz(id: string, force = false): Promise<QuizContent> {
  if (!force && quizCache.has(id)) return quizCache.get(id)!;
  const manifest = await loadManifest();
  const entry = manifest.quizzes.find(q => q.id === id);
  if (!entry) throw new Error(`Quiz not found: ${id}`);
  const quizPath = path.join(CONTENT_ROOT, entry.file);
  const json = await readJSON<any>(quizPath);
  const parsed = QuizContentSchema.parse(json);
  quizCache.set(id, parsed);
  return parsed;
}

export function clearContentCache() {
  manifestCache.value = undefined;
  manifestCache.mtimeMs = undefined;
  lessonCache.clear();
  quizCache.clear();
}

// Utility to preload all content (e.g., warmup during server start if desired)
export async function preloadAllContent(): Promise<{ lessons: number; quizzes: number }> {
  const manifest = await loadManifest();
  await Promise.all(manifest.lessons.map(l => loadLesson(l.id)));
  await Promise.all(manifest.quizzes.map(q => loadQuiz(q.id)));
  return { lessons: manifest.lessons.length, quizzes: manifest.quizzes.length };
}
