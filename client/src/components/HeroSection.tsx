import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@assets/generated_images/Nepal_Constitution_Hero_Image_f5576ccb.png';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLanguage();

  const handleStartLearning = () => {
    window.location.href = '/lessons';
  };
  const handleTakeQuiz = () => {
    window.location.href = '/quiz';
  };

  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_38%,rgba(255,255,255,0.10),transparent_65%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/20 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl relative">
          <div className="absolute -inset-4 rounded-2xl bg-black/35 backdrop-blur-sm border border-white/10 pointer-events-none" />
          <p
            className="relative font-medium uppercase tracking-[0.18em] mb-5 fade-in-up text-[10px] md:text-xs text-white/90"
            style={{ animationDelay: '.05s' }}
          >
            <span className="px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/15 shadow-sm inline-block">
              {t('hero.tagline')}
            </span>
          </p>
          <h1
            className="relative text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-sm fade-in-up text-white"
            style={{ animationDelay: '.15s' }}
          >
            <span className="bg-clip-text">{t('hero.title')}</span>
            <span className="mt-3 block w-24 h-[3px] rounded-full bg-gradient-to-r from-white/80 via-white/60 to-transparent" />
          </h1>
          <p
            className="relative text-lg md:text-xl mb-7 leading-relaxed text-white/95 max-w-prose drop-shadow fade-in-up"
            style={{ animationDelay: '.25s' }}
          >
            {t('hero.subtitle')}
          </p>
          <div
            className="relative flex flex-col sm:flex-row gap-4 mb-7 fade-in-up"
            style={{ animationDelay: '.35s' }}
          >
            <Button
              size="lg"
              onClick={handleStartLearning}
              className="px-8 py-4 text-base font-semibold group shadow-md"
              data-testid="button-start-learning"
            >
              <span className="flex items-center gap-2">
                {t('hero.primaryCta') || t('hero.cta')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleTakeQuiz}
              className="px-8 py-4 text-base font-semibold group bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15"
              data-testid="button-take-quiz"
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                {t('hero.secondaryCta')}
              </span>
            </Button>
          </div>
          <p
            className="relative text-sm md:text-base text-white/85 max-w-2xl fade-in-up"
            style={{ animationDelay: '.45s' }}
          >
            {t('about.short')}
          </p>
          <div className="relative mt-9 fade-in-up" style={{ animationDelay: '.55s' }}>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium tracking-wide"
              aria-label="Scroll to features"
            >
              <span className="flex items-center gap-2">
                <span>{t('features.title')}</span>
                <span className="relative w-5 h-5 inline-flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-white/30 group-hover:border-white/60 transition-colors" />
                  <svg
                    className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8l4 4 4-4" />
                  </svg>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-white/70 to-transparent animate-pulse" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
