import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { LessonContentSchema, QuizContentSchema } from '../shared/contentSchemas';

function collect(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collect(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

function load(file: string) {
  return JSON.parse(readFileSync(file, 'utf-8'));
}

const lessonsDir = path.join(__dirname, '..', 'content', 'lessons');
const quizzesDir = path.join(__dirname, '..', 'content', 'quizzes');

const lessonFiles = collect(lessonsDir);
const quizFiles = collect(quizzesDir);

describe('Content presence', () => {
  it('has lessons', () => expect(lessonFiles.length).toBeGreaterThan(0));
  it('has quizzes', () => expect(quizFiles.length).toBeGreaterThan(0));
});

describe('Lessons schema validity', () => {
  for (const f of lessonFiles) {
    it(path.basename(f), () => {
      const data = load(f);
      const parsed = LessonContentSchema.safeParse(data);
      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error('Lesson schema errors', f, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
    });
  }
});

describe('Quizzes schema validity', () => {
  for (const f of quizFiles) {
    it(path.basename(f), () => {
      const data = load(f);
      const parsed = QuizContentSchema.safeParse(data);
      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error('Quiz schema errors', f, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
    });
  }
});
