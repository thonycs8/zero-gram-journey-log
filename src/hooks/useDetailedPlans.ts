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

  // Get exercises for a specific workout plan and day (using plan day instead of day_of_week)
  const getExercisesForDay = (workoutPlanId: string, planDay: number): WorkoutExercise[] => {
    return workoutExercises.filter(
      exercise => exercise.workout_plan_id === workoutPlanId && exercise.day_of_week === planDay
    );
  };

  // Get all exercises for a workout plan grouped by day
  const getWorkoutPlanDays = (workoutPlanId: string) => {
    const planExercises = workoutExercises.filter(ex => ex.workout_plan_id === workoutPlanId);
    const days: { [key: number]: WorkoutExercise[] } = {};
    
    planExercises.forEach(exercise => {
      const day = exercise.day_of_week || 1;
      if (!days[day]) days[day] = [];
      days[day].push(exercise);
    });
    
    return Object.keys(days).map(dayNum => ({
      dayNumber: parseInt(dayNum),
      exercises: days[parseInt(dayNum)],
      dayTitle: getDayTitle(parseInt(dayNum), days[parseInt(dayNum)])
    })).sort((a, b) => a.dayNumber - b.dayNumber);
  };

  // Generate day title based on exercises
  const getDayTitle = (dayNumber: number, exercises: WorkoutExercise[]): string => {
    if (!exercises || exercises.length === 0) return 'Descanso';
    
    // Try to determine muscle group from exercise names
    const exerciseNames = exercises.map(ex => ex.exercise_name.toLowerCase());
    
    if (exerciseNames.some(name => name.includes('peito') || name.includes('supino') || name.includes('triceps'))) {
      return 'Peito e Tríceps';
    }
    if (exerciseNames.some(name => name.includes('costas') || name.includes('puxada') || name.includes('biceps'))) {
      return 'Costas e Bíceps';
    }
    if (exerciseNames.some(name => name.includes('perna') || name.includes('agacha') || name.includes('gluteo'))) {
      return 'Pernas e Glúteos';
    }
    if (exerciseNames.some(name => name.includes('ombro') || name.includes('abdome') || name.includes('desenvolvimento'))) {
      return 'Ombros e Abdome';
    }
    
    return `${exercises.length} exercícios`;
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
    getWorkoutPlanDays,
    getMealsForDay,
    getWorkoutPlan,
    getMealPlan,
    refetch: () => {
      fetchWorkoutPlans();
      fetchMealPlans();
    }
  };
};