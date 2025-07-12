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
  Clock
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

interface ActiveWorkoutManagerProps {
  activePlans: UserPlan[];
  onPlanRemoved: () => void;
  getPlanProgress: (plan: UserPlan) => number;
  getTodaysStats: () => {
    totalExercises: number;
    completedExercises: number;
    totalPoints: number;
    exerciseProgress: number;
  };
}

export const ActiveWorkoutManager = ({
  activePlans,
  onPlanRemoved,
  getPlanProgress,
  getTodaysStats
}: ActiveWorkoutManagerProps) => {
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
        title: "Treino removido",
        description: "O treino foi marcado como concluído e removido dos ativos.",
      });

      onPlanRemoved();
    } catch (error) {
      console.error('Error removing active plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o treino. Tente novamente.",
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
        // Delete exercise checkpoints
        supabase
          .from('exercise_checkpoints')
          .delete()
          .eq('user_plan_id', planId),
        
        // Delete workout sessions
        supabase
          .from('workout_sessions')
          .delete()
          .eq('user_plan_id', planId),
        
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
        description: "Todos os dados do treino foram deletados permanentemente.",
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
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nenhum treino ativo</h3>
          <p className="text-muted-foreground mb-4">
            Você não tem treinos ativos no momento.
          </p>
          <Button asChild>
            <a href="/planos">Escolher Treino</a>
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
            Progresso Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{todaysStats.completedExercises}</div>
              <div className="text-sm text-muted-foreground">de {todaysStats.totalExercises} exercícios</div>
              <Progress 
                value={todaysStats.exerciseProgress} 
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
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(todaysStats.exerciseProgress)}%</div>
              <div className="text-sm text-muted-foreground">progresso do dia</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Trophy className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Meta</span>
              </div>
            </div>
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
                  <Badge variant="default">Treino Ativo</Badge>
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
                  <h4 className="font-medium text-sm">Gerenciamento do Treino</h4>
                  
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
                          <AlertDialogTitle>Remover treino dos ativos?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá marcar o treino como concluído e removê-lo da lista de treinos ativos. 
                            Seus dados de progresso serão mantidos. Você poderá vê-lo na seção de treinos concluídos.
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
                          <AlertDialogTitle>Deletar todos os dados do treino?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              <strong>Atenção:</strong> Esta ação é irreversível e irá deletar permanentemente:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Todo o histórico de exercícios realizados</li>
                              <li>Pontos e conquistas relacionadas</li>
                              <li>Sessões de treino registradas</li>
                              <li>O plano de treino da sua lista</li>
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
                    <p><strong>Dica:</strong> Use "Remover dos Ativos" se quiser pausar o treino mantendo seu progresso, 
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