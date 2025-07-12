import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Zap, TrendingUp } from 'lucide-react';
import { useUserLevel } from '@/hooks/useUserLevel';

export const UserLevelCard = () => {
  const { userLevel, weeklyStats, loading } = useUserLevel();

  if (loading || !userLevel) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient based on level color */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: `linear-gradient(135deg, ${userLevel.color}, transparent)` }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${userLevel.color}20` }}
            >
              {userLevel.icon}
            </div>
            <div>
              <CardTitle className="text-lg">Nível {userLevel.level}</CardTitle>
              <p className="text-sm text-muted-foreground">{userLevel.title}</p>
            </div>
          </div>
          <Badge variant="outline" className="font-bold">
            {userLevel.current_points} pontos
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Level progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Progresso do Nível</p>
            <p className="text-sm text-muted-foreground">
              {userLevel.max_points 
                ? `${userLevel.points_to_next} pontos para próximo nível`
                : 'Nível máximo alcançado!'
              }
            </p>
          </div>
          <Progress 
            value={userLevel.progress_percent} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{userLevel.min_points}</span>
            {userLevel.max_points && <span>{userLevel.max_points}</span>}
          </div>
        </div>

        {/* Weekly stats */}
        {weeklyStats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Esta Semana</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                +{weeklyStats.total_points}
              </div>
              <div className="text-xs text-muted-foreground">pontos ganhos</div>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Sequência</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {weeklyStats.streak_days}
              </div>
              <div className="text-xs text-muted-foreground">dias ativos</div>
            </div>
          </div>
        )}

        {/* Level benefits */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Benefícios do Nível
          </p>
          <div className="space-y-1">
            {userLevel.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="pt-3 border-t">
          <p className="text-sm text-muted-foreground italic">
            "{userLevel.description}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};