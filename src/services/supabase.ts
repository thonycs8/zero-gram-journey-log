import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  display_name?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  activity_level?: string;
  goal?: string;
  bio?: string;
  notifications?: any;
}

export interface UserGoals {
  currentWeight?: number;
  targetWeight?: number;
  weeklyGoal?: number;
  calories?: number;
  water?: number;
  exercise?: number;
}

export interface UserStats {
  totalCalculations: number;
  recipesViewed: number;
  plansCreated: number;
  daysActive: number;
  averageCalories: number;
  weightLoss: number;
  currentStreak?: number;
  longestStreak?: number;
  totalPoints?: number;
  level?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
  requirement_field?: string;
}

export interface UserAchievement {
  id: string;
  achievement: Achievement;
  unlocked_at: string;
  progress: number;
  is_completed: boolean;
}

export const ProfileService = {
  async getProfile(userId: string): Promise<ProfileData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, profileData: ProfileData): Promise<ProfileData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  },

  async getGoals(userId: string): Promise<UserGoals | null> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No goals found, return empty object
        return {
          currentWeight: 0,
          targetWeight: 0,
          weeklyGoal: 0.5,
          calories: 2000,
          water: 2.5,
          exercise: 4
        };
      }
      console.error('Error fetching goals:', error);
      return null;
    }
    
    // Map database fields to interface
    return {
      currentWeight: data.current_weight || 0,
      targetWeight: data.target_weight || 0,
      weeklyGoal: data.weekly_goal || 0.5,
      calories: data.daily_calories || 2000,
      water: data.daily_water || 2.5,
      exercise: data.weekly_exercise || 4
    };
  },

  async updateGoals(userId: string, goals: UserGoals): Promise<UserGoals | null> {
    // Map interface fields to database
    const dbGoals = {
      user_id: userId,
      current_weight: goals.currentWeight,
      target_weight: goals.targetWeight,
      weekly_goal: goals.weeklyGoal,
      daily_calories: goals.calories,
      daily_water: goals.water,
      weekly_exercise: goals.exercise
    };

    const { data, error } = await supabase
      .from('user_goals')
      .upsert(dbGoals)
      .select()
      .single();

    if (error) {
      console.error('Error updating goals:', error);
      return null;
    }
    
    // Map back to interface
    return {
      currentWeight: data.current_weight || 0,
      targetWeight: data.target_weight || 0,
      weeklyGoal: data.weekly_goal || 0.5,
      calories: data.daily_calories || 2000,
      water: data.daily_water || 2.5,
      exercise: data.weekly_exercise || 4
    };
  },

  async getStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No stats found, create initial stats
        return this.initializeStats(userId);
      }
      console.error('Error fetching stats:', error);
      return null;
    }
    
    // Map database fields to interface
    return {
      totalCalculations: data.total_calculations || 0,
      recipesViewed: data.recipes_viewed || 0,
      plansCreated: data.plans_created || 0,
      daysActive: data.days_active || 0,
      averageCalories: 0, // Not in database, calculated value
      weightLoss: 0, // Not in database, calculated value
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      totalPoints: data.total_points || 0,
      level: data.level || 1
    };
  },

  async initializeStats(userId: string): Promise<UserStats | null> {
    const initialStats = {
      user_id: userId,
      total_calculations: 0,
      recipes_viewed: 0,
      plans_created: 0,
      days_active: 0,
      current_streak: 0,
      longest_streak: 0,
      total_points: 0,
      level: 1
    };

    const { data, error } = await supabase
      .from('user_stats')
      .insert(initialStats)
      .select()
      .single();

    if (error) {
      console.error('Error initializing stats:', error);
      return null;
    }
    
    // Map to interface
    return {
      totalCalculations: 0,
      recipesViewed: 0,
      plansCreated: 0,
      daysActive: 0,
      averageCalories: 0,
      weightLoss: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1
    };
  },

  async updateStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();

    if (error) {
      console.error('Error updating stats:', error);
      return null;
    }
    
    // Map to interface
    return {
      totalCalculations: data.total_calculations || 0,
      recipesViewed: data.recipes_viewed || 0,
      plansCreated: data.plans_created || 0,
      daysActive: data.days_active || 0,
      averageCalories: 0,
      weightLoss: 0,
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      totalPoints: data.total_points || 0,
      level: data.level || 1
    };
  },

  async getAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievement_id (*)
      `)
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    return data || [];
  },

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    // Get user stats
    const stats = await this.getStats(userId);
    if (!stats) return [];

    // Get all achievements
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    const newAchievements: UserAchievement[] = [];

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();

      if (existing) continue;

      // Check if achievement should be unlocked
      const fieldValue = stats[achievement.requirement_field as keyof UserStats] || 0;
      const shouldUnlock = fieldValue >= achievement.requirement_value;

      if (shouldUnlock) {
        const { data: newAchievement, error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: fieldValue,
            is_completed: true
          })
          .select(`
            *,
            achievement:achievement_id (*)
          `)
          .single();

        if (!insertError && newAchievement) {
          newAchievements.push(newAchievement);
          
          // Update user total points
          await this.updateStats(userId, {
            ...stats,
            total_points: stats.total_points + achievement.points
          });
        }
      }
    }

    return newAchievements;
  },

  async incrementStat(userId: string, field: keyof UserStats, amount: number = 1): Promise<void> {
    const stats = await this.getStats(userId);
    if (!stats) return;

    const updatedStats = {
      ...stats,
      [field]: (stats[field] as number) + amount
    };

    await this.updateStats(userId, updatedStats);
    await this.checkAndUnlockAchievements(userId);
  }
};