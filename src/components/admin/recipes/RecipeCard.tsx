import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Recipe } from '@/types/admin';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          <span>⏱️ {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
          <span>🍽️ {recipe.servings} doses</span>
          <span>🔥 {recipe.calories} cal</span>
          <span>📅 {new Date(recipe.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(recipe)}
            className="flex-1"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(recipe.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};