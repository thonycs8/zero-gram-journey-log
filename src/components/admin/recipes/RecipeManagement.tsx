import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import { RecipeForm } from './RecipeForm';
import { useRecipeForm } from '@/hooks/useRecipeForm';
import type { Recipe } from '@/types/admin';

interface RecipeManagementProps {
  recipes: Recipe[];
  onDataChange: () => void;
}

export const RecipeManagement = ({ recipes, onDataChange }: RecipeManagementProps) => {
  const {
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
  } = useRecipeForm(onDataChange);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Receitas</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={openNewRecipeDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <RecipeForm
            form={form}
            setForm={setForm}
            editingRecipe={editingRecipe}
            onSave={handleSave}
            onCancel={resetForm}
          />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={editRecipe}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};