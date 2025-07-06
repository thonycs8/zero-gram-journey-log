// Tipo para PageContent baseado na tabela page_content
export interface PageContent {
  id: string;
  page_key: string;
  content_type: string;
  content: string;
  description?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

// Tipo para Recipe baseado na tabela recipes
export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  ingredients: string[];
  instructions: string;
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  calories?: number | null;
  difficulty?: string | null;
  image_url?: string | null;
  dica_zerogram?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

// Tipo para BlogPost baseado na tabela blog_posts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  image_url?: string | null;
  published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

// Tipo para WorkoutPlan baseado na tabela workout_plans
export interface WorkoutPlan {
  id: string;
  title: string;
  description?: string | null;
  difficulty?: string | null;
  frequency?: string | null;
  duration_weeks?: number | null;
  image_url?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
}

// Tipo para MealPlan baseado na tabela meal_plans
export interface MealPlan {
  id: string;
  title: string;
  description?: string | null;
  goal?: string | null;
  total_calories?: number | null;
  duration_days?: number | null;
  image_url?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  items?: MealPlanItem[];
}

// Tipos relacionados
export interface Tag {
  id: string;
  name: string;
  color?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;
  exercise_name: string;
  sets?: number | null;
  reps?: string | null;
  rest_seconds?: number | null;
  day_of_week?: number | null;
  order_index?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  meal_type: string;
  food_item: string;
  quantity?: string | null;
  calories?: number | null;
  day_number?: number | null;
  order_index?: number | null;
  created_at: string;
}

// Tipo para frases motivacionais
export interface MotivationalQuote {
  id: string;
  quote_pt: string;
  quote_en: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeForm {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  difficulty: string;
  image_url: string;
}

export interface PostForm {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
}

export interface WorkoutForm {
  title: string;
  description: string;
  difficulty: string;
  frequency: string;
  duration_weeks: number;
  image_url: string;
}

export interface MealPlanForm {
  title: string;
  description: string;
  goal: string;
  total_calories: number;
  duration_days: number;
  image_url: string;
}

export interface PageContentForm {
  page_key: string;
  content_type: string;
  content: string;
  description: string;
}