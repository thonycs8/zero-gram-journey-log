import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface CalorieData {
  age: string;
  gender: string;
  weight: string;
  height: string;
  activity: string;
}

interface CalorieResult {
  bmr: number;
  calories: number;
  goal: string;
}

const CalorieCalculator = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<CalorieData>({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity: ''
  });
  
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCalories = () => {
    if (!data.age || !data.gender || !data.weight || !data.height || !data.activity) {
      return;
    }

    setIsCalculating(true);
    
    // Simulando um delay para mostrar a animação
    setTimeout(() => {
      const age = parseInt(data.age);
      const weight = parseFloat(data.weight);
      const height = parseFloat(data.height);
      
      // Cálculo BMR (Mifflin-St Jeor)
      let bmr: number;
      if (data.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      // Multiplicadores de atividade
      const activityMultipliers: { [key: string]: number } = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      const totalCalories = bmr * activityMultipliers[data.activity];
      
      setResult({
        bmr: Math.round(bmr),
        calories: Math.round(totalCalories),
        goal: data.activity
      });
      
      setIsCalculating(false);
    }, 800);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-effect animate-fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-4">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold">{t('calculator.title')}</CardTitle>
        <CardDescription>
          {t('calculator.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">{t('calculator.age')}</Label>
            <Input
              id="age"
              type="number"
              placeholder="Ex: 25"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              className="text-center"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">{t('calculator.gender')}</Label>
            <Select value={data.gender} onValueChange={(value) => setData({ ...data, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('calculator.male')}</SelectItem>
                <SelectItem value="female">{t('calculator.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">{t('calculator.weight')}</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={data.weight}
              onChange={(e) => setData({ ...data, weight: e.target.value })}
              className="text-center"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">{t('calculator.height')}</Label>
            <Input
              id="height"
              type="number"
              placeholder="Ex: 175"
              value={data.height}
              onChange={(e) => setData({ ...data, height: e.target.value })}
              className="text-center"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="activity">{t('calculator.activity')}</Label>
          <Select value={data.activity} onValueChange={(value) => setData({ ...data, activity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu nível de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t('calculator.sedentary')}</SelectItem>
              <SelectItem value="light">{t('calculator.light')}</SelectItem>
              <SelectItem value="moderate">{t('calculator.moderate')}</SelectItem>
              <SelectItem value="active">{t('calculator.active')}</SelectItem>
              <SelectItem value="veryActive">{t('calculator.veryActive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={calculateCalories}
          className="w-full gradient-primary border-0 text-white font-medium h-12 text-lg"
          disabled={isCalculating || !data.age || !data.gender || !data.weight || !data.height || !data.activity}
        >
          {isCalculating ? t('calculator.calculating') : t('calculator.calculate')}
        </Button>
        
        {result && (
          <Card className="gradient-secondary animate-slide-up">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{t('calculator.results')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">{t('calculator.bmr')}</p>
                    <p className="text-2xl font-bold text-foreground">{result.bmr}</p>
                    <p className="text-xs text-muted-foreground">{t('calculator.calories')}/dia</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">{t('calculator.dailyCalories')}</p>
                    <p className="text-2xl font-bold text-primary">{result.calories}</p>
                    <p className="text-xs text-muted-foreground">{t('calculator.maintain')}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">{t('calculator.tip')}</p>
                  <p className="text-sm text-foreground">
                    {t('calculator.tipText')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default CalorieCalculator;