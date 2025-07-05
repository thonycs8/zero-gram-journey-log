-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('Iniciante', 'Intermédio', 'Avançado')),
  frequency TEXT, -- e.g., "3x por semana", "5x por semana"
  duration_weeks INTEGER,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_exercises table (exercises within a workout plan)
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT, -- can be "10-12" or "até falha"
  rest_seconds INTEGER,
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  order_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_plans table
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goal TEXT, -- e.g., "Emagrecimento", "Ganho de massa", "Manutenção"
  total_calories INTEGER,
  duration_days INTEGER,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_plan_items table (meals within a meal plan)
CREATE TABLE public.meal_plan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL, -- "Pequeno-almoço", "Almoço", "Jantar", "Lanche"
  food_item TEXT NOT NULL,
  quantity TEXT,
  calories INTEGER,
  day_number INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page_content table for dynamic content management
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE, -- e.g., "home_title", "home_subtitle", "motivational_quotes"
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'html', 'json')),
  content TEXT NOT NULL,
  description TEXT, -- To help admins understand what this content is for
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies for workout_plans
CREATE POLICY "Everyone can view workout plans" 
  ON public.workout_plans 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all workout plans" 
  ON public.workout_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for workout_exercises
CREATE POLICY "Everyone can view workout exercises" 
  ON public.workout_exercises 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all workout exercises" 
  ON public.workout_exercises 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for meal_plans
CREATE POLICY "Everyone can view meal plans" 
  ON public.meal_plans 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all meal plans" 
  ON public.meal_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for meal_plan_items
CREATE POLICY "Everyone can view meal plan items" 
  ON public.meal_plan_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all meal plan items" 
  ON public.meal_plan_items 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for page_content
CREATE POLICY "Everyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all page content" 
  ON public.page_content 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert some initial page content
INSERT INTO public.page_content (page_key, content_type, content, description) VALUES
('home_title', 'text', 'Transforme o seu corpo com', 'Título principal da página inicial'),
('home_title_highlight', 'text', ' ZeroGram', 'Parte destacada do título principal'),
('home_subtitle', 'text', 'Descubra como alcançar o seu peso ideal com planos personalizados e orientação profissional', 'Subtítulo da página inicial'),
('home_description', 'text', 'Através da nossa calculadora inteligente e planos alimentares personalizados, vamos ajudá-lo a atingir os seus objetivos de forma saudável e sustentável.', 'Descrição da página inicial'),
('motivational_quotes', 'json', '["O sucesso é a soma de pequenos esforços repetidos dia após dia.", "Não espere por uma segunda-feira. Comece hoje mesmo.", "O seu corpo pode fazer. É a sua mente que precisa de ser convencida.", "Cada passo conta. Cada escolha importa.", "A transformação acontece quando decidimos começar."]', 'Frases motivacionais para o blog');

-- Assign all existing recipes and blog posts to admin
UPDATE public.recipes SET created_by = (
  SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1
) WHERE created_by IS NULL;

UPDATE public.blog_posts SET created_by = (
  SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1
) WHERE created_by IS NULL;