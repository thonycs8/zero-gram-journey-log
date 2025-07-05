import { Card, CardContent } from '@/components/ui/card';
import type { Recipe, BlogPost, WorkoutPlan, MealPlan, PageContent } from '@/types/admin';

interface AdminStatsProps {
  recipes: Recipe[];
  blogPosts: BlogPost[];
  workoutPlans: WorkoutPlan[];
  mealPlans: MealPlan[];
  pageContent: PageContent[];
}

export const AdminStats = ({ recipes, blogPosts, workoutPlans, mealPlans, pageContent }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl mb-2">🍽️</div>
          <h3 className="font-semibold">Receitas</h3>
          <p className="text-2xl font-bold text-primary">{recipes.length}</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-semibold">Posts</h3>
          <p className="text-2xl font-bold text-primary">{blogPosts.length}</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl mb-2">💪</div>
          <h3 className="font-semibold">Treinos</h3>
          <p className="text-2xl font-bold text-primary">{workoutPlans.length}</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl mb-2">🥗</div>
          <h3 className="font-semibold">Planos</h3>
          <p className="text-2xl font-bold text-primary">{mealPlans.length}</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-semibold">Conteúdo</h3>
          <p className="text-2xl font-bold text-primary">{pageContent.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};