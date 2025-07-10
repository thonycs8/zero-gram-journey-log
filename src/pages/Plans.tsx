
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Apple, Clock, Target, Users, TrendingUp, Zap } from 'lucide-react';
import { CreateWorkoutPlanDialog } from '@/components/plans/CreateWorkoutPlanDialog';
import { CreateMealPlanDialog } from '@/components/plans/CreateMealPlanDialog';
import { DietDetailsDialog } from '@/components/plans/DietDetailsDialog';
import { WorkoutDetailsDialog } from '@/components/plans/WorkoutDetailsDialog';
import { MealPlanDetailsDialog } from '@/components/plans/MealPlanDetailsDialog';
import { useAds } from '@/hooks/useAds';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSquare } from '@/components/ads/AdSquare';

const Plans = () => {
  const { t } = useTranslation();
  const { shouldShowAds } = useAds();

  const dietTypes = [
    {
      id: 1,
      title: "Dieta Proteica",
      description: "Rica em proteínas para ganho de massa muscular e saciedade",
      icon: "🥩",
      color: "from-red-400 to-red-600",
      features: ["Alto teor proteico", "Baixo carboidrato", "Saciedade prolongada"],
      macros: "40% Proteína, 30% Gordura, 30% Carboidrato"
    },
    {
      id: 2,
      title: "Dieta Mediterrânea",
      description: "Baseada nos padrões alimentares tradicionais do Mediterrâneo",
      icon: "🫒",
      color: "from-blue-400 to-blue-600",
      features: ["Rico em azeite", "Peixes e frutos do mar", "Frutas e vegetais"],
      macros: "15% Proteína, 35% Gordura, 50% Carboidrato"
    },
    {
      id: 3,
      title: "Dieta Vegana",
      description: "100% baseada em plantas, rica em fibras e nutrientes",
      icon: "🌱",
      color: "from-green-400 to-green-600",
      features: ["Base em plantas", "Rica em fibras", "Sustentável"],
      macros: "15% Proteína, 25% Gordura, 60% Carboidrato"
    }
  ];

  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<typeof dietTypes[0] | null>(null);
  const [dietDialogOpen, setDietDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<typeof workoutPlans[0] | null>(null);
  const [workoutDetailsDialogOpen, setWorkoutDetailsDialogOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<typeof mealPlans[0] | null>(null);
  const [mealPlanDetailsDialogOpen, setMealPlanDetailsDialogOpen] = useState(false);

  const handleDietClick = (diet: typeof dietTypes[0]) => {
    setSelectedDiet(diet);
    setDietDialogOpen(true);
  };

  const handleWorkoutClick = (workout: typeof workoutPlans[0]) => {
    setSelectedWorkout(workout);
    setWorkoutDetailsDialogOpen(true);
  };

  const handleMealPlanClick = (mealPlan: typeof mealPlans[0]) => {
    setSelectedMealPlan(mealPlan);
    setMealPlanDetailsDialogOpen(true);
  };

  const workoutPlans = [
    {
      id: 1,
      title: "Treino de Força",
      description: "Plano focado no ganho de força e massa muscular com exercícios compostos",
      duration: "8 semanas",
      difficulty: "Intermediário",
      frequency: "4x/semana",
      icon: "💪",
      color: "from-red-400 to-red-600",
      features: ["Supino e agachamento", "Levantamento terra", "Exercícios compostos"]
    },
    {
      id: 2,
      title: "Cardio Intenso",
      description: "Treino cardiovascular de alta intensidade para queima de gordura",
      duration: "6 semanas",
      difficulty: "Avançado",
      frequency: "5x/semana",
      icon: "🏃",
      color: "from-blue-400 to-blue-600",
      features: ["HIIT", "Corrida intervalada", "Exercícios funcionais"]
    },
    {
      id: 3,
      title: "Iniciante Total",
      description: "Plano completo e seguro para quem está começando a treinar",
      duration: "4 semanas",
      difficulty: "Iniciante",
      frequency: "3x/semana",
      icon: "🌱",
      color: "from-green-400 to-green-600",
      features: ["Adaptação muscular", "Técnica básica", "Progressão gradual"]
    }
  ];

  const mealPlans = [
    {
      id: 1,
      title: "Dieta Equilibrada",
      description: "Plano alimentar balanceado para manutenção do peso ideal",
      calories: "2000 cal/dia",
      duration: "30 dias",
      goal: "Manutenção",
      icon: "🥗",
      color: "from-emerald-400 to-emerald-600",
      features: ["Refeições balanceadas", "Variedade nutricional", "Sustentável"]
    },
    {
      id: 2,
      title: "Ganho de Massa",
      description: "Dieta hipercalórica rica em proteínas para ganho de peso",
      calories: "2800 cal/dia",
      duration: "45 dias",
      goal: "Ganho de Peso",
      icon: "🍖",
      color: "from-orange-400 to-orange-600",
      features: ["Alta proteína", "Surplus calórico", "Timing nutricional"]
    },
    {
      id: 3,
      title: "Emagrecimento",
      description: "Plano de déficit calórico controlado para perda de peso saudável",
      calories: "1600 cal/dia",
      duration: "60 dias",
      goal: "Perda de Peso",
      icon: "🍎",
      color: "from-pink-400 to-pink-600",
      features: ["Déficit sustentável", "Saciedade", "Metabolismo ativo"]
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-16 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Seus <span className="gradient-primary bg-clip-text text-transparent">Planos</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie e gerencie seus planos de treino e alimentação personalizados
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card 
            className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => setWorkoutDialogOpen(true)}
          >
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Dumbbell size={120} />
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Criar Plano de Treino</CardTitle>
              <CardDescription className="text-base">
                Quer um treino feito especialmente para ti? Define os teus objetivos e cria um plano personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Plano de Treino
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-green-100 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => setMealDialogOpen(true)}
          >
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Apple size={120} />
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Apple className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Criar Plano Alimentar</CardTitle>
              <CardDescription className="text-base">
                Quer uma dieta feita especialmente para ti? Define os teus objetivos e cria um plano personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Plano Alimentar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ad Banner between sections */}
        {shouldShowAds && (
          <AdBanner size="large" className="my-8" />
        )}

        {/* Workout Plans Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
              <Dumbbell className="h-8 w-8 text-primary" />
              Planos de <span className="gradient-primary bg-clip-text text-transparent">Treino</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Treinos personalizados para atingir os seus objetivos de fitness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {workoutPlans.map((plan, index) => (
              <div key={plan.id} className="flex flex-col">
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary flex-1"
                  onClick={() => handleWorkoutClick(plan)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-white text-xl">{plan.icon}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {plan.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.frequency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Ad Square between specific cards */}
                {shouldShowAds && index === 1 && (
                  <div className="mt-6">
                    <AdSquare size="medium" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ad Banner between workout and meal sections */}
        {shouldShowAds && (
          <AdBanner size="medium" className="my-8" />
        )}

        {/* Meal Plans Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
              <Apple className="h-8 w-8 text-green-600" />
              Planos <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Alimentares</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dietas balanceadas para complementar seus treinos e alcançar seus objetivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mealPlans.map((plan, index) => (
              <div key={plan.id} className="flex flex-col">
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-green-200 hover:border-l-green-500 flex-1"
                  onClick={() => handleMealPlanClick(plan)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-white text-xl">{plan.icon}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {plan.goal}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-green-600">{plan.calories}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Ad Square after second meal plan */}
                {shouldShowAds && index === 1 && (
                  <div className="mt-6">
                    <AdSquare size="small" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ad Banner between sections */}
        {shouldShowAds && (
          <AdBanner size="medium" className="my-8" />
        )}

        {/* Diet Types Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
              <Apple className="h-8 w-8 text-purple-600" />
              Tipos de <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">Dieta</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o tipo de alimentação que melhor se adapta ao seu estilo de vida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {dietTypes.map((diet, index) => (
              <div key={diet.id} className="flex flex-col">
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-purple-200 hover:border-l-purple-500 flex-1"
                  onClick={() => handleDietClick(diet)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${diet.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-white text-xl">{diet.icon}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{diet.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1 border-purple-200 text-purple-700">
                          Especializada
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{diet.description}</p>
                    
                    <div className="space-y-2">
                      {diet.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Distribuição de Macros:</div>
                      <div className="text-sm font-medium text-purple-600">{diet.macros}</div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Ad Square after second diet type */}
                {shouldShowAds && index === 1 && (
                  <div className="mt-6">
                    <AdSquare size="small" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final Ad Banner */}
        {shouldShowAds && (
          <AdBanner size="medium" className="mt-12" />
        )}

        {/* Dialogs */}
        <CreateWorkoutPlanDialog 
          open={workoutDialogOpen} 
          onOpenChange={setWorkoutDialogOpen} 
        />
        <CreateMealPlanDialog 
          open={mealDialogOpen} 
          onOpenChange={setMealDialogOpen} 
        />
        <DietDetailsDialog 
          diet={selectedDiet}
          open={dietDialogOpen} 
          onOpenChange={setDietDialogOpen} 
        />
        <WorkoutDetailsDialog 
          workout={selectedWorkout}
          open={workoutDetailsDialogOpen} 
          onOpenChange={setWorkoutDetailsDialogOpen} 
        />
        <MealPlanDetailsDialog 
          mealPlan={selectedMealPlan}
          open={mealPlanDetailsDialogOpen} 
          onOpenChange={setMealPlanDetailsDialogOpen} 
        />
      </div>
    </div>
  );
};

export default Plans;
