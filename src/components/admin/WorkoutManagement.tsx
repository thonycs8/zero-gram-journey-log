import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { WorkoutPlan, WorkoutForm } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutManagementProps {
  workoutPlans: WorkoutPlan[];
  onDataChange: () => void;
}

export const WorkoutManagement = ({ workoutPlans, onDataChange }: WorkoutManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<WorkoutForm>({
    title: '',
    description: '',
    difficulty: 'Iniciante',
    frequency: '',
    duration_weeks: 4,
    image_url: ''
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      difficulty: 'Iniciante',
      frequency: '',
      duration_weeks: 4,
      image_url: ''
    });
    setEditingWorkout(null);
    setShowDialog(false);
  };

  const editWorkout = (workout: WorkoutPlan) => {
    setForm({
      title: workout.title,
      description: workout.description || '',
      difficulty: workout.difficulty || 'Iniciante',
      frequency: workout.frequency || '',
      duration_weeks: workout.duration_weeks || 4,
      image_url: workout.image_url || ''
    });
    setEditingWorkout(workout);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const workoutData = {
      ...form,
      created_by: user?.id
    };

    try {
      if (editingWorkout) {
        const { error } = await supabase
          .from('workout_plans')
          .update(workoutData)
          .eq('id', editingWorkout.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Treino atualizado!" });
      } else {
        const { error } = await supabase
          .from('workout_plans')
          .insert([workoutData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Treino criado!" });
      }
      
      resetForm();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar treino",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este treino?')) return;
    
    try {
      const { error } = await supabase.from('workout_plans').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Treino eliminado!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar treino",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Planos de Treino</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWorkout(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWorkout ? 'Editar Treino' : 'Novo Plano de Treino'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-title">Título *</Label>
                <Input
                  id="workout-title"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Nome do plano de treino"
                />
              </div>

              <div>
                <Label htmlFor="workout-description">Descrição</Label>
                <Textarea
                  id="workout-description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descrição do plano de treino"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select value={form.difficulty} onValueChange={(value) => setForm({...form, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermédio">Intermédio</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Frequência</Label>
                  <Input
                    id="frequency"
                    value={form.frequency}
                    onChange={(e) => setForm({...form, frequency: e.target.value})}
                    placeholder="Ex: 3x por semana"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (semanas)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={form.duration_weeks}
                    onChange={(e) => setForm({...form, duration_weeks: +e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="workout-image">URL da Imagem</Label>
                <Input
                  id="workout-image"
                  value={form.image_url}
                  onChange={(e) => setForm({...form, image_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map((workout) => (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{workout.title}</CardTitle>
                  <CardDescription>{workout.description}</CardDescription>
                </div>
                <Badge variant="secondary">{workout.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                <span>⏱️ {workout.frequency}</span>
                <span>📅 {workout.duration_weeks} semanas</span>
                <span>📅 {new Date(workout.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editWorkout(workout)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(workout.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};