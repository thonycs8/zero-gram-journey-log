import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateMealPlanDialog } from '@/components/plans/CreateMealPlanDialog';
import { CreateWorkoutPlanDialog } from '@/components/plans/CreateWorkoutPlanDialog';

const Plans = () => {
  const { t } = useTranslation();
  const [showMealPlanDialog, setShowMealPlanDialog] = useState(false);
  const [showWorkoutPlanDialog, setShowWorkoutPlanDialog] = useState(false);
  
  const workoutPlans = [
    {
      id: 1,
      name: t('plans.beginnerPlan'),
      description: t('plans.beginnerDesc'),
      duration: '4 semanas',
      frequency: '3x/semana',
      difficulty: t('plans.easy'),
      workouts: {
        fullBody: [
          { name: 'Agachamento', sets: '3x12', rest: '60s' },
          { name: 'Flexão de braço', sets: '3x8', rest: '60s' },
          { name: 'Remada com halteres', sets: '3x10', rest: '60s' },
          { name: 'Prancha', sets: '3x30s', rest: '45s' }
        ],
        upper: [
          { name: 'Supino com halteres', sets: '3x10', rest: '90s' },
          { name: 'Puxada alta', sets: '3x12', rest: '60s' },
          { name: 'Desenvolvimento', sets: '3x10', rest: '90s' },
          { name: 'Rosca bíceps', sets: '3x12', rest: '45s' }
        ],
        lower: [
          { name: 'Leg press', sets: '3x15', rest: '90s' },
          { name: 'Stiff', sets: '3x12', rest: '60s' },
          { name: 'Panturrilha', sets: '4x15', rest: '45s' },
          { name: 'Abdução', sets: '3x12', rest: '45s' }
        ]
      }
    },
    {
      id: 2,
      name: t('plans.intermediatePlan'),
      description: t('plans.intermediateDesc'),
      duration: '6 semanas',
      frequency: '4x/semana',
      difficulty: t('plans.medium'),
      workouts: {
        push: [
          { name: 'Supino reto', sets: '4x8', rest: '120s' },
          { name: 'Desenvolvimento', sets: '3x10', rest: '90s' },
          { name: 'Paralelas', sets: '3x12', rest: '90s' },
          { name: 'Tríceps pulley', sets: '3x12', rest: '60s' }
        ],
        pull: [
          { name: 'Barra fixa', sets: '4x8', rest: '120s' },
          { name: 'Remada curvada', sets: '3x10', rest: '90s' },
          { name: 'Puxada triangular', sets: '3x12', rest: '60s' },
          { name: 'Rosca direta', sets: '3x12', rest: '60s' }
        ],
        legs: [
          { name: 'Agachamento livre', sets: '4x10', rest: '150s' },
          { name: 'Leg press 45°', sets: '3x15', rest: '90s' },
          { name: 'Mesa flexora', sets: '3x12', rest: '60s' },
          { name: 'Panturrilha em pé', sets: '4x20', rest: '45s' }
        ]
      }
    },
    {
      id: 3,
      name: t('plans.advancedPlan'),
      description: t('plans.advancedDesc'),
      duration: '8 semanas',
      frequency: '5x/semana',
      difficulty: t('plans.advanced'),
      workouts: {
        chest: [
          { name: 'Supino reto', sets: '5x5', rest: '180s' },
          { name: 'Supino inclinado', sets: '4x8', rest: '120s' },
          { name: 'Crossover', sets: '3x12', rest: '60s' },
          { name: 'Supino declinado', sets: '3x10', rest: '90s' }
        ],
        back: [
          { name: 'Levantamento terra', sets: '5x5', rest: '180s' },
          { name: 'Barra fixa', sets: '4x8', rest: '120s' },
          { name: 'Remada T', sets: '4x10', rest: '90s' },
          { name: 'Pullover', sets: '3x12', rest: '60s' }
        ],
        legs: [
          { name: 'Agachamento livre', sets: '5x8', rest: '180s' },
          { name: 'Bulgaro', sets: '4x10', rest: '90s' },
          { name: 'Stiff', sets: '4x8', rest: '120s' },
          { name: 'Avanço', sets: '3x12', rest: '60s' }
        ]
      }
    }
  ];

  const mealPlans = [
    {
      id: 1,
      name: t('plans.mediterranean'),
      description: t('plans.mediterraneanDesc'),
      calories: 1800,
      duration: '7 dias',
      difficulty: t('plans.easy'),
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
      name: t('plans.protein'),
      description: t('plans.proteinDesc'),
      calories: 2200,
      duration: '7 dias',
      difficulty: t('plans.medium'),
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
      name: t('plans.vegetarian'),
      description: t('plans.vegetarianDesc'),
      calories: 1600,
      duration: '7 dias',
      difficulty: t('plans.easy'),
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

  const workoutTypes = [
    { key: 'fullBody', label: 'Corpo Inteiro', icon: '💪' },
    { key: 'upper', label: 'Trem Superior', icon: '🏋️' },
    { key: 'lower', label: 'Trem Inferior', icon: '🦵' },
    { key: 'push', label: 'Push (Empurrão)', icon: '👐' },
    { key: 'pull', label: 'Pull (Puxada)', icon: '🤏' },
    { key: 'legs', label: 'Pernas', icon: '🦵' },
    { key: 'chest', label: 'Peito', icon: '💪' },
    { key: 'back', label: 'Costas', icon: '🤸' }
  ];

  const WorkoutPlanCard = ({ plan }: { plan: typeof workoutPlans[0] }) => (
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
            <p className="text-2xl font-bold text-primary">{plan.frequency}</p>
            <p className="text-xs text-muted-foreground">{t('plans.frequency')}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">{plan.duration}</p>
            <p className="text-xs text-muted-foreground">{t('plans.duration')}</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">{t('plans.viewFullWorkout')}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{plan.name}</DialogTitle>
              <DialogDescription>{plan.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Resumo</TabsTrigger>
                <TabsTrigger value="detailed">Programa Semanal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workoutTypes.filter(type => plan.workouts[type.key as keyof typeof plan.workouts]).map((workoutType) => (
                    <Card key={workoutType.key} className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span>{workoutType.icon}</span>
                          {workoutType.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {plan.workouts[workoutType.key as keyof typeof plan.workouts]?.map((exercise, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded">
                            <span className="text-sm">{exercise.name}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {exercise.sets}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exercise.rest}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="detailed" className="space-y-4">
                <div className="grid gap-4">
                  {weekDays.slice(0, plan.frequency === '3x/semana' ? 3 : plan.frequency === '4x/semana' ? 4 : 5).map((day, dayIndex) => {
                    const availableWorkouts = Object.keys(plan.workouts);
                    const workoutKey = availableWorkouts[dayIndex % availableWorkouts.length];
                    const workout = plan.workouts[workoutKey as keyof typeof plan.workouts];
                    const workoutType = workoutTypes.find(type => type.key === workoutKey);
                    
                    return (
                      <Card key={day} className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {day} - {workoutType?.icon} {workoutType?.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {workout?.map((exercise, exerciseIndex) => (
                              <div key={exerciseIndex} className="text-center p-3 bg-background/50 rounded-lg">
                                <p className="text-sm font-medium mb-2">{exercise.name}</p>
                                <div className="flex justify-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {exercise.sets}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {exercise.rest}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

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
            <p className="text-xs text-muted-foreground">{t('plans.caloriesPerDay')}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-lg font-bold text-foreground">{plan.duration}</p>
            <p className="text-xs text-muted-foreground">{t('plans.duration')}</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">{t('plans.viewFullPlan')}</Button>
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
      
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">{t('plans.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('plans.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold">{t('plans.mealPlans')}</h3>
            <p className="text-2xl font-bold text-primary">{mealPlans.length}</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-semibold">{t('plans.workoutPlans')}</h3>
            <p className="text-2xl font-bold text-primary">{workoutPlans.length}</p>
          </CardContent>
        </Card>

        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold">{t('plans.mealsPerDay')}</h3>
            <p className="text-2xl font-bold text-primary">4</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold">{t('plans.personalization')}</h3>
            <p className="text-sm text-muted-foreground">{t('plans.personalizationDesc')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alimentares" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="alimentares" className="text-base">
            {t('plans.mealPlansTab')}
          </TabsTrigger>
          <TabsTrigger value="treinos" className="text-base">
            {t('plans.workoutPlansTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alimentares" className="space-y-8">
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

          <Card className="gradient-primary text-center">
            <CardContent className="pt-6">
              <div className="text-white space-y-4">
                <div className="text-4xl">🎯</div>
                <h3 className="text-xl font-semibold">{t('plans.createPersonalizedPlan')}</h3>
                <p className="text-white/90 max-w-md mx-auto">
                  {t('plans.createPersonalizedPlanDesc')}
                </p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => setShowMealPlanDialog(true)}
                >
                  {t('plans.createPlan')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treinos" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan, index) => (
              <div 
                key={plan.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <WorkoutPlanCard plan={plan} />
              </div>
            ))}
          </div>

          <Card className="gradient-primary text-center">
            <CardContent className="pt-6">
              <div className="text-white space-y-4">
                <div className="text-4xl">🏋️</div>
                <h3 className="text-xl font-semibold">{t('plans.createPersonalizedWorkout')}</h3>
                <p className="text-white/90 max-w-md mx-auto">
                  {t('plans.createPersonalizedWorkoutDesc')}
                </p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => setShowWorkoutPlanDialog(true)}
                >
                  {t('plans.createWorkoutPlan')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateMealPlanDialog 
        open={showMealPlanDialog} 
        onOpenChange={setShowMealPlanDialog} 
      />
      <CreateWorkoutPlanDialog 
        open={showWorkoutPlanDialog} 
        onOpenChange={setShowWorkoutPlanDialog} 
      />
    </div>
  );
};

export default Plans;
