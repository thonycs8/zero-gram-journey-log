-- Create user_plans table to track user selected plans
CREATE TABLE public.user_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL, -- 'workout' or 'meal' or 'diet'
  plan_id INTEGER NOT NULL, -- reference to the plan
  plan_title TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_days INTEGER NOT NULL DEFAULT 30,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_checkpoints table for tracking daily progress
CREATE TABLE public.user_checkpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_plan_id UUID NOT NULL REFERENCES public.user_plans(id) ON DELETE CASCADE,
  checkpoint_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements_unlocked table for tracking completed achievements
CREATE TABLE public.user_achievements_unlocked (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- 'plan_completed', 'streak', 'milestone', etc.
  achievement_title TEXT NOT NULL,
  achievement_description TEXT,
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements_unlocked ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_plans
CREATE POLICY "Users can view their own plans" 
ON public.user_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plans" 
ON public.user_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" 
ON public.user_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" 
ON public.user_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_checkpoints
CREATE POLICY "Users can view their own checkpoints" 
ON public.user_checkpoints 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkpoints" 
ON public.user_checkpoints 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkpoints" 
ON public.user_checkpoints 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements_unlocked
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements_unlocked 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
ON public.user_achievements_unlocked 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update plan progress
CREATE OR REPLACE FUNCTION public.update_plan_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the plan progress when a checkpoint is completed
  IF NEW.completed = TRUE AND (OLD.completed IS NULL OR OLD.completed = FALSE) THEN
    UPDATE public.user_plans 
    SET 
      current_progress = current_progress + 1,
      updated_at = now(),
      is_completed = CASE 
        WHEN current_progress + 1 >= target_days THEN TRUE 
        ELSE FALSE 
      END
    WHERE id = NEW.user_plan_id;
    
    -- Award points for checkpoint completion
    UPDATE public.user_checkpoints
    SET points_earned = 10
    WHERE id = NEW.id;
    
    -- Update user total points
    UPDATE public.user_stats
    SET total_points = total_points + 10
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic progress updates
CREATE TRIGGER update_plan_progress_trigger
  AFTER UPDATE ON public.user_checkpoints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_plan_progress();

-- Create function to award achievements
CREATE OR REPLACE FUNCTION public.check_and_award_achievements()
RETURNS TRIGGER AS $$
DECLARE
  plan_record RECORD;
  streak_count INTEGER;
BEGIN
  -- Check if plan was just completed
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
    -- Award plan completion achievement
    INSERT INTO public.user_achievements_unlocked (
      user_id, 
      achievement_type, 
      achievement_title, 
      achievement_description, 
      points_awarded
    ) VALUES (
      NEW.user_id,
      'plan_completed',
      'Plano Concluído!',
      'Parabéns! Você completou seu plano: ' || NEW.plan_title,
      100
    );
    
    -- Update user total points
    UPDATE public.user_stats
    SET total_points = total_points + 100
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for achievement awards
CREATE TRIGGER check_achievements_trigger
  AFTER UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_award_achievements();

-- Create indexes for better performance
CREATE INDEX idx_user_plans_user_id ON public.user_plans(user_id);
CREATE INDEX idx_user_checkpoints_user_id ON public.user_checkpoints(user_id);
CREATE INDEX idx_user_checkpoints_plan_id ON public.user_checkpoints(user_plan_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements_unlocked(user_id);