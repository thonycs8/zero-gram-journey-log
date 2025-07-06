import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StoreConfig {
  url: string;
  namePt: string;
  nameEn: string;
}

export const useStoreConfig = () => {
  const { toast } = useToast();
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    url: '',
    namePt: '',
    nameEn: ''
  });
  const [loading, setLoading] = useState(true);

  const loadStoreConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('page_key, content')
        .in('page_key', ['store_button_url', 'store_button_name_pt', 'store_button_name_en']);

      if (error) throw error;

      if (data) {
        const config: StoreConfig = {
          url: '',
          namePt: '',
          nameEn: ''
        };

        data.forEach((item) => {
          switch (item.page_key) {
            case 'store_button_url':
              config.url = item.content;
              break;
            case 'store_button_name_pt':
              config.namePt = item.content;
              break;
            case 'store_button_name_en':
              config.nameEn = item.content;
              break;
          }
        });

        setStoreConfig(config);
      }
    } catch (error) {
      console.error('Error loading store config:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar configurações da loja",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreConfig();
  }, []);

  return {
    storeConfig,
    loading,
    loadStoreConfig
  };
};