import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, TrendingUp, Calendar, Apple, Users } from 'lucide-react';

interface MealPlan {
  id: number;
  title: string;
  description: string;
  calories: string;
  duration: string;
  goal: string;
  icon: string;
  color: string;
  features: string[];
}

interface MealPlanDetailsDialogProps {
  mealPlan: MealPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MealPlanDetailsDialog = ({ mealPlan, open, onOpenChange }: MealPlanDetailsDialogProps) => {
  if (!mealPlan) return null;

  const getMealPlanDetails = (planId: number) => {
    switch (planId) {
      case 1: // Dieta Equilibrada
        return {
          weeklyMenu: {
            segunda: {
              breakfast: "Aveia com frutas vermelhas e mel",
              lunch: "Frango grelhado + arroz integral + salada",
              dinner: "Peixe assado + batata doce + brócolis",
              snacks: ["Iogurte natural", "Mix de castanhas"]
            },
            terca: {
              breakfast: "Omelete de 2 ovos + pão integral",
              lunch: "Salmão + quinoa + aspargos",
              dinner: "Peito de peru + purê de abóbora + salada",
              snacks: ["Fruta da época", "Queijo branco"]
            },
            quarta: {
              breakfast: "Smoothie verde + granola",
              lunch: "Carne magra + arroz 7 grãos + legumes",
              dinner: "Omelete + salada completa",
              snacks: ["Vitamina de banana", "Torrada integral"]
            }
          },
          macros: {
            carboidratos: "45-50%",
            proteinas: "20-25%",
            gorduras: "25-30%"
          },
          supplements: ["Multivitamínico", "Ômega 3", "Vitamina D"]
        };
      case 2: // Ganho de Massa
        return {
          weeklyMenu: {
            segunda: {
              breakfast: "Ovos mexidos + aveia + banana + pasta amendoim",
              lunch: "Frango + arroz + feijão + salada + azeite",
              dinner: "Carne vermelha + batata + vegetais + queijo",
              snacks: ["Whey protein + aveia", "Sanduíche peito peru", "Mix oleaginosas"]
            },
            terca: {
              breakfast: "Panqueca aveia + ovos + mel + frutas",
              lunch: "Salmão + macarrão integral + molho pesto",
              dinner: "Frango + quinoa + abacate + salada",
              snacks: ["Vitamina hipercalórica", "Pão integral + queijo", "Iogurte grego"]
            },
            quarta: {
              breakfast: "Tapioca + queijo + presunto + vitamina",
              lunch: "Carne + arroz + lentilha + legumes refogados",
              dinner: "Peixe + purê batata + salada + azeite",
              snacks: ["Proteína + banana", "Sanduíche natural", "Castanhas"]
            }
          },
          macros: {
            carboidratos: "50-55%",
            proteinas: "25-30%",
            gorduras: "20-25%"
          },
          supplements: ["Whey Protein", "Creatina", "Hipercalórico", "BCAA"]
        };
      case 3: // Emagrecimento
        return {
          weeklyMenu: {
            segunda: {
              breakfast: "Omelete de claras + salada + chá verde",
              lunch: "Peito frango + salada grande + azeite",
              dinner: "Peixe grelhado + legumes + salada",
              snacks: ["Iogurte light", "Frutas vermelhas"]
            },
            terca: {
              breakfast: "Vitamina verde + chia + proteína",
              lunch: "Salmão + quinoa + salada colorida",
              dinner: "Frango desfiado + sopa de legumes",
              snacks: ["Chá termogênico", "Gelatina diet"]
            },
            quarta: {
              breakfast: "Ovos + abacate + tomate + café",
              lunch: "Carne magra + salada + legumes cozidos",
              dinner: "Peixe + abobrinha refogada + salada",
              snacks: ["Água detox", "Oleaginosas (porção pequena)"]
            }
          },
          macros: {
            carboidratos: "30-35%",
            proteinas: "35-40%",
            gorduras: "25-30%"
          },
          supplements: ["Termogênico", "L-Carnitina", "Multivitamínico", "Fibras"]
        };
      default:
        return {};
    }
  };

  const getMealPlanBenefits = (planId: number) => {
    switch (planId) {
      case 1:
        return [
          "Fornece todos os nutrientes essenciais",
          "Mantém energia estável ao longo do dia",
          "Fácil de seguir e sustentável",
          "Promove saúde geral e bem-estar"
        ];
      case 2:
        return [
          "Maximiza o ganho de massa muscular",
          "Fornece energia para treinos intensos",
          "Acelera a recuperação muscular",
          "Otimiza a síntese proteica"
        ];
      case 3:
        return [
          "Promove perda de gordura preservando músculo",
          "Controla a fome e saciedade",
          "Acelera o metabolismo",
          "Melhora a composição corporal"
        ];
      default:
        return [];
    }
  };

  const getMealPlanTips = (planId: number) => {
    switch (planId) {
      case 1:
        return [
          "Beba pelo menos 2L de água por dia",
          "Mastigue bem os alimentos",
          "Faça refeições regulares",
          "Varie os alimentos semanalmente"
        ];
      case 2:
        return [
          "Coma a cada 3 horas",
          "Priorize proteína pós-treino",
          "Inclua carboidratos antes do treino",
          "Monitore o ganho de peso semanal"
        ];
      case 3:
        return [
          "Controle as porções rigorosamente",
          "Priorize proteínas em cada refeição",
          "Beba água antes das refeições",
          "Evite alimentos processados"
        ];
      default:
        return [];
    }
  };

  const planDetails = getMealPlanDetails(mealPlan.id);
  const benefits = getMealPlanBenefits(mealPlan.id);
  const tips = getMealPlanTips(mealPlan.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={`w-12 h-12 bg-gradient-to-br ${mealPlan.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-2xl">{mealPlan.icon}</span>
            </div>
            {mealPlan.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description and Info */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{mealPlan.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Target className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{mealPlan.calories}</div>
                  <div className="text-xs text-muted-foreground">Calorias/dia</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{mealPlan.duration}</div>
                  <div className="text-xs text-muted-foreground">Duração</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{mealPlan.goal}</div>
                  <div className="text-xs text-muted-foreground">Objetivo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Macros */}
          {planDetails.macros && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Apple className="h-4 w-4" />
                Distribuição de Macronutrientes
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">{planDetails.macros.carboidratos}</div>
                  <div className="text-sm text-blue-600">Carboidratos</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="font-bold text-red-600">{planDetails.macros.proteinas}</div>
                  <div className="text-sm text-red-600">Proteínas</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-600">{planDetails.macros.gorduras}</div>
                  <div className="text-sm text-yellow-600">Gorduras</div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Características do Plano
            </h3>
            <div className="flex flex-wrap gap-2">
              {mealPlan.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Weekly Menu */}
          {planDetails.weeklyMenu && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Exemplo de Cardápio Semanal
              </h3>
              
              <div className="space-y-4">
                {Object.entries(planDetails.weeklyMenu).map(([day, meals]: [string, any]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-3 text-primary capitalize">{day}-feira</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Café da Manhã</h5>
                          <p className="text-sm mt-1">{meals.breakfast}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Almoço</h5>
                          <p className="text-sm mt-1">{meals.lunch}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Jantar</h5>
                          <p className="text-sm mt-1">{meals.dinner}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">Lanches</h5>
                          <div className="text-sm mt-1">
                            {meals.snacks.map((snack: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary"></div>
                                {snack}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supplements */}
          {planDetails.supplements && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Suplementação Recomendada
              </h3>
              <div className="flex flex-wrap gap-2">
                {planDetails.supplements.map((supplement: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-primary/20 text-primary">
                    {supplement}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Benefits and Tips */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Benefícios
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Dicas Importantes
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};