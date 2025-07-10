import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MealCheckpoint } from '@/services/detailedCheckpoints';
import { CheckCircle, UtensilsCrossed, Clock, Camera, Trophy, Edit, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetailedMealCardProps {
  mealItem: MealCheckpoint;
  onComplete: (
    checkpointId: string,
    quantityConsumed?: string,
    caloriesConsumed?: number,
    photoUrl?: string,
    notes?: string
  ) => Promise<void>;
}

export const DetailedMealCard = ({ mealItem, onComplete }: DetailedMealCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantityConsumed, setQuantityConsumed] = useState(mealItem.quantity_consumed || '');
  const [caloriesConsumed, setCaloriesConsumed] = useState(mealItem.calories_consumed || 0);
  const [photoUrl, setPhotoUrl] = useState(mealItem.photo_url || '');
  const [notes, setNotes] = useState(mealItem.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'café da manhã':
        return '🌅';
      case 'almoço':
        return '🍽️';
      case 'lanche':
        return '🥜';
      case 'jantar':
        return '🌙';
      default:
        return '🍴';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'café da manhã':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'almoço':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'lanche':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'jantar':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(mealItem.id, quantityConsumed, caloriesConsumed, photoUrl, notes);
      
      // Trigger confetti animation for meal completion
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error completing meal item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(mealItem.id);
      
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error completing meal item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`transition-all duration-300 ${
      mealItem.is_completed 
        ? 'border-green-500 bg-green-50/50 shadow-lg' 
        : 'border-border hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              mealItem.is_completed 
                ? 'bg-green-100 text-green-600' 
                : getMealTypeColor(mealItem.meal_type)
            }`}>
              {mealItem.is_completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-lg">{getMealTypeIcon(mealItem.meal_type)}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-base">{mealItem.food_item}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {mealItem.meal_type}
                </Badge>
                {mealItem.calories_consumed && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{mealItem.calories_consumed} kcal</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {mealItem.points_earned > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +{mealItem.points_earned}
              </Badge>
            )}
            {mealItem.is_completed && (
              <Badge className="bg-green-600">
                Consumido
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meal Details */}
        {(mealItem.quantity_consumed || mealItem.calories_consumed || mealItem.completed_at) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
            {mealItem.quantity_consumed && (
              <div className="flex items-center gap-2 text-sm">
                <UtensilsCrossed className="h-4 w-4 text-primary" />
                <span className="font-medium">{mealItem.quantity_consumed}</span>
              </div>
            )}
            {mealItem.calories_consumed && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">{mealItem.calories_consumed} kcal</span>
              </div>
            )}
            {mealItem.completed_at && (
              <div className="flex items-center gap-2 text-sm col-span-full">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Consumido às {new Date(mealItem.completed_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Photo */}
        {mealItem.photo_url && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Foto da Refeição</Label>
            <img
              src={mealItem.photo_url}
              alt={`Foto de ${mealItem.food_item}`}
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Notes */}
        {mealItem.notes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Observações:</strong> {mealItem.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!mealItem.is_completed && (
          <div className="flex gap-2">
            <Button
              onClick={handleQuickComplete}
              disabled={isSubmitting}
              className="flex-1"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Consumido
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Consumo</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantidade Consumida</Label>
                    <Input
                      id="quantity"
                      placeholder="ex: 1 prato, 200g, 1 copo..."
                      value={quantityConsumed}
                      onChange={(e) => setQuantityConsumed(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="calories">Calorias Consumidas</Label>
                    <Input
                      id="calories"
                      type="number"
                      min="0"
                      placeholder="Calorias estimadas"
                      value={caloriesConsumed}
                      onChange={(e) => setCaloriesConsumed(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="photo">URL da Foto (opcional)</Label>
                    <Input
                      id="photo"
                      type="url"
                      placeholder="https://..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole o link de uma foto da sua refeição
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Como estava o sabor, como se sentiu, etc..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Salvando...' : 'Registrar Consumo'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {mealItem.is_completed && (
          <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Item consumido! +{mealItem.points_earned} pontos
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};