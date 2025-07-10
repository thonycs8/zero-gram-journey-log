import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowUp, ArrowDown, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { AdBanner } from '@/components/ads/AdBanner';
import { useAds } from '@/hooks/useAds';
import { GamificationDashboard } from '@/components/gamification/GamificationDashboard';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { shouldShowAds } = useAds();
  const { user } = useAuth();
  const [progress] = useState(68); // Progresso semanal simulado

  const stats = {
    todaysCalories: 1850,
    goalCalories: 2100,
    totalCalculations: 12,
    averageCalories: 1920,
    weekProgress: progress
  };

  const recentActivities = [
    { type: 'calculation', date: 'Hoje', calories: 1850, goal: 'Manter peso' },
    { type: 'recipe', date: 'Ontem', name: 'Salmão grelhado', calories: 450 },
    { type: 'plan', date: '2 dias', name: 'Plano Semanal', status: 'Criado' },
    { type: 'calculation', date: '3 dias', calories: 1920, goal: 'Perder peso' }
  ];

  const quickActions = [
    { title: t('dashboard.newCalculation'), path: '/calculadora', icon: Calculator, color: 'gradient-primary' },
    { title: t('dashboard.viewHistory'), path: '/historico', icon: ArrowUp, color: 'gradient-secondary' },
    { title: t('dashboard.updateGoals'), path: '/metas', icon: ArrowDown, color: 'bg-accent' }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        
        {/* Today's Goal */}
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.todaysGoal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">
                {stats.todaysCalories}/{stats.goalCalories}
              </div>
              <Progress value={(stats.todaysCalories / stats.goalCalories) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.goalCalories - stats.todaysCalories} calorias restantes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Week Progress */}
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.weekProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{stats.weekProgress}%</div>
              <Progress value={stats.weekProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                5 de 7 dias completos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Calculations */}
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.totalCalculations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalCalculations}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        {/* Average Calories */}
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.averageCalories')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.averageCalories}</div>
            <p className="text-xs text-muted-foreground">
              Média semanal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-effect animate-slide-up">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>As tuas últimas acções no ZeroGram</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'calculation' ? 'bg-primary/20 text-primary' :
                      activity.type === 'recipe' ? 'bg-success/20 text-success' :
                      'bg-info/20 text-info'
                    }`}>
                      {activity.type === 'calculation' ? '🧮' : 
                       activity.type === 'recipe' ? '🍽️' : '📋'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {activity.type === 'calculation' 
                          ? `Cálculo: ${activity.calories} cal` 
                          : activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  {activity.type === 'calculation' && (
                    <Badge variant="secondary" className="text-xs">
                      {activity.goal}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-effect animate-slide-up">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>Acções rápidas para optimizar o teu dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12 glass-effect hover:bg-muted/50"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">{action.title}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Gamification System */}
      {user && (
        <div className="animate-fade-in">
          <GamificationDashboard />
        </div>
      )}

      {/* Motivational Card */}
      <Card className="gradient-secondary animate-fade-in">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="text-4xl">🌟</div>
            <h3 className="text-xl font-semibold text-foreground">
              Continua assim!
            </h3>
            <p className="text-muted-foreground">
              Estás a fazer um trabalho fantástico na tua jornada. Cada passo conta e cada escolha saudável é um investimento no teu futuro.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Banner Publicitário */}
      {shouldShowAds && <AdBanner size="medium" />}
      
        </div>

        {/* Sidebar com Anúncios */}
        {shouldShowAds && (
          <div className="hidden lg:block w-80">
            <AdSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;