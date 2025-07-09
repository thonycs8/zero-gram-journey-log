import { useSubscription } from './useSubscription';

export const useAds = () => {
  const { isPremium } = useSubscription();
  
  // Assinantes (Basic e Premium) não veem anúncios
  const shouldShowAds = !isPremium;
  
  return {
    shouldShowAds
  };
};