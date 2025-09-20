import { lessonContents } from '@shared/lessonContent';
import { quizContents } from '@shared/quizContent';

export type SearchKind = 'lesson' | 'quiz';

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
};

export type SearchHit = SearchDoc & { score: number };

function normalize(s: string) {
  return s.toLowerCase();
}

function scoreMatch(query: string, doc: SearchDoc): number {
  const q = normalize(query);
  const title = normalize(doc.title);
  const desc = normalize(doc.description);
  if (!q) return 0;
  let score = 0;
  if (title.includes(q)) score += 10;
  if (desc.includes(q)) score += 4;
  // prefix boosts
  if (title.startsWith(q)) score += 5;
  if (desc.startsWith(q)) score += 2;
  return score;
}

export function buildIndex(): SearchDoc[] {
  const lessonDocs = Object.values(lessonContents).map((l) => ({
    id: l.id,
    kind: 'lesson' as const,
    title: l.title,
    description: l.description,
  }));
  const quizDocs = Object.values(quizContents).map((q) => ({
    id: q.id,
    kind: 'quiz' as const,
    title: q.title,
    description: q.description,
  }));
  return [...lessonDocs, ...quizDocs];
}

export function search(query: string, limit = 8): SearchHit[] {
  const docs = buildIndex();
  const hits = docs
    .map((doc) => ({ ...doc, score: scoreMatch(query, doc) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return hits;
}
