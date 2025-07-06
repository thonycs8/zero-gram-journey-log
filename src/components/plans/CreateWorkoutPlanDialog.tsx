
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateWorkoutPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

export const CreateWorkoutPlanDialog = ({ open, onOpenChange }: CreateWorkoutPlanDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState(4);
  
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    { name: 'Dia 1', exercises: [] }
  ]);

  const addWorkoutDay = () => {
    setWorkoutDays(prev => [...prev, { name: `Dia ${prev.length + 1}`, exercises: [] }]);
  };

  const removeWorkoutDay = (index: number) => {
    if (workoutDays.length > 1) {
      setWorkoutDays(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addExercise = (dayIndex: number) => {
    const name = prompt('Nome do exercício:');
    const sets = prompt('Séries (ex: 3):');
    const reps = prompt('Repetições (ex: 12):');
    const rest = prompt('Descanso (ex: 60s):');
    
    if (name && sets && reps && rest) {
      const newExercise: Exercise = { name, sets, reps, rest };
      setWorkoutDays(prev => prev.map((day, i) => 
        i === dayIndex 
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      ));
    }
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    setWorkoutDays(prev => prev.map((day, i) => 
      i === dayIndex 
        ? { ...day, exercises: day.exercises.filter((_, j) => j !== exerciseIndex) }
        : day
    ));
  };

  const handleSave = () => {
    if (!planName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do plano é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (workoutDays.every(day => day.exercises.length === 0)) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um exercício",
        variant: "destructive"
      });
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      name: planName,
      description: planDescription,
      difficulty,
      frequency,
      duration,
      workoutDays,
      createdAt: new Date().toISOString()
    };

    // Salvar no localStorage por enquanto
    const existingPlans = JSON.parse(localStorage.getItem('customWorkoutPlans') || '[]');
    existingPlans.push(newPlan);
    localStorage.setItem('customWorkoutPlans', JSON.stringify(existingPlans));

    toast({
      title: "Sucesso!",
      description: "Plano de treino criado com sucesso"
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setPlanName('');
    setPlanDescription('');
    setDifficulty('');
    setFrequency('');
    setDuration(4);
    setWorkoutDays([{ name: 'Dia 1', exercises: [] }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar Plano de Treino Personalizado</DialogTitle>
          <DialogDescription>
            Crie o seu próprio plano de treino adaptado aos seus objetivos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Nome do Plano *</Label>
                <Input
                  id="workout-name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Ex: Meu Treino de Força"
                />
              </div>
              
              <div>
                <Label htmlFor="workout-description">Descrição</Label>
                <Textarea
                  id="workout-description"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Descreva o seu plano de treino..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermedio">Intermédio</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Frequência</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3x/semana">3x por semana</SelectItem>
                      <SelectItem value="4x/semana">4x por semana</SelectItem>
                      <SelectItem value="5x/semana">5x por semana</SelectItem>
                      <SelectItem value="6x/semana">6x por semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duração (semanas)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dias de Treino */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Dias de Treino</CardTitle>
                <Button onClick={addWorkoutDay} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Dia
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {workoutDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{day.name}</h4>
                    {workoutDays.length > 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeWorkoutDay(dayIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.sets} séries • {exercise.reps} reps • {exercise.rest} descanso
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addExercise(dayIndex)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Exercício
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Criar Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
