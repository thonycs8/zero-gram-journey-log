-- Create user levels/ranks table
CREATE TABLE public.user_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  min_points INTEGER NOT NULL,
  max_points INTEGER,
  icon TEXT DEFAULT '🏆',
  color TEXT DEFAULT '#fbbf24',
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;

-- Create policies for user levels
CREATE POLICY "Everyone can view user levels" 
ON public.user_levels 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage user levels" 
ON public.user_levels 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default levels
INSERT INTO public.user_levels (level, title, description, min_points, max_points, icon, color, benefits) VALUES
(1, 'Iniciante', 'Começando a jornada fitness', 0, 99, '🌱', '#10b981', ARRAY['Acesso a planos básicos', 'Sistema de pontos']),
(2, 'Dedicado', 'Mostrando consistência', 100, 249, '💪', '#3b82f6', ARRAY['Planos intermediários', 'Tracking avançado', '+10% pontos bônus']),
(3, 'Comprometido', 'Sério sobre fitness', 250, 499, '🔥', '#f59e0b', ARRAY['Planos avançados', 'Conquistas especiais', '+15% pontos bônus']),
(4, 'Atleta', 'Performance de alto nível', 500, 999, '⚡', '#ef4444', ARRAY['Todos os planos', 'Coaching personalizado', '+20% pontos bônus']),
(5, 'Lenda', 'Elite dos guerreiros fitness', 1000, 2499, '👑', '#8b5cf6', ARRAY['Conteúdo exclusivo', 'Prioridade no suporte', '+25% pontos bônus']),
(6, 'Imortal', 'Transcendeu os limites', 2500, NULL, '🏛️', '#ec4899', ARRAY['Status VIP', 'Acesso beta', '+30% pontos bônus', 'Mentorias exclusivas']);

-- Create function to get user current level
CREATE OR REPLACE FUNCTION public.get_user_level(user_total_points INTEGER)
RETURNS TABLE(
  level_info JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'level', ul.level,
    'title', ul.title,
    'description', ul.description,
    'min_points', ul.min_points,
    'max_points', ul.max_points,
    'icon', ul.icon,
    'color', ul.color,
    'benefits', ul.benefits,
    'current_points', user_total_points,
    'points_to_next', CASE 
      WHEN ul.max_points IS NULL THEN 0 
      ELSE GREATEST(0, ul.max_points + 1 - user_total_points)
    END,
    'progress_percent', CASE 
      WHEN ul.max_points IS NULL THEN 100
      ELSE LEAST(100, ((user_total_points - ul.min_points) * 100.0 / (ul.max_points - ul.min_points + 1)))
    END
  ) as level_info
  FROM public.user_levels ul
  WHERE user_total_points >= ul.min_points 
    AND (ul.max_points IS NULL OR user_total_points <= ul.max_points)
  ORDER BY ul.level DESC
  LIMIT 1;
END;
$$;

-- Create function to calculate weekly workout stats
CREATE OR REPLACE FUNCTION public.get_weekly_stats(p_user_id UUID)
RETURNS TABLE(
  total_workouts INTEGER,
  completed_workouts INTEGER,
  total_exercises INTEGER,
  completed_exercises INTEGER,
  total_points INTEGER,
  streak_days INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
  week_end DATE := week_start + INTERVAL '6 days';
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT ws.id)::INTEGER as total_workouts,
    COUNT(DISTINCT CASE WHEN ws.is_completed THEN ws.id END)::INTEGER as completed_workouts,
    COUNT(ec.id)::INTEGER as total_exercises,
    COUNT(CASE WHEN ec.is_completed THEN ec.id END)::INTEGER as completed_exercises,
    COALESCE(SUM(ec.points_earned), 0)::INTEGER + COALESCE(SUM(ws.points_earned), 0)::INTEGER as total_points,
    (
      SELECT COUNT(DISTINCT DATE(uc.checkpoint_date))
      FROM user_checkpoints uc
      WHERE uc.user_id = p_user_id 
        AND uc.completed = true
        AND uc.checkpoint_date >= week_start
        AND uc.checkpoint_date <= week_end
    )::INTEGER as streak_days
  FROM workout_sessions ws
  LEFT JOIN exercise_checkpoints ec ON ec.user_id = ws.user_id AND ec.workout_date = ws.workout_date
  WHERE ws.user_id = p_user_id
    AND ws.workout_date >= week_start
    AND ws.workout_date <= week_end;
END;
$$;

-- Add trigger for updating timestamps
CREATE TRIGGER update_user_levels_updated_at
BEFORE UPDATE ON public.user_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();