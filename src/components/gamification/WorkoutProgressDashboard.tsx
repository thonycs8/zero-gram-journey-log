import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Trophy, Target, Zap, CheckCircle, Calendar, Clock } from 'lucide-react';
import { useDetailedCheckpoints } from '@/hooks/useDetailedCheckpoints';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutProgressDashboardProps {
  userPlan: any;
  onViewDetails?: () => void;
}

export const WorkoutProgressDashboard = ({ userPlan, onViewDetails }: WorkoutProgressDashboardProps) => {
  const {
    exerciseCheckpoints,
    workoutSessions,
    getTodaysStats,
    getExercisesBySession
  } = useDetailedCheckpoints();

  const todaysStats = getTodaysStats();
  const exercisesBySession = getExercisesBySession();
  
  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todaysExercises = exerciseCheckpoints.filter(ex => ex.workout_date === today);
  const todaysSession = workoutSessions.find(ws => ws.workout_date === today);
  
  // Calculate progress
  const completedExercises = todaysExercises.filter(ex => ex.is_completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercent = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Today's Workout Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Progresso de Hoje
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Exercícios Completados</span>
              <span className="text-sm text-muted-foreground">
                {completedExercises}/{totalExercises}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <Dumbbell className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{completedExercises}</div>
              <div className="text-xs text-muted-foreground">Exercícios</div>
            </div>
            
            <div className="bg-green-500/5 p-4 rounded-lg text-center">
              <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">+{todaysStats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Pontos</div>
            </div>
            
            <div className="bg-yellow-500/5 p-4 rounded-lg text-center">
              <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{todaysStats.completedWorkouts}</div>
              <div className="text-xs text-muted-foreground">Treinos</div>
            </div>
          </div>

          {/* Session status */}
          {todaysSession && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={todaysSession.is_completed ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {todaysSession.is_completed ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {todaysSession.is_completed ? 'Concluído' : 'Em Progresso'}
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  {todaysSession.session_name}
                </span>
              </div>
              
              {todaysSession.started_at && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Iniciado: {format(new Date(todaysSession.started_at), 'HH:mm')}
                  </span>
                  {todaysSession.completed_at && (
                    <span>
                      Concluído: {format(new Date(todaysSession.completed_at), 'HH:mm')}
                    </span>
                  )}
                  {todaysSession.total_duration_minutes && (
                    <span>
                      Duração: {todaysSession.total_duration_minutes}min
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Completed exercises list */}
          {todaysExercises.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Exercícios de Hoje
              </h4>
              <div className="space-y-2">
                {todaysExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      exercise.is_completed 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {exercise.is_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                      )}
                      <div>
                        <div className="font-medium">{exercise.exercise_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.sets_completed}/{exercise.total_sets} séries
                          {exercise.reps_completed && ` • ${exercise.reps_completed} reps`}
                          {exercise.weight_used && ` • ${exercise.weight_used}kg`}
                        </div>
                      </div>
                    </div>
                    
                    {exercise.is_completed && (
                      <Badge variant="outline" className="text-green-600">
                        +{exercise.points_earned} pts
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};