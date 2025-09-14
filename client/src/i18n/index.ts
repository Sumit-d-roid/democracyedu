export type SupportedLanguage = 'en' | 'ne';

let cache: Record<SupportedLanguage, Record<string, string> | null> = { en: null, ne: null };

async function loadLanguage(lang: SupportedLanguage): Promise<Record<string, string>> {
  if (cache[lang]) return cache[lang]!;
  // Use dynamic import so bundlers can code-split
  const data = await import(/* @vite-ignore */ `./${lang}/ui.json`);
  cache[lang] = data.default as Record<string, string>;
  return cache[lang]!;
}

export interface TranslatorOptions { fallback?: SupportedLanguage; }

export async function createTranslator(lang: SupportedLanguage, opts: TranslatorOptions = {}) {
  const primary = await loadLanguage(lang);
  const fallbackLang = opts.fallback || 'en';
  const fallback = lang === fallbackLang ? primary : await loadLanguage(fallbackLang);
  return function t(key: string): string {
    return primary[key] ?? fallback[key] ?? key;
  };
}

export function clearI18nCache() { cache = { en: null, ne: null }; }
