import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy } from 'lucide-react';

interface PersonalInfoTabProps {
  profileData: any;
  setProfileData: (data: any) => void;
  onSave: () => void;
  achievements: any[];
}

const PersonalInfoTab = ({ profileData, setProfileData, onSave, achievements }: PersonalInfoTabProps) => {
  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case 'star': return <Star className="h-4 w-4" />;
      case 'trophy': return <Trophy className="h-4 w-4" />;
      case 'award': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'nutrition': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'consistency': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize as suas informações básicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Nome</Label>
            <Input
              id="display_name"
              value={profileData.display_name || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                display_name: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                email: e.target.value
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={profileData.age || ''}
                onChange={(e) => setProfileData({
                  ...profileData,
                  age: parseInt(e.target.value) || ''
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={profileData.gender || 'female'}
                onValueChange={(value) => setProfileData({
                  ...profileData,
                  gender: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profileData.height || ''}
                onChange={(e) => setProfileData({
                  ...profileData,
                  height: parseInt(e.target.value) || ''
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={profileData.weight || ''}
                onChange={(e) => setProfileData({
                  ...profileData,
                  weight: parseFloat(e.target.value) || ''
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity_level">Nível de Atividade</Label>
            <Select
              value={profileData.activity_level || 'moderate'}
              onValueChange={(value) => setProfileData({
                ...profileData,
                activity_level: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentário</SelectItem>
                <SelectItem value="light">Ligeiro</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="very_active">Muito Ativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              placeholder="Conte-nos um pouco sobre si..."
              value={profileData.bio || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                bio: e.target.value
              })}
            />
          </div>

          <Button onClick={onSave} className="w-full">
            Guardar Alterações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
          <CardDescription>
            As suas conquistas desbloqueadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Ainda não tem conquistas desbloqueadas. Continue a usar a aplicação para desbloquear conquistas!
            </p>
          ) : (
            <div className="space-y-4">
              {achievements.map((userAchievement) => (
                <div
                  key={userAchievement.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="text-primary mt-1">
                    {getAchievementIcon(userAchievement.achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{userAchievement.achievement.title}</h4>
                      <Badge className={getCategoryColor(userAchievement.achievement.category)}>
                        {userAchievement.achievement.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userAchievement.achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Desbloqueado em {new Date(userAchievement.unlocked_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;