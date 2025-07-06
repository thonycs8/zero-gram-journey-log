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
import type { Recipe, RecipeForm } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';

interface RecipeManagementProps {
  recipes: Recipe[];
  onDataChange: () => void;
}

export const RecipeManagement = ({ recipes, onDataChange }: RecipeManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<RecipeForm>({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prep_time: 0,
    cook_time: 0,
    servings: 4,
    calories: 0,
    difficulty: 'Fácil',
    image_url: '',
    dica_zerogram: ''
  });

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      prep_time: 0,
      cook_time: 0,
      servings: 4,
      calories: 0,
      difficulty: 'Fácil',
      image_url: '',
      dica_zerogram: ''
    });
    setEditingRecipe(null);
    setShowDialog(false);
  };

  const editRecipe = (recipe: Recipe) => {
    setForm({
      title: recipe.title,
      description: recipe.description || '',
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions,
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 4,
      calories: recipe.calories || 0,
      difficulty: recipe.difficulty || 'Fácil',
      image_url: recipe.image_url || '',
      dica_zerogram: recipe.dica_zerogram || ''
    });
    setEditingRecipe(recipe);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.instructions) {
      toast({
        title: "Erro",
        description: "Título e instruções são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const ingredientsArray = form.ingredients.split('\n').filter(i => i.trim());
    
    const recipeData = {
      ...form,
      ingredients: ingredientsArray,
      created_by: user?.id
    };

    try {
      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Receita atualizada!" });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Receita criada!" });
      }
      
      resetForm();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar receita",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta receita?')) return;
    
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Receita eliminada!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar receita",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Receitas</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRecipe(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Nome da receita"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Breve descrição da receita"
                />
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredientes (um por linha) *</Label>
                <Textarea
                  id="ingredients"
                  value={form.ingredients}
                  onChange={(e) => setForm({...form, ingredients: e.target.value})}
                  placeholder="200g de farinha&#10;2 ovos&#10;250ml de leite"
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instruções *</Label>
                <Textarea
                  id="instructions"
                  value={form.instructions}
                  onChange={(e) => setForm({...form, instructions: e.target.value})}
                  placeholder="Passo a passo da preparação"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="prep_time">Prep. (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    value={form.prep_time}
                    onChange={(e) => setForm({...form, prep_time: +e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cook_time">Coze. (min)</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    value={form.cook_time}
                    onChange={(e) => setForm({...form, cook_time: +e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Doses</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={form.servings}
                    onChange={(e) => setForm({...form, servings: +e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={form.calories}
                    onChange={(e) => setForm({...form, calories: +e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select value={form.difficulty} onValueChange={(value) => setForm({...form, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm({...form, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dica_zerogram">Dica ZeroGram</Label>
                <Textarea
                  id="dica_zerogram"
                  value={form.dica_zerogram}
                  onChange={(e) => setForm({...form, dica_zerogram: e.target.value})}
                  placeholder="Dica especial da ZeroGram para esta receita..."
                  rows={3}
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
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </div>
                <Badge variant="secondary">{recipe.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                <span>⏱️ {recipe.prep_time + recipe.cook_time} min</span>
                <span>🍽️ {recipe.servings} doses</span>
                <span>🔥 {recipe.calories} cal</span>
                <span>📅 {new Date(recipe.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editRecipe(recipe)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(recipe.id)}
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