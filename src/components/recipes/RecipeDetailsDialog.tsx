import { useTranslation } from 'react-i18next';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Recipe } from '@/types/admin';

interface RecipeDetailsDialogProps {
  recipe: Recipe;
}

export const RecipeDetailsDialog = ({ recipe }: RecipeDetailsDialogProps) => {
  const { t } = useTranslation();
  const instructionsList = recipe.instructions.split('\n').filter(instruction => instruction.trim());

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          {recipe.title}
        </DialogTitle>
        <DialogDescription>
          {recipe.description}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Recipe Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Informações da Receita</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="font-bold text-primary">{recipe.calories || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">Calorias</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">{recipe.servings || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">Doses</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">{recipe.prep_time || 'N/A'} min</p>
              <p className="text-xs text-muted-foreground">Preparação</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">{recipe.cook_time || 'N/A'} min</p>
              <p className="text-xs text-muted-foreground">Cozedura</p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="font-semibold mb-3">{t('recipes.ingredients')}</h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h4 className="font-semibold mb-3">{t('recipes.instructions')}</h4>
          <ol className="space-y-2">
            {instructionsList.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DialogContent>
  );
};