import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { useDetailedPlans } from '@/hooks/useDetailedPlans';
import { CheckCircle, Calendar, Target, Dumbbell, Clock, Trophy, Plus, Timer, Zap } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Workouts = () => {
  const { 
    userPlans, 
    checkpoints, 
    loading: gamificationLoading, 
    completeCheckpoint, 
    getTodaysCheckpoints,
    getPlanProgress 
  } = useGamification();

  const {
    getExercisesForDay,
    getWorkoutPlan,
    loading: plansLoading
  } = useDetailedPlans();

  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});

  const workoutPlans = userPlans.filter(plan => plan.plan_type === 'workout');
  const activePlans = workoutPlans.filter(plan => !plan.is_completed);
  const completedPlans = workoutPlans.filter(plan => plan.is_completed);
  const todaysCheckpoints = getTodaysCheckpoints();

  const handleCompleteCheckpoint = async (planId: string) => {
    await completeCheckpoint(planId, 'Treino concluído hoje');
  };

  const handleExerciseToggle = (exerciseId: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
  };

  const getCurrentWeekDay = () => {
    return new Date().getDay();
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
              <Dumbbell className="h-8 w-8 text-primary" />
              Meus Treinos
            </h1>
            <p className="text-muted-foreground mt-2">
              Acompanhe o progresso dos seus planos de treino com detalhes
            </p>
          </div>
          <Button asChild>
            <a href="/planos" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Escolher Treino
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
                  <div className="text-sm text-muted-foreground">Treinos Ativos</div>
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
                      userPlans.find(p => p.id === cp.user_plan_id && p.plan_type === 'workout')
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
                  <div className="text-2xl font-bold">{getDayName(getCurrentWeekDay())}</div>
                  <div className="text-sm text-muted-foreground">Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Workout Plans */}
        {activePlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Treinos Ativos
            </h2>
            
            <div className="grid gap-6">
              {activePlans.map((plan) => {
                const progress = getPlanProgress(plan);
                const todayCompleted = todaysCheckpoints.some(
                  cp => cp.user_plan_id === plan.id && cp.completed
                );
                const workoutDetails = getWorkoutPlan(plan.plan_id.toString());
                const currentDay = getCurrentWeekDay();
                const todaysExercises = getExercisesForDay(plan.plan_id.toString(), currentDay);

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
                            {workoutDetails && (
                              <Badge variant="outline">
                                {workoutDetails.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="default">Treino</Badge>
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

                      {/* Today's Workout Details */}
                      <Tabs defaultValue="today" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="today">Treino de Hoje</TabsTrigger>
                          <TabsTrigger value="week">Semana</TabsTrigger>
                        </TabsList>

                        <TabsContent value="today" className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium">{getDayName(currentDay)} - Treino do Dia</h4>
                                <p className="text-sm text-muted-foreground">
                                  {todaysExercises.length} exercícios programados
                                </p>
                              </div>
                              <Button
                                onClick={() => handleCompleteCheckpoint(plan.id)}
                                disabled={todayCompleted}
                                variant={todayCompleted ? "outline" : "default"}
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {todayCompleted ? 'Concluído!' : 'Finalizar Treino'}
                              </Button>
                            </div>

                            {todaysExercises.length > 0 ? (
                              <div className="space-y-3">
                                {todaysExercises.map((exercise, index) => (
                                  <div key={exercise.id} className="flex items-center space-x-3 p-3 bg-background rounded border">
                                    <Checkbox
                                      id={exercise.id}
                                      checked={completedExercises[exercise.id] || false}
                                      onCheckedChange={() => handleExerciseToggle(exercise.id)}
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">{exercise.exercise_name}</div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                                        <span>{exercise.sets} séries</span>
                                        <span>{exercise.reps} repetições</span>
                                        {exercise.rest_seconds && (
                                          <span className="flex items-center gap-1">
                                            <Timer className="h-3 w-3" />
                                            {Math.floor(exercise.rest_seconds / 60)}min descanso
                                          </span>
                                        )}
                                      </div>
                                      {exercise.notes && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          💡 {exercise.notes}
                                        </div>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      Ex. {index + 1}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-muted-foreground">
                                <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhum exercício programado para hoje</p>
                                <p className="text-sm">Dia de descanso ou treino livre</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="week" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                              const dayExercises = getExercisesForDay(plan.plan_id.toString(), day);
                              const isToday = day === currentDay;
                              
                              return (
                                <Card key={day} className={`${isToday ? 'ring-2 ring-primary' : ''}`}>
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">{getDayName(day)}</h4>
                                      {isToday && <Badge variant="default" className="text-xs">Hoje</Badge>}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    {dayExercises.length > 0 ? (
                                      <div className="space-y-2">
                                        {dayExercises.slice(0, 3).map((exercise) => (
                                          <div key={exercise.id} className="text-sm">
                                            <div className="font-medium">{exercise.exercise_name}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {exercise.sets}x{exercise.reps}
                                            </div>
                                          </div>
                                        ))}
                                        {dayExercises.length > 3 && (
                                          <div className="text-xs text-muted-foreground">
                                            +{dayExercises.length - 3} exercícios
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground">
                                        Descanso
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
              Treinos Concluídos
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
        {workoutPlans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum Treino Ativo</h3>
              <p className="text-muted-foreground mb-6">
                Comece sua jornada fitness escolhendo um plano de treino!
              </p>
              <Button asChild>
                <a href="/planos">Explorar Treinos</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Workouts;