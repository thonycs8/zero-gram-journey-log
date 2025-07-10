import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification, UserPlan } from '@/hooks/useGamification';
import { CheckCircle, Trophy, Target, Calendar, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamificationDashboardProps {
  className?: string;
}

export const GamificationDashboard = ({ className }: GamificationDashboardProps) => {
  const { 
    userPlans, 
    checkpoints, 
    achievements, 
    loading, 
    completeCheckpoint, 
    getTodaysCheckpoints,
    getPlanProgress 
  } = useGamification();

  const [celebrationShown, setCelebrationShown] = useState<string[]>([]);

  // Trigger celebration animation
  const triggerCelebration = (planId: string) => {
    if (celebrationShown.includes(planId)) return;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    });

    setCelebrationShown(prev => [...prev, planId]);
    
    // Remove from celebration list after 5 seconds
    setTimeout(() => {
      setCelebrationShown(prev => prev.filter(id => id !== planId));
    }, 5000);
  };

  // Check for completed plans and trigger celebrations
  useEffect(() => {
    userPlans.forEach(plan => {
      if (plan.is_completed && !celebrationShown.includes(plan.id)) {
        triggerCelebration(plan.id);
      }
    });
  }, [userPlans]);

  const todaysCheckpoints = getTodaysCheckpoints();
  const activePlans = userPlans.filter(plan => !plan.is_completed);
  const completedPlans = userPlans.filter(plan => plan.is_completed);
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points_awarded, 0) +
                     checkpoints.reduce((sum, checkpoint) => sum + (checkpoint.points_earned || 0), 0);

  const handleCompleteCheckpoint = async (plan: UserPlan) => {
    const success = await completeCheckpoint(plan.id);
    if (success && getPlanProgress(plan) >= 100) {
      setTimeout(() => triggerCelebration(plan.id), 500);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{totalPoints}</div>
                <div className="text-sm opacity-90">Pontos Totais</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{activePlans.length}</div>
                <div className="text-sm opacity-90">Planos Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{achievements.length}</div>
                <div className="text-sm opacity-90">Conquistas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Planos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePlans.map((plan) => {
              const progress = getPlanProgress(plan);
              const todayCompleted = todaysCheckpoints.some(
                cp => cp.user_plan_id === plan.id && cp.completed
              );

              return (
                <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{plan.plan_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.current_progress} de {plan.target_days} dias
                      </p>
                    </div>
                    <Badge variant={plan.plan_type === 'workout' ? 'default' : 'secondary'}>
                      {plan.plan_type === 'workout' ? 'Treino' : 
                       plan.plan_type === 'meal' ? 'Alimentar' : 'Dieta'}
                    </Badge>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {progress.toFixed(1)}% completo
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteCheckpoint(plan)}
                      disabled={todayCompleted}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {todayCompleted ? 'Feito Hoje!' : 'Marcar Hoje'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.achievement_title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.achievement_description}
                    </p>
                  </div>
                  <Badge variant="outline">
                    +{achievement.points_awarded} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Planos Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {completedPlans.map((plan) => (
                <div key={plan.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">{plan.plan_title}</h4>
                    <p className="text-sm text-green-600">
                      Concluído em {new Date(plan.updated_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <Badge className="bg-green-600">
                    Completo!
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {userPlans.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sem Planos Ativos</h3>
            <p className="text-muted-foreground mb-4">
              Começa a tua jornada escolhendo um plano na página de Planos!
            </p>
            <Button asChild>
              <a href="/planos">Explorar Planos</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};