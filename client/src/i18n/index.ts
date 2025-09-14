import en from './en/ui.json';
import ne from './ne/ui.json';

export type SupportedLanguage = 'en' | 'ne';

// Preloaded maps (small footprint, ensures production reliability)
const maps: Record<SupportedLanguage, Record<string, string>> = { en, ne } as const;

export interface TranslatorOptions { fallback?: SupportedLanguage; }

export async function createTranslator(lang: SupportedLanguage, opts: TranslatorOptions = {}) {
  const fallbackLang = opts.fallback || 'en';
  const primary = maps[lang];
  const fallback = lang === fallbackLang ? primary : maps[fallbackLang];
  return (key: string) => primary[key] ?? fallback[key] ?? key;
}

// Keeping API parity if something calls it; now it's a no-op.
export function clearI18nCache() { /* no dynamic cache anymore */ }
