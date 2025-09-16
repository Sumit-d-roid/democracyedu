import { locales } from './locales';

export type SupportedLanguage = keyof typeof locales; // 'en' | 'ne'

export interface TranslatorOptions {
  fallback?: SupportedLanguage;
}

type LocaleRecord = (typeof locales)[SupportedLanguage];
type TranslationKey = keyof typeof locales.en & string; // keys shared across locales

export async function createTranslator(lang: SupportedLanguage, opts: TranslatorOptions = {}) {
  const fallbackLang = opts.fallback || 'en';
  const primary = locales[lang];
  const fallback = lang === fallbackLang ? primary : locales[fallbackLang];
  return (key: string) => {
    // If key is a known translation key, return value; else return key itself.
    if ((primary as Record<string, string>)[key] !== undefined) {
      return (primary as Record<string, string>)[key];
    }
    if ((fallback as Record<string, string>)[key] !== undefined) {
      return (fallback as Record<string, string>)[key];
    }
    return key;
  };
}

export function clearI18nCache() {
  /* no dynamic cache used */
}
