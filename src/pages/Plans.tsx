import { useEffect } from 'react';
import PlansCard from '@/components/PlansCard';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Plans = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const subscription = searchParams.get('subscription');
    const plan = searchParams.get('plan');
    
    if (subscription === 'success') {
      toast({
        title: "Sucesso!",
        description: `Assinatura do plano ${plan === 'basic' ? 'Basic' : 'Premium'} realizada com sucesso!`,
      });
    } else if (subscription === 'cancelled') {
      toast({
        title: "Cancelado",
        description: "A assinatura foi cancelada.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Planos <span className="gradient-primary bg-clip-text text-transparent">VIP</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desbloqueie todo o potencial do ZeroGram com nossos planos VIP
          </p>
        </div>

        <PlansCard />

        {/* Seção de Planos de Treino */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Planos de <span className="gradient-primary bg-clip-text text-transparent">Treino</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Treinos personalizados para atingir os seus objetivos de fitness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Plano de Treino Iniciante */}
            <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🏃</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Iniciante</h3>
                  <p className="text-sm text-muted-foreground">Para quem está começando</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  3x por semana, 30-45 min
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Exercícios básicos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Foco em técnica
                </li>
              </ul>
            </div>

            {/* Plano de Treino Intermediário */}
            <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Intermediário</h3>
                  <p className="text-sm text-muted-foreground">Para quem já tem experiência</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  4-5x por semana, 45-60 min
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Treinos compostos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Progressão de carga
                </li>
              </ul>
            </div>

            {/* Plano de Treino Avançado */}
            <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Avançado</h3>
                  <p className="text-sm text-muted-foreground">Para atletas experientes</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  5-6x por semana, 60-90 min
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Treinos especializados
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Periodização avançada
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;