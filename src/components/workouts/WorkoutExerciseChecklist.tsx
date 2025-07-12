import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Timer, Trophy, Zap, Star, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

interface WorkoutExerciseChecklistProps {
  workoutId: number;
  userPlanId?: string;
  onCompleteWorkout: (completedExercises: number, totalExercises: number) => void;
}

export const WorkoutExerciseChecklist = ({ workoutId, userPlanId, onCompleteWorkout }: WorkoutExerciseChecklistProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [currentDay, setCurrentDay] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savedExercises, setSavedExercises] = useState<Set<string>>(new Set());
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  // Load saved progress on component mount
  useEffect(() => {
    if (user && userPlanId) {
      loadSavedProgress();
    }
  }, [user, userPlanId, workoutId]);

  const loadSavedProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load exercise checkpoints for today
      const { data: exerciseData, error } = await supabase
        .from('exercise_checkpoints')
        .select('*')
        .eq('user_id', user?.id)
        .eq('user_plan_id', userPlanId)
        .eq('workout_date', today);

      if (error) throw error;

      if (exerciseData && exerciseData.length > 0) {
        const completed: { [key: string]: boolean } = {};
        const saved = new Set<string>();
        let totalPoints = 0;

        exerciseData.forEach((exercise) => {
          const exerciseKey = `${currentDay}-${exercise.exercise_name}`;
          if (exercise.is_completed) {
            completed[exerciseKey] = true;
            saved.add(exerciseKey);
            totalPoints += exercise.points_earned;
          }
        });

        setCompletedExercises(completed);
        setSavedExercises(saved);
        setTotalPointsEarned(totalPoints);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveExerciseProgress = async (exerciseId: string, exerciseName: string, points: number) => {
    if (!user || !userPlanId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('exercise_checkpoints')
        .upsert({
          user_id: user.id,
          user_plan_id: userPlanId,
          exercise_id: `${workoutId}-${exerciseId}`,
          exercise_name: exerciseName,
          workout_date: today,
          is_completed: true,
          points_earned: points,
          total_sets: parseInt(exercises[currentDay]?.exercises.find(ex => ex.name === exerciseName)?.sets?.replace('x', '') || '3'),
          sets_completed: parseInt(exercises[currentDay]?.exercises.find(ex => ex.name === exerciseName)?.sets?.replace('x', '') || '3'),
          reps_completed: exercises[currentDay]?.exercises.find(ex => ex.name === exerciseName)?.reps || '',
        });

      if (error) throw error;

      setSavedExercises(prev => new Set(prev).add(exerciseId));
      setTotalPointsEarned(prev => prev + points);

      // Update user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          total_points: totalPointsEarned + points,
          total_calculations: 1,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (statsError) {
        console.error('Error updating user stats:', statsError);
      }

    } catch (error) {
      console.error('Error saving exercise progress:', error);
      toast({
        title: "Erro ao salvar progresso",
        description: "Não foi possível salvar o progresso do exercício",
        variant: "destructive"
      });
    }
  };

  const getWorkoutExercises = (workoutId: number) => {
    switch (workoutId) {
      case 1: // Treino de Força
        return [
          {
            name: "Peito e Tríceps",
            exercises: [
              { name: "Supino reto", sets: "4x", reps: "8-10", rest: "2-3min" },
              { name: "Supino inclinado", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Crucifixo", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Tríceps testa", sets: "3x", reps: "10-12", rest: "90s" },
              { name: "Tríceps pulley", sets: "3x", reps: "12-15", rest: "60s" }
            ]
          },
          {
            name: "Costas e Bíceps",
            exercises: [
              { name: "Levantamento terra", sets: "4x", reps: "6-8", rest: "3min" },
              { name: "Puxada frente", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Remada curvada", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Rosca direta", sets: "3x", reps: "10-12", rest: "90s" },
              { name: "Rosca martelo", sets: "3x", reps: "12-15", rest: "60s" }
            ]
          },
          {
            name: "Pernas e Glúteos",
            exercises: [
              { name: "Agachamento livre", sets: "4x", reps: "8-10", rest: "3min" },
              { name: "Leg press", sets: "3x", reps: "12-15", rest: "2min" },
              { name: "Stiff", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Extensora", sets: "3x", reps: "15-20", rest: "90s" },
              { name: "Panturrilha", sets: "4x", reps: "15-20", rest: "60s" }
            ]
          },
          {
            name: "Ombros e Abdome",
            exercises: [
              { name: "Desenvolvimento", sets: "4x", reps: "8-10", rest: "2min" },
              { name: "Elevação lateral", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Elevação posterior", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Abdominal", sets: "3x", reps: "15-20", rest: "60s" },
              { name: "Prancha", sets: "3x", reps: "30-60s", rest: "60s" }
            ]
          }
        ];
      case 2: // Cardio Intenso
        return [
          {
            name: "HIIT Corrida",
            exercises: [
              { name: "Aquecimento", sets: "1x", reps: "5min", rest: "-" },
              { name: "Sprint", sets: "8x", reps: "30s", rest: "90s" },
              { name: "Corrida moderada", sets: "1x", reps: "10min", rest: "-" },
              { name: "Burpees", sets: "3x", reps: "10", rest: "60s" },
              { name: "Desaquecimento", sets: "1x", reps: "5min", rest: "-" }
            ]
          },
          {
            name: "Funcional",
            exercises: [
              { name: "Jumping jacks", sets: "4x", reps: "30s", rest: "30s" },
              { name: "Mountain climbers", sets: "4x", reps: "30s", rest: "30s" },
              { name: "Agachamento jump", sets: "4x", reps: "15", rest: "45s" },
              { name: "Flexão", sets: "4x", reps: "10-15", rest: "45s" },
              { name: "Prancha", sets: "3x", reps: "45s", rest: "60s" }
            ]
          },
          {
            name: "Bike/Elíptico",
            exercises: [
              { name: "Aquecimento", sets: "1x", reps: "5min", rest: "-" },
              { name: "Intervalos intensos", sets: "10x", reps: "1min", rest: "1min" },
              { name: "Ritmo moderado", sets: "1x", reps: "15min", rest: "-" },
              { name: "Cool down", sets: "1x", reps: "5min", rest: "-" }
            ]
          }
        ];
      case 3: // Iniciante Total
        return [
          {
            name: "Corpo Todo A",
            exercises: [
              { name: "Agachamento ar", sets: "3x", reps: "12-15", rest: "60s" },
              { name: "Flexão joelhos", sets: "3x", reps: "8-12", rest: "60s" },
              { name: "Remada elástico", sets: "3x", reps: "12-15", rest: "60s" },
              { name: "Prancha", sets: "3x", reps: "20-30s", rest: "60s" },
              { name: "Caminhada", sets: "1x", reps: "15min", rest: "-" }
            ]
          },
          {
            name: "Corpo Todo B",
            exercises: [
              { name: "Ponte glúteo", sets: "3x", reps: "15-20", rest: "60s" },
              { name: "Flexão parede", sets: "3x", reps: "10-15", rest: "60s" },
              { name: "Elevação perna", sets: "3x", reps: "10/lado", rest: "60s" },
              { name: "Abdominal", sets: "3x", reps: "10-15", rest: "60s" },
              { name: "Alongamento", sets: "1x", reps: "10min", rest: "-" }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const exercises = getWorkoutExercises(workoutId);
  const currentWorkout = exercises[currentDay] || exercises[0];

  const handleExerciseToggle = async (exerciseId: string) => {
    const newState = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    };
    
    setCompletedExercises(newState);

    // Check if exercise was just completed
    if (!completedExercises[exerciseId]) {
      // Save progress to database
      const exerciseIndex = parseInt(exerciseId.split('-')[1]);
      const exerciseName = currentWorkout.exercises[exerciseIndex]?.name;
      const points = 5;
      
      await saveExerciseProgress(exerciseId, exerciseName, points);

      // Show celebration animation
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 }
      });

      toast({
        title: "Exercício Concluído! 🎉",
        description: "+5 pontos ganhos e salvos",
        duration: 2000,
      });
    }

    // Check if all exercises in current day are completed
    const allCurrentDayExercises = currentWorkout.exercises.map((_, index) => 
      `${currentDay}-${index}`
    );
    const completedInCurrentDay = allCurrentDayExercises.filter(id => 
      id === exerciseId ? !completedExercises[exerciseId] : newState[id]
    ).length;

    if (completedInCurrentDay === allCurrentDayExercises.length) {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "Treino do Dia Concluído! 🏆",
        description: "+20 pontos de bônus ganhos",
        duration: 3000,
      });

      // Call parent callback
      onCompleteWorkout(completedInCurrentDay, allCurrentDayExercises.length);
    }
  };

  const getProgress = () => {
    const totalExercises = currentWorkout.exercises.length;
    const completed = currentWorkout.exercises.filter((_, index) => 
      completedExercises[`${currentDay}-${index}`]
    ).length;
    return (completed / totalExercises) * 100;
  };

  const getCompletedCount = () => {
    return currentWorkout.exercises.filter((_, index) => 
      completedExercises[`${currentDay}-${index}`]
    ).length;
  };

  const getTotalPoints = () => {
    return totalPointsEarned + (getCompletedCount() * 5) + (getProgress() === 100 ? 20 : 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with gamification */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Programa de Exercícios
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Complete cada exercício para ganhar pontos e conquistar objetivos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{getTotalPoints()}</div>
                <div className="text-xs text-muted-foreground">Pontos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{getCompletedCount()}/{currentWorkout.exercises.length}</div>
                <div className="text-xs text-muted-foreground">Exercícios</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day selector */}
      {exercises.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {exercises.map((day, index) => (
            <Button
              key={index}
              variant={currentDay === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentDay(index)}
              className="whitespace-nowrap"
            >
              Dia {index + 1}: {day.name}
            </Button>
          ))}
        </div>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso do Treino</span>
              <span className="text-sm text-muted-foreground">{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                +5 pontos por exercício
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +20 bônus ao completar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentWorkout.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentWorkout.exercises.map((exercise, index) => {
            const exerciseId = `${currentDay}-${index}`;
            const isCompleted = completedExercises[exerciseId];
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={exerciseId}
                    checked={isCompleted}
                    onCheckedChange={() => handleExerciseToggle(exerciseId)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor={exerciseId}
                        className={`font-medium cursor-pointer ${
                          isCompleted ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {exercise.name}
                      </label>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            +5 pts
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Ex. {index + 1}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {exercise.sets} séries
                      </span>
                      <span>{exercise.reps} repetições</span>
                      {exercise.rest !== '-' && (
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {exercise.rest} descanso
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Completion celebration */}
      {showCelebration && (
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300 dark:from-green-950 dark:to-blue-950 dark:border-green-700">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                Parabéns! Treino Concluído!
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
                Dicas para Manter o Foco
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Marque cada exercício conforme completa</li>
                <li>• Use o sistema de pontos como motivação</li>
                <li>• Faça pausas entre os exercícios se necessário</li>
                <li>• Celebre cada pequena vitória!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};