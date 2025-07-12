import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  PauseCircle, 
  BarChart3, 
  Trophy, 
  Zap, 
  Target,
  Calendar,
  Clock,
  Apple,
  Utensils
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPlan {
  id: string;
  user_id: string;
  plan_id: number;
  plan_title: string;
  plan_type: string;
  start_date: string;
  target_days: number;
  current_progress: number;
  is_completed: boolean;
}

interface ActiveNutritionManagerProps {
  activePlans: UserPlan[];
  onPlanRemoved: () => void;
  getPlanProgress: (plan: UserPlan) => number;
  getTodaysStats: () => {
    totalMealItems: number;
    completedMealItems: number;
    totalPoints: number;
    mealProgress: number;
    nutritionGoal?: {
      consumed_calories: number;
      target_calories: number;
      water_consumed: number;
      water_target: number;
      meals_completed: number;
      total_meals: number;
    } | null;
  };
}

export const ActiveNutritionManager = ({
  activePlans,
  onPlanRemoved,
  getPlanProgress,
  getTodaysStats
}: ActiveNutritionManagerProps) => {
  const { toast } = useToast();
  const [removingPlan, setRemovingPlan] = useState<string | null>(null);
  const [deletingData, setDeletingData] = useState<string | null>(null);

  const todaysStats = getTodaysStats();

  const handleRemoveActivePlan = async (planId: string) => {
    setRemovingPlan(planId);
    
    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ is_completed: true })
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Plano removido",
        description: "O plano alimentar foi marcado como concluído e removido dos ativos.",
      });

      onPlanRemoved();
    } catch (error) {
      console.error('Error removing active plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o plano. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setRemovingPlan(null);
    }
  };

  const handleDeletePlanData = async (planId: string) => {
    setDeletingData(planId);
    
    try {
      // Delete all related data for this plan
      const deleteTasks = [
        // Delete meal checkpoints
        supabase
          .from('meal_checkpoints')
          .delete()
          .eq('user_plan_id', planId),
        
        // Delete daily nutrition goals (if they reference this plan)
        supabase
          .from('daily_nutrition_goals')
          .delete()
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id),
        
        // Delete user checkpoints
        supabase
          .from('user_checkpoints')
          .delete()
          .eq('user_plan_id', planId),
        
        // Finally delete the plan itself
        supabase
          .from('user_plans')
          .delete()
          .eq('id', planId)
      ];

      const results = await Promise.all(deleteTasks);
      
      // Check for errors
      for (const result of results) {
        if (result.error) throw result.error;
      }

      toast({
        title: "Dados deletados",
        description: "Todos os dados do plano alimentar foram deletados permanentemente.",
      });

      onPlanRemoved();
    } catch (error) {
      console.error('Error deleting plan data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setDeletingData(null);
    }
  };

  if (activePlans.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Apple className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nenhum plano ativo</h3>
          <p className="text-muted-foreground mb-4">
            Você não tem planos alimentares ativos no momento.
          </p>
          <Button asChild>
            <a href="/planos">Escolher Plano</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progresso Nutricional Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{todaysStats.completedMealItems}</div>
              <div className="text-sm text-muted-foreground">de {todaysStats.totalMealItems} itens</div>
              <Progress 
                value={todaysStats.mealProgress} 
                className="mt-2 h-2" 
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{todaysStats.totalPoints}</div>
              <div className="text-sm text-muted-foreground">pontos ganhos</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Energia</span>
              </div>
            </div>
            {todaysStats.nutritionGoal && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {todaysStats.nutritionGoal.consumed_calories}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    de {todaysStats.nutritionGoal.target_calories} kcal
                  </div>
                  <Progress 
                    value={(todaysStats.nutritionGoal.consumed_calories / todaysStats.nutritionGoal.target_calories) * 100} 
                    className="mt-2 h-2" 
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {todaysStats.nutritionGoal.water_consumed}L
                  </div>
                  <div className="text-sm text-muted-foreground">
                    de {todaysStats.nutritionGoal.water_target}L água
                  </div>
                  <Progress 
                    value={(todaysStats.nutritionGoal.water_consumed / todaysStats.nutritionGoal.water_target) * 100} 
                    className="mt-2 h-2" 
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Plans */}
      <div className="grid gap-6">
        {activePlans.map((plan) => {
          const progress = getPlanProgress(plan);
          const isRemoving = removingPlan === plan.id;
          const isDeleting = deletingData === plan.id;

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
                    </div>
                  </div>
                  <Badge variant={plan.plan_type === 'meal' ? 'default' : 'secondary'}>
                    {plan.plan_type === 'meal' ? 'Alimentar Ativo' : 'Dieta Ativa'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <Separator />

                {/* Plan Management Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Gerenciamento do Plano</h4>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Remove from Active */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isRemoving || isDeleting}
                          className="flex items-center gap-2"
                        >
                          <PauseCircle className="h-4 w-4" />
                          Remover dos Ativos
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover plano dos ativos?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá marcar o plano como concluído e removê-lo da lista de planos ativos. 
                            Seus dados de progresso nutricional serão mantidos. Você poderá vê-lo na seção de planos concluídos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRemoveActivePlan(plan.id)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? 'Removendo...' : 'Remover'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete All Data */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={isRemoving || isDeleting}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Deletar Dados
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deletar todos os dados do plano?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              <strong>Atenção:</strong> Esta ação é irreversível e irá deletar permanentemente:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Todo o histórico de refeições registradas</li>
                              <li>Dados de consumo de calorias e água</li>
                              <li>Pontos e conquistas nutricionais</li>
                              <li>Metas diárias de nutrição</li>
                              <li>O plano alimentar da sua lista</li>
                            </ul>
                            <p className="text-destructive font-medium">
                              Esta ação não pode ser desfeita!
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeletePlanData(plan.id)}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Deletando...' : 'Deletar Tudo'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                    <p><strong>Dica:</strong> Use "Remover dos Ativos" se quiser pausar o plano mantendo seu progresso, 
                    ou "Deletar Dados" se quiser começar do zero.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};