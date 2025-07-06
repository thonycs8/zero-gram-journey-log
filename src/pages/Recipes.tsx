import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSquare } from '@/components/ads/AdSquare';

const Recipes = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { recipes, loading, error } = useRecipes();

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Banner Publicitário */}
      <AdBanner size="medium" />

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
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredRecipes.slice(0, 6).map((recipe, index) => (
              <div 
                key={recipe.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
          
          {/* Anúncio no meio das receitas */}
          {filteredRecipes.length > 6 && (
            <div className="flex justify-center mb-8">
              <AdSquare size="large" />
            </div>
          )}
          
          {filteredRecipes.length > 6 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.slice(6).map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 6) * 0.1}s` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recipes;