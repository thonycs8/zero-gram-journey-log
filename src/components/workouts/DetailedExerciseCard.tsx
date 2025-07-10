import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ExerciseCheckpoint } from '@/services/detailedCheckpoints';
import { CheckCircle, Dumbbell, Clock, Weight, Target, Trophy, Plus, Edit } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetailedExerciseCardProps {
  exercise: ExerciseCheckpoint;
  onComplete: (
    checkpointId: string,
    setsCompleted: number,
    repsCompleted?: string,
    weightUsed?: number,
    notes?: string
  ) => Promise<void>;
}

export const DetailedExerciseCard = ({ exercise, onComplete }: DetailedExerciseCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [setsCompleted, setSetsCompleted] = useState(exercise.sets_completed);
  const [repsCompleted, setRepsCompleted] = useState(exercise.reps_completed || '');
  const [weightUsed, setWeightUsed] = useState(exercise.weight_used || 0);
  const [notes, setNotes] = useState(exercise.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressPercentage = (exercise.sets_completed / exercise.total_sets) * 100;

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
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(exercise.id, exercise.total_sets);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`transition-all duration-300 ${
      exercise.is_completed 
        ? 'border-green-500 bg-green-50/50 shadow-lg' 
        : 'border-border hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              exercise.is_completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-primary/10 text-primary'
            }`}>
              {exercise.is_completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Dumbbell className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{exercise.exercise_name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>{exercise.total_sets} séries</span>
                {exercise.reps_completed && (
                  <>
                    <span>•</span>
                    <span>{exercise.reps_completed} reps</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {exercise.points_earned > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +{exercise.points_earned}
              </Badge>
            )}
            {exercise.is_completed && (
              <Badge className="bg-green-600">
                Concluído
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">
              {exercise.sets_completed} de {exercise.total_sets} séries
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Exercise Details */}
        {(exercise.weight_used || exercise.reps_completed || exercise.notes) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
            {exercise.weight_used && (
              <div className="flex items-center gap-2 text-sm">
                <Weight className="h-4 w-4 text-primary" />
                <span className="font-medium">{exercise.weight_used}kg</span>
              </div>
            )}
            {exercise.reps_completed && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">{exercise.reps_completed} reps</span>
              </div>
            )}
            {exercise.completed_at && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {new Date(exercise.completed_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {exercise.notes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Notas:</strong> {exercise.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!exercise.is_completed && (
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
                      max={exercise.total_sets}
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

        {exercise.is_completed && (
          <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Exercício concluído! +{exercise.points_earned} pontos
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};