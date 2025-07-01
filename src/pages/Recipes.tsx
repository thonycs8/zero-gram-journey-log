import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Recipes = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const recipes = [
    {
      id: 1,
      name: 'Salmão Grelhado com Legumes',
      description: 'Delicioso salmão grelhado acompanhado de legumes frescos da época',
      calories: 420,
      servings: 2,
      prepTime: '25 min',
      difficulty: 'easy',
      image: '🐟',
      category: 'Almoço',
      ingredients: [
        '2 filetes de salmão (150g cada)',
        '1 courgette média',
        '1 pimento vermelho',
        '200g de brócolos',
        '2 colheres de sopa de azeite',
        'Sal e pimenta a gosto',
        'Sumo de 1 limão'
      ],
      instructions: [
        'Tempera o salmão com sal, pimenta e sumo de limão',
        'Corta os legumes em pedaços uniformes',
        'Grelha o salmão 4-5 minutos de cada lado',
        'Salteia os legumes no azeite até ficarem tenros',
        'Serve imediatamente com uma fatia de limão'
      ],
      nutrition: {
        protein: '35g',
        carbs: '12g',
        fat: '18g',
        fiber: '8g'
      }
    },
    {
      id: 2,
      name: 'Salada Mediterrânica Completa',
      description: 'Salada fresca e nutritiva com ingredientes típicos do mediterrâneo',
      calories: 280,
      servings: 1,
      prepTime: '15 min',
      difficulty: 'easy',
      image: '🥗',
      category: 'Jantar',
      ingredients: [
        '100g de folhas verdes mistas',
        '50g de queijo feta',
        '10 azeitonas pretas',
        '1 tomate médio',
        '1/2 pepino',
        '1/4 de cebola roxa',
        '2 colheres de sopa de azeite extra virgem',
        '1 colher de sopa de vinagre balsâmico'
      ],
      instructions: [
        'Lava bem todas as folhas verdes',
        'Corta o tomate, pepino e cebola',
        'Mistura todos os ingredientes numa tigela',
        'Tempera com azeite e vinagre',
        'Adiciona o queijo feta por cima'
      ],
      nutrition: {
        protein: '12g',
        carbs: '8g',
        fat: '22g',
        fiber: '6g'
      }
    },
    {
      id: 3,
      name: 'Smoothie Proteico Verde',
      description: 'Batido nutritivo perfeito para o pequeno-almoço ou lanche pós-treino',
      calories: 240,
      servings: 1,
      prepTime: '5 min',
      difficulty: 'easy',
      image: '🥤',
      category: 'Pequeno-almoço',
      ingredients: [
        '1 banana madura',
        '1 chávena de espinafres frescos',
        '1 colher de sopa de manteiga de amêndoa',
        '200ml de leite de amêndoa',
        '1 colher de chá de mel',
        'Gelo a gosto'
      ],
      instructions: [
        'Adiciona todos os ingredientes ao liquidificador',
        'Bate até obter uma mistura cremosa',
        'Adiciona gelo se preferires mais frio',
        'Serve imediatamente',
        'Decora com sementes de chia se desejares'
      ],
      nutrition: {
        protein: '8g',
        carbs: '28g',
        fat: '12g',
        fiber: '7g'
      }
    },
    {
      id: 4,
      name: 'Peito de Frango com Quinoa',
      description: 'Combinação perfeita de proteína magra com cereais integrais',
      calories: 380,
      servings: 2,
      prepTime: '30 min',
      difficulty: 'medium',
      image: '🍗',
      category: 'Almoço',
      ingredients: [
        '2 peitos de frango (120g cada)',
        '1 chávena de quinoa',
        '2 chávenas de caldo de legumes',
        '1 cenoura',
        '1 aipo',
        'Ervas aromáticas frescas',
        'Azeite e temperos'
      ],
      instructions: [
        'Coze a quinoa no caldo de legumes',
        'Tempera e grelha o frango',
        'Refoga os legumes cortados em cubos',
        'Mistura tudo numa tigela',
        'Finaliza com ervas frescas'
      ],
      nutrition: {
        protein: '42g',
        carbs: '35g',
        fat: '8g',
        fiber: '5g'
      }
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const RecipeCard = ({ recipe }: { recipe: typeof recipes[0] }) => (
    <Card className="glass-effect hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{recipe.image}</span>
              <div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  {recipe.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {recipe.category}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                    {t(`recipes.${recipe.difficulty}`)}
                  </Badge>
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
            <p className="text-lg font-bold text-primary">{recipe.calories}</p>
            <p className="text-xs text-muted-foreground">{t('recipes.calories')}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-lg font-bold text-foreground">{recipe.servings}</p>
            <p className="text-xs text-muted-foreground">{t('recipes.servings')}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-lg font-bold text-foreground">{recipe.prepTime}</p>
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
                <span className="text-2xl">{recipe.image}</span>
                {recipe.name}
              </DialogTitle>
              <DialogDescription>
                {recipe.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Nutrition Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">{t('recipes.nutrition')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="font-bold text-primary">{recipe.nutrition.protein}</p>
                    <p className="text-xs text-muted-foreground">Proteína</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{recipe.nutrition.carbs}</p>
                    <p className="text-xs text-muted-foreground">Hidratos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{recipe.nutrition.fat}</p>
                    <p className="text-xs text-muted-foreground">Gordura</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{recipe.nutrition.fiber}</p>
                    <p className="text-xs text-muted-foreground">Fibra</p>
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
                  {recipe.instructions.map((instruction, index) => (
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

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma receita encontrada</h3>
          <p className="text-muted-foreground">
            Tenta pesquisar por outros termos ou explora as nossas categorias.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recipes;