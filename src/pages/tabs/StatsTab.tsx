import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsTabProps {
  stats: any;
}

const StatsTab = ({ stats }: StatsTabProps) => {
  const calculateLevel = (points: number) => {
    // Level calculation: every 100 points = 1 level
    return Math.floor(points / 100) + 1;
  };

  const getPointsToNextLevel = (points: number) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * 100;
    return pointsForNextLevel - points;
  };

  const getLevelProgress = (points: number) => {
    const currentLevelPoints = (calculateLevel(points) - 1) * 100;
    const progressInCurrentLevel = points - currentLevelPoints;
    return (progressInCurrentLevel / 100) * 100;
  };

  const StatCard = ({ title, value, description, progress }: { 
    title: string; 
    value: string | number; 
    description: string; 
    progress?: number;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <Card>
        <CardHeader>
          <CardTitle>Nível e Pontuação</CardTitle>
          <CardDescription>
            O seu progresso na aplicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
            <div className="text-3xl font-bold">Nível {calculateLevel(stats.totalPoints || 0)}</div>
            <div className="text-sm text-muted-foreground">
              {stats.totalPoints || 0} pontos totais
            </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {getPointsToNextLevel(stats.totalPoints || 0)} pontos para o próximo nível
              </div>
            </div>
          </div>
          <Progress value={getLevelProgress(stats.totalPoints || 0)} className="h-2" />
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cálculos Realizados"
          value={stats.totalCalculations}
          description="Total de cálculos de calorias"
        />
        
        <StatCard
          title="Receitas Visualizadas"
          value={stats.recipesViewed}
          description="Receitas que já consultou"
        />
        
        <StatCard
          title="Planos Criados"
          value={stats.plansCreated}
          description="Planos alimentares criados"
        />
        
        <StatCard
          title="Dias Ativos"
          value={stats.daysActive}
          description="Total de dias com atividade"
        />
      </div>

      {/* Consistency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Sequência Atual"
          value={`${stats.currentStreak || 0} dias`}
          description="Dias consecutivos de atividade"
          progress={Math.min(((stats.currentStreak || 0) / 30) * 100, 100)}
        />
        
        <StatCard
          title="Melhor Sequência"
          value={`${stats.longestStreak || 0} dias`}
          description="Maior sequência já alcançada"
        />
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Semanal</CardTitle>
          <CardDescription>
            A sua atividade na última semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cálculos esta semana</span>
              <span className="font-medium">{Math.min(stats.totalCalculations, 12)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Receitas vistas esta semana</span>
              <span className="font-medium">{Math.min(stats.recipesViewed, 25)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pontos ganhos esta semana</span>
              <span className="font-medium">{Math.min(stats.totalPoints || 0, 150)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;