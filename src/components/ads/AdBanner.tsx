import { GoogleAd } from './GoogleAd';

interface AdBannerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Banner publicitário horizontal
export const AdBanner = ({ size = 'medium', className = '' }: AdBannerProps) => {
  const sizes = {
    small: { width: '320px', height: '100px' },
    medium: { width: '728px', height: '90px' },
    large: { width: '970px', height: '250px' }
  };

  const adSlots = {
    small: '1234567890', // Substituir pelos slots reais
    medium: '1234567891',
    large: '1234567892'
  };

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <div 
        className="bg-muted/20 border border-border rounded-lg p-4 flex items-center justify-center"
        style={{ minWidth: sizes[size].width, minHeight: sizes[size].height }}
      >
        <GoogleAd
          adSlot={adSlots[size]}
          adFormat="horizontal"
          style={sizes[size]}
        />
      </div>
    </div>
  );
};