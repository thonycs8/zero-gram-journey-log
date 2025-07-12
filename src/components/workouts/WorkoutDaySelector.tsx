import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutDay {
  dayNumber: number;
  exercises: any[];
  completed?: boolean;
  completedDate?: string;
}

interface WorkoutDaySelectorProps {
  workoutPlan: any;
  workoutDays: WorkoutDay[];
  onSelectDay: (dayNumber: number) => void;
  selectedDay?: number;
  userProgress: any;
}

export const WorkoutDaySelector = ({ 
  workoutPlan, 
  workoutDays, 
  onSelectDay, 
  selectedDay,
  userProgress 
}: WorkoutDaySelectorProps) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getDayStatus = (dayNumber: number) => {
    const dayProgress = userProgress?.completedDays?.find((day: any) => day.planDay === dayNumber);
    if (dayProgress?.completed) return 'completed';
    if (selectedDay === dayNumber) return 'selected';
    return 'available';
  };

  const getDayColor = (dayNumber: number) => {
    const status = getDayStatus(dayNumber);
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'selected': return 'bg-primary/10 border-primary hover:bg-primary/20';
      default: return 'bg-muted/30 border-border hover:bg-muted/50';
    }
  };

  const getNextAvailableDay = () => {
    const completedDays = userProgress?.completedDays?.map((day: any) => day.planDay) || [];
    for (let i = 1; i <= workoutDays.length; i++) {
      if (!completedDays.includes(i)) {
        return i;
      }
    }
    return 1; // Se todos estão completos, volta ao primeiro
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Selecionar Dia do Treino
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Escolha qual dia do plano "{workoutPlan?.title || 'Carregando...'}" você quer treinar hoje
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          {workoutDays.map((day) => {
            const status = getDayStatus(day.dayNumber);
            const dayProgress = userProgress?.completedDays?.find((d: any) => d.planDay === day.dayNumber);
            
            return (
              <div
                key={day.dayNumber}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${getDayColor(day.dayNumber)}`}
                onClick={() => onSelectDay(day.dayNumber)}
                onMouseEnter={() => setHoveredDay(day.dayNumber)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="text-center">
                  <div className="font-semibold text-lg mb-1">
                    Dia {day.dayNumber}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {day.exercises.length} exercícios
                  </div>
                  
                  {status === 'completed' && (
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                      {dayProgress?.completedDate && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(dayProgress.completedDate), 'dd/MM', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {status === 'selected' && (
                    <Badge variant="default" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                  
                  {status === 'available' && hoveredDay === day.dayNumber && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Disponível
                    </Badge>
                  )}
                </div>
                
                {/* Preview dos exercícios ao hover */}
                {hoveredDay === day.dayNumber && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-card border rounded-lg shadow-lg z-10 max-w-xs">
                    <div className="text-sm font-medium mb-2">Exercícios do Dia {day.dayNumber}:</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {day.exercises.slice(0, 3).map((exercise, idx) => (
                        <div key={idx}>• {exercise.exercise_name}</div>
                      ))}
                      {day.exercises.length > 3 && (
                        <div>+ {day.exercises.length - 3} exercícios...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSelectDay(getNextAvailableDay())}
          >
            <Play className="h-4 w-4 mr-1" />
            Próximo Dia Disponível
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onSelectDay(1)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Reiniciar do Dia 1
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};