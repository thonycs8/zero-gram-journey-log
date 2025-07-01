import { useState } from 'react';
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
        <CardTitle className="text-2xl font-semibold">Calculadora de Calorias</CardTitle>
        <CardDescription>
          Descubra suas necessidades calóricas diárias de forma precisa
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
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
            <Label htmlFor="gender">Sexo</Label>
            <Select value={data.gender} onValueChange={(value) => setData({ ...data, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
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
            <Label htmlFor="height">Altura (cm)</Label>
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
          <Label htmlFor="activity">Nível de Atividade</Label>
          <Select value={data.activity} onValueChange={(value) => setData({ ...data, activity: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu nível de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="light">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
              <SelectItem value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
              <SelectItem value="active">Ativo (exercício intenso 6-7 dias/semana)</SelectItem>
              <SelectItem value="veryActive">Muito ativo (exercício muito intenso, trabalho físico)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={calculateCalories}
          className="w-full gradient-primary border-0 text-white font-medium h-12 text-lg"
          disabled={isCalculating || !data.age || !data.gender || !data.weight || !data.height || !data.activity}
        >
          {isCalculating ? 'Calculando...' : 'Calcular Calorias'}
        </Button>
        
        {result && (
          <Card className="gradient-secondary animate-slide-up">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Seus Resultados</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Metabolismo Basal (BMR)</p>
                    <p className="text-2xl font-bold text-foreground">{result.bmr}</p>
                    <p className="text-xs text-muted-foreground">calorias/dia</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Calorias Diárias</p>
                    <p className="text-2xl font-bold text-primary">{result.calories}</p>
                    <p className="text-xs text-muted-foreground">para manter peso</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">💡 Dica personalizada:</p>
                  <p className="text-sm text-foreground">
                    Para perder peso saudavelmente, reduza 300-500 calorias da sua necessidade diária. 
                    Para ganhar peso, adicione 300-500 calorias.
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