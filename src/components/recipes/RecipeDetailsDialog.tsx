import { useTranslation } from 'react-i18next';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Recipe } from '@/types/admin';

interface RecipeDetailsDialogProps {
  recipe: Recipe;
}

export const RecipeDetailsDialog = ({ recipe }: RecipeDetailsDialogProps) => {
  const { t } = useTranslation();
  const instructionsList = recipe.instructions.split('\n').filter(instruction => instruction.trim());

  return (
    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto m-4">
      <DialogHeader className="mb-6">
        <DialogTitle className="flex items-center gap-2 text-xl">
          <span className="text-2xl">🍽️</span>
          {recipe.title}
        </DialogTitle>
        <DialogDescription className="text-base">
          {recipe.description}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Recipe Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="font-bold text-primary text-lg">{recipe.calories || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Calorias</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="font-bold text-foreground text-lg">{recipe.servings || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Doses</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="font-bold text-foreground text-lg">{recipe.prep_time || 'N/A'} min</p>
                <p className="text-sm text-muted-foreground">Preparação</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="font-bold text-foreground text-lg">{recipe.cook_time || 'N/A'} min</p>
                <p className="text-sm text-muted-foreground">Cozedura</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dica ZeroGram Card */}
        {recipe.dica_zerogram && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                💡 Dica ZeroGram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{recipe.dica_zerogram}</p>
            </CardContent>
          </Card>
        )}

        {/* Ingredients Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recipes.ingredients')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 text-sm p-2 bg-muted/20 rounded-md">
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recipes.instructions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {instructionsList.map((instruction, index) => (
                <li key={index} className="flex gap-4 p-3 bg-muted/20 rounded-md">
                  <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};