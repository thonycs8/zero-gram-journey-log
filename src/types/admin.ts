export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  difficulty: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  frequency: string;
  duration_weeks: number;
  image_url: string;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_plan_id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  day_of_week: number;
  order_index: number;
  notes: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  goal: string;
  total_calories: number;
  duration_days: number;
  image_url: string;
  created_at: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  meal_type: string;
  food_item: string;
  quantity: string;
  calories: number;
  day_number: number;
  order_index: number;
}

export interface PageContent {
  id: string;
  page_key: string;
  content_type: string;
  content: string;
  description: string;
  created_at: string;
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
  category: string;
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