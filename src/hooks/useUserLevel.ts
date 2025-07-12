import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserLevel {
  level: number;
  title: string;
  description: string;
  min_points: number;
  max_points: number | null;
  icon: string;
  color: string;
  benefits: string[];
  current_points: number;
  points_to_next: number;
  progress_percent: number;
}

interface WeeklyStats {
  total_workouts: number;
  completed_workouts: number;
  total_exercises: number;
  completed_exercises: number;
  total_points: number;
  streak_days: number;
}

export const useUserLevel = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get user's total points from user_stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      const currentPoints = userStats?.total_points || 0;
      setTotalPoints(currentPoints);

      // Get user level based on points
      const { data: levelData } = await supabase
        .rpc('get_user_level', { user_total_points: currentPoints });

      if (levelData && levelData.length > 0) {
        const levelInfo = levelData[0].level_info as unknown as UserLevel;
        setUserLevel(levelInfo);
      }

      // Get weekly stats
      const { data: weeklyData } = await supabase
        .rpc('get_weekly_stats', { p_user_id: user.id });

      if (weeklyData && weeklyData.length > 0) {
        setWeeklyStats(weeklyData[0]);
      }

    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextLevel = async () => {
    if (!userLevel) return null;

    try {
      const { data: levels } = await supabase
        .from('user_levels')
        .select('*')
        .eq('level', userLevel.level + 1)
        .single();

      return levels;
    } catch (error) {
      console.error('Error fetching next level:', error);
      return null;
    }
  };

  const getAllLevels = async () => {
    try {
      const { data: levels } = await supabase
        .from('user_levels')
        .select('*')
        .order('level');

      return levels || [];
    } catch (error) {
      console.error('Error fetching all levels:', error);
      return [];
    }
  };

  const getLevelProgress = () => {
    if (!userLevel) return { current: 0, next: 0, percentage: 0 };

    return {
      current: userLevel.current_points,
      next: userLevel.max_points,
      remaining: userLevel.points_to_next,
      percentage: userLevel.progress_percent
    };
  };

  const getBonusMultiplier = () => {
    if (!userLevel) return 1;

    // Extract bonus percentage from benefits
    const bonusBenefit = userLevel.benefits.find(benefit => 
      benefit.includes('pontos bônus')
    );

    if (bonusBenefit) {
      const match = bonusBenefit.match(/\+(\d+)%/);
      if (match) {
        return 1 + (parseInt(match[1]) / 100);
      }
    }

    return 1;
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  return {
    userLevel,
    weeklyStats,
    totalPoints,
    loading,
    fetchUserStats,
    getNextLevel,
    getAllLevels,
    getLevelProgress,
    getBonusMultiplier
  };
};