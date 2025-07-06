import { GoogleAd } from './GoogleAd';

interface AdSidebarProps {
  className?: string;
}

// Anúncio lateral vertical
export const AdSidebar = ({ className = '' }: AdSidebarProps) => {
  return (
    <div className={`sticky top-4 ${className}`}>
      <div className="bg-muted/20 border border-border rounded-lg p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Publicidade</p>
          <GoogleAd
            adSlot="1234567893" // Substituir pelo slot real
            adFormat="vertical"
            style={{ width: '300px', height: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};