import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Clock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PlansCard = () => {
  const { subscription, loading, createCheckout, manageSubscription, isPremium } = useSubscription();
  const [currency, setCurrency] = useState<'eur' | 'brl'>('eur');

  const plans = {
    basic: {
      eur: { price: "2,99€", originalPrice: "4,99€", symbol: "€" },
      brl: { price: "R$ 9,99", originalPrice: "R$ 19,99", symbol: "R$" }
    },
    premium: {
      eur: { price: "9,99€", originalPrice: null, symbol: "€" },
      brl: { price: "R$ 29,90", originalPrice: null, symbol: "R$" }
    }
  };

  const basicFeatures = [
    "Receitas personalizadas ilimitadas",
    "Treinos personalizados",
    "Publicar no blog da comunidade",
    "Salvar conteúdo pessoal"
  ];

  const premiumFeatures = [
    "Todas as funcionalidades do Basic",
    "Análise de nutrição avançada (scanner de rótulos)",
    "Planos de dieta personalizados por IA",
    "Sessões com coaches certificados",
    "Sem anúncios",
    "Suporte prioritário"
  ];

  const handleCreateCheckout = (plan: 'basic' | 'premium') => {
    createCheckout(plan, currency);
  };

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Moeda:</span>
          <Select value={currency} onValueChange={(value: 'eur' | 'brl') => setCurrency(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">🇪🇺 EUR</SelectItem>
              <SelectItem value="brl">🇧🇷 BRL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Sparkles size={120} />
          </div>
          
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Plano Basic</CardTitle>
            </div>
            
            {isPremium && subscription.subscription_tier === 'Basic' ? (
              <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800 border-green-200">
                <Crown className="h-4 w-4 mr-1" />
                Ativo
              </Badge>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="text-center">
                  {plans.basic[currency].originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {plans.basic[currency].originalPrice}
                    </span>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">{plans.basic[currency].price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                    Desconto especial!
                  </Badge>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {isPremium && subscription.subscription_tier === 'Basic' ? (
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
                onClick={() => handleCreateCheckout('basic')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {loading ? "Carregando..." : "Começar Agora"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative overflow-hidden border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Crown size={120} />
          </div>
          
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                Plano Premium
              </CardTitle>
            </div>
            
            {isPremium && subscription.subscription_tier === 'Premium' ? (
              <Badge variant="secondary" className="mx-auto bg-green-100 text-green-800 border-green-200">
                <Crown className="h-4 w-4 mr-1" />
                Ativo
              </Badge>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-purple-600">{plans.premium[currency].price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Em breve
                  </Badge>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {isPremium && subscription.subscription_tier === 'Premium' ? (
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
                disabled={true}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500"
              >
                Em Breve - Aguarde Parcerias
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <p>
          O Plano Premium estará disponível em breve com parcerias exclusivas com nutricionistas e coaches certificados. 
          Cadastre-se no Basic agora e seja o primeiro a saber quando estiver disponível!
        </p>
      </div>
    </div>
  );
};

export default PlansCard;