import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Timer, Trophy, Zap, Star, Target, Apple, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  type: 'protein' | 'carb' | 'fat' | 'veggie' | 'fruit';
}

interface Meal {
  name: string;
  time: string;
  items: MealItem[];
  totalCalories: number;
}

interface MealChecklistGamifiedProps {
  nutritionPlanId: number;
  onCompleteMeal: (completedMeals: number, totalMeals: number) => void;
}

export const MealChecklistGamified = ({ nutritionPlanId, onCompleteMeal }: MealChecklistGamifiedProps) => {
  const { toast } = useToast();
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});
  const [currentDay, setCurrentDay] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const getMealPlan = (planId: number) => {
    switch (planId) {
      case 1: // Plano de Perda de Peso
        return [
          {
            name: "Café da Manhã",
            time: "07:00",
            items: [
              { name: "Aveia integral", quantity: "40g", calories: 150, type: "carb" as const },
              { name: "Banana", quantity: "1 unidade", calories: 90, type: "fruit" as const },
              { name: "Leite desnatado", quantity: "200ml", calories: 70, type: "protein" as const },
              { name: "Chia", quantity: "1 colher sopa", calories: 60, type: "fat" as const }
            ],
            totalCalories: 370
          },
          {
            name: "Lanche da Manhã",
            time: "10:00",
            items: [
              { name: "Maçã", quantity: "1 unidade", calories: 80, type: "fruit" as const },
              { name: "Amêndoas", quantity: "10 unidades", calories: 70, type: "fat" as const }
            ],
            totalCalories: 150
          },
          {
            name: "Almoço",
            time: "12:30",
            items: [
              { name: "Peito de frango grelhado", quantity: "120g", calories: 200, type: "protein" as const },
              { name: "Arroz integral", quantity: "60g", calories: 180, type: "carb" as const },
              { name: "Brócolis refogado", quantity: "100g", calories: 35, type: "veggie" as const },
              { name: "Salada mista", quantity: "1 prato", calories: 50, type: "veggie" as const },
              { name: "Azeite", quantity: "1 colher sopa", calories: 120, type: "fat" as const }
            ],
            totalCalories: 585
          },
          {
            name: "Lanche da Tarde",
            time: "15:30",
            items: [
              { name: "Iogurte natural", quantity: "150g", calories: 90, type: "protein" as const },
              { name: "Morango", quantity: "100g", calories: 30, type: "fruit" as const }
            ],
            totalCalories: 120
          },
          {
            name: "Jantar",
            time: "19:00",
            items: [
              { name: "Salmão grelhado", quantity: "100g", calories: 220, type: "protein" as const },
              { name: "Batata doce", quantity: "80g", calories: 90, type: "carb" as const },
              { name: "Aspargos", quantity: "100g", calories: 25, type: "veggie" as const },
              { name: "Rúcula", quantity: "50g", calories: 10, type: "veggie" as const }
            ],
            totalCalories: 345
          }
        ];
      case 2: // Plano de Ganho de Massa
        return [
          {
            name: "Café da Manhã",
            time: "07:00",
            items: [
              { name: "Ovos mexidos", quantity: "3 unidades", calories: 210, type: "protein" as const },
              { name: "Pão integral", quantity: "2 fatias", calories: 160, type: "carb" as const },
              { name: "Abacate", quantity: "1/2 unidade", calories: 160, type: "fat" as const },
              { name: "Suco de laranja", quantity: "200ml", calories: 110, type: "fruit" as const }
            ],
            totalCalories: 640
          },
          {
            name: "Lanche da Manhã",
            time: "10:00",
            items: [
              { name: "Whey protein", quantity: "30g", calories: 120, type: "protein" as const },
              { name: "Banana", quantity: "1 unidade", calories: 90, type: "fruit" as const },
              { name: "Aveia", quantity: "30g", calories: 115, type: "carb" as const }
            ],
            totalCalories: 325
          },
          {
            name: "Almoço",
            time: "12:30",
            items: [
              { name: "Carne vermelha magra", quantity: "150g", calories: 300, type: "protein" as const },
              { name: "Arroz integral", quantity: "100g", calories: 300, type: "carb" as const },
              { name: "Feijão", quantity: "80g", calories: 120, type: "protein" as const },
              { name: "Legumes refogados", quantity: "150g", calories: 80, type: "veggie" as const }
            ],
            totalCalories: 800
          },
          {
            name: "Lanche da Tarde",
            time: "15:30",
            items: [
              { name: "Sanduíche natural", quantity: "1 unidade", calories: 350, type: "carb" as const },
              { name: "Vitamina de frutas", quantity: "300ml", calories: 200, type: "fruit" as const }
            ],
            totalCalories: 550
          },
          {
            name: "Jantar",
            time: "19:00",
            items: [
              { name: "Frango grelhado", quantity: "150g", calories: 250, type: "protein" as const },
              { name: "Macarrão integral", quantity: "80g", calories: 280, type: "carb" as const },
              { name: "Molho de tomate", quantity: "50g", calories: 30, type: "veggie" as const },
              { name: "Salada verde", quantity: "1 prato", calories: 40, type: "veggie" as const }
            ],
            totalCalories: 600
          }
        ];
      case 3: // Plano Vegetariano
        return [
          {
            name: "Café da Manhã",
            time: "07:00",
            items: [
              { name: "Mingau de quinoa", quantity: "150g", calories: 180, type: "carb" as const },
              { name: "Leite de amêndoas", quantity: "200ml", calories: 60, type: "protein" as const },
              { name: "Frutas vermelhas", quantity: "100g", calories: 50, type: "fruit" as const },
              { name: "Nozes", quantity: "20g", calories: 130, type: "fat" as const }
            ],
            totalCalories: 420
          },
          {
            name: "Lanche da Manhã",
            time: "10:00",
            items: [
              { name: "Smoothie verde", quantity: "300ml", calories: 120, type: "veggie" as const },
              { name: "Castanhas", quantity: "15g", calories: 90, type: "fat" as const }
            ],
            totalCalories: 210
          },
          {
            name: "Almoço",
            time: "12:30",
            items: [
              { name: "Grão de bico", quantity: "100g", calories: 160, type: "protein" as const },
              { name: "Quinoa", quantity: "60g", calories: 220, type: "carb" as const },
              { name: "Legumes assados", quantity: "200g", calories: 100, type: "veggie" as const },
              { name: "Tahine", quantity: "1 colher sopa", calories: 90, type: "fat" as const }
            ],
            totalCalories: 570
          },
          {
            name: "Lanche da Tarde",
            time: "15:30",
            items: [
              { name: "Hummus", quantity: "50g", calories: 80, type: "protein" as const },
              { name: "Cenoura baby", quantity: "100g", calories: 40, type: "veggie" as const }
            ],
            totalCalories: 120
          },
          {
            name: "Jantar",
            time: "19:00",
            items: [
              { name: "Tofu grelhado", quantity: "120g", calories: 180, type: "protein" as const },
              { name: "Arroz integral", quantity: "60g", calories: 180, type: "carb" as const },
              { name: "Vegetais no vapor", quantity: "150g", calories: 60, type: "veggie" as const },
              { name: "Sementes de gergelim", quantity: "1 colher sopa", calories: 50, type: "fat" as const }
            ],
            totalCalories: 470
          }
        ];
      default:
        return [];
    }
  };

  const meals = getMealPlan(nutritionPlanId);

  const handleItemToggle = (itemId: string) => {
    const newState = {
      ...completedItems,
      [itemId]: !completedItems[itemId]
    };
    
    setCompletedItems(newState);

    // Check if item was just completed
    if (!completedItems[itemId]) {
      // Show celebration animation
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 }
      });

      toast({
        title: "Item Concluído! 🎉",
        description: "+2 pontos ganhos",
        duration: 2000,
      });
    }

    // Check if all items in current meal are completed
    const currentMealItems = meals.flatMap((meal, mealIndex) => 
      meal.items.map((_, itemIndex) => `${mealIndex}-${itemIndex}`)
    );
    
    const completedCount = currentMealItems.filter(id => 
      id === itemId ? !completedItems[itemId] : newState[id]
    ).length;

    if (completedCount === currentMealItems.length) {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "Plano Alimentar Concluído! 🏆",
        description: "+50 pontos de bônus ganhos",
        duration: 3000,
      });

      // Call parent callback
      onCompleteMeal(completedCount, currentMealItems.length);
    }
  };

  const getProgress = () => {
    const totalItems = meals.reduce((acc, meal) => acc + meal.items.length, 0);
    const completed = meals.reduce((acc, meal, mealIndex) => {
      return acc + meal.items.filter((_, itemIndex) => 
        completedItems[`${mealIndex}-${itemIndex}`]
      ).length;
    }, 0);
    return totalItems > 0 ? (completed / totalItems) * 100 : 0;
  };

  const getCompletedCount = () => {
    return meals.reduce((acc, meal, mealIndex) => {
      return acc + meal.items.filter((_, itemIndex) => 
        completedItems[`${mealIndex}-${itemIndex}`]
      ).length;
    }, 0);
  };

  const getTotalItems = () => {
    return meals.reduce((acc, meal) => acc + meal.items.length, 0);
  };

  const getTotalPoints = () => {
    return getCompletedCount() * 2 + (getProgress() === 100 ? 50 : 0);
  };

  const getTotalCalories = () => {
    return meals.reduce((acc, meal) => acc + meal.totalCalories, 0);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'protein': return '🥩';
      case 'carb': return '🍞';
      case 'fat': return '🥑';
      case 'veggie': return '🥬';
      case 'fruit': return '🍎';
      default: return '🍽️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'protein': return 'bg-red-100 text-red-800';
      case 'carb': return 'bg-yellow-100 text-yellow-800';
      case 'fat': return 'bg-green-100 text-green-800';
      case 'veggie': return 'bg-emerald-100 text-emerald-800';
      case 'fruit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gamification */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                Programa Alimentar
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Complete cada item da alimentação para ganhar pontos e conquistar objetivos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{getTotalPoints()}</div>
                <div className="text-xs text-muted-foreground">Pontos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{getCompletedCount()}/{getTotalItems()}</div>
                <div className="text-xs text-muted-foreground">Itens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getTotalCalories()}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso do Dia</span>
              <span className="text-sm text-muted-foreground">{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                +2 pontos por item
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +50 bônus ao completar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal checklist */}
      <div className="space-y-4">
        {meals.map((meal, mealIndex) => {
          const completedInMeal = meal.items.filter((_, itemIndex) => 
            completedItems[`${mealIndex}-${itemIndex}`]
          ).length;
          const mealProgress = (completedInMeal / meal.items.length) * 100;
          
          return (
            <Card key={mealIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      {meal.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {meal.time}
                      </span>
                      <span>{meal.totalCalories} kcal</span>
                      <span>{completedInMeal}/{meal.items.length} itens</span>
                    </div>
                  </div>
                  <Badge variant={mealProgress === 100 ? "default" : "outline"}>
                    {Math.round(mealProgress)}%
                  </Badge>
                </div>
                <Progress value={mealProgress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {meal.items.map((item, itemIndex) => {
                  const itemId = `${mealIndex}-${itemIndex}`;
                  const isCompleted = completedItems[itemId];
                  
                  return (
                    <div
                      key={itemIndex}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                          : 'bg-background hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={itemId}
                          checked={isCompleted}
                          onCheckedChange={() => handleItemToggle(itemId)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <label 
                              htmlFor={itemId}
                              className={`font-medium cursor-pointer ${
                                isCompleted ? 'line-through text-muted-foreground' : ''
                              }`}
                            >
                              {item.name}
                            </label>
                            <div className="flex items-center gap-2">
                              {isCompleted && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  +2 pts
                                </Badge>
                              )}
                              <Badge className={getTypeColor(item.type)}>
                                {getTypeIcon(item.type)} {item.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.quantity}</span>
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {item.calories} kcal
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion celebration */}
      {showCelebration && (
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300 dark:from-green-950 dark:to-blue-950 dark:border-green-700">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                Parabéns! Plano Alimentar Concluído!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Você ganhou {getTotalPoints()} pontos totais hoje!
              </p>
              <Button 
                onClick={() => setShowCelebration(false)}
                className="mt-4"
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help for ADHD users */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="space-y-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Dicas para Manter o Foco na Alimentação
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Marque cada item conforme consome</li>
                <li>• Use o sistema de pontos como motivação</li>
                <li>• Prepare os alimentos com antecedência</li>
                <li>• Celebre cada refeição completa!</li>
                <li>• Use lembretes para os horários das refeições</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};