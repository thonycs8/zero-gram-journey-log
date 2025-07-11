import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { useDetailedPlans } from '@/hooks/useDetailedPlans';
import { MealChecklistGamified } from '@/components/nutrition/MealChecklistGamified';
import { CheckCircle, Calendar, Target, Apple, Clock, Trophy, Plus, Utensils, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Nutrition = () => {
  const { 
    userPlans, 
    checkpoints, 
    loading: gamificationLoading, 
    completeCheckpoint, 
    getTodaysCheckpoints,
    getPlanProgress 
  } = useGamification();

  const {
    getMealsForDay,
    getMealPlan,
    loading: plansLoading
  } = useDetailedPlans();

  const [completedMeals, setCompletedMeals] = useState<{ [key: string]: boolean }>({});

  const nutritionPlans = userPlans.filter(plan => plan.plan_type === 'meal' || plan.plan_type === 'diet');
  const activePlans = nutritionPlans.filter(plan => !plan.is_completed);
  const completedPlans = nutritionPlans.filter(plan => plan.is_completed);
  const todaysCheckpoints = getTodaysCheckpoints();

  const handleCompleteCheckpoint = async (planId: string) => {
    await completeCheckpoint(planId, 'Plano alimentar seguido hoje');
  };

  const handleMealToggle = (mealId: string) => {
    setCompletedMeals(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'café da manhã':
      case 'breakfast':
        return '🌅';
      case 'almoço':
      case 'lunch':
        return '🌞';
      case 'jantar':
      case 'dinner':
        return '🌙';
      case 'lanche':
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getCurrentDay = () => {
    const startDate = new Date();
    const daysSinceStart = Math.floor((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, (daysSinceStart % 7) + 1); // Cycle through days 1-7
  };

  if (gamificationLoading || plansLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Apple className="h-8 w-8 text-primary" />
              Minha Alimentação
            </h1>
            <p className="text-muted-foreground mt-2">
              Acompanhe o progresso dos seus planos alimentares com detalhes
            </p>
          </div>
          <Button asChild>
            <a href="/planos" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Escolher Plano
            </a>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activePlans.length}</div>
                  <div className="text-sm text-muted-foreground">Planos Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedPlans.length}</div>
                  <div className="text-sm text-muted-foreground">Concluídos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {todaysCheckpoints.filter(cp => 
                      userPlans.find(p => p.id === cp.user_plan_id && (p.plan_type === 'meal' || p.plan_type === 'diet'))
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Dia {getCurrentDay()}</div>
                  <div className="text-sm text-muted-foreground">Do Plano</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Nutrition Plans */}
        {activePlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Planos Ativos
            </h2>
            
            <div className="grid gap-6">
              {activePlans.map((plan) => {
                const progress = getPlanProgress(plan);
                const todayCompleted = todaysCheckpoints.some(
                  cp => cp.user_plan_id === plan.id && cp.completed
                );
                const mealDetails = getMealPlan(plan.plan_id.toString());
                const currentDay = getCurrentDay();
                const todaysMeals = getMealsForDay(plan.plan_id.toString(), currentDay);

                // Group meals by meal type
                const mealsByType = todaysMeals.reduce((acc, meal) => {
                  if (!acc[meal.meal_type]) {
                    acc[meal.meal_type] = [];
                  }
                  acc[meal.meal_type].push(meal);
                  return acc;
                }, {} as { [key: string]: typeof todaysMeals });

                const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

                return (
                  <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{plan.plan_title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Iniciado em {format(new Date(plan.start_date), 'dd MMM yyyy', { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {plan.current_progress} de {plan.target_days} dias
                            </span>
                            {mealDetails && (
                              <Badge variant="outline">
                                {mealDetails.goal}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant={plan.plan_type === 'meal' ? 'default' : 'secondary'}>
                          {plan.plan_type === 'meal' ? 'Alimentar' : 'Dieta'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>

                      {/* Today's Meal Plan Details */}
                      <Tabs defaultValue="gamified" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="gamified">Programa Gamificado</TabsTrigger>
                          <TabsTrigger value="today">Alimentação de Hoje</TabsTrigger>
                          <TabsTrigger value="week">Semana</TabsTrigger>
                        </TabsList>

                        <TabsContent value="gamified" className="space-y-4">
                          <MealChecklistGamified 
                            nutritionPlanId={plan.plan_id}
                            onCompleteMeal={(completed, total) => {
                              // Handle meal completion
                              console.log(`Completed ${completed}/${total} meals`);
                            }}
                          />
                        </TabsContent>

                        <TabsContent value="today" className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium">Dia {currentDay} - Plano Alimentar</h4>
                                <p className="text-sm text-muted-foreground">
                                  {Object.keys(mealsByType).length} refeições • {totalCalories} kcal total
                                </p>
                              </div>
                              <Button
                                onClick={() => handleCompleteCheckpoint(plan.id)}
                                disabled={todayCompleted}
                                variant={todayCompleted ? "outline" : "default"}
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {todayCompleted ? 'Seguido!' : 'Marcar Dia'}
                              </Button>
                            </div>

                            {Object.keys(mealsByType).length > 0 ? (
                              <div className="space-y-4">
                                {Object.entries(mealsByType).map(([mealType, meals]) => (
                                  <div key={mealType} className="p-4 bg-background rounded border">
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                                      <h5 className="font-medium">{mealType}</h5>
                                      <Badge variant="outline" className="text-xs">
                                        {meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} kcal
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      {meals.map((meal) => (
                                        <div key={meal.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                                          <Checkbox
                                            id={meal.id}
                                            checked={completedMeals[meal.id] || false}
                                            onCheckedChange={() => handleMealToggle(meal.id)}
                                          />
                                          <div className="flex-1">
                                            <div className="font-medium text-sm">{meal.food_item}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                              <span>{meal.quantity}</span>
                                              <span>•</span>
                                              <span>{meal.calories} kcal</span>
                                            </div>
                                          </div>
                                          <Utensils className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-muted-foreground">
                                <Apple className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhuma refeição programada para hoje</p>
                                <p className="text-sm">Dia livre ou jejum programado</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="week" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                              const dayMeals = getMealsForDay(plan.plan_id.toString(), day);
                              const isToday = day === currentDay;
                              const dayCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
                              const mealTypes = [...new Set(dayMeals.map(meal => meal.meal_type))];
                              
                              return (
                                <Card key={day} className={`${isToday ? 'ring-2 ring-primary' : ''}`}>
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">Dia {day}</h4>
                                      {isToday && <Badge variant="default" className="text-xs">Hoje</Badge>}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    {dayMeals.length > 0 ? (
                                      <div className="space-y-2">
                                        <div className="text-sm font-medium">{dayCalories} kcal</div>
                                        <div className="text-xs text-muted-foreground">
                                          {mealTypes.slice(0, 3).map((type, index) => (
                                            <span key={type}>
                                              {getMealTypeIcon(type)} {type}
                                              {index < Math.min(mealTypes.length - 1, 2) && ', '}
                                            </span>
                                          ))}
                                          {mealTypes.length > 3 && ` +${mealTypes.length - 3}`}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground">
                                        Sem refeições
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Plans */}
        {completedPlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-green-600" />
              Planos Concluídos
            </h2>
            
            <div className="grid gap-4">
              {completedPlans.map((plan) => (
                <Card key={plan.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">{plan.plan_title}</h4>
                          <p className="text-sm text-green-600">
                            Concluído em {format(new Date(plan.updated_at), 'dd MMM yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">
                        {plan.target_days} dias completos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {nutritionPlans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Apple className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum Plano Alimentar Ativo</h3>
              <p className="text-muted-foreground mb-6">
                Comece sua jornada alimentar escolhendo um plano!
              </p>
              <Button asChild>
                <a href="/planos">Explorar Planos</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Nutrition;