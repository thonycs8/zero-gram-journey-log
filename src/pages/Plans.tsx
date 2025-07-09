import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Apple, Clock, Target } from 'lucide-react';
import { CreateWorkoutPlanDialog } from '@/components/plans/CreateWorkoutPlanDialog';
import { CreateMealPlanDialog } from '@/components/plans/CreateMealPlanDialog';

const Plans = () => {
  const { t } = useTranslation();
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);

  const workoutPlans = [
    {
      id: 1,
      title: "Treino de Força",
      description: "Plano focado no ganho de força e massa muscular",
      duration: "8 semanas",
      difficulty: "Intermediário",
      frequency: "4x/semana",
      icon: "💪",
      color: "from-red-400 to-red-600"
    },
    {
      id: 2,
      title: "Cardio Intenso",
      description: "Treino cardiovascular para queima de gordura",
      duration: "6 semanas",
      difficulty: "Avançado",
      frequency: "5x/semana",
      icon: "🏃",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "Iniciante Total",
      description: "Plano completo para quem está começando",
      duration: "4 semanas",
      difficulty: "Iniciante",
      frequency: "3x/semana",
      icon: "🌱",
      color: "from-green-400 to-green-600"
    }
  ];

  const mealPlans = [
    {
      id: 1,
      title: "Dieta Equilibrada",
      description: "Plano alimentar balanceado para manutenção",
      calories: "2000 cal/dia",
      duration: "30 dias",
      goal: "Manutenção",
      icon: "🥗",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      id: 2,
      title: "Ganho de Massa",
      description: "Dieta hipercalórica para ganho de peso",
      calories: "2800 cal/dia",
      duration: "45 dias",
      goal: "Ganho de Peso",
      icon: "🍖",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: 3,
      title: "Emagrecimento",
      description: "Plano de déficit calórico controlado",
      calories: "1600 cal/dia",
      duration: "60 dias",
      goal: "Perda de Peso",
      icon: "🍎",
      color: "from-pink-400 to-pink-600"
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
            className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setWorkoutDialogOpen(true)}
          >
            <div className="absolute -top-10 -right-10 opacity-10">
              <Dumbbell size={120} />
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('dashboard.createPersonalizedWorkout')}</CardTitle>
              <CardDescription className="text-base">
                {t('dashboard.createPersonalizedWorkoutDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {t('dashboard.createWorkoutPlan')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-green-100 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setMealDialogOpen(true)}
          >
            <div className="absolute -top-10 -right-10 opacity-10">
              <Apple size={120} />
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Apple className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Criar Plano Alimentar Personalizado</CardTitle>
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

        {/* Workout Plans Section */}
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
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-xl">{plan.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {plan.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-center justify-between text-sm">
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
            ))}
          </div>
        </div>

        {/* Meal Plans Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Planos <span className="gradient-primary bg-clip-text text-transparent">Alimentares</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dietas balanceadas para complementar seus treinos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mealPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-xl">{plan.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {plan.goal}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.calories}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dialogs */}
        <CreateWorkoutPlanDialog 
          open={workoutDialogOpen} 
          onOpenChange={setWorkoutDialogOpen} 
        />
        <CreateMealPlanDialog 
          open={mealDialogOpen} 
          onOpenChange={setMealDialogOpen} 
        />
      </div>
    </div>
  );
};

export default Plans;