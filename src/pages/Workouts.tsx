import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { useDetailedPlans } from '@/hooks/useDetailedPlans';
import { useDetailedCheckpoints } from '@/hooks/useDetailedCheckpoints';
import { DetailedExerciseCard } from '@/components/workouts/DetailedExerciseCard';
import { WorkoutExerciseChecklist } from '@/components/workouts/WorkoutExerciseChecklist';
import { WorkoutCardManager } from '@/components/workouts/WorkoutCardManager';
import { CheckCircle, Calendar, Target, Dumbbell, Clock, Trophy, Plus, Timer, Zap, Play, BarChart3 } from 'lucide-react';
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
    checkpointId: string,
    setsCompleted: number,
    repsCompleted?: string,
    weightUsed?: number,
    notes?: string
  ) => {
    await completeExercise(checkpointId, setsCompleted, repsCompleted, weightUsed, notes);
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
                          <span>Progresso</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>

                      {/* Enhanced Workout Tabs */}
                      <Tabs defaultValue="session" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="session">Sessão</TabsTrigger>
                          <TabsTrigger value="routine">Rotina</TabsTrigger>
                          <TabsTrigger value="analytics">Analytics</TabsTrigger>
                          <TabsTrigger value="schedule">Agenda</TabsTrigger>
                        </TabsList>

                        <TabsContent value="session" className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium">{getDayName(currentDay)} - Treino do Dia</h4>
                                <p className="text-sm text-muted-foreground">
                                  {todaysExercises.length} exercícios programados
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {!activeWorkoutSession && todaysExercises.length > 0 && (
                                  <Button
                                    onClick={() => handleStartWorkout(plan)}
                                    variant="default"
                                    size="sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Iniciar Treino
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleCompleteCheckpoint(plan.id)}
                                  disabled={todayCompleted}
                                  variant={todayCompleted ? "outline" : "secondary"}
                                  size="sm"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {todayCompleted ? 'Concluído!' : 'Finalizar Treino'}
                                </Button>
                              </div>
                            </div>

                            {todaysExercises.length > 0 ? (
                              <div className="space-y-4">
                                {exercisesBySession.has(plan.id) ? (
                                  <div className="space-y-3">
                                    <div className="text-sm font-medium text-green-600 mb-3">
                                      ✨ Modo Treino Detalhado Ativado
                                    </div>
                                    {exercisesBySession.get(plan.id)?.map((exerciseCheckpoint) => (
                                      <DetailedExerciseCard
                                        key={exerciseCheckpoint.id}
                                        exercise={exerciseCheckpoint}
                                        onComplete={handleCompleteExercise}
                                      />
                                    ))}
                                  </div>
                                ) : (
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
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <div className="text-4xl mb-2">💪</div>
                                <p>Dia de descanso ou sem exercícios programados</p>
                                <p className="text-sm mt-1">Aproveite para relaxar!</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="routine" className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-4">Programa Gamificado</h4>
                            <WorkoutExerciseChecklist 
                              workoutId={plan.plan_id} 
                              onCompleteWorkout={(completed, total) => {
                                console.log(`Workout completed: ${completed}/${total} exercises`);
                              }}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Progresso Semanal</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                                <div className="text-xs text-muted-foreground">Meta atual</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Exercícios Hoje</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-green-600">{todaysStats.completedExercises}</div>
                                <div className="text-xs text-muted-foreground">de {todaysStats.totalExercises} exercícios</div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Agenda da Semana</h4>
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
                                          {format(dayDate, 'dd MMM', { locale: ptBR })}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-medium">
                                          {dayExercises.length} exercícios
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {dayExercises.length === 0 ? 'Descanso' : 'Treino'}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
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
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✓ Completo
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