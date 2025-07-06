import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de tradução
const resources = {
  pt: {
    translation: {
      // Navegação
      nav: {
        home: 'Início',
        calculator: 'Calculadora',
        dashboard: 'Painel',
        recipes: 'Receitas',
        plans: 'Planos',
        blog: 'Blog',
        profile: 'Perfil'
      },
      
      // Página inicial
      home: {
        title: 'Zero',
        titleHighlight: 'Gram',
        subtitle: 'A tua jornada para uma vida mais saudável começa aqui',
        description: 'Calcula as tuas necessidades calóricas de forma inteligente e encontra inspiração para te manteres motivado em cada passo da tua transformação pessoal.',
        cta: 'Começar agora'
      },
      
      // Calculadora
      calculator: {
        title: 'Calculadora de Calorias',
        description: 'Descobre as tuas necessidades calóricas diárias de forma precisa',
        age: 'Idade',
        gender: 'Sexo',
        male: 'Masculino',
        female: 'Feminino',
        weight: 'Peso (kg)',
        height: 'Altura (cm)',
        activity: 'Nível de Atividade',
        sedentary: 'Sedentário (pouco ou nenhum exercício)',
        light: 'Levemente ativo (exercício leve 1-3 dias/semana)',
        moderate: 'Moderadamente ativo (exercício moderado 3-5 dias/semana)',
        active: 'Ativo (exercício intenso 6-7 dias/semana)',
        veryActive: 'Muito ativo (exercício muito intenso, trabalho físico)',
        calculate: 'Calcular Calorias',
        calculating: 'A calcular...',
        results: 'Os Teus Resultados',
        bmr: 'Metabolismo Basal (BMR)',
        dailyCalories: 'Calorias Diárias',
        maintain: 'para manter peso',
        tip: '💡 Dica personalizada:',
        tipText: 'Para perder peso de forma saudável, reduz 300-500 calorias da tua necessidade diária. Para ganhar peso, adiciona 300-500 calorias.'
      },
      
      // Dashboard
      dashboard: {
        title: 'O Teu Painel Pessoal',
        welcome: 'Bem-vindo de volta!',
        todaysGoal: 'Meta de Hoje',
        weekProgress: 'Progresso Semanal',
        totalCalculations: 'Cálculos Realizados',
        averageCalories: 'Média de Calorias',
        recentActivity: 'Atividade Recente',
        quickActions: 'Ações Rápidas',
        newCalculation: 'Novo Cálculo',
        viewHistory: 'Ver Histórico',
        updateGoals: 'Atualizar Metas'
      },
      
      // Receitas
      recipes: {
        title: 'Receitas Saudáveis',
        subtitle: 'Deliciosas opções para a tua jornada',
        calories: 'calorias',
        servings: 'porções',
        prepTime: 'tempo de preparação',
        difficulty: 'dificuldade',
        easy: 'Fácil',
        medium: 'Médio',
        hard: 'Difícil',
        ingredients: 'Ingredientes',
        instructions: 'Instruções',
        nutrition: 'Informação Nutricional'
      },
      
      // Planos
      plans: {
        title: 'Planos Alimentares',
        subtitle: 'Planeja as tuas refeições para o sucesso',
        breakfast: 'Pequeno-almoço',
        lunch: 'Almoço',
        dinner: 'Jantar',
        snack: 'Lanche',
        createPlan: 'Criar Plano',
        savePlan: 'Guardar Plano',
        myPlans: 'Os Meus Planos',
        // Cards estatísticas
        mealPlans: 'Planos Alimentares',
        workoutPlans: 'Planos de Treino',
        mealsPerDay: 'Refeições por Dia',
        personalization: 'Personalização',
        personalizationDesc: 'Adaptado às tuas necessidades',
        // Tabs
        mealPlansTab: '🍽️ Planos Alimentares',
        workoutPlansTab: '💪 Planos de Treino',
        // Planos alimentares
        mediterranean: 'Plano Mediterrânico',
        mediterraneanDesc: 'Plano alimentar inspirado na dieta mediterrânica, rica em vegetais e peixes',
        protein: 'Plano Proteico',
        proteinDesc: 'Focado em alimentos ricos em proteína para ganho de massa muscular',
        vegetarian: 'Plano Vegetariano', 
        vegetarianDesc: 'Opções vegetarianas equilibradas e nutritivas para todos os gostos',
        // Planos de treino
        beginnerPlan: 'Plano Iniciante',
        beginnerDesc: 'Treino completo para quem está começando na musculação',
        intermediatePlan: 'Plano Intermediário',
        intermediateDesc: 'Treino dividido para quem já tem experiência',
        advancedPlan: 'Plano Avançado',
        advancedDesc: 'Treino intensivo para atletas experientes',
        // Detalhes
        caloriesPerDay: 'calorias/dia',
        duration: 'duração',
        frequency: 'frequência',
        viewFullPlan: 'Ver Plano Completo',
        viewFullWorkout: 'Ver Treino Completo',
        // CTA
        createPersonalizedPlan: 'Cria o Teu Plano Alimentar Personalizado',
        createPersonalizedPlanDesc: 'Quer um plano alimentar feito especialmente para ti? Usa a nossa calculadora para definir as tuas necessidades calóricas.',
        createPersonalizedWorkout: 'Cria o Teu Plano de Treino Personalizado',
        createPersonalizedWorkoutDesc: 'Quer um treino feito especialmente para ti? Define os teus objetivos e cria um plano personalizado.',
        createWorkoutPlan: 'Criar Plano de Treino',
        // Dificuldade
        easy: 'Fácil',
        medium: 'Médio',
        hard: 'Difícil',
        advanced: 'Avançado'
      },
      
      // Blog
      blog: {
        title: 'Blog ZeroGram',
        subtitle: 'Inspiração, dicas e conhecimento para te acompanhar em cada passo da tua jornada saudável',
        motivationOfDay: '💪 Motivação do dia',
        readMore: 'Ler artigo completo →',
        quickTips: '🎯 Dicas Rápidas',
        focusQuality: 'Foca na Qualidade',
        focusQualityText: 'Prefere alimentos integrais e minimamente processados',
        beConsistent: 'Sê Consistente',
        beConsistentText: 'Pequenas mudanças diárias geram grandes resultados',
        celebrateWins: 'Celebra Vitórias',
        celebrateWinsText: 'Reconhece cada passo em direção aos teus objetivos',
        quotes: [
          'A tua única competição é quem eras ontem',
          'Pequenos progressos continuam a ser progressos',
          'Cuida do teu corpo, é o único lugar que tens para viver',
          'A mudança começa no momento em que decides tentar'
        ]
      },
      
      // Perfil
      profile: {
        title: 'O Teu Perfil',
        personalInfo: 'Informação Pessoal',
        goals: 'Objetivos',
        preferences: 'Preferências',
        statistics: 'Estatísticas',
        settings: 'Definições',
        store: 'Loja'
      },
      
      // Botões comuns
      common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        back: 'Voltar',
        next: 'Seguinte',
        previous: 'Anterior',
        loading: 'A carregar...',
        error: 'Erro',
        success: 'Sucesso'
      },
      
      // Autenticação
      auth: {
        loginRegister: 'Entrar / Registar'
      },

      // Footer
      footer: {
        ready: 'Pronto para começar a tua transformação?',
        journey: 'Lembra-te: cada grande jornada começa com um pequeno passo. O teu primeiro passo pode ser hoje mesmo.',
        features: {
          healthy: '💚 Saudável',
          personalized: '🎯 Personalizado',
          progressive: '📈 Progressivo',
          motivational: '🌟 Motivacional'
        },
        copyright: '© 2024 ZeroGram. Feito com 💚 para a tua jornada saudável.'
      }
    }
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        calculator: 'Calculator',
        dashboard: 'Dashboard',
        recipes: 'Recipes',
        plans: 'Plans',
        blog: 'Blog',
        profile: 'Profile'
      },
      
      // Home page
      home: {
        title: 'Zero',
        titleHighlight: 'Gram',
        subtitle: 'Your journey to a healthier life starts here',
        description: 'Calculate your caloric needs intelligently and find inspiration to stay motivated at every step of your personal transformation.',
        cta: 'Start now'
      },
      
      // Calculator
      calculator: {
        title: 'Calorie Calculator',
        description: 'Discover your daily caloric needs accurately',
        age: 'Age',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        weight: 'Weight (kg)',
        height: 'Height (cm)',
        activity: 'Activity Level',
        sedentary: 'Sedentary (little to no exercise)',
        light: 'Lightly active (light exercise 1-3 days/week)',
        moderate: 'Moderately active (moderate exercise 3-5 days/week)',
        active: 'Active (intense exercise 6-7 days/week)',
        veryActive: 'Very active (very intense exercise, physical work)',
        calculate: 'Calculate Calories',
        calculating: 'Calculating...',
        results: 'Your Results',
        bmr: 'Basal Metabolic Rate (BMR)',
        dailyCalories: 'Daily Calories',
        maintain: 'to maintain weight',
        tip: '💡 Personalized tip:',
        tipText: 'To lose weight healthily, reduce 300-500 calories from your daily need. To gain weight, add 300-500 calories.'
      },
      
      // Dashboard
      dashboard: {
        title: 'Your Personal Dashboard',
        welcome: 'Welcome back!',
        todaysGoal: 'Today\'s Goal',
        weekProgress: 'Weekly Progress',
        totalCalculations: 'Total Calculations',
        averageCalories: 'Average Calories',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        newCalculation: 'New Calculation',
        viewHistory: 'View History',
        updateGoals: 'Update Goals'
      },
      
      // Recipes
      recipes: {
        title: 'Healthy Recipes',
        subtitle: 'Delicious options for your journey',
        calories: 'calories',
        servings: 'servings',
        prepTime: 'prep time',
        difficulty: 'difficulty',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        ingredients: 'Ingredients',
        instructions: 'Instructions',
        nutrition: 'Nutrition Information'
      },
      
      // Plans
      plans: {
        title: 'Meal Plans',
        subtitle: 'Plan your meals for success',
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snack: 'Snack',
        createPlan: 'Create Plan',
        savePlan: 'Save Plan',
        myPlans: 'My Plans',
        // Cards estatísticas
        mealPlans: 'Meal Plans',
        workoutPlans: 'Workout Plans',
        mealsPerDay: 'Meals per Day',
        personalization: 'Personalization',
        personalizationDesc: 'Adapted to your needs',
        // Tabs
        mealPlansTab: '🍽️ Meal Plans',
        workoutPlansTab: '💪 Workout Plans',
        // Planos alimentares
        mediterranean: 'Mediterranean Plan',
        mediterraneanDesc: 'Meal plan inspired by the Mediterranean diet, rich in vegetables and fish',
        protein: 'Protein Plan',
        proteinDesc: 'Focused on protein-rich foods for muscle mass gain',
        vegetarian: 'Vegetarian Plan', 
        vegetarianDesc: 'Balanced and nutritious vegetarian options for all tastes',
        // Planos de treino
        beginnerPlan: 'Beginner Plan',
        beginnerDesc: 'Complete workout for those starting in weight training',
        intermediatePlan: 'Intermediate Plan',
        intermediateDesc: 'Split workout for those with experience',
        advancedPlan: 'Advanced Plan',
        advancedDesc: 'Intensive training for experienced athletes',
        // Detalhes
        caloriesPerDay: 'calories/day',
        duration: 'duration',
        frequency: 'frequency',
        viewFullPlan: 'View Full Plan',
        viewFullWorkout: 'View Full Workout',
        // CTA
        createPersonalizedPlan: 'Create Your Personalized Meal Plan',
        createPersonalizedPlanDesc: 'Want a meal plan made especially for you? Use our calculator to define your caloric needs.',
        createPersonalizedWorkout: 'Create Your Personalized Workout Plan',
        createPersonalizedWorkoutDesc: 'Want a workout made especially for you? Define your goals and create a personalized plan.',
        createWorkoutPlan: 'Create Workout Plan',
        // Dificuldade
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        advanced: 'Advanced'
      },
      
      // Blog
      blog: {
        title: 'ZeroGram Blog',
        subtitle: 'Inspiration, tips and knowledge to accompany you at every step of your healthy journey',
        motivationOfDay: '💪 Motivation of the day',
        readMore: 'Read full article →',
        quickTips: '🎯 Quick Tips',
        focusQuality: 'Focus on Quality',
        focusQualityText: 'Prefer whole and minimally processed foods',
        beConsistent: 'Be Consistent',
        beConsistentText: 'Small daily changes generate big results',
        celebrateWins: 'Celebrate Wins',
        celebrateWinsText: 'Recognize every step towards your goals',
        quotes: [
          'Your only competition is who you were yesterday',
          'Small progress is still progress',
          'Take care of your body, it\'s the only place you have to live',
          'Change begins the moment you decide to try'
        ]
      },
      
      // Profile
      profile: {
        title: 'Your Profile',
        personalInfo: 'Personal Information',
        goals: 'Goals',
        preferences: 'Preferences',
        statistics: 'Statistics',
        settings: 'Settings',
        store: 'Store'
      },
      
      // Common buttons
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
      },
      
      // Authentication
      auth: {
        loginRegister: 'Login / Register'
      },
      
      // Footer
      footer: {
        ready: 'Ready to start your transformation?',
        journey: 'Remember: every great journey begins with a small step. Your first step can be today.',
        features: {
          healthy: '💚 Healthy',
          personalized: '🎯 Personalized',
          progressive: '📈 Progressive',
          motivational: '🌟 Motivational'
        },
        copyright: '© 2024 ZeroGram. Made with 💚 for your healthy journey.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;