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
      </div>
    </div>
  );
};

export default Plans;