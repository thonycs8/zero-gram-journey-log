import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const { t } = useTranslation();
  
  const [profileData, setProfileData] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    age: '28',
    height: '165',
    weight: '65',
    gender: 'female',
    activityLevel: 'moderate',
    goal: 'maintain',
    bio: 'Entusiasta da vida saudável, adoro experimentar receitas nutritivas e manter-me activa.',
    notifications: {
      meals: true,
      progress: true,
      tips: true,
      reminders: false
    }
  });

  const [goals, setGoals] = useState({
    currentWeight: 65,
    targetWeight: 62,
    weeklyGoal: 0.5,
    calories: 1850,
    water: 2.5,
    exercise: 4
  });

  const achievements = [
    { name: 'Primeira Semana', description: 'Completou 7 dias consecutivos', icon: '🏆', date: '15/10/2024' },
    { name: 'Calculadora Expert', description: 'Realizou 10 cálculos', icon: '🧮', date: '20/10/2024' },
    { name: 'Explorador de Receitas', description: 'Visualizou 25 receitas', icon: '📖', date: '25/10/2024' },
    { name: 'Planeador', description: 'Criou o primeiro plano alimentar', icon: '📋', date: '28/10/2024' }
  ];

  const stats = {
    totalCalculations: 15,
    recipesViewed: 32,
    plansCreated: 3,
    daysActive: 28,
    averageCalories: 1820,
    weightLoss: 2.5
  };

  const handleSave = () => {
    console.log('Dados guardados:', profileData);
    // Aqui implementar lógica de guardar
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {profileData.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{profileData.name}</h1>
        <p className="text-lg text-muted-foreground">Membro desde Outubro 2024</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="goals">Objectivos</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Definições</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>Gere a tua informação pessoal e dados básicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="male">Masculino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso Actual (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Sobre Ti</Label>
                <Textarea
                  id="bio"
                  placeholder="Conta-nos um pouco sobre ti e os teus objectivos..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                Guardar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Conquistas</CardTitle>
              <CardDescription>Os teus marcos na jornada ZeroGram</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{t('profile.goals')}</CardTitle>
              <CardDescription>Define e acompanha os teus objectivos de saúde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Objectivos de Peso</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Peso Actual</Label>
                      <div className="text-2xl font-bold text-primary">{goals.currentWeight} kg</div>
                    </div>
                    <div>
                      <Label>Peso Desejado</Label>
                      <Input
                        type="number"
                        value={goals.targetWeight}
                        onChange={(e) => setGoals({...goals, targetWeight: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Meta Semanal (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={goals.weeklyGoal}
                        onChange={(e) => setGoals({...goals, weeklyGoal: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Objectivos Diários</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Calorias Diárias</Label>
                      <Input
                        type="number"
                        value={goals.calories}
                        onChange={(e) => setGoals({...goals, calories: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Água (litros)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={goals.water}
                        onChange={(e) => setGoals({...goals, water: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Exercício (dias/semana)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="7"
                        value={goals.exercise}
                        onChange={(e) => setGoals({...goals, exercise: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Progresso</h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">-{stats.weightLoss} kg</div>
                      <p className="text-sm text-muted-foreground">Perdidos até agora</p>
                    </div>
                    <div className="text-center p-4 bg-info/10 rounded-lg">
                      <div className="text-2xl font-bold text-info">{Math.round((goals.currentWeight - goals.targetWeight) / goals.weeklyGoal)}</div>
                      <p className="text-sm text-muted-foreground">Semanas restantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">🧮</div>
                <div className="text-2xl font-bold text-primary">{stats.totalCalculations}</div>
                <p className="text-sm text-muted-foreground">Cálculos Realizados</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">📖</div>
                <div className="text-2xl font-bold text-primary">{stats.recipesViewed}</div>
                <p className="text-sm text-muted-foreground">Receitas Visualizadas</p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-primary">{stats.plansCreated}</div>
                <p className="text-sm text-muted-foreground">Planos Criados</p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold text-primary">{stats.daysActive}</div>
                <p className="text-sm text-muted-foreground">Dias Activos</p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-primary">{stats.averageCalories}</div>
                <p className="text-sm text-muted-foreground">Média de Calorias</p>
              </CardContent>
            </Card>

            <Card className="glass-effect text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-success">85%</div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gere as tuas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Refeições</p>
                  <p className="text-sm text-muted-foreground">Recebe notificações nos horários das refeições</p>
                </div>
                <Switch
                  checked={profileData.notifications.meals}
                  onCheckedChange={(checked) => setProfileData({
                    ...profileData,
                    notifications: {...profileData.notifications, meals: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatórios de Progresso</p>
                  <p className="text-sm text-muted-foreground">Relatórios semanais do teu progresso</p>
                </div>
                <Switch
                  checked={profileData.notifications.progress}
                  onCheckedChange={(checked) => setProfileData({
                    ...profileData,
                    notifications: {...profileData.notifications, progress: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dicas Motivacionais</p>
                  <p className="text-sm text-muted-foreground">Dicas diárias para te manter motivado</p>
                </div>
                <Switch
                  checked={profileData.notifications.tips}
                  onCheckedChange={(checked) => setProfileData({
                    ...profileData,
                    notifications: {...profileData.notifications, tips: checked}
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de Exercício</p>
                  <p className="text-sm text-muted-foreground">Lembretes para manteres-te activo</p>
                </div>
                <Switch
                  checked={profileData.notifications.reminders}
                  onCheckedChange={(checked) => setProfileData({
                    ...profileData,
                    notifications: {...profileData.notifications, reminders: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Preferências da Conta</CardTitle>
              <CardDescription>Configurações gerais da tua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Unidades de Medida</Label>
                <Select defaultValue="metric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Métrico (kg, cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato de Data</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="destructive" className="w-full md:w-auto mt-6">
                Eliminar Conta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;