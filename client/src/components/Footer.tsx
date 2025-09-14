import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t bg-background" role="contentinfo">
      <div className="container px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-semibold mb-2">SambhidanX</h3>
          <p className="text-muted-foreground leading-relaxed max-w-xs">
            {t('footer.tagline') || 'Making constitutional literacy accessible and engaging.'}
          </p>
        </div>
        <nav className="grid gap-1" aria-label={t('footer.navigation') || 'Footer navigation'}>
          <Link href="/lessons" className="hover:underline w-fit">
            {t('nav.lessons')}
          </Link>
          <Link href="/quiz" className="hover:underline w-fit">
            {t('nav.quiz')}
          </Link>
          <Link href="/achievements" className="hover:underline w-fit">
            {t('nav.achievements')}
          </Link>
          <Link href="/progress" className="hover:underline w-fit">
            {t('nav.progress')}
          </Link>
          <Link href="/glossary" className="hover:underline w-fit">
            {t('nav.glossary')}
          </Link>
        </nav>
        <div className="space-y-2">
          <p className="text-muted-foreground">&copy; {year} SambhidanX</p>
          <p className="text-muted-foreground">{t('footer.rights') || 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
