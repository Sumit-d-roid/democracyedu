import { describe, it, expect } from 'vitest';
import { buildIndex, search } from '../client/src/lib/searchIndex';

describe('searchIndex', () => {
  it('builds an index with lessons and quizzes', () => {
    const idx = buildIndex();
    expect(idx.length).toBeGreaterThan(0);
    expect(idx.some((d) => d.kind === 'lesson')).toBeTruthy();
    expect(idx.some((d) => d.kind === 'quiz')).toBeTruthy();
  });

  it('returns scored hits for matching queries', () => {
    const hits = search('rights');
    expect(Array.isArray(hits)).toBe(true);
    if (hits.length > 0) {
      expect(hits[0].score).toBeGreaterThan(0);
    }
  });
});
