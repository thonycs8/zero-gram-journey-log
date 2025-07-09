-- Update RLS policies to allow premium users to create content

-- Allow premium users to create recipes
CREATE POLICY "Premium users can create recipes" ON public.recipes
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to update their own recipes  
CREATE POLICY "Premium users can update their recipes" ON public.recipes
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to delete their own recipes
CREATE POLICY "Premium users can delete their recipes" ON public.recipes
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to create blog posts
CREATE POLICY "Premium users can create blog posts" ON public.blog_posts
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to update their own blog posts
CREATE POLICY "Premium users can update their blog posts" ON public.blog_posts
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to delete their own blog posts
CREATE POLICY "Premium users can delete their blog posts" ON public.blog_posts
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to create workout plans
CREATE POLICY "Premium users can create workout plans" ON public.workout_plans
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to update their own workout plans
CREATE POLICY "Premium users can update their workout plans" ON public.workout_plans
FOR UPDATE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);

-- Allow premium users to delete their own workout plans
CREATE POLICY "Premium users can delete their workout plans" ON public.workout_plans
FOR DELETE 
USING (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true
  )
);