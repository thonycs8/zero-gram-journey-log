import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Trash2, 
  PauseCircle
} from 'lucide-react';
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

interface WorkoutCardManagerProps {
  plan: UserPlan;
  onPlanUpdated: () => void;
}

export const WorkoutCardManager = ({
  plan,
  onPlanUpdated
}: WorkoutCardManagerProps) => {
  const { toast } = useToast();
  const [removing, setRemoving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleRemoveActivePlan = async () => {
    setRemoving(true);
    
    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ is_completed: true })
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: "Treino removido",
        description: "O treino foi marcado como concluído e removido dos ativos.",
      });

      onPlanUpdated();
    } catch (error) {
      console.error('Error removing active plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o treino. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setRemoving(false);
    }
  };

  const handleDeletePlanData = async () => {
    setDeleting(true);
    
    try {
      // Delete all related data for this plan
      const deleteTasks = [
        // Delete exercise checkpoints
        supabase
          .from('exercise_checkpoints')
          .delete()
          .eq('user_plan_id', plan.id),
        
        // Delete workout sessions
        supabase
          .from('workout_sessions')
          .delete()
          .eq('user_plan_id', plan.id),
        
        // Delete user checkpoints
        supabase
          .from('user_checkpoints')
          .delete()
          .eq('user_plan_id', plan.id),
        
        // Finally delete the plan itself
        supabase
          .from('user_plans')
          .delete()
          .eq('id', plan.id)
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

      onPlanUpdated();
    } catch (error) {
      console.error('Error deleting plan data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <PauseCircle className="h-4 w-4 mr-2" />
              Remover dos Ativos
            </DropdownMenuItem>
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
                onClick={handleRemoveActivePlan}
                disabled={removing}
              >
                {removing ? 'Removendo...' : 'Remover'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar Dados
            </DropdownMenuItem>
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
                onClick={handleDeletePlanData}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleting ? 'Deletando...' : 'Deletar Tudo'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};