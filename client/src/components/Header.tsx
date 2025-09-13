// ...existing code...
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';

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

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: '/', key: 'nav.home' },
    { path: '/lessons', key: 'nav.lessons' },
    { path: '/quiz', key: 'nav.quiz' },
    { path: '/achievements', key: 'nav.achievements' },
    { path: '/progress', key: 'nav.progress' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">DE</span>
          </div>
          <span className="font-bold text-lg">Education for Democracy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                size="sm"
                data-testid={`nav-${item.key.split('.')[1]}`}
              >
                {t(item.key)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Points and Language Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded border"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌞' : '🌙'}
          </button>
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1" data-testid="points-badge">
            <span className="text-xs">🏆</span>
            {progress.totalPoints}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            data-testid="button-language-toggle"
            className="hover-elevate flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t('general.language.toggle')}</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-b bg-background md:hidden">
          <nav className="container flex flex-col space-y-2 px-4 py-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.key.split('.')[1]}`}
                >
                  {t(item.key)}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t">
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                <span className="text-xs">🏆</span>
                {t('progress.points')}: {progress.totalPoints}
              </Badge>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}