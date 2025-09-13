import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@assets/generated_images/Nepal_Constitution_Hero_Image_f5576ccb.png';

export default function HeroSection() {
  const { t } = useLanguage();

  const handleStartLearning = () => {
    console.log('Start learning clicked');
    window.location.href = '/lessons';
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
          {t('hero.subtitle')}
        </p>
        <Button 
          size="lg" 
          onClick={handleStartLearning}
          className="bg-primary/90 backdrop-blur-sm border border-primary-border hover:bg-primary text-primary-foreground px-8 py-4 text-lg"
          data-testid="button-start-learning"
        >
          {t('hero.cta')}
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}