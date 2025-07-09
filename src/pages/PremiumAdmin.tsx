import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminData } from '@/hooks/useAdminData';
import { RecipeManagement } from '@/components/admin/recipes/RecipeManagement';
import { BlogManagement } from '@/components/admin/BlogManagement';
import { WorkoutManagement } from '@/components/admin/WorkoutManagement';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

const PremiumAdmin = () => {
  const { user, isPremium } = useAuth();
  const { recipes, blogPosts, workoutPlans, loading: loadingData, loadData } = useAdminData(isPremium);

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter data to show only user's own content
  const userRecipes = recipes.filter(recipe => recipe.created_by === user?.id);
  const userBlogPosts = blogPosts.filter(post => post.created_by === user?.id);
  const userWorkoutPlans = workoutPlans.filter(plan => plan.created_by === user?.id);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Painel Premium</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Crown className="h-4 w-4 mr-1" />
            Acesso Premium
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Crie e gerencie seu próprio conteúdo
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes">
            Minhas Receitas ({userRecipes.length})
          </TabsTrigger>
          <TabsTrigger value="blog">
            Meus Posts ({userBlogPosts.length})
          </TabsTrigger>
          <TabsTrigger value="workouts">
            Meus Treinos ({userWorkoutPlans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <RecipeManagement recipes={userRecipes} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="blog">
          <BlogManagement blogPosts={userBlogPosts} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutManagement workoutPlans={userWorkoutPlans} onDataChange={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumAdmin;