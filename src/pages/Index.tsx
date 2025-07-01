import CalorieCalculator from '@/components/CalorieCalculator';
import MotivationalBlog from '@/components/MotivationalBlog';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Hero Section */}
      <header className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Zero<span className="gradient-primary bg-clip-text text-transparent">Gram</span>
            </h1>
            <div className="w-24 h-1 gradient-primary mx-auto rounded-full mb-6"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Sua jornada para uma vida mais saudável começa aqui
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calcule suas necessidades calóricas de forma inteligente e encontre inspiração 
            para manter-se motivado em cada passo da sua transformação pessoal.
          </p>
        </div>
      </header>

      {/* Calculadora de Calorias */}
      <section className="py-12 px-4">
        <CalorieCalculator />
      </section>

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

      {/* Footer */}
      <footer className="py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-secondary p-8 rounded-2xl glass-effect">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Pronto para começar sua transformação?
            </h3>
            <p className="text-muted-foreground mb-6">
              Lembre-se: cada grande jornada começa com um pequeno passo. 
              O seu primeiro passo pode ser hoje mesmo.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <span>💚 Saudável</span>
              <span>🎯 Personalizado</span>
              <span>📈 Progressivo</span>
              <span>🌟 Motivacional</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 ZeroGram. Feito com 💚 para sua jornada saudável.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;