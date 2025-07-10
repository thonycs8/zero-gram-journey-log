import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration_weeks: number;
  frequency: string;
  image_url?: string;
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
  notes?: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  goal: string;
  duration_days: number;
  total_calories: number;
  image_url?: string;
}

export interface MealPlanItem {
  id: string;
  meal_plan_id: string;
  food_item: string;
  meal_type: string;
  day_number: number;
  quantity: string;
  calories: number;
  order_index: number;
}

export const useDetailedPlans = () => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch workout plans and exercises
  const fetchWorkoutPlans = async () => {
    try {
      const { data: plans, error: plansError } = await supabase
        .from('workout_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      const { data: exercises, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*')
        .order('day_of_week, order_index');

      if (exercisesError) throw exercisesError;

      setWorkoutPlans(plans || []);
      setWorkoutExercises(exercises || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  // Fetch meal plans and items
  const fetchMealPlans = async () => {
    try {
      const { data: plans, error: plansError } = await supabase
        .from('meal_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      const { data: items, error: itemsError } = await supabase
        .from('meal_plan_items')
        .select('*')
        .order('day_number, order_index');

      if (itemsError) throw itemsError;

      setMealPlans(plans || []);
      setMealPlanItems(items || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  // Get exercises for a specific workout plan and day
  const getExercisesForDay = (workoutPlanId: string, dayOfWeek: number): WorkoutExercise[] => {
    return workoutExercises.filter(
      exercise => exercise.workout_plan_id === workoutPlanId && exercise.day_of_week === dayOfWeek
    );
  };

  // Get meals for a specific meal plan and day
  const getMealsForDay = (mealPlanId: string, dayNumber: number): MealPlanItem[] => {
    return mealPlanItems.filter(
      item => item.meal_plan_id === mealPlanId && item.day_number === dayNumber
    );
  };

  // Get workout plan by ID
  const getWorkoutPlan = (planId: string): WorkoutPlan | undefined => {
    return workoutPlans.find(plan => plan.id === planId);
  };

  // Get meal plan by ID
  const getMealPlan = (planId: string): MealPlan | undefined => {
    return mealPlans.find(plan => plan.id === planId);
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchWorkoutPlans(),
        fetchMealPlans()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    workoutPlans,
    workoutExercises,
    mealPlans,
    mealPlanItems,
    loading,
    getExercisesForDay,
    getMealsForDay,
    getWorkoutPlan,
    getMealPlan,
    refetch: () => {
      fetchWorkoutPlans();
      fetchMealPlans();
    }
  };
};