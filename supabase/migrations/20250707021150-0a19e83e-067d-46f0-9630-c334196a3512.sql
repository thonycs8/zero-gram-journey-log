-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,  
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- fitness, nutrition, consistency, milestone
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL, -- count, streak, milestone
  requirement_value INTEGER NOT NULL,
  requirement_field TEXT, -- what to count (calculations, recipes_viewed, etc)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table  
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, achievement_id)
);

-- Create user_stats table for tracking user activities
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_calculations INTEGER DEFAULT 0,
  recipes_viewed INTEGER DEFAULT 0,
  plans_created INTEGER DEFAULT 0,
  days_active INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_goals table
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2), 
  weekly_goal DECIMAL(3,1) DEFAULT 0.5,
  daily_calories INTEGER DEFAULT 2000,
  daily_water DECIMAL(3,1) DEFAULT 2.5,
  weekly_exercise INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Everyone can view achievements" 
ON public.achievements FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" 
ON public.achievements FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
ON public.user_achievements FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" 
ON public.user_stats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_stats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view their own goals" 
ON public.user_goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" 
ON public.user_goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.user_goals FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial achievements
INSERT INTO public.achievements (title, description, icon, category, points, requirement_type, requirement_value, requirement_field) VALUES
('Primeiro Cálculo', 'Complete seu primeiro cálculo de calorias', 'star', 'milestone', 10, 'count', 1, 'calculations'),
('Explorador de Receitas', 'Visualize 10 receitas diferentes', 'award', 'nutrition', 25, 'count', 10, 'recipes_viewed'),
('Planejador', 'Crie seu primeiro plano alimentar', 'trophy', 'planning', 15, 'count', 1, 'plans_created'),
('Constância', 'Use a aplicação por 7 dias consecutivos', 'star', 'consistency', 50, 'streak', 7, 'current_streak'),
('Calculadora Expert', 'Complete 50 cálculos de calorias', 'award', 'milestone', 100, 'count', 50, 'calculations'),
('Mestre das Receitas', 'Visualize 100 receitas', 'trophy', 'nutrition', 150, 'count', 100, 'recipes_viewed'),
('Super Planejador', 'Crie 10 planos alimentares', 'star', 'planning', 200, 'count', 10, 'plans_created'),
('Dedicação Total', 'Mantenha uma sequência de 30 dias', 'award', 'consistency', 300, 'streak', 30, 'current_streak');