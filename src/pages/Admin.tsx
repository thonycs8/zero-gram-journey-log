import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminData } from '@/hooks/useAdminData';
import { AdminStats } from '@/components/admin/AdminStats';
import { RecipeManagement } from '@/components/admin/recipes/RecipeManagement';
import { BlogManagement } from '@/components/admin/BlogManagement';
import { WorkoutManagement } from '@/components/admin/WorkoutManagement';
import { MealPlanManagement } from '@/components/admin/MealPlanManagement';
import { PageContentManagement } from '@/components/admin/PageContentManagement';
import { PageManagement } from '@/components/admin/PageManagement';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { recipes, blogPosts, workoutPlans, mealPlans, pageContent, loading: loadingData, loadData } = useAdminData(isAdmin);

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
        <p className="text-lg text-muted-foreground">
          Gerir receitas e posts do blog
        </p>
      </div>

      {/* Stats */}
      <AdminStats
        recipes={recipes}
        blogPosts={blogPosts}
        workoutPlans={workoutPlans}
        mealPlans={mealPlans}
        pageContent={pageContent}
      />

      {/* Main Content */}
      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="recipes">Receitas</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="workouts">Treinos</TabsTrigger>
          <TabsTrigger value="meals">Planos</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <RecipeManagement recipes={recipes} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="blog">
          <BlogManagement blogPosts={blogPosts} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutManagement workoutPlans={workoutPlans} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="meals">
          <MealPlanManagement mealPlans={mealPlans} onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="pages">
          <PageManagement onDataChange={loadData} />
        </TabsContent>

        <TabsContent value="content">
          <PageContentManagement pageContent={pageContent} onDataChange={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;