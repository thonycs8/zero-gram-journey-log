-- Update subscribers table to support multiple currencies and tiers
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR';
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS amount INTEGER;

-- Update RLS policies for Basic plan users
CREATE POLICY "Basic users can create recipes" ON public.recipes
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can update their own recipes" ON public.recipes
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can delete their own recipes" ON public.recipes
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can create blog posts" ON public.blog_posts
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can update their blog posts" ON public.blog_posts
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can delete their blog posts" ON public.blog_posts
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can create workout plans" ON public.workout_plans
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can update their workout plans" ON public.workout_plans
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);

CREATE POLICY "Basic users can delete their workout plans" ON public.workout_plans
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
    AND subscription_tier IN ('Basic', 'Premium')
  )
);