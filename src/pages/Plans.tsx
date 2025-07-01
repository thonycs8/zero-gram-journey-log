import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Plans = () => {
  const { t } = useTranslation();
  
  const mealPlans = [
    {
      id: 1,
      name: 'Plano Mediterrânico',
      description: 'Plano alimentar inspirado na dieta mediterrânica, rica em vegetais e peixes',
      calories: 1800,
      duration: '7 dias',
      difficulty: 'Fácil',
      meals: {
        breakfast: [
          { name: 'Iogurte grego com frutos vermelhos', calories: 280 },
          { name: 'Torrada integral com abacate', calories: 320 }
        ],
        lunch: [
          { name: 'Salada de atum com grão', calories: 450 },
          { name: 'Salmão grelhado com quinoa', calories: 480 }
        ],
        dinner: [
          { name: 'Peixe assado com legumes', calories: 380 },
          { name: 'Sopa de lentilhas', calories: 350 }
        ],
        snack: [
          { name: 'Frutos secos mistos', calories: 150 },
          { name: 'Maçã com canela', calories: 120 }
        ]
      }
    },
    {
      id: 2,
      name: 'Plano Proteico',
      description: 'Focado em alimentos ricos em proteína para ganho de massa muscular',
      calories: 2200,
      duration: '7 dias',
      difficulty: 'Médio',
      meals: {
        breakfast: [
          { name: 'Ovos mexidos com espinafres', calories: 350 },
          { name: 'Smoothie proteico', calories: 400 }
        ],
        lunch: [
          { name: 'Peito de frango grelhado', calories: 500 },
          { name: 'Carne magra com batata doce', calories: 550 }
        ],
        dinner: [
          { name: 'Salmão com brócolos', calories: 420 },
          { name: 'Omelete de claras', calories: 380 }
        ],
        snack: [
          { name: 'Iogurte proteico', calories: 180 },
          { name: 'Queijo cottage com nozes', calories: 200 }
        ]
      }
    },
    {
      id: 3,
      name: 'Plano Vegetariano',
      description: 'Opções vegetarianas equilibradas e nutritivas para todos os gostos',
      calories: 1600,
      duration: '7 dias',
      difficulty: 'Fácil',
      meals: {
        breakfast: [
          { name: 'Aveia com banana e mel', calories: 300 },
          { name: 'Smoothie verde energético', calories: 250 }
        ],
        lunch: [
          { name: 'Salada de quinoa e legumes', calories: 400 },
          { name: 'Wrap de hummus e vegetais', calories: 380 }
        ],
        dinner: [
          { name: 'Caril de grão com coco', calories: 420 },
          { name: 'Sopa de legumes com lentilhas', calories: 350 }
        ],
        snack: [
          { name: 'Fruta da época', calories: 100 },
          { name: 'Amêndoas e passas', calories: 140 }
        ]
      }
    }
  ];

  const weekDays = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  const mealTypes = [
    { key: 'breakfast', label: t('plans.breakfast'), icon: '🌅' },
    { key: 'lunch', label: t('plans.lunch'), icon: '☀️' },
    { key: 'dinner', label: t('plans.dinner'), icon: '🌙' },
    { key: 'snack', label: t('plans.snack'), icon: '🍎' }
  ];

  const PlanCard = ({ plan }: { plan: typeof mealPlans[0] }) => (
    <Card className="glass-effect hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="mt-2">{plan.description}</CardDescription>
          </div>
          <Badge variant="secondary">{plan.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-primary">{plan.calories}</p>
            <p className="text-xs text-muted-foreground">calorias/dia</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">{plan.duration}</p>
            <p className="text-xs text-muted-foreground">duração</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver Plano Completo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{plan.name}</DialogTitle>
              <DialogDescription>{plan.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Resumo</TabsTrigger>
                <TabsTrigger value="detailed">Plano Semanal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mealTypes.map((mealType) => (
                    <Card key={mealType.key} className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span>{mealType.icon}</span>
                          {mealType.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {plan.meals[mealType.key as keyof typeof plan.meals].map((meal, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded">
                            <span className="text-sm">{meal.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {meal.calories} cal
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="space-y-4">
                <div className="grid gap-4">
                  {weekDays.map((day, dayIndex) => (
                    <Card key={day} className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {mealTypes.map((mealType) => {
                            const meals = plan.meals[mealType.key as keyof typeof plan.meals];
                            const meal = meals[dayIndex % meals.length];
                            return (
                              <div key={mealType.key} className="text-center p-3 bg-background/50 rounded-lg">
                                <div className="text-lg mb-1">{mealType.icon}</div>
                                <p className="text-xs text-muted-foreground mb-1">{mealType.label}</p>
                                <p className="text-sm font-medium">{meal.name}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {meal.calories} cal
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">{t('plans.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('plans.subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold">Planos Disponíveis</h3>
            <p className="text-2xl font-bold text-primary">{mealPlans.length}</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold">Refeições por Dia</h3>
            <p className="text-2xl font-bold text-primary">4</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold">Personalização</h3>
            <p className="text-sm text-muted-foreground">Adaptado às tuas necessidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlans.map((plan, index) => (
          <div 
            key={plan.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="gradient-primary text-center">
        <CardContent className="pt-6">
          <div className="text-white space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="text-xl font-semibold">Cria o Teu Plano Personalizado</h3>
            <p className="text-white/90 max-w-md mx-auto">
              Quer um plano feito especialmente para ti? Usa a nossa calculadora para definir as tuas necessidades.
            </p>
            <Button variant="secondary" className="mt-4">
              {t('plans.createPlan')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plans;