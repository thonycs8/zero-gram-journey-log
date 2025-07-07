import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface GoalsTabProps {
  goals: any;
  setGoals: (goals: any) => void;
  onSave: () => void;
  stats: any;
}

const GoalsTab = ({ goals, setGoals, onSave, stats }: GoalsTabProps) => {
  const calculateWeightProgress = () => {
    if (!goals.currentWeight || !goals.targetWeight) return 0;
    
    const totalWeightToLose = Math.abs(goals.currentWeight - goals.targetWeight);
    if (totalWeightToLose === 0) return 100;
    
    // For demo purposes, we'll assume some progress has been made
    const currentProgress = Math.min(totalWeightToLose * 0.3, totalWeightToLose);
    return (currentProgress / totalWeightToLose) * 100;
  };

  const calculateCaloriesProgress = () => {
    if (!goals.calories) return 0;
    // For demo purposes, assuming 80% of daily calories consumed
    return 80;
  };

  const calculateExerciseProgress = () => {
    if (!goals.exercise) return 0;
    // For demo purposes, using current stats
    const workoutsThisWeek = Math.min(stats.currentStreak || 0, goals.exercise);
    return (workoutsThisWeek / goals.exercise) * 100;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Definir Objetivos</CardTitle>
          <CardDescription>
            Configure os seus objetivos pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_weight">Peso Atual (kg)</Label>
              <Input
                id="current_weight"
                type="number"
                step="0.1"
              value={goals.currentWeight || ''}
              onChange={(e) => setGoals({
                ...goals,
                currentWeight: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_weight">Peso Objetivo (kg)</Label>
              <Input
                id="target_weight"
                type="number"
                step="0.1"
              value={goals.targetWeight || ''}
              onChange={(e) => setGoals({
                ...goals,
                targetWeight: parseFloat(e.target.value) || 0
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly_goal">Objetivo Semanal (kg)</Label>
            <Input
              id="weekly_goal"
              type="number"
              step="0.1"
              value={goals.weeklyGoal || ''}
              onChange={(e) => setGoals({
                ...goals,
                weeklyGoal: parseFloat(e.target.value) || 0.5
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily_calories">Calorias Diárias</Label>
            <Input
              id="daily_calories"
              type="number"
              value={goals.calories || ''}
              onChange={(e) => setGoals({
                ...goals,
                calories: parseInt(e.target.value) || 2000
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daily_water">Água Diária (litros)</Label>
            <Input
              id="daily_water"
              type="number"
              step="0.1"
              value={goals.water || ''}
              onChange={(e) => setGoals({
                ...goals,
                water: parseFloat(e.target.value) || 2.5
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly_exercise">Exercícios por Semana</Label>
            <Input
              id="weekly_exercise"
              type="number"
              value={goals.exercise || ''}
              onChange={(e) => setGoals({
                ...goals,
                exercise: parseInt(e.target.value) || 4
              })}
            />
          </div>

          <Button onClick={onSave} className="w-full">
            Guardar Objetivos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progresso dos Objetivos</CardTitle>
          <CardDescription>
            Acompanhe o seu progresso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Peso Objetivo</span>
              <span>{calculateWeightProgress().toFixed(1)}%</span>
            </div>
            <Progress value={calculateWeightProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{goals.currentWeight || 0} kg</span>
              <span>{goals.targetWeight || 0} kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Calorias Diárias</span>
              <span>{calculateCaloriesProgress()}%</span>
            </div>
            <Progress value={calculateCaloriesProgress()} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Meta: {goals.calories || 2000} cal/dia
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercícios Semanais</span>
              <span>{calculateExerciseProgress().toFixed(0)}%</span>
            </div>
            <Progress value={calculateExerciseProgress()} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Meta: {goals.exercise || 4} exercícios/semana
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Água Diária</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Meta: {goals.water || 2.5} litros/dia
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;