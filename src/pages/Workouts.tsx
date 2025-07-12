
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import { useDetailedPlans } from '@/hooks/useDetailedPlans';
import { useDetailedCheckpoints } from '@/hooks/useDetailedCheckpoints';
import { DetailedExerciseCard } from '@/components/workouts/DetailedExerciseCard';
import { WorkoutExerciseChecklist } from '@/components/workouts/WorkoutExerciseChecklist';
import { WorkoutCardManager } from '@/components/workouts/WorkoutCardManager';
import { CheckCircle, Calendar, Target, Dumbbell, Clock, Trophy, Plus, Timer, Zap, Play, BarChart3 } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActiveWorkoutManager } from '@/components/workouts/ActiveWorkoutManager';

const Workouts = () => {
  const { user } = useAuth();
  const { 
    userPlans, 
    checkpoints, 
    loading: gamificationLoading, 
    completeCheckpoint, 
    getTodaysCheckpoints,
    getPlanProgress 
  } = useGamification();

  const {
    workoutExercises,
    getExercisesForDay,
    getWorkoutPlanDays,
    getWorkoutPlan,
    loading: plansLoading
  } = useDetailedPlans();

  const {
    exerciseCheckpoints,
    workoutSessions,
    loading: checkpointsLoading,
    initializeWorkoutSession,
    completeExercise,
    startWorkoutSession,
    getTodaysStats,
    getExercisesBySession
  } = useDetailedCheckpoints();

  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<string | null>(null);

  const workoutPlans = userPlans.filter(plan => plan.plan_type === 'workout');
  const activePlans = workoutPlans.filter(plan => !plan.is_completed);
  const completedPlans = workoutPlans.filter(plan => plan.is_completed);
  const todaysCheckpoints = getTodaysCheckpoints();
  const todaysStats = getTodaysStats();
  const exercisesBySession = getExercisesBySession();

  const handleCompleteCheckpoint = async (planId: string) => {
    await completeCheckpoint(planId, 'Treino concluído hoje');
  };

  const handleStartWorkout = async (plan: any) => {
    const workoutDetails = getWorkoutPlan(plan.plan_id.toString());
    const currentDay = getCurrentWeekDay();
    const todaysExercises = getExercisesForDay(plan.plan_id.toString(), currentDay);

    if (todaysExercises.length === 0) return;

    // Check if session already exists
    const existingSession = workoutSessions.find(
      session => session.user_plan_id === plan.id && 
      session.workout_date === new Date().toISOString().split('T')[0]
    );

    if (existingSession) {
      setActiveWorkoutSession(existingSession.id);
      if (!existingSession.started_at) {
        await startWorkoutSession(existingSession.id);
      }
    } else {
      // Create new session
      const exercises = todaysExercises.map(exercise => ({
        exercise_id: exercise.id,
        exercise_name: exercise.exercise_name,
        total_sets: exercise.sets || 3
      }));

      const result = await initializeWorkoutSession(
        plan.id,
        plan.plan_id.toString(),
        `${workoutDetails?.title || plan.plan_title} - ${getDayName(currentDay)}`,
        exercises
      );

      if (result?.session) {
        setActiveWorkoutSession(result.session.id);
        await startWorkoutSession(result.session.id);
      }
    }
  };

  const handleCompleteExercise = async (
    exerciseId: string,
    setsCompleted: number,
    repsCompleted?: string,
    weightUsed?: number,
    notes?: string
  ) => {
    // First check if an exercise checkpoint already exists for today
    const today = new Date().toISOString().split('T')[0];
    const existingCheckpoint = exerciseCheckpoints.find(
      checkpoint => checkpoint.exercise_id === exerciseId && checkpoint.workout_date === today
    );

    if (existingCheckpoint) {
      // Update existing checkpoint
      await completeExercise(existingCheckpoint.id, setsCompleted, repsCompleted, weightUsed, notes);
    } else {
      // Find the exercise details
      const exercise = workoutExercises.find(ex => ex.id === exerciseId);
      if (exercise && user) {
        // Create new exercise checkpoint
        const userPlan = workoutPlans.find(plan => plan.plan_id.toString() === exercise.workout_plan_id);
        if (userPlan) {
          const checkpoints = await initializeWorkoutSession(
            userPlan.id,
            exercise.workout_plan_id,
            `${exercise.exercise_name} - Treino Individual`,
            [{
              exercise_id: exerciseId,
              exercise_name: exercise.exercise_name,
              total_sets: exercise.sets || 3
            }]
          );
          
          if (checkpoints?.checkpoints?.[0]) {
            await completeExercise(checkpoints.checkpoints[0].id, setsCompleted, repsCompleted, weightUsed, notes);
          }
        }
      }
    }
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

  if (gamificationLoading || plansLoading || checkpointsLoading) {
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

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{todaysStats.completedExercises}</div>
                  <div className="text-sm text-muted-foreground">Exercícios Hoje</div>
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
                  <div className="text-2xl font-bold">{todaysStats.completedWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Treinos Concluídos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+{todaysStats.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Pontos Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(todaysStats.exerciseProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Progresso</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Workout Plans */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Treinos Ativos
            </h2>
          </div>

          {activePlans.length > 0 ? (
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
                        <div className="flex gap-2 items-center">
                          <Badge variant="default">Treino</Badge>
                          <WorkoutCardManager 
                            plan={plan}
                            onPlanUpdated={() => window.location.reload()}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso do Plano</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {checkpoints.filter(cp => cp.user_plan_id === plan.id && cp.completed).length} de {plan.target_days} dias concluídos
                          </span>
                          <span>
                            {plan.target_days - checkpoints.filter(cp => cp.user_plan_id === plan.id && cp.completed).length} dias restantes
                          </span>
                        </div>
                      </div>

                      {/* Brief Plan Summary */}
                      <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">💪</span>
                          <div>
                            <p className="text-sm font-medium">{plan.plan_title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {workoutDetails?.description || 'Plano de treino personalizado para alcançar seus objetivos de forma eficiente e progressiva'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Motivational Tip */}
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-2">
                          <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">💡</div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Dica do Dia</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                              {todaysExercises.length > 0 
                                ? "Mantenha o foco na execução correta dos exercícios. Qualidade sempre supera quantidade!"
                                : "Use dias de descanso para alongamentos leves e hidratação. A recuperação é parte do crescimento!"
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Workout Tabs */}
                      <Tabs defaultValue="hoje" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="hoje">Hoje</TabsTrigger>
                          <TabsTrigger value="semana">Semana</TabsTrigger>
                          <TabsTrigger value="progresso">Progresso</TabsTrigger>
                        </TabsList>

                        <TabsContent value="hoje" className="space-y-4">
                          <ActiveWorkoutManager
                            userPlan={plan}
                            workoutDetails={workoutDetails}
                            planDays={getWorkoutPlanDays(plan.plan_id.toString())}
                            userProgress={{
                              completedDays: checkpoints.filter(cp => cp.user_plan_id === plan.id && cp.completed)
                                .map(cp => ({ planDay: 1, completedDate: cp.checkpoint_date, completed: true }))
                            }}
                            onCompleteWorkout={async (dayNumber: number, exercises: any[]) => {
                              await handleCompleteCheckpoint(plan.id);
                            }}
                            onStartWorkout={async (dayNumber: number) => {
                              await handleStartWorkout(plan);
                            }}
                            onCompleteExercise={handleCompleteExercise}
                          />
                        </TabsContent>

                        <TabsContent value="semana" className="space-y-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Agenda Semanal</h4>
                            <div className="grid gap-3">
                              {Array.from({ length: 7 }, (_, i) => {
                                const dayDate = addDays(startOfWeek(new Date()), i);
                                const dayOfWeek = dayDate.getDay();
                                const dayExercises = getExercisesForDay(plan.plan_id.toString(), dayOfWeek);
                                const isToday = dayDate.toDateString() === new Date().toDateString();

                                return (
                                  <Card key={i} className={`p-3 ${isToday ? 'ring-2 ring-primary' : ''}`}>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium text-sm">
                                          {format(dayDate, 'EEEE', { locale: ptBR })}
                                          {isToday && <Badge variant="default" className="ml-2 text-xs">Hoje</Badge>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {format(dayDate, 'dd/MM', { locale: ptBR })}
                                        </div>
                                      </div>
                                      <div className="text-sm">
                                        {dayExercises.length > 0 ? (
                                          <div className="flex items-center gap-2">
                                            <span className="text-primary font-medium">{dayExercises.length}</span>
                                            <span className="text-muted-foreground">exercícios</span>
                                          </div>
                                        ) : (
                                          <span className="text-muted-foreground text-xs">Descanso</span>
                                        )}
                                      </div>
                                    </div>
                                    {dayExercises.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-border/50">
                                        <div className="grid gap-1">
                                          {dayExercises.slice(0, 3).map((ex, idx) => (
                                            <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                                              {ex.exercise_name}
                                            </div>
                                          ))}
                                          {dayExercises.length > 3 && (
                                            <div className="text-xs text-muted-foreground">
                                              +{dayExercises.length - 3} mais exercícios
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="progresso" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Progresso do Plano</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                                <div className="text-xs text-muted-foreground">
                                  {checkpoints.filter(cp => cp.user_plan_id === plan.id && cp.completed).length} de {plan.target_days} dias
                                </div>
                                <Progress value={progress} className="mt-2" />
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Exercícios Hoje</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-green-600">{todaysStats.completedExercises}</div>
                                <div className="text-xs text-muted-foreground">de {todaysStats.totalExercises} exercícios</div>
                                {todaysStats.totalExercises > 0 && (
                                  <Progress 
                                    value={(todaysStats.completedExercises / todaysStats.totalExercises) * 100} 
                                    className="mt-2" 
                                  />
                                )}
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Pontos Ganhos</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{todaysStats.totalPoints}</div>
                                <div className="text-xs text-muted-foreground">pontos hoje</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Dias Restantes</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                  {plan.target_days - checkpoints.filter(cp => cp.user_plan_id === plan.id && cp.completed).length}
                                </div>
                                <div className="text-xs text-muted-foreground">dias para completar</div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum treino ativo</h3>
              <p className="text-muted-foreground mb-4">
                Escolha um plano de treino para começar.
              </p>
              <Button asChild>
                <a href="/planos">Escolher Treino</a>
              </Button>
            </div>
          )}
        </div>

        {/* Completed Plans */}
        {completedPlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-green-600" />
              Treinos Concluídos
            </h2>
            
            <div className="grid gap-4">
              {completedPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{plan.plan_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Concluído em {format(new Date(plan.start_date), 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          ✓ Completo
                        </Badge>
                        <WorkoutCardManager 
                          plan={plan} 
                          onPlanUpdated={() => window.location.reload()} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {workoutPlans.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhum plano de treino</h3>
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
