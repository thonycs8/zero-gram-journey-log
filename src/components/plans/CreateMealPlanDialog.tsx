
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

interface CreateMealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MealItem {
  name: string;
  calories: number;
}

interface DayMeals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snack: MealItem[];
}

export const CreateMealPlanDialog = ({ open, onOpenChange }: CreateMealPlanDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [duration, setDuration] = useState(7);
  
  const [meals, setMeals] = useState<DayMeals>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });

  const mealTypes = [
    { key: 'breakfast', label: 'Pequeno-almoço', icon: '🌅' },
    { key: 'lunch', label: 'Almoço', icon: '☀️' },
    { key: 'dinner', label: 'Jantar', icon: '🌙' },
    { key: 'snack', label: 'Lanche', icon: '🍎' }
  ];

  const addMealItem = (mealType: keyof DayMeals) => {
    const name = prompt(`Nome do alimento para ${mealTypes.find(m => m.key === mealType)?.label}:`);
    const caloriesStr = prompt('Calorias:');
    
    if (name && caloriesStr) {
      const calories = parseInt(caloriesStr);
      if (!isNaN(calories)) {
        setMeals(prev => ({
          ...prev,
          [mealType]: [...prev[mealType], { name, calories }]
        }));
      }
    }
  };

  const removeMealItem = (mealType: keyof DayMeals, index: number) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index)
    }));
  };

  const getTotalCalories = () => {
    return Object.values(meals).flat().reduce((sum, item) => sum + item.calories, 0);
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

    // Aqui você salvaria o plano no localStorage ou enviaria para o servidor
    const newPlan = {
      id: Date.now().toString(),
      name: planName,
      description: planDescription,
      goal,
      targetCalories,
      duration,
      meals,
      createdAt: new Date().toISOString()
    };

    // Salvar no localStorage por enquanto
    const existingPlans = JSON.parse(localStorage.getItem('customMealPlans') || '[]');
    existingPlans.push(newPlan);
    localStorage.setItem('customMealPlans', JSON.stringify(existingPlans));

    toast({
      title: "Sucesso!",
      description: "Plano alimentar criado com sucesso"
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setPlanName('');
    setPlanDescription('');
    setGoal('');
    setTargetCalories(2000);
    setDuration(7);
    setMeals({ breakfast: [], lunch: [], dinner: [], snack: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar Plano Alimentar Personalizado</DialogTitle>
          <DialogDescription>
            Crie o seu próprio plano alimentar adaptado aos seus objetivos
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
                <Label htmlFor="plan-name">Nome do Plano *</Label>
                <Input
                  id="plan-name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Ex: Meu Plano de Emagrecimento"
                />
              </div>
              
              <div>
                <Label htmlFor="plan-description">Descrição</Label>
                <Textarea
                  id="plan-description"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Descreva o seu plano..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="goal">Objetivo</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                      <SelectItem value="ganho-massa">Ganho de Massa</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="definicao">Definição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="calories">Calorias Alvo</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duração (dias)</Label>
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

          {/* Refeições */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Refeições</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total de calorias: {getTotalCalories()} cal (Meta: {targetCalories} cal)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealTypes.map((mealType) => (
                  <div key={mealType.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <span>{mealType.icon}</span>
                        {mealType.label}
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addMealItem(mealType.key as keyof DayMeals)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {meals[mealType.key as keyof DayMeals].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="text-sm">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{item.calories} cal</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMealItem(mealType.key as keyof DayMeals, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {meals[mealType.key as keyof DayMeals].length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum alimento adicionado
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
