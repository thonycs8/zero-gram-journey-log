import { GoogleAd } from './GoogleAd';

interface AdSquareProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Anúncio quadrado
export const AdSquare = ({ size = 'medium', className = '' }: AdSquareProps) => {
  const sizes = {
    small: { width: '200px', height: '200px' },
    medium: { width: '300px', height: '250px' },
    large: { width: '336px', height: '280px' }
  };

  const adSlots = {
    small: '1234567894', // Substituir pelos slots reais
    medium: '1234567895',
    large: '1234567896'
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div 
        className="bg-muted/20 border border-border rounded-lg p-4 flex items-center justify-center"
        style={sizes[size]}
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Publicidade</p>
          <GoogleAd
            adSlot={adSlots[size]}
            adFormat="rectangle"
            style={sizes[size]}
          />
        </div>
      </div>
    </div>
  );
};