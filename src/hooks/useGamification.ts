import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserPlan {
  id: string;
  user_id: string;
  plan_type: string;
  plan_id: number;
  plan_title: string;
  start_date: string;
  target_days: number;
  current_progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCheckpoint {
  id: string;
  user_id: string;
  user_plan_id: string;
  checkpoint_date: string;
  completed: boolean;
  points_earned: number;
  notes?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_title: string;
  achievement_description?: string;
  points_awarded: number;
  unlocked_at: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [checkpoints, setCheckpoints] = useState<UserCheckpoint[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user plans
  const fetchUserPlans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPlans(data || []);
    } catch (error) {
      console.error('Error fetching user plans:', error);
    }
  };

  // Fetch checkpoints for a specific plan
  const fetchCheckpoints = async (planId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('user_checkpoints')
        .select('*')
        .eq('user_id', user.id);

      if (planId) {
        query = query.eq('user_plan_id', planId);
      }

      const { data, error } = await query.order('checkpoint_date', { ascending: false });

      if (error) throw error;
      setCheckpoints(data || []);
    } catch (error) {
      console.error('Error fetching checkpoints:', error);
    }
  };

  // Fetch user achievements
  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements_unlocked')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  // Create a new user plan
  const createUserPlan = async (planType: string, planId: number, planTitle: string, targetDays: number = 30) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_plans')
        .insert({
          user_id: user.id,
          plan_type: planType,
          plan_id: planId,
          plan_title: planTitle,
          target_days: targetDays
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plano Adicionado! 🎯",
        description: `Começaste o plano "${planTitle}". Boa sorte na tua jornada!`,
      });

      await fetchUserPlans();
      return data;
    } catch (error) {
      console.error('Error creating user plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o plano. Tenta novamente.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Complete a daily checkpoint
  const completeCheckpoint = async (planId: string, notes?: string) => {
    if (!user) return false;

    try {
      // Check if checkpoint for today already exists
      const today = new Date().toISOString().split('T')[0];
      const { data: existingCheckpoint } = await supabase
        .from('user_checkpoints')
        .select('*')
        .eq('user_plan_id', planId)
        .eq('checkpoint_date', today)
        .single();

      if (existingCheckpoint) {
        // Update existing checkpoint
        const { error } = await supabase
          .from('user_checkpoints')
          .update({ 
            completed: true, 
            notes: notes || existingCheckpoint.notes 
          })
          .eq('id', existingCheckpoint.id);

        if (error) throw error;
      } else {
        // Create new checkpoint
        const { error } = await supabase
          .from('user_checkpoints')
          .insert({
            user_id: user.id,
            user_plan_id: planId,
            checkpoint_date: today,
            completed: true,
            notes
          });

        if (error) throw error;
      }

      toast({
        title: "Checkpoint Completo! ✅",
        description: "Ganhaste 10 pontos! Continua assim!",
      });

      await fetchCheckpoints();
      await fetchUserPlans();
      return true;
    } catch (error) {
      console.error('Error completing checkpoint:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar o checkpoint.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Get today's checkpoints
  const getTodaysCheckpoints = () => {
    const today = new Date().toISOString().split('T')[0];
    return checkpoints.filter(cp => cp.checkpoint_date === today);
  };

  // Get plan progress percentage
  const getPlanProgress = (plan: UserPlan) => {
    return Math.min((plan.current_progress / plan.target_days) * 100, 100);
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserPlans(),
        fetchCheckpoints(),
        fetchAchievements()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    userPlans,
    checkpoints,
    achievements,
    loading,
    createUserPlan,
    completeCheckpoint,
    fetchCheckpoints,
    getTodaysCheckpoints,
    getPlanProgress,
    refetch: () => {
      fetchUserPlans();
      fetchCheckpoints();
      fetchAchievements();
    }
  };
};