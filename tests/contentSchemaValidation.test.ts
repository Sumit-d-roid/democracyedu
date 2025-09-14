import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { LessonContentSchema, QuizContentSchema } from '../shared/contentSchemas';

// Utility to recursively gather JSON files in a directory
function collectJsonFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...collectJsonFiles(full));
    else if (entry.endsWith('.json')) files.push(full);
  }
  return files;
}

function loadJson(file: string) {
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch (e) {
    throw new Error(`Failed to parse JSON (${file}): ${(e as Error).message}`);
  }
}

const lessonsDir = path.join(__dirname, '..', 'content', 'lessons');
const quizzesDir = path.join(__dirname, '..', 'content', 'quizzes');

// Defensive: if directory structure changes, test should surface clear guidance.
function safeCollect(dir: string): string[] {
  try { return collectJsonFiles(dir); } catch { return []; }
}

const lessonFiles = safeCollect(lessonsDir);
const quizFiles = safeCollect(quizzesDir);

// Basic invariant expectations to guard accidental deletion.
describe('Content presence sanity', () => {
  it('has at least one lesson JSON', () => {
    expect(lessonFiles.length).toBeGreaterThan(0);
  });
  it('has at least one quiz JSON', () => {
    expect(quizFiles.length).toBeGreaterThan(0);
  });
});

describe('Lesson JSON schema validity', () => {
  for (const file of lessonFiles) {
    it(path.basename(file), () => {
      const data = loadJson(file);
      const parsed = LessonContentSchema.safeParse(data);
      if (!parsed.success) {
        // Provide formatted error details for quick debugging
        // eslint-disable-next-line no-console
        console.error(`Schema errors in ${file}`, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
    });
  }
});

describe('Quiz JSON schema validity', () => {
  for (const file of quizFiles) {
    it(path.basename(file), () => {
      const data = loadJson(file);
      const parsed = QuizContentSchema.safeParse(data);
      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error(`Schema errors in ${file}`, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
    });
  }
});
