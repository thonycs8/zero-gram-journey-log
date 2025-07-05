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
import type { MealPlan, MealPlanForm } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';

interface MealPlanManagementProps {
  mealPlans: MealPlan[];
  onDataChange: () => void;
}

export const MealPlanManagement = ({ mealPlans, onDataChange }: MealPlanManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<MealPlanForm>({
    title: '',
    description: '',
    goal: 'Emagrecimento',
    total_calories: 2000,
    duration_days: 7,
    image_url: ''
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      goal: 'Emagrecimento',
      total_calories: 2000,
      duration_days: 7,
      image_url: ''
    });
    setEditingMealPlan(null);
    setShowDialog(false);
  };

  const editMealPlan = (mealPlan: MealPlan) => {
    setForm({
      title: mealPlan.title,
      description: mealPlan.description || '',
      goal: mealPlan.goal || 'Emagrecimento',
      total_calories: mealPlan.total_calories || 2000,
      duration_days: mealPlan.duration_days || 7,
      image_url: mealPlan.image_url || ''
    });
    setEditingMealPlan(mealPlan);
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

    const mealPlanData = {
      ...form,
      created_by: user?.id
    };

    try {
      if (editingMealPlan) {
        const { error } = await supabase
          .from('meal_plans')
          .update(mealPlanData)
          .eq('id', editingMealPlan.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Plano alimentar atualizado!" });
      } else {
        const { error } = await supabase
          .from('meal_plans')
          .insert([mealPlanData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Plano alimentar criado!" });
      }
      
      resetForm();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar plano alimentar",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este plano alimentar?')) return;
    
    try {
      const { error } = await supabase.from('meal_plans').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Plano alimentar eliminado!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar plano alimentar",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Planos Alimentares</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMealPlan(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMealPlan ? 'Editar Plano' : 'Novo Plano Alimentar'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="meal-title">Título *</Label>
                <Input
                  id="meal-title"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Nome do plano alimentar"
                />
              </div>

              <div>
                <Label htmlFor="meal-description">Descrição</Label>
                <Textarea
                  id="meal-description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descrição do plano alimentar"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="goal">Objetivo</Label>
                  <Select value={form.goal} onValueChange={(value) => setForm({...form, goal: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="Ganho de massa">Ganho de massa</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Definição">Definição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="calories">Calorias Totais</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={form.total_calories}
                    onChange={(e) => setForm({...form, total_calories: +e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="duration-days">Duração (dias)</Label>
                  <Input
                    id="duration-days"
                    type="number"
                    value={form.duration_days}
                    onChange={(e) => setForm({...form, duration_days: +e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meal-image">URL da Imagem</Label>
                <Input
                  id="meal-image"
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
        {mealPlans.map((mealPlan) => (
          <Card key={mealPlan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{mealPlan.title}</CardTitle>
                  <CardDescription>{mealPlan.description}</CardDescription>
                </div>
                <Badge variant="secondary">{mealPlan.goal}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                <span>🔥 {mealPlan.total_calories} cal</span>
                <span>📅 {mealPlan.duration_days} dias</span>
                <span>📅 {new Date(mealPlan.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editMealPlan(mealPlan)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(mealPlan.id)}
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