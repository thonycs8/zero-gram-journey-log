import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DetailedCheckpointsService, ExerciseCheckpoint, MealCheckpoint, WorkoutSession, DailyNutritionGoal } from '@/services/detailedCheckpoints';

export const useDetailedCheckpoints = () => {
  const { user } = useAuth();
  const [exerciseCheckpoints, setExerciseCheckpoints] = useState<ExerciseCheckpoint[]>([]);
  const [mealCheckpoints, setMealCheckpoints] = useState<MealCheckpoint[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [dailyNutritionGoal, setDailyNutritionGoal] = useState<DailyNutritionGoal | null>(null);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0];

  // Load today's data
  const loadTodaysData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [exercises, meals, sessions, nutrition] = await Promise.all([
        DetailedCheckpointsService.getExerciseCheckpoints(user.id, currentDate),
        DetailedCheckpointsService.getMealCheckpoints(user.id, currentDate),
        DetailedCheckpointsService.getWorkoutSessions(user.id, currentDate),
        DetailedCheckpointsService.getDailyNutritionGoal(user.id, currentDate)
      ]);

      setExerciseCheckpoints(exercises);
      setMealCheckpoints(meals);
      setWorkoutSessions(sessions);
      setDailyNutritionGoal(nutrition);
    } catch (error) {
      console.error('Error loading today\'s data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize workout session and exercise checkpoints
  const initializeWorkoutSession = async (
    userPlanId: string,
    workoutPlanId: string,
    sessionName: string,
    exercises: Array<{
      exercise_id: string;
      exercise_name: string;
      total_sets: number;
    }>
  ) => {
    if (!user?.id) return null;

    try {
      // Create workout session
      const session = await DetailedCheckpointsService.createWorkoutSession(
        user.id,
        userPlanId,
        workoutPlanId,
        sessionName,
        exercises.length,
        currentDate
      );

      if (session) {
        // Create exercise checkpoints
        const checkpoints = await DetailedCheckpointsService.createExerciseCheckpoints(
          user.id,
          userPlanId,
          exercises,
          currentDate
        );

        setWorkoutSessions(prev => [...prev, session]);
        setExerciseCheckpoints(prev => [...prev, ...checkpoints]);

        return { session, checkpoints };
      }
    } catch (error) {
      console.error('Error initializing workout session:', error);
    }

    return null;
  };

  // Initialize meal checkpoints for a plan
  const initializeMealCheckpoints = async (
    userPlanId: string,
    mealItems: Array<{
      meal_item_id: string;
      food_item: string;
      meal_type: string;
      calories?: number;
    }>
  ) => {
    if (!user?.id) return [];

    try {
      const checkpoints = await DetailedCheckpointsService.createMealCheckpoints(
        user.id,
        userPlanId,
        mealItems,
        currentDate
      );

      setMealCheckpoints(prev => [...prev, ...checkpoints]);
      return checkpoints;
    } catch (error) {
      console.error('Error initializing meal checkpoints:', error);
      return [];
    }
  };

  // Complete exercise
  const completeExercise = async (
    checkpointId: string,
    setsCompleted: number,
    repsCompleted?: string,
    weightUsed?: number,
    notes?: string
  ) => {
    try {
      const updated = await DetailedCheckpointsService.updateExerciseCheckpoint(checkpointId, {
        sets_completed: setsCompleted,
        reps_completed: repsCompleted,
        weight_used: weightUsed,
        notes: notes,
        is_completed: true,
        completed_at: new Date().toISOString()
      });

      if (updated) {
        setExerciseCheckpoints(prev =>
          prev.map(checkpoint =>
            checkpoint.id === checkpointId ? updated : checkpoint
          )
        );

        // Refresh workout sessions to update completion status
        loadTodaysData();
      }

      return updated;
    } catch (error) {
      console.error('Error completing exercise:', error);
      return null;
    }
  };

  // Complete meal item
  const completeMealItem = async (
    checkpointId: string,
    quantityConsumed?: string,
    caloriesConsumed?: number,
    photoUrl?: string,
    notes?: string
  ) => {
    try {
      const updated = await DetailedCheckpointsService.updateMealCheckpoint(checkpointId, {
        quantity_consumed: quantityConsumed,
        calories_consumed: caloriesConsumed,
        photo_url: photoUrl,
        notes: notes,
        is_completed: true,
        completed_at: new Date().toISOString()
      });

      if (updated) {
        setMealCheckpoints(prev =>
          prev.map(checkpoint =>
            checkpoint.id === checkpointId ? updated : checkpoint
          )
        );

        // Refresh nutrition goals
        loadTodaysData();
      }

      return updated;
    } catch (error) {
      console.error('Error completing meal item:', error);
      return null;
    }
  };

  // Update water consumption
  const updateWaterConsumption = async (waterConsumed: number) => {
    if (!dailyNutritionGoal) return null;

    try {
      const updated = await DetailedCheckpointsService.updateDailyNutritionGoal(
        dailyNutritionGoal.id,
        { water_consumed: waterConsumed }
      );

      if (updated) {
        setDailyNutritionGoal(updated);
      }

      return updated;
    } catch (error) {
      console.error('Error updating water consumption:', error);
      return null;
    }
  };

  // Start workout session
  const startWorkoutSession = async (sessionId: string) => {
    try {
      const updated = await DetailedCheckpointsService.updateWorkoutSession(sessionId, {
        started_at: new Date().toISOString()
      });

      if (updated) {
        setWorkoutSessions(prev =>
          prev.map(session =>
            session.id === sessionId ? updated : session
          )
        );
      }

      return updated;
    } catch (error) {
      console.error('Error starting workout session:', error);
      return null;
    }
  };

  // Get today's statistics
  const getTodaysStats = () => {
    const totalExercises = exerciseCheckpoints.length;
    const completedExercises = exerciseCheckpoints.filter(e => e.is_completed).length;
    const totalMealItems = mealCheckpoints.length;
    const completedMealItems = mealCheckpoints.filter(m => m.is_completed).length;
    const completedWorkouts = workoutSessions.filter(w => w.is_completed).length;
    
    const exerciseProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
    const mealProgress = totalMealItems > 0 ? (completedMealItems / totalMealItems) * 100 : 0;
    
    const totalPoints = [
      ...exerciseCheckpoints,
      ...mealCheckpoints,
      ...workoutSessions
    ].reduce((sum, item) => sum + (item.points_earned || 0), 0);

    return {
      totalExercises,
      completedExercises,
      totalMealItems,
      completedMealItems,
      completedWorkouts,
      exerciseProgress,
      mealProgress,
      totalPoints,
      nutritionGoal: dailyNutritionGoal
    };
  };

  // Get exercises grouped by workout session
  const getExercisesBySession = () => {
    const sessionMap = new Map<string, ExerciseCheckpoint[]>();
    
    exerciseCheckpoints.forEach(exercise => {
      const sessionId = exercise.user_plan_id;
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, []);
      }
      sessionMap.get(sessionId)!.push(exercise);
    });

    return sessionMap;
  };

  // Get meals grouped by meal type
  const getMealsByType = () => {
    const mealTypes = ['café da manhã', 'almoço', 'lanche', 'jantar'];
    const mealMap = new Map<string, MealCheckpoint[]>();

    mealTypes.forEach(type => {
      mealMap.set(type, mealCheckpoints.filter(meal => meal.meal_type.toLowerCase() === type));
    });

    return mealMap;
  };

  useEffect(() => {
    if (user?.id) {
      loadTodaysData();
    }
  }, [user?.id]);

  return {
    // Data
    exerciseCheckpoints,
    mealCheckpoints,
    workoutSessions,
    dailyNutritionGoal,
    loading,

    // Actions
    initializeWorkoutSession,
    initializeMealCheckpoints,
    completeExercise,
    completeMealItem,
    updateWaterConsumption,
    startWorkoutSession,
    loadTodaysData,

    // Computed
    getTodaysStats,
    getExercisesBySession,
    getMealsByType
  };
};