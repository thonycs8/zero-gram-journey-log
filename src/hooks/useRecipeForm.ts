import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Recipe, RecipeForm } from '@/types/admin';

const initialForm: RecipeForm = {
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
};

export const useRecipeForm = (onDataChange: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<RecipeForm>(initialForm);

  const resetForm = () => {
    setForm(initialForm);
    setEditingRecipe(null);
    setShowDialog(false);
  };

  const openNewRecipeDialog = () => {
    resetForm();
    setShowDialog(true);
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

  return {
    form,
    setForm,
    editingRecipe,
    showDialog,
    setShowDialog,
    resetForm,
    editRecipe,
    openNewRecipeDialog,
    handleSave,
    handleDelete
  };
};