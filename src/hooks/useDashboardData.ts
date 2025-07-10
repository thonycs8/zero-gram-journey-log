import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  total_calculations: number;
  recipes_viewed: number;
  plans_created: number;
  total_points: number;
  current_streak: number;
  level: number;
}

export interface UserGoals {
  daily_calories: number;
  current_weight: number;
  target_weight: number;
  weekly_goal: number;
  weekly_exercise: number;
}

export interface RecentActivity {
  type: 'calculation' | 'recipe' | 'plan';
  date: string;
  calories?: number;
  goal?: string;
  name?: string;
  status?: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user stats
  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (!data) {
        // Create initial stats record
        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_calculations: 0,
            recipes_viewed: 0,
            plans_created: 0,
            total_points: 0,
            current_streak: 0,
            level: 1
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user stats:', createError);
          return;
        }

        setUserStats(newStats);
      } else {
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error in fetchUserStats:', error);
    }
  };

  // Fetch user goals
  const fetchUserGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user goals:', error);
        return;
      }

      if (!data) {
        // Create initial goals record
        const { data: newGoals, error: createError } = await supabase
          .from('user_goals')
          .insert({
            user_id: user.id,
            daily_calories: 2000,
            weekly_exercise: 4,
            weekly_goal: 0.5
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user goals:', createError);
          return;
        }

        setUserGoals(newGoals);
      } else {
        setUserGoals(data);
      }
    } catch (error) {
      console.error('Error in fetchUserGoals:', error);
    }
  };

  // Fetch recent activities (simulated data based on real stats)
  const fetchRecentActivities = async () => {
    if (!user || !userStats) return;

    const activities: RecentActivity[] = [];

    // Add recent calculation activities
    for (let i = 0; i < Math.min(userStats.total_calculations, 3); i++) {
      activities.push({
        type: 'calculation',
        date: `${i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : `${i + 1} dias`}`,
        calories: Math.floor(Math.random() * 500) + 1500,
        goal: ['Manter peso', 'Perder peso', 'Ganhar peso'][Math.floor(Math.random() * 3)]
      });
    }

    // Add recipe views
    if (userStats.recipes_viewed > 0) {
      activities.push({
        type: 'recipe',
        date: 'Ontem',
        name: 'Salmão grelhado',
        calories: 450
      });
    }

    // Add plan activities
    if (userStats.plans_created > 0) {
      activities.push({
        type: 'plan',
        date: '2 dias',
        name: 'Plano Semanal',
        status: 'Criado'
      });
    }

    setRecentActivities(activities.slice(0, 4));
  };

  // Update calculation count
  const incrementCalculations = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          total_calculations: (userStats?.total_calculations || 0) + 1,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating calculations:', error);
        return;
      }

      await fetchUserStats();
    } catch (error) {
      console.error('Error in incrementCalculations:', error);
    }
  };

  // Update recipe view count
  const incrementRecipeViews = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          recipes_viewed: (userStats?.recipes_viewed || 0) + 1,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating recipe views:', error);
        return;
      }

      await fetchUserStats();
    } catch (error) {
      console.error('Error in incrementRecipeViews:', error);
    }
  };

  // Calculate weekly progress (based on last 7 days activity)
  const getWeeklyProgress = () => {
    if (!userStats) return 0;
    
    // Simple calculation: if user has recent activity, show progress
    const daysActive = Math.min(userStats.current_streak, 7);
    return Math.round((daysActive / 7) * 100);
  };

  // Calculate average daily calories (simplified)
  const getAverageDailyCalories = () => {
    if (!userGoals || !userStats) return userGoals?.daily_calories || 2000;
    
    // Base it on daily goal with some variation based on activity
    const base = userGoals.daily_calories;
    const variation = userStats.total_calculations > 10 ? 50 : 0;
    return base + variation;
  };

  // Get today's calories progress
  const getTodaysCalories = () => {
    if (!userGoals) return { current: 0, goal: 2000 };
    
    // Simulate current progress based on time of day
    const hour = new Date().getHours();
    const progressFactor = Math.min(hour / 24, 0.9); // Max 90% by end of day
    const current = Math.round(userGoals.daily_calories * progressFactor);
    
    return {
      current,
      goal: userGoals.daily_calories
    };
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserStats(),
        fetchUserGoals()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  // Fetch activities when stats are loaded
  useEffect(() => {
    if (userStats) {
      fetchRecentActivities();
    }
  }, [userStats]);

  return {
    userStats,
    userGoals,
    recentActivities,
    loading,
    incrementCalculations,
    incrementRecipeViews,
    getWeeklyProgress,
    getAverageDailyCalories,
    getTodaysCalories,
    refetch: () => {
      fetchUserStats();
      fetchUserGoals();
    }
  };
};