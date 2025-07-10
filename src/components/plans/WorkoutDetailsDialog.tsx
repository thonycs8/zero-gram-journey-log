import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, TrendingUp, Calendar, Dumbbell, Play } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  frequency: string;
  icon: string;
  color: string;
  features: string[];
}

interface WorkoutDetailsDialogProps {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkoutDetailsDialog = ({ workout, open, onOpenChange }: WorkoutDetailsDialogProps) => {
  const { createUserPlan } = useGamification();
  const { user } = useAuth();

  if (!workout) return null;

  const handleStartPlan = async () => {
    if (!user) return;
    
    const targetDays = workout.duration.includes('8') ? 56 : workout.duration.includes('6') ? 42 : 28;
    await createUserPlan('workout', workout.id, workout.title, targetDays);
    onOpenChange(false);
  };

  const getWorkoutExercises = (workoutId: number) => {
    switch (workoutId) {
      case 1: // Treino de Força
        return {
          day1: {
            name: "Peito e Tríceps",
            exercises: [
              { name: "Supino reto", sets: "4x", reps: "8-10", rest: "2-3min" },
              { name: "Supino inclinado", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Crucifixo", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Tríceps testa", sets: "3x", reps: "10-12", rest: "90s" },
              { name: "Tríceps pulley", sets: "3x", reps: "12-15", rest: "60s" }
            ]
          },
          day2: {
            name: "Costas e Bíceps",
            exercises: [
              { name: "Levantamento terra", sets: "4x", reps: "6-8", rest: "3min" },
              { name: "Puxada frente", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Remada curvada", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Rosca direta", sets: "3x", reps: "10-12", rest: "90s" },
              { name: "Rosca martelo", sets: "3x", reps: "12-15", rest: "60s" }
            ]
          },
          day3: {
            name: "Pernas e Glúteos",
            exercises: [
              { name: "Agachamento livre", sets: "4x", reps: "8-10", rest: "3min" },
              { name: "Leg press", sets: "3x", reps: "12-15", rest: "2min" },
              { name: "Stiff", sets: "3x", reps: "10-12", rest: "2min" },
              { name: "Extensora", sets: "3x", reps: "15-20", rest: "90s" },
              { name: "Panturrilha", sets: "4x", reps: "15-20", rest: "60s" }
            ]
          },
          day4: {
            name: "Ombros e Abdome",
            exercises: [
              { name: "Desenvolvimento", sets: "4x", reps: "8-10", rest: "2min" },
              { name: "Elevação lateral", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Elevação posterior", sets: "3x", reps: "12-15", rest: "90s" },
              { name: "Abdominal", sets: "3x", reps: "15-20", rest: "60s" },
              { name: "Prancha", sets: "3x", reps: "30-60s", rest: "60s" }
            ]
          }
        };
      case 2: // Cardio Intenso
        return {
          day1: {
            name: "HIIT Corrida",
            exercises: [
              { name: "Aquecimento", sets: "1x", reps: "5min", rest: "-" },
              { name: "Sprint", sets: "8x", reps: "30s", rest: "90s" },
              { name: "Corrida moderada", sets: "1x", reps: "10min", rest: "-" },
              { name: "Burpees", sets: "3x", reps: "10", rest: "60s" },
              { name: "Desaquecimento", sets: "1x", reps: "5min", rest: "-" }
            ]
          },
          day2: {
            name: "Funcional",
            exercises: [
              { name: "Jumping jacks", sets: "4x", reps: "30s", rest: "30s" },
              { name: "Mountain climbers", sets: "4x", reps: "30s", rest: "30s" },
              { name: "Agachamento jump", sets: "4x", reps: "15", rest: "45s" },
              { name: "Flexão", sets: "4x", reps: "10-15", rest: "45s" },
              { name: "Prancha", sets: "3x", reps: "45s", rest: "60s" }
            ]
          },
          day3: {
            name: "Bike/Elíptico",
            exercises: [
              { name: "Aquecimento", sets: "1x", reps: "5min", rest: "-" },
              { name: "Intervalos intensos", sets: "10x", reps: "1min", rest: "1min" },
              { name: "Ritmo moderado", sets: "1x", reps: "15min", rest: "-" },
              { name: "Cool down", sets: "1x", reps: "5min", rest: "-" }
            ]
          }
        };
      case 3: // Iniciante Total
        return {
          day1: {
            name: "Corpo Todo A",
            exercises: [
              { name: "Agachamento ar", sets: "3x", reps: "12-15", rest: "60s" },
              { name: "Flexão joelhos", sets: "3x", reps: "8-12", rest: "60s" },
              { name: "Remada elástico", sets: "3x", reps: "12-15", rest: "60s" },
              { name: "Prancha", sets: "3x", reps: "20-30s", rest: "60s" },
              { name: "Caminhada", sets: "1x", reps: "15min", rest: "-" }
            ]
          },
          day2: {
            name: "Corpo Todo B",
            exercises: [
              { name: "Ponte glúteo", sets: "3x", reps: "15-20", rest: "60s" },
              { name: "Flexão parede", sets: "3x", reps: "10-15", rest: "60s" },
              { name: "Elevação perna", sets: "3x", reps: "10/lado", rest: "60s" },
              { name: "Abdominal", sets: "3x", reps: "10-15", rest: "60s" },
              { name: "Alongamento", sets: "1x", reps: "10min", rest: "-" }
            ]
          }
        };
      default:
        return {};
    }
  };

  const getWorkoutBenefits = (workoutId: number) => {
    switch (workoutId) {
      case 1:
        return [
          "Aumento significativo da força",
          "Ganho de massa muscular",
          "Melhora da densidade óssea",
          "Aceleração do metabolismo"
        ];
      case 2:
        return [
          "Queima eficiente de gordura",
          "Melhora cardiovascular",
          "Aumento da resistência",
          "Otimização do tempo de treino"
        ];
      case 3:
        return [
          "Criação de base sólida",
          "Aprendizado correto",
          "Redução do risco de lesões",
          "Construção de hábitos saudáveis"
        ];
      default:
        return [];
    }
  };

  const getWorkoutTips = (workoutId: number) => {
    switch (workoutId) {
      case 1:
        return [
          "Priorize a técnica antes do peso",
          "Descanse adequadamente entre treinos",
          "Mantenha alimentação rica em proteínas",
          "Durma pelo menos 7-8 horas por noite"
        ];
      case 2:
        return [
          "Mantenha-se sempre hidratado",
          "Respeite os intervalos de descanso",
          "Ouça seu corpo para evitar overtraining",
          "Combine com alimentação balanceada"
        ];
      case 3:
        return [
          "Comece devagar e progrida gradualmente",
          "Foque na forma correta dos exercícios",
          "Seja consistente com a frequência",
          "Não hesite em pedir ajuda profissional"
        ];
      default:
        return [];
    }
  };

  const exercises = getWorkoutExercises(workout.id);
  const benefits = getWorkoutBenefits(workout.id);
  const tips = getWorkoutTips(workout.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={`w-12 h-12 bg-gradient-to-br ${workout.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-2xl">{workout.icon}</span>
            </div>
            {workout.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description and Info */}
          <div className="space-y-4">
            <p className="text-muted-foreground">{workout.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{workout.duration}</div>
                  <div className="text-xs text-muted-foreground">Duração</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Target className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{workout.difficulty}</div>
                  <div className="text-xs text-muted-foreground">Nível</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">{workout.frequency}</div>
                  <div className="text-xs text-muted-foreground">Frequência</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Características do Treino
            </h3>
            <div className="flex flex-wrap gap-2">
              {workout.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Workout Plan with Gamification */}
          <div>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Programa de Exercícios Gamificado</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de checklist interativo para acompanhar cada exercício e ganhar pontos
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/80 p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Sistema de Checklist</div>
                      <div className="text-xs text-muted-foreground">Marque exercícios concluídos</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/80 p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">★</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Sistema de Pontos</div>
                      <div className="text-xs text-muted-foreground">Ganhe pontos por exercício</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/80 p-3 rounded border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-bold">🎯</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Ideal para TDAH</div>
                      <div className="text-xs text-muted-foreground">Foco em pequenas tarefas</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Prévia dos Exercícios:</h4>
                {Object.entries(exercises).map(([dayKey, day]: [string, any], dayIndex) => (
                  <div key={dayKey} className="border rounded-lg p-4 bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-primary">Dia {dayIndex + 1}: {day.name}</h5>
                      <span className="text-xs text-muted-foreground">{day.exercises.length} exercícios</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {day.exercises.slice(0, 4).map((exercise: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-4 h-4 border rounded flex-shrink-0"></span>
                          <span className="truncate">{exercise.name}</span>
                        </div>
                      ))}
                      {day.exercises.length > 4 && (
                        <div className="text-xs text-muted-foreground">
                          +{day.exercises.length - 4} exercícios...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <div className="text-xl">🧠</div>
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Desenvolvido para Iniciantes e Pessoas com TDAH
                    </h5>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      O sistema de checklist gamificado ajuda a manter o foco, dividindo o treino em pequenas 
                      tarefas alcançáveis. Cada exercício concluído gera recompensas visuais e pontos, 
                      mantendo a motivação alta durante todo o treino.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Benefits and Tips */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Benefícios
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Dicas Importantes
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {user && (
            <Button onClick={handleStartPlan} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Começar Plano
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};