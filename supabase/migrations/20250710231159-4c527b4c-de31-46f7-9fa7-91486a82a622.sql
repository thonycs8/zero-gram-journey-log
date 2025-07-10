-- Create user workout schedule table for flexible weekly scheduling
CREATE TABLE public.user_workout_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_plan_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  scheduled_time TIME NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user meal schedule table for flexible meal planning
CREATE TABLE public.user_meal_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_plan_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_type TEXT NOT NULL,
  scheduled_time TIME NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise checkpoints for individual exercise tracking
CREATE TABLE public.exercise_checkpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_plan_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  sets_completed INTEGER NOT NULL DEFAULT 0,
  total_sets INTEGER NOT NULL,
  reps_completed TEXT NULL,
  weight_used NUMERIC NULL,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  notes TEXT NULL,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal checkpoints for individual meal item tracking
CREATE TABLE public.meal_checkpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_plan_id UUID NOT NULL,
  meal_item_id UUID NOT NULL,
  food_item TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  quantity_consumed TEXT NULL,
  calories_consumed INTEGER NULL,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  photo_url TEXT NULL,
  notes TEXT NULL,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout sessions for complete workout tracking
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_plan_id UUID NOT NULL,
  workout_plan_id UUID NOT NULL,
  session_name TEXT NOT NULL,
  total_exercises INTEGER NOT NULL DEFAULT 0,
  completed_exercises INTEGER NOT NULL DEFAULT 0,
  total_duration_minutes INTEGER NULL,
  calories_burned INTEGER NULL,
  started_at TIMESTAMP WITH TIME ZONE NULL,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily nutrition goals tracking
CREATE TABLE public.daily_nutrition_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_calories INTEGER NOT NULL DEFAULT 2000,
  consumed_calories INTEGER NOT NULL DEFAULT 0,
  target_protein NUMERIC NULL,
  consumed_protein NUMERIC NULL DEFAULT 0,
  target_carbs NUMERIC NULL,
  consumed_carbs NUMERIC NULL DEFAULT 0,
  target_fat NUMERIC NULL,
  consumed_fat NUMERIC NULL DEFAULT 0,
  water_target NUMERIC NOT NULL DEFAULT 2.5,
  water_consumed NUMERIC NOT NULL DEFAULT 0,
  meals_completed INTEGER NOT NULL DEFAULT 0,
  total_meals INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_date)
);

-- Enable Row Level Security
ALTER TABLE public.user_workout_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meal_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_nutrition_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_workout_schedule
CREATE POLICY "Users can manage their own workout schedule" 
ON public.user_workout_schedule 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for user_meal_schedule
CREATE POLICY "Users can manage their own meal schedule" 
ON public.user_meal_schedule 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for exercise_checkpoints
CREATE POLICY "Users can manage their own exercise checkpoints" 
ON public.exercise_checkpoints 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for meal_checkpoints
CREATE POLICY "Users can manage their own meal checkpoints" 
ON public.meal_checkpoints 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for workout_sessions
CREATE POLICY "Users can manage their own workout sessions" 
ON public.workout_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for daily_nutrition_goals
CREATE POLICY "Users can manage their own daily nutrition goals" 
ON public.daily_nutrition_goals 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_workout_schedule_user_id ON public.user_workout_schedule(user_id);
CREATE INDEX idx_user_workout_schedule_day ON public.user_workout_schedule(day_of_week);
CREATE INDEX idx_user_meal_schedule_user_id ON public.user_meal_schedule(user_id);
CREATE INDEX idx_user_meal_schedule_day ON public.user_meal_schedule(day_of_week);
CREATE INDEX idx_exercise_checkpoints_user_id ON public.exercise_checkpoints(user_id);
CREATE INDEX idx_exercise_checkpoints_date ON public.exercise_checkpoints(workout_date);
CREATE INDEX idx_meal_checkpoints_user_id ON public.meal_checkpoints(user_id);
CREATE INDEX idx_meal_checkpoints_date ON public.meal_checkpoints(meal_date);
CREATE INDEX idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON public.workout_sessions(workout_date);
CREATE INDEX idx_daily_nutrition_goals_user_id ON public.daily_nutrition_goals(user_id);
CREATE INDEX idx_daily_nutrition_goals_date ON public.daily_nutrition_goals(goal_date);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_workout_schedule_updated_at
BEFORE UPDATE ON public.user_workout_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_meal_schedule_updated_at
BEFORE UPDATE ON public.user_meal_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercise_checkpoints_updated_at
BEFORE UPDATE ON public.exercise_checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_checkpoints_updated_at
BEFORE UPDATE ON public.meal_checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at
BEFORE UPDATE ON public.workout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_nutrition_goals_updated_at
BEFORE UPDATE ON public.daily_nutrition_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically award points for exercise completion
CREATE OR REPLACE FUNCTION public.award_exercise_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 5 points per exercise completion
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
    NEW.points_earned = 5;
    
    -- Update user total points
    UPDATE public.user_stats
    SET total_points = total_points + 5,
        total_calculations = total_calculations + 1
    WHERE user_id = NEW.user_id;
    
    -- Check if workout session is complete
    UPDATE public.workout_sessions
    SET completed_exercises = (
      SELECT COUNT(*) 
      FROM public.exercise_checkpoints 
      WHERE user_plan_id = NEW.user_plan_id 
      AND workout_date = NEW.workout_date 
      AND is_completed = TRUE
    )
    WHERE user_plan_id = NEW.user_plan_id 
    AND workout_date = NEW.workout_date;
    
    -- Award bonus points if workout is complete
    UPDATE public.workout_sessions
    SET is_completed = TRUE,
        points_earned = 20,
        completed_at = now()
    WHERE user_plan_id = NEW.user_plan_id 
    AND workout_date = NEW.workout_date
    AND completed_exercises >= total_exercises
    AND is_completed = FALSE;
    
    -- Award workout completion bonus
    IF EXISTS (
      SELECT 1 FROM public.workout_sessions 
      WHERE user_plan_id = NEW.user_plan_id 
      AND workout_date = NEW.workout_date
      AND is_completed = TRUE
      AND completed_at = now()::date
    ) THEN
      UPDATE public.user_stats
      SET total_points = total_points + 20
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically award points for meal completion
CREATE OR REPLACE FUNCTION public.award_meal_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 2 points per meal item completion
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
    NEW.points_earned = 2;
    
    -- Update user total points
    UPDATE public.user_stats
    SET total_points = total_points + 2
    WHERE user_id = NEW.user_id;
    
    -- Update daily nutrition goals
    UPDATE public.daily_nutrition_goals
    SET consumed_calories = consumed_calories + COALESCE(NEW.calories_consumed, 0),
        meals_completed = (
          SELECT COUNT(*)
          FROM public.meal_checkpoints
          WHERE user_id = NEW.user_id
          AND meal_date = NEW.meal_date
          AND is_completed = TRUE
        )
    WHERE user_id = NEW.user_id
    AND goal_date = NEW.meal_date;
    
    -- Award bonus points for meal completion (when all items in a meal type are done)
    DECLARE
      meal_items_total INTEGER;
      meal_items_completed INTEGER;
    BEGIN
      SELECT COUNT(*) INTO meal_items_total
      FROM public.meal_checkpoints
      WHERE user_id = NEW.user_id
      AND meal_date = NEW.meal_date
      AND meal_type = NEW.meal_type;
      
      SELECT COUNT(*) INTO meal_items_completed
      FROM public.meal_checkpoints
      WHERE user_id = NEW.user_id
      AND meal_date = NEW.meal_date
      AND meal_type = NEW.meal_type
      AND is_completed = TRUE;
      
      IF meal_items_completed = meal_items_total AND meal_items_total > 0 THEN
        UPDATE public.user_stats
        SET total_points = total_points + 10
        WHERE user_id = NEW.user_id;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic point awarding
CREATE TRIGGER award_exercise_completion_points
BEFORE UPDATE ON public.exercise_checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.award_exercise_points();

CREATE TRIGGER award_meal_completion_points
BEFORE UPDATE ON public.meal_checkpoints
FOR EACH ROW
EXECUTE FUNCTION public.award_meal_points();