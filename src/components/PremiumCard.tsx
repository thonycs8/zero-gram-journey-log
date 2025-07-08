import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const PremiumCard = () => {
  const { subscription, loading, createCheckout, manageSubscription, isPremium } = useSubscription();

  const features = [
    "Análise de nutrição avançada (scanner de rótulos)",
    "Planos de dieta personalizados",
    "Sessões com coaches (parceria com nutricionistas)", 
    "Sem anúncios",
    "10% de desconto na loja"
  ];

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="absolute -top-10 -right-10 opacity-10">
        <Crown size={120} />
      </div>
      
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Plano Premium
          </CardTitle>
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        
        {isPremium ? (
          <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800 border-green-200">
            <Crown className="h-4 w-4 mr-1" />
            Ativo
          </Badge>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary">R$ 19,90</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {isPremium ? (
          <div className="space-y-3">
            <Button 
              onClick={manageSubscription}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? "Carregando..." : "Gerenciar Assinatura"}
            </Button>
            
            {subscription.subscription_end && (
              <p className="text-xs text-muted-foreground text-center">
                Renovação: {new Date(subscription.subscription_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        ) : (
          <Button 
            onClick={createCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {loading ? "Carregando..." : "Assinar Agora"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumCard;