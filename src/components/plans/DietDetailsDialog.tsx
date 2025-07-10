import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Target, TrendingUp } from 'lucide-react';

interface DietType {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  macros: string;
  meals?: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  benefits?: string[];
  tips?: string[];
}

interface DietDetailsDialogProps {
  diet: DietType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DietDetailsDialog = ({ diet, open, onOpenChange }: DietDetailsDialogProps) => {
  if (!diet) return null;

  const getDietMeals = (dietId: number) => {
    switch (dietId) {
      case 1: // Dieta Proteica
        return {
          breakfast: [
            "3 ovos mexidos com espinafre",
            "2 fatias de queijo branco",
            "1 fatia de abacate",
            "Café sem açúcar"
          ],
          lunch: [
            "150g de frango grelhado",
            "Salada verde com azeite",
            "100g de brócolis",
            "50g de quinoa"
          ],
          dinner: [
            "150g de salmão assado",
            "Aspargos grelhados",
            "Salada de rúcula",
            "30g de nozes"
          ],
          snacks: [
            "Iogurte grego com amêndoas",
            "Proteína whey",
            "Queijo cottage com pepino"
          ]
        };
      case 2: // Dieta Mediterrânea
        return {
          breakfast: [
            "Iogurte grego com mel",
            "Frutas vermelhas",
            "30g de nozes",
            "Pão integral com azeite"
          ],
          lunch: [
            "Peixe grelhado com ervas",
            "Salada mediterrânea",
            "Grão-de-bico",
            "Azeite extra virgem"
          ],
          dinner: [
            "Frango com tomate e azeitonas",
            "Vegetais grelhados",
            "Arroz integral",
            "Vinho tinto (opcional)"
          ],
          snacks: [
            "Azeitonas e queijo feta",
            "Frutas da época",
            "Hummus com vegetais"
          ]
        };
      case 3: // Dieta Vegana
        return {
          breakfast: [
            "Smoothie de frutas com proteína vegetal",
            "Aveia com frutas vermelhas",
            "Sementes de chia",
            "Leite de amêndoa"
          ],
          lunch: [
            "Buddha bowl com quinoa",
            "Legumes variados",
            "Grão-de-bico temperado",
            "Molho tahini"
          ],
          dinner: [
            "Tofu grelhado com vegetais",
            "Arroz integral",
            "Salada verde",
            "Azeite e limão"
          ],
          snacks: [
            "Mix de oleaginosas",
            "Frutas frescas",
            "Hummus com cenoura"
          ]
        };
      default:
        return {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };
    }
  };

  const getDietBenefits = (dietId: number) => {
    switch (dietId) {
      case 1:
        return [
          "Maior saciedade e controle do apetite",
          "Preservação da massa muscular",
          "Aceleração do metabolismo",
          "Melhora na composição corporal"
        ];
      case 2:
        return [
          "Redução do risco cardiovascular",
          "Propriedades anti-inflamatórias",
          "Rica em antioxidantes",
          "Sustentável a longo prazo"
        ];
      case 3:
        return [
          "Rica em fibras e antioxidantes",
          "Redução da pegada ecológica",
          "Melhora da digestão",
          "Prevenção de doenças crônicas"
        ];
      default:
        return [];
    }
  };

  const getDietTips = (dietId: number) => {
    switch (dietId) {
      case 1:
        return [
          "Inclua proteína em todas as refeições",
          "Hidrate-se bem durante o dia",
          "Combine com exercícios de resistência",
          "Monitore a ingestão de fibras"
        ];
      case 2:
        return [
          "Use azeite extra virgem como principal gordura",
          "Consuma peixes pelo menos 2x por semana",
          "Inclua oleaginosas diariamente",
          "Prefira grãos integrais"
        ];
      case 3:
        return [
          "Combine diferentes proteínas vegetais",
          "Suplemente vitamina B12",
          "Inclua leguminosas diariamente",
          "Varie as cores dos vegetais"
        ];
      default:
        return [];
    }
  };

  const meals = getDietMeals(diet.id);
  const benefits = getDietBenefits(diet.id);
  const tips = getDietTips(diet.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={`w-12 h-12 bg-gradient-to-br ${diet.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-2xl">{diet.icon}</span>
            </div>
            {diet.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description and Macros */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{diet.description}</p>
            
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Distribuição de Macronutrientes</div>
                <div className="text-sm text-muted-foreground">{diet.macros}</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Características Principais
            </h3>
            <div className="flex flex-wrap gap-2">
              {diet.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Meal Plan */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Exemplo de Cardápio Diário
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Café da Manhã</h4>
                  <ul className="space-y-1">
                    {meals.breakfast.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Almoço</h4>
                  <ul className="space-y-1">
                    {meals.lunch.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Jantar</h4>
                  <ul className="space-y-1">
                    {meals.dinner.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Lanches</h4>
                  <ul className="space-y-1">
                    {meals.snacks.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Benefits and Tips */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
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
                <TrendingUp className="h-4 w-4" />
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