import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe, BlogPost, WorkoutPlan, MealPlan, PageContent } from '@/types/admin';

export const useAdminData = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [recipesResponse, postsResponse, workoutPlansResponse, mealPlansResponse, pageContentResponse] = await Promise.all([
        supabase.from('recipes').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('workout_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('meal_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('page_content').select('*').order('created_at', { ascending: false })
      ]);

      if (recipesResponse.data) setRecipes(recipesResponse.data);
      if (postsResponse.data) setBlogPosts(postsResponse.data);
      if (workoutPlansResponse.data) setWorkoutPlans(workoutPlansResponse.data);
      if (mealPlansResponse.data) setMealPlans(mealPlansResponse.data);
      if (pageContentResponse.data) setPageContent(pageContentResponse.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  return {
    recipes,
    blogPosts,
    workoutPlans,
    mealPlans,
    pageContent,
    loading,
    loadData
  };
};