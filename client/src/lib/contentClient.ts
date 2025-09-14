// Browser-side content client fetching pre-built JSON files served statically
export interface LessonListItem {
  id: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  icon: string;
  description?: string;
}

export interface QuizListItem {
  id: string;
  title: string;
  category: string;
}

const base = '';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

let manifestCache: any | null = null;
async function loadManifest() {
  if (manifestCache) return manifestCache;
  manifestCache = await fetchJSON<any>(`${base}/content/manifest.json`);
  return manifestCache;
}

export async function listLessonsBrowser(): Promise<LessonListItem[]> {
  const manifest = await loadManifest();
  return manifest.lessons;
}

export async function listQuizzesBrowser(): Promise<QuizListItem[]> {
  const manifest = await loadManifest();
  return manifest.quizzes;
}

export async function loadLessonBrowser(id: string): Promise<any> {
  const manifest = await loadManifest();
  const entry = manifest.lessons.find((l: any) => l.id === id);
  if (!entry) throw new Error('Lesson not found');
  return fetchJSON<any>(`${base}/content/${entry.file}`);
}

export async function loadQuizBrowser(id: string): Promise<any> {
  const manifest = await loadManifest();
  const entry = manifest.quizzes.find((q: any) => q.id === id);
  if (!entry) throw new Error('Quiz not found');
  return fetchJSON<any>(`${base}/content/${entry.file}`);
}

export function clearContentBrowserCache() { manifestCache = null; }