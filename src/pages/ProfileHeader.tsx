import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  joinDate?: string;
  level?: number;
  totalPoints?: number;
}

const ProfileHeader = ({ name, email, joinDate, level = 1, totalPoints = 0 }: ProfileHeaderProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recente';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{name || 'Utilizador'}</h1>
              <Badge variant="secondary" className="px-3 py-1">
                Nível {level}
              </Badge>
            </div>
            
            <p className="text-muted-foreground">{email}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Membro desde {formatDate(joinDate)}</span>
              <span>•</span>
              <span className="font-medium text-primary">{totalPoints} pontos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;