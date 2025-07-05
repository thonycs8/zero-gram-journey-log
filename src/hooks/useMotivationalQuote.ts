import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface MotivationalQuote {
  id: string;
  quote_pt: string;
  quote_en: string;
  category: string;
}

export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  const fetchRandomQuote = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (data && data.length > 0) {
        // Selecionar uma frase aleatória
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching motivational quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const getCurrentQuote = () => {
    if (!quote) return '';
    return i18n.language === 'pt' ? quote.quote_pt : quote.quote_en;
  };

  return {
    quote: getCurrentQuote(),
    loading,
    refreshQuote: fetchRandomQuote
  };
};