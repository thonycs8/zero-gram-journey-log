import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import { CheckCircle, Calendar, Target, Apple, Clock, Trophy, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Nutrition = () => {
  const { 
    userPlans, 
    checkpoints, 
    loading, 
    completeCheckpoint, 
    getTodaysCheckpoints,
    getPlanProgress 
  } = useGamification();

  const nutritionPlans = userPlans.filter(plan => plan.plan_type === 'meal' || plan.plan_type === 'diet');
  const activePlans = nutritionPlans.filter(plan => !plan.is_completed);
  const completedPlans = nutritionPlans.filter(plan => plan.is_completed);
  const todaysCheckpoints = getTodaysCheckpoints();

  const handleCompleteCheckpoint = async (planId: string) => {
    await completeCheckpoint(planId, 'Plano alimentar seguido hoje');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Apple className="h-8 w-8 text-primary" />
              Minha Alimentação
            </h1>
            <p className="text-muted-foreground mt-2">
              Acompanhe o progresso dos seus planos alimentares
            </p>
          </div>
          <Button asChild>
            <a href="/planos" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Escolher Plano
            </a>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activePlans.length}</div>
                  <div className="text-sm text-muted-foreground">Planos Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedPlans.length}</div>
                  <div className="text-sm text-muted-foreground">Planos Concluídos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {todaysCheckpoints.filter(cp => 
                      userPlans.find(p => p.id === cp.user_plan_id && (p.plan_type === 'meal' || p.plan_type === 'diet'))
                    ).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Seguido Hoje</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Nutrition Plans */}
        {activePlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Planos Ativos
            </h2>
            
            <div className="grid gap-6">
              {activePlans.map((plan) => {
                const progress = getPlanProgress(plan);
                const todayCompleted = todaysCheckpoints.some(
                  cp => cp.user_plan_id === plan.id && cp.completed
                );
                const planCheckpoints = checkpoints.filter(cp => cp.user_plan_id === plan.id);
                const recentCheckpoints = planCheckpoints
                  .filter(cp => cp.completed)
                  .slice(0, 5)
                  .sort((a, b) => new Date(b.checkpoint_date).getTime() - new Date(a.checkpoint_date).getTime());

                return (
                  <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{plan.plan_title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Iniciado em {format(new Date(plan.start_date), 'dd MMM yyyy', { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {plan.current_progress} de {plan.target_days} dias
                            </span>
                          </div>
                        </div>
                        <Badge variant={plan.plan_type === 'meal' ? 'default' : 'secondary'}>
                          {plan.plan_type === 'meal' ? 'Alimentar' : 'Dieta'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>

                      {/* Today's Action */}
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Alimentação de Hoje</h4>
                          <p className="text-sm text-muted-foreground">
                            {todayCompleted ? 'Parabéns! Plano seguido hoje.' : 'Marque como seguido ao final do dia.'}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleCompleteCheckpoint(plan.id)}
                          disabled={todayCompleted}
                          className="flex items-center gap-2"
                          variant={todayCompleted ? "outline" : "default"}
                        >
                          <CheckCircle className="h-4 w-4" />
                          {todayCompleted ? 'Seguido!' : 'Marcar'}
                        </Button>
                      </div>

                      {/* Recent Activity */}
                      {recentCheckpoints.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Atividade Recente</h4>
                          <div className="space-y-2">
                            {recentCheckpoints.map((checkpoint) => (
                              <div key={checkpoint.id} className="flex items-center gap-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>
                                  Plano seguido em {format(new Date(checkpoint.checkpoint_date), 'dd MMM', { locale: ptBR })}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  +{checkpoint.points_earned || 10} pts
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Plans */}
        {completedPlans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-green-600" />
              Planos Concluídos
            </h2>
            
            <div className="grid gap-4">
              {completedPlans.map((plan) => (
                <Card key={plan.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">{plan.plan_title}</h4>
                          <p className="text-sm text-green-600">
                            Concluído em {format(new Date(plan.updated_at), 'dd MMM yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">
                        {plan.target_days} dias completos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {nutritionPlans.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Apple className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum Plano Alimentar Ativo</h3>
              <p className="text-muted-foreground mb-6">
                Comece sua jornada alimentar escolhendo um plano!
              </p>
              <Button asChild>
                <a href="/planos">Explorar Planos</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Nutrition;