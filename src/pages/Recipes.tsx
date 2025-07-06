import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/types/admin';

const Recipes = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { recipes, loading, error } = useRecipes();

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const instructionsList = recipe.instructions.split('\n').filter(instruction => instruction.trim());
    
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
          </Dialog>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">{t('recipes.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('recipes.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <Input
          placeholder="Pesquisar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-center"
        />
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando receitas...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma receita encontrada</h3>
          <p className="text-muted-foreground">
            {recipes.length === 0 
              ? "Nenhuma receita publicada ainda." 
              : "Tenta pesquisar por outros termos ou explora as nossas categorias."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;