import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SimpleExerciseCard } from './SimpleExerciseCard';
import { WorkoutDaySelector } from './WorkoutDaySelector';
import { Play, Pause, CheckCircle, Trophy, Timer, Dumbbell, Zap, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveWorkoutManagerProps {
  userPlan: any;
  workoutDetails: any;
  planDays: Array<{
    dayNumber: number;
    exercises: any[];
    dayTitle: string;
  }>;
  userProgress: any;
  onCompleteWorkout: (dayNumber: number, exercises: any[]) => Promise<void>;
  onStartWorkout: (dayNumber: number) => Promise<void>;
  onCompleteExercise: (exerciseId: string, setsCompleted: number, repsCompleted?: string, weightUsed?: number, notes?: string) => Promise<void>;
}

export const ActiveWorkoutManager = ({
  userPlan,
  workoutDetails,
  planDays,
  userProgress,
  onCompleteWorkout,
  onStartWorkout,
  onCompleteExercise
}: ActiveWorkoutManagerProps) => {
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [sessionExercises, setSessionExercises] = useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Timer para cronometrar o treino
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime && activeSession) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStartTime, activeSession]);

  // Use planDays from props instead of grouping
  const workoutDays = planDays;
  const selectedDayData = workoutDays.find(day => day.dayNumber === selectedDay);
  const selectedDayExercises = selectedDayData?.exercises || [];
  const selectedDayTitle = selectedDayData?.dayTitle || `Dia ${selectedDay}`;

  const handleSelectDay = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    // Reset active session if changing days
    if (activeSession && activeSession.dayNumber !== dayNumber) {
      setActiveSession(null);
      setSessionExercises([]);
      setSessionStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleStartWorkout = async () => {
    try {
      await onStartWorkout(selectedDay);
      
      // Criar sessão local de treino
      const session = {
        id: `session-${Date.now()}`,
        dayNumber: selectedDay,
        startTime: new Date(),
        exercises: selectedDayExercises.map(ex => ({
          ...ex,
          completed: false,
          setsCompleted: 0,
          repsCompleted: '',
          weightUsed: 0,
          notes: ''
        }))
      };
      
      setActiveSession(session);
      setSessionExercises(session.exercises);
      setSessionStartTime(new Date());
      setElapsedTime(0);
      
      toast({
        title: "Treino Iniciado! 💪",
        description: `Dia ${selectedDay} - ${selectedDayExercises.length} exercícios`,
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o treino",
        variant: "destructive"
      });
    }
  };

  const handleCompleteExerciseInSession = async (
    exerciseId: string, 
    setsCompleted: number, 
    repsCompleted?: string, 
    weightUsed?: number, 
    notes?: string
  ) => {
    try {
      // Mark exercise as completed in local state
      setSessionExercises(prev => 
        prev.map(ex => 
          ex.id === exerciseId 
            ? { ...ex, completed: true, setsCompleted, repsCompleted, weightUsed, exerciseNotes: notes }
            : ex
        )
      );
      
      // Add to completed exercises set
      setCompletedExercises(prev => new Set([...prev, exerciseId]));
      
      // Call the parent handler which should create/update exercise checkpoint
      await onCompleteExercise(exerciseId, setsCompleted, repsCompleted, weightUsed, notes);
      
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const handleCompleteWorkoutSession = async () => {
    try {
      const completedExercises = sessionExercises.filter(ex => ex.completed);
      
      await onCompleteWorkout(selectedDay, completedExercises);
      
      // Animação de conclusão
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Reset session
      setActiveSession(null);
      setSessionExercises([]);
      setSessionStartTime(null);
      setElapsedTime(0);
      
      toast({
        title: "Treino Concluído! 🎉",
        description: `Dia ${selectedDay} finalizado com sucesso. +50 pontos bônus!`,
      });
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionProgress = () => {
    if (!sessionExercises.length) return 0;
    const completed = sessionExercises.filter(ex => ex.completed).length;
    return (completed / sessionExercises.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Dia */}
      {!activeSession && (
        <WorkoutDaySelector
          workoutPlan={workoutDetails}
          workoutDays={workoutDays}
          onSelectDay={handleSelectDay}
          selectedDay={selectedDay}
          userProgress={userProgress}
        />
      )}

      {/* Sessão Ativa */}
      {activeSession && (
        <Card className="border-primary">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Dia {activeSession.dayNumber}: {selectedDayTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {sessionExercises.length} exercícios | Iniciado às {format(sessionStartTime!, 'HH:mm')}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Timer className="h-5 w-5" />
                  {formatTime(elapsedTime)}
                </div>
                <Badge variant="default">
                  {sessionExercises.filter(ex => ex.completed).length}/{sessionExercises.length} completos
                </Badge>
              </div>
            </div>
            <Progress value={getSessionProgress()} className="h-2" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {sessionExercises.map((exercise) => (
                <SimpleExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onComplete={handleCompleteExerciseInSession}
                />
              ))}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleCompleteWorkoutSession}
                  disabled={sessionExercises.filter(ex => ex.completed).length === 0}
                  className="flex-1"
                  size="lg"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Finalizar Treino do Dia {activeSession.dayNumber}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveSession(null);
                    setSessionExercises([]);
                    setSessionStartTime(null);
                    setElapsedTime(0);
                  }}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview do Dia Selecionado */}
      {!activeSession && selectedDayExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dia {selectedDay}: {selectedDayTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedDayExercises.length} exercícios programados
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {selectedDayExercises.map((exercise, idx) => (
                <div key={exercise.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{exercise.exercise_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} séries × {exercise.reps} repetições
                      {exercise.rest_seconds && ` • ${exercise.rest_seconds}s descanso`}
                    </div>
                  </div>
                  <Badge variant="outline">{exercise.sets} × {exercise.reps}</Badge>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleStartWorkout}
              size="lg"
              className="w-full"
            >
              <Play className="h-5 w-5 mr-2" />
              Iniciar Treino do Dia {selectedDay}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mensagem se não há exercícios */}
      {!activeSession && selectedDayExercises.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum exercício programado</h3>
            <p className="text-muted-foreground">
              Não há exercícios programados para o Dia {selectedDay} deste plano.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};