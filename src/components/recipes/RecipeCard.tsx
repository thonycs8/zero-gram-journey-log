import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RecipeDetailsDialog } from './RecipeDetailsDialog';
import { getDifficultyColor } from '@/utils/recipe-utils';
import type { Recipe } from '@/types/admin';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { t } = useTranslation();
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  
  return (
    <Card className="glass-effect hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🍽️</span>
              <div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  {recipe.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Receita
                  </Badge>
                  {recipe.difficulty && (
                    <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty.toLowerCase())}`}>
                      {recipe.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <CardDescription className="text-sm">
              {recipe.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-lg font-bold text-primary">{recipe.calories || 'N/A'}</p>
            <p className="text-xs text-muted-foreground">{t('recipes.calories')}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-lg font-bold text-foreground">{recipe.servings || 'N/A'}</p>
            <p className="text-xs text-muted-foreground">{t('recipes.servings')}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-lg font-bold text-foreground">{totalTime ? `${totalTime} min` : 'N/A'}</p>
            <p className="text-xs text-muted-foreground">{t('recipes.prepTime')}</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              Ver Receita Completa
            </Button>
          </DialogTrigger>
          <RecipeDetailsDialog recipe={recipe} />
        </Dialog>
      </CardContent>
    </Card>
  );
};