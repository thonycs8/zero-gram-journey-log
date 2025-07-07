import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsTabProps {
  profileData: any;
  setProfileData: (data: any) => void;
  onSave: () => void;
}

const SettingsTab = ({ profileData, setProfileData, onSave }: SettingsTabProps) => {
  const updateNotificationSetting = (key: string, value: boolean) => {
    setProfileData({
      ...profileData,
      notifications: {
        ...profileData.notifications,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Configure as suas preferências de notificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meals-notifications">Notificações de Refeições</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes sobre as suas refeições
              </p>
            </div>
            <Switch
              id="meals-notifications"
              checked={profileData.notifications?.meals || false}
              onCheckedChange={(checked) => updateNotificationSetting('meals', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="progress-notifications">Notificações de Progresso</Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações sobre o seu progresso
              </p>
            </div>
            <Switch
              id="progress-notifications"
              checked={profileData.notifications?.progress || false}
              onCheckedChange={(checked) => updateNotificationSetting('progress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tips-notifications">Dicas e Sugestões</Label>
              <p className="text-sm text-muted-foreground">
                Receba dicas nutricionais e de exercícios
              </p>
            </div>
            <Switch
              id="tips-notifications"
              checked={profileData.notifications?.tips || false}
              onCheckedChange={(checked) => updateNotificationSetting('tips', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders-notifications">Lembretes Gerais</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes para usar a aplicação
              </p>
            </div>
            <Switch
              id="reminders-notifications"
              checked={profileData.notifications?.reminders || false}
              onCheckedChange={(checked) => updateNotificationSetting('reminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>
            Configure as suas preferências da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-preference">Objetivo Principal</Label>
            <Select
              value={profileData.goal || 'maintain'}
              onValueChange={(value) => setProfileData({
                ...profileData,
                goal: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Perder Peso</SelectItem>
                <SelectItem value="gain">Ganhar Peso</SelectItem>
                <SelectItem value="maintain">Manter Peso</SelectItem>
                <SelectItem value="muscle">Ganhar Músculo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-preference">Nível de Atividade</Label>
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
                <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                <SelectItem value="light">Ligeiro (exercício leve 1-3 dias/semana)</SelectItem>
                <SelectItem value="moderate">Moderado (exercício moderado 3-5 dias/semana)</SelectItem>
                <SelectItem value="active">Ativo (exercício intenso 6-7 dias/semana)</SelectItem>
                <SelectItem value="very_active">Muito Ativo (exercício muito intenso, trabalho físico)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacidade</CardTitle>
          <CardDescription>
            Gerir as suas definições de privacidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Perfil Público</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que outros vejam o seu perfil
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Partilhar Conquistas</Label>
              <p className="text-sm text-muted-foreground">
                Partilhar as suas conquistas publicamente
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onSave} className="w-full">
        Guardar Definições
      </Button>
    </div>
  );
};

export default SettingsTab;