import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Globe, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Trophy,
      titleKey: 'features.gamified.title',
      descKey: 'features.gamified.desc',
      extra: null
    },
    {
      icon: Globe,
      titleKey: 'features.bilingual.title', 
      descKey: 'features.bilingual.desc',
      extra: null
    },
    {
      icon: TrendingUp,
      titleKey: 'features.progress.title',
      descKey: 'features.progress.desc',
      extra: (
        <div className="w-full mt-2" aria-hidden>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-primary/70 to-primary animate-pulse" />
          </div>
        </div>
      )
    },
    {
      icon: Info,
      titleKey: 'about.title',
      descKey: 'about.short',
      extra: null
    }
  ];

  return (
    <section className="section-y-md px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="h2 text-center mb-14 text-balance">
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden cursor-pointer card-hover-scale shadow-lift transition-base group min-h-[320px] flex fade-in-up"
                style={{animationDelay: `${0.1 + index * 0.1}s`}}
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-7 flex flex-col items-center text-center justify-start gap-4 flex-1">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/20 shadow-sm transition-base group-hover:from-primary/25 group-hover:ring-primary/40">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,hsl(var(--primary)_/_0.25),transparent_60%)]" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[22ch]">
                    {t(feature.descKey)}
                  </p>
                  {feature.extra}
                  <div className="mt-auto h-1 w-0 bg-gradient-to-r from-primary/40 to-primary/70 rounded-full transition-all duration-300 group-hover:w-28" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}