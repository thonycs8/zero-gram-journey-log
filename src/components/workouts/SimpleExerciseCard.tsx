import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle, Dumbbell, Clock, Weight, Target, Trophy, Plus, Edit } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds?: number;
  notes?: string;
  completed?: boolean;
  setsCompleted?: number;
  repsCompleted?: string;
  weightUsed?: number;
  exerciseNotes?: string;
}

interface SimpleExerciseCardProps {
  exercise: Exercise;
  onComplete: (
    exerciseId: string,
    setsCompleted: number,
    repsCompleted?: string,
    weightUsed?: number,
    notes?: string
  ) => Promise<void>;
}

export const SimpleExerciseCard = ({ exercise, onComplete }: SimpleExerciseCardProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [setsCompleted, setSetsCompleted] = useState(exercise.setsCompleted || 0);
  const [repsCompleted, setRepsCompleted] = useState(exercise.repsCompleted || '');
  const [weightUsed, setWeightUsed] = useState(exercise.weightUsed || 0);
  const [notes, setNotes] = useState(exercise.exerciseNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressPercentage = exercise.sets > 0 ? (setsCompleted / exercise.sets) * 100 : 0;

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(exercise.id, setsCompleted, repsCompleted, weightUsed, notes);
      
      // Trigger confetti animation for exercise completion
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Exercício Concluído! ✅",
        description: `${exercise.exercise_name} - +5 pontos ganhos`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar o exercício",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(exercise.id, exercise.sets, exercise.reps);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });

      toast({
        title: "Exercício Concluído! ✅", 
        description: `${exercise.exercise_name} - +5 pontos ganhos`,
      });
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar o exercício",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`transition-all duration-300 ${
      exercise.completed 
        ? 'border-green-500 bg-green-50/50 shadow-lg' 
        : 'border-border hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              exercise.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-primary/10 text-primary'
            }`}>
              {exercise.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Dumbbell className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{exercise.exercise_name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{exercise.sets} séries × {exercise.reps} reps</span>
                {exercise.rest_seconds && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{exercise.rest_seconds}s descanso</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {exercise.completed && (
              <>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  +5
                </Badge>
                <Badge className="bg-green-600">
                  Concluído
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {!exercise.completed && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">
                {setsCompleted} de {exercise.sets} séries
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Exercise Details */}
        {exercise.completed && (exercise.weightUsed || exercise.repsCompleted || exercise.exerciseNotes) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
            {exercise.weightUsed && (
              <div className="flex items-center gap-2 text-sm">
                <Weight className="h-4 w-4 text-primary" />
                <span className="font-medium">{exercise.weightUsed}kg</span>
              </div>
            )}
            {exercise.repsCompleted && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">{exercise.repsCompleted}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Concluído</span>
            </div>
          </div>
        )}

        {exercise.exerciseNotes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Notas:</strong> {exercise.exerciseNotes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!exercise.completed && (
          <div className="flex gap-2">
            <Button
              onClick={handleQuickComplete}
              disabled={isSubmitting}
              className="flex-1"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Concluído
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Exercício</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sets">Séries Concluídas</Label>
                    <Input
                      id="sets"
                      type="number"
                      min="0"
                      max={exercise.sets}
                      value={setsCompleted}
                      onChange={(e) => setSetsCompleted(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reps">Repetições (ex: 12, 10, 8)</Label>
                    <Input
                      id="reps"
                      placeholder="12x3 ou 12, 10, 8"
                      value={repsCompleted}
                      onChange={(e) => setRepsCompleted(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight">Peso Utilizado (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.5"
                      value={weightUsed}
                      onChange={(e) => setWeightUsed(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Como se sentiu, dificuldades, etc..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Salvando...' : 'Concluir Exercício'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {exercise.completed && (
          <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Exercício concluído! +5 pontos
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};