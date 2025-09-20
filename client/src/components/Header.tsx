// ...existing code...
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Globe, Sun, Moon, Search, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useSearch } from '@/contexts/SearchContext';
import { usePwa } from '@/hooks/use-pwa';


export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { progress } = useProgress();
  const [location] = useLocation();
  const { open: openSearch } = useSearch();
  const { canInstall, promptInstall } = usePwa();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: '/', key: 'nav.home' },
    { path: '/lessons', key: 'nav.lessons' },
    { path: '/quiz', key: 'nav.quiz' },
    { path: '/achievements', key: 'nav.achievements' },
    { path: '/progress', key: 'nav.progress' },
    { path: '/glossary', key: 'nav.glossary' },
  ];

  return (
    <>
      {/* Skip navigation link for keyboard users */}
      <a href="#main" className="skip-link">{t('general.skip-to-content') || 'Skip to content'}</a>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t('nav.home')}>
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <img src="/images/sambhidanx_icon.svg" alt="SambhidanX" className="h-7 w-7" />
            </div>
            <span className="font-bold text-lg">SambhidanX</span>
          </Link>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" aria-label={t('general.primary-navigation') || 'Primary navigation'}>
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    size="sm"
                    data-testid={`nav-${item.key.split('.')[1]}`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    className="transition-base"
                  >
                    {t(item.key)}
                  </Button>
                </Link>
              ))}
            </nav>

          {/* Points and Language Toggle */}
          <div className="flex items-center space-x-3">
            {canInstall && (
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex items-center gap-2"
                onClick={() => {
                  promptInstall();
                }}
                aria-label="Install app"
              >
                <Download className="h-4 w-4" />
                <span className="hidden md:inline">Install</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center gap-2"
              onClick={openSearch}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
              <kbd className="ml-1 hidden lg:inline rounded border bg-muted px-1.5 py-0.5 text-[10px] leading-none">/
              </kbd>
            </Button>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border hover-elevate transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
              aria-label={t('general.theme.toggle') || 'Toggle theme'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Badge variant="secondary" className="hidden sm:inline-flex items-center gap-1 transition-base" data-testid="points-badge" aria-label={`${t('progress.points')}: ${progress.totalPoints}`}>
              <span className="text-xs" aria-hidden>🏆</span>
              {progress.totalPoints}
            </Badge>
            
            <Button
              variant="secondary"
              size="default"
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              className="hover-elevate flex items-center gap-2 transition-base font-medium px-4 shadow-sm"
              aria-label={t('general.language.toggle')}
            >
              <Globe className="h-5 w-5" aria-hidden />
              <span>{t('general.language.toggle')}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-base"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label={isMenuOpen ? t('general.close-menu') || 'Close menu' : t('general.open-menu') || 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-b bg-background md:hidden" id="mobile-nav">
            <nav className="container flex flex-col space-y-2 px-4 py-4" aria-label={t('general.mobile-navigation') || 'Mobile navigation'}>
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    className="w-full justify-start transition-base"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`mobile-nav-${item.key.split('.')[1]}`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {t(item.key)}
                  </Button>
                </Link>
              ))}
              <div className="pt-2 border-t">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit transition-base">
                  <span className="text-xs" aria-hidden>🏆</span>
                  {t('progress.points')}: {progress.totalPoints}
                </Badge>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}