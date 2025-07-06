import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CalorieCalculator from '@/components/CalorieCalculator';
import MotivationalBlog from '@/components/MotivationalBlog';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSquare } from '@/components/ads/AdSquare';

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      {/* Header/Hero Section */}
      <header className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              {t('home.title')}<span className="gradient-primary bg-clip-text text-transparent">{t('home.titleHighlight')}</span>
            </h1>
            <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {t('home.subtitle')}
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            {t('home.description')}
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/calculadora">
              <Button size="lg" className="gradient-primary border-0 text-white font-medium">
                {t('home.cta')}
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                {t('auth.loginRegister')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Calculadora de Calorias */}
      <section className="py-12 px-4">
        <CalorieCalculator />
      </section>

      {/* Banner Publicitário */}
      <AdBanner size="large" />

      {/* Separador visual */}
      <div className="py-8">
        <div className="max-w-xs mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>
      </div>

      {/* Blog Motivacional */}
      <section className="py-12 px-4">
        <MotivationalBlog />
      </section>

      {/* Anúncio Quadrado */}
      <div className="flex justify-center py-8">
        <AdSquare size="large" />
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-secondary p-8 rounded-2xl glass-effect">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              {t('footer.ready')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('footer.journey')}
            </p>
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <span>{t('footer.features.healthy')}</span>
              <span>{t('footer.features.personalized')}</span>
              <span>{t('footer.features.progressive')}</span>
              <span>{t('footer.features.motivational')}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;