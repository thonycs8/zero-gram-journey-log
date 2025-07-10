import { supabase } from '@/integrations/supabase/client';

export interface ExerciseCheckpoint {
  id: string;
  user_id: string;
  user_plan_id: string;
  exercise_id: string;
  exercise_name: string;
  sets_completed: number;
  total_sets: number;
  reps_completed?: string;
  weight_used?: number;
  completed_at?: string;
  is_completed: boolean;
  points_earned: number;
  notes?: string;
  workout_date: string;
}

export interface MealCheckpoint {
  id: string;
  user_id: string;
  user_plan_id: string;
  meal_item_id: string;
  food_item: string;
  meal_type: string;
  quantity_consumed?: string;
  calories_consumed?: number;
  completed_at?: string;
  is_completed: boolean;
  points_earned: number;
  photo_url?: string;
  notes?: string;
  meal_date: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  user_plan_id: string;
  workout_plan_id: string;
  session_name: string;
  total_exercises: number;
  completed_exercises: number;
  total_duration_minutes?: number;
  calories_burned?: number;
  started_at?: string;
  completed_at?: string;
  is_completed: boolean;
  points_earned: number;
  workout_date: string;
}

export interface DailyNutritionGoal {
  id: string;
  user_id: string;
  goal_date: string;
  target_calories: number;
  consumed_calories: number;
  target_protein?: number;
  consumed_protein?: number;
  target_carbs?: number;
  consumed_carbs?: number;
  target_fat?: number;
  consumed_fat?: number;
  water_target: number;
  water_consumed: number;
  meals_completed: number;
  total_meals: number;
  points_earned: number;
  is_completed: boolean;
}

export const DetailedCheckpointsService = {
  // Exercise Checkpoints
  async createExerciseCheckpoints(
    userId: string,
    userPlanId: string,
    exercises: Array<{
      exercise_id: string;
      exercise_name: string;
      total_sets: number;
    }>,
    workoutDate?: string
  ): Promise<ExerciseCheckpoint[]> {
    const checkpoints = exercises.map(exercise => ({
      user_id: userId,
      user_plan_id: userPlanId,
      exercise_id: exercise.exercise_id,
      exercise_name: exercise.exercise_name,
      total_sets: exercise.total_sets,
      workout_date: workoutDate || new Date().toISOString().split('T')[0]
    }));

    const { data, error } = await supabase
      .from('exercise_checkpoints')
      .insert(checkpoints)
      .select();

    if (error) {
      console.error('Error creating exercise checkpoints:', error);
      return [];
    }

    return data || [];
  },

  async getExerciseCheckpoints(
    userId: string,
    workoutDate?: string
  ): Promise<ExerciseCheckpoint[]> {
    let query = supabase
      .from('exercise_checkpoints')
      .select('*')
      .eq('user_id', userId);

    if (workoutDate) {
      query = query.eq('workout_date', workoutDate);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching exercise checkpoints:', error);
      return [];
    }

    return data || [];
  },

  async updateExerciseCheckpoint(
    checkpointId: string,
    updates: Partial<ExerciseCheckpoint>
  ): Promise<ExerciseCheckpoint | null> {
    const { data, error } = await supabase
      .from('exercise_checkpoints')
      .update(updates)
      .eq('id', checkpointId)
      .select()
      .single();

    if (error) {
      console.error('Error updating exercise checkpoint:', error);
      return null;
    }

    return data;
  },

  // Meal Checkpoints
  async createMealCheckpoints(
    userId: string,
    userPlanId: string,
    mealItems: Array<{
      meal_item_id: string;
      food_item: string;
      meal_type: string;
      calories?: number;
    }>,
    mealDate?: string
  ): Promise<MealCheckpoint[]> {
    const checkpoints = mealItems.map(item => ({
      user_id: userId,
      user_plan_id: userPlanId,
      meal_item_id: item.meal_item_id,
      food_item: item.food_item,
      meal_type: item.meal_type,
      calories_consumed: item.calories,
      meal_date: mealDate || new Date().toISOString().split('T')[0]
    }));

    const { data, error } = await supabase
      .from('meal_checkpoints')
      .insert(checkpoints)
      .select();

    if (error) {
      console.error('Error creating meal checkpoints:', error);
      return [];
    }

    return data || [];
  },

  async getMealCheckpoints(
    userId: string,
    mealDate?: string
  ): Promise<MealCheckpoint[]> {
    let query = supabase
      .from('meal_checkpoints')
      .select('*')
      .eq('user_id', userId);

    if (mealDate) {
      query = query.eq('meal_date', mealDate);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching meal checkpoints:', error);
      return [];
    }

    return data || [];
  },

  async updateMealCheckpoint(
    checkpointId: string,
    updates: Partial<MealCheckpoint>
  ): Promise<MealCheckpoint | null> {
    const { data, error } = await supabase
      .from('meal_checkpoints')
      .update(updates)
      .eq('id', checkpointId)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal checkpoint:', error);
      return null;
    }

    return data;
  },

  // Workout Sessions
  async createWorkoutSession(
    userId: string,
    userPlanId: string,
    workoutPlanId: string,
    sessionName: string,
    totalExercises: number,
    workoutDate?: string
  ): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        user_plan_id: userPlanId,
        workout_plan_id: workoutPlanId,
        session_name: sessionName,
        total_exercises: totalExercises,
        workout_date: workoutDate || new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout session:', error);
      return null;
    }

    return data;
  },

  async getWorkoutSessions(
    userId: string,
    workoutDate?: string
  ): Promise<WorkoutSession[]> {
    let query = supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId);

    if (workoutDate) {
      query = query.eq('workout_date', workoutDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout sessions:', error);
      return [];
    }

    return data || [];
  },

  async updateWorkoutSession(
    sessionId: string,
    updates: Partial<WorkoutSession>
  ): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout session:', error);
      return null;
    }

    return data;
  },

  // Daily Nutrition Goals
  async getDailyNutritionGoal(
    userId: string,
    goalDate?: string
  ): Promise<DailyNutritionGoal | null> {
    const date = goalDate || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('goal_date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No goal found, create one
        return this.createDailyNutritionGoal(userId, date);
      }
      console.error('Error fetching daily nutrition goal:', error);
      return null;
    }

    return data;
  },

  async createDailyNutritionGoal(
    userId: string,
    goalDate: string,
    targetCalories = 2000
  ): Promise<DailyNutritionGoal | null> {
    const { data, error } = await supabase
      .from('daily_nutrition_goals')
      .insert({
        user_id: userId,
        goal_date: goalDate,
        target_calories: targetCalories
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating daily nutrition goal:', error);
      return null;
    }

    return data;
  },

  async updateDailyNutritionGoal(
    goalId: string,
    updates: Partial<DailyNutritionGoal>
  ): Promise<DailyNutritionGoal | null> {
    const { data, error } = await supabase
      .from('daily_nutrition_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating daily nutrition goal:', error);
      return null;
    }

    return data;
  },

  // Statistics and Analytics
  async getWeeklyWorkoutStats(userId: string): Promise<{
    totalExercises: number;
    completedExercises: number;
    totalWorkouts: number;
    completedWorkouts: number;
    pointsEarned: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

    // Get exercise stats
    const { data: exerciseStats } = await supabase
      .from('exercise_checkpoints')
      .select('is_completed, points_earned')
      .eq('user_id', userId)
      .gte('workout_date', weekAgoString);

    // Get workout session stats
    const { data: workoutStats } = await supabase
      .from('workout_sessions')
      .select('is_completed, points_earned')
      .eq('user_id', userId)
      .gte('workout_date', weekAgoString);

    const totalExercises = exerciseStats?.length || 0;
    const completedExercises = exerciseStats?.filter(e => e.is_completed).length || 0;
    const totalWorkouts = workoutStats?.length || 0;
    const completedWorkouts = workoutStats?.filter(w => w.is_completed).length || 0;
    const pointsEarned = [
      ...(exerciseStats || []),
      ...(workoutStats || [])
    ].reduce((sum, item) => sum + (item.points_earned || 0), 0);

    return {
      totalExercises,
      completedExercises,
      totalWorkouts,
      completedWorkouts,
      pointsEarned
    };
  },

  async getWeeklyNutritionStats(userId: string): Promise<{
    avgCaloriesConsumed: number;
    avgCaloriesTarget: number;
    totalMealsCompleted: number;
    nutritionGoalsAchieved: number;
    pointsEarned: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

    const { data: nutritionStats } = await supabase
      .from('daily_nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .gte('goal_date', weekAgoString);

    if (!nutritionStats || nutritionStats.length === 0) {
      return {
        avgCaloriesConsumed: 0,
        avgCaloriesTarget: 0,
        totalMealsCompleted: 0,
        nutritionGoalsAchieved: 0,
        pointsEarned: 0
      };
    }

    const avgCaloriesConsumed = nutritionStats.reduce((sum, day) => sum + day.consumed_calories, 0) / nutritionStats.length;
    const avgCaloriesTarget = nutritionStats.reduce((sum, day) => sum + day.target_calories, 0) / nutritionStats.length;
    const totalMealsCompleted = nutritionStats.reduce((sum, day) => sum + day.meals_completed, 0);
    const nutritionGoalsAchieved = nutritionStats.filter(day => day.is_completed).length;
    const pointsEarned = nutritionStats.reduce((sum, day) => sum + day.points_earned, 0);

    return {
      avgCaloriesConsumed,
      avgCaloriesTarget,
      totalMealsCompleted,
      nutritionGoalsAchieved,
      pointsEarned
    };
  }
};