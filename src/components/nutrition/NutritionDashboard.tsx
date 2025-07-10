import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DailyNutritionGoal } from '@/services/detailedCheckpoints';
import { Droplets, Zap, Target, Trophy, Plus, Minus } from 'lucide-react';

interface NutritionDashboardProps {
  nutritionGoal: DailyNutritionGoal | null;
  onUpdateWater: (waterConsumed: number) => Promise<void>;
}

export const NutritionDashboard = ({ nutritionGoal, onUpdateWater }: NutritionDashboardProps) => {
  const [waterInput, setWaterInput] = useState(0.25); // Default water increment

  if (!nutritionGoal) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma meta nutricional definida para hoje</p>
        </CardContent>
      </Card>
    );
  }

  const calorieProgress = (nutritionGoal.consumed_calories / nutritionGoal.target_calories) * 100;
  const waterProgress = (nutritionGoal.water_consumed / nutritionGoal.water_target) * 100;
  const mealProgress = nutritionGoal.total_meals > 0 
    ? (nutritionGoal.meals_completed / nutritionGoal.total_meals) * 100 
    : 0;

  const handleWaterUpdate = async (change: number) => {
    const newAmount = Math.max(0, nutritionGoal.water_consumed + change);
    await onUpdateWater(newAmount);
  };

  const isCalorieGoalMet = calorieProgress >= 100;
  const isWaterGoalMet = waterProgress >= 100;
  const areMealsComplete = mealProgress >= 100;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={isCalorieGoalMet ? 'border-green-500 bg-green-50/50' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Calorias</CardTitle>
              <Zap className={`h-4 w-4 ${isCalorieGoalMet ? 'text-green-600' : 'text-orange-500'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{nutritionGoal.consumed_calories}</span>
                <span className="text-muted-foreground">/ {nutritionGoal.target_calories} kcal</span>
              </div>
              <Progress value={Math.min(calorieProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {calorieProgress >= 100 ? 'Meta atingida!' : `${Math.round(calorieProgress)}% da meta`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={isWaterGoalMet ? 'border-blue-500 bg-blue-50/50' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
              <Droplets className={`h-4 w-4 ${isWaterGoalMet ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{nutritionGoal.water_consumed}L</span>
                <span className="text-muted-foreground">/ {nutritionGoal.water_target}L</span>
              </div>
              <Progress value={Math.min(waterProgress, 100)} className="h-2" />
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleWaterUpdate(-waterInput)}
                  disabled={nutritionGoal.water_consumed <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={waterInput}
                  onChange={(e) => setWaterInput(Number(e.target.value))}
                  className="w-16 h-8 text-center text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleWaterUpdate(waterInput)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="text-xs text-muted-foreground">L</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={areMealsComplete ? 'border-green-500 bg-green-50/50' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Refeições</CardTitle>
              <Target className={`h-4 w-4 ${areMealsComplete ? 'text-green-600' : 'text-primary'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{nutritionGoal.meals_completed}</span>
                <span className="text-muted-foreground">/ {nutritionGoal.total_meals} refeições</span>
              </div>
              <Progress value={Math.min(mealProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {mealProgress >= 100 ? 'Todas concluídas!' : `${Math.round(mealProgress)}% concluído`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Goals Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Resumo Nutricional de Hoje
            </CardTitle>
            {nutritionGoal.points_earned > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +{nutritionGoal.points_earned} pontos
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutritionGoal.target_protein && (
              <div className="text-center p-3 rounded-lg border">
                <div className="text-lg font-bold text-primary">
                  {nutritionGoal.consumed_protein || 0}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Meta: {nutritionGoal.target_protein}g
                </div>
                <div className="text-xs font-medium">Proteína</div>
              </div>
            )}
            
            {nutritionGoal.target_carbs && (
              <div className="text-center p-3 rounded-lg border">
                <div className="text-lg font-bold text-orange-500">
                  {nutritionGoal.consumed_carbs || 0}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Meta: {nutritionGoal.target_carbs}g
                </div>
                <div className="text-xs font-medium">Carboidratos</div>
              </div>
            )}
            
            {nutritionGoal.target_fat && (
              <div className="text-center p-3 rounded-lg border">
                <div className="text-lg font-bold text-yellow-500">
                  {nutritionGoal.consumed_fat || 0}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Meta: {nutritionGoal.target_fat}g
                </div>
                <div className="text-xs font-medium">Gorduras</div>
              </div>
            )}
            
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-bold text-green-500">
                {Math.round((nutritionGoal.consumed_calories / nutritionGoal.target_calories) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Meta diária
              </div>
              <div className="text-xs font-medium">Progresso</div>
            </div>
          </div>

          {/* Achievement Indicators */}
          <div className="mt-4 flex flex-wrap gap-2">
            {isCalorieGoalMet && (
              <Badge className="bg-green-600">
                🎯 Meta de Calorias Atingida
              </Badge>
            )}
            {isWaterGoalMet && (
              <Badge className="bg-blue-600">
                💧 Meta de Hidratação Atingida
              </Badge>
            )}
            {areMealsComplete && (
              <Badge className="bg-purple-600">
                🍽️ Todas as Refeições Concluídas
              </Badge>
            )}
            {nutritionGoal.is_completed && (
              <Badge className="bg-yellow-600">
                🏆 Dia Nutricional Perfeito!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};