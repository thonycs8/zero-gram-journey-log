import { useEffect, useRef } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

// Componente base para anúncios do Google AdSense
export const GoogleAd = ({ 
  adSlot, 
  adFormat = 'auto',
  style = {},
  className = ''
}: GoogleAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading Google Ad:', error);
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={`google-ad ${className}`}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Substituir pelo ID real
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};