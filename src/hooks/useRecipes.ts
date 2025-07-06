import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/admin';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Falha ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes
  };
};