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
        activity: 'Nível de Actividade',
        sedentary: 'Sedentário (pouco ou nenhum exercício)',
        light: 'Levemente activo (exercício leve 1-3 dias/semana)',
        moderate: 'Moderadamente activo (exercício moderado 3-5 dias/semana)',
        active: 'Activo (exercício intenso 6-7 dias/semana)',
        veryActive: 'Muito activo (exercício muito intenso, trabalho físico)',
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
        recentActivity: 'Actividade Recente',
        quickActions: 'Acções Rápidas',
        newCalculation: 'Novo Cálculo',
        viewHistory: 'Ver Histórico',
        updateGoals: 'Actualizar Metas'
      },
      
      // Receitas
      recipes: {
        title: 'Receitas Saudáveis',
        subtitle: 'Deliciosas opções para a tua jornada',
        calories: 'calorias',
        servings: 'porções',
        prepTime: 'tempo prep',
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
        subtitle: 'Planifica as tuas refeições para o sucesso',
        breakfast: 'Pequeno-almoço',
        lunch: 'Almoço',
        dinner: 'Jantar',
        snack: 'Lanche',
        createPlan: 'Criar Plano',
        savePlan: 'Guardar Plano',
        myPlans: 'Os Meus Planos'
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
        celebrateWinsText: 'Reconhece cada passo em direcção aos teus objectivos'
      },
      
      // Perfil
      profile: {
        title: 'O Teu Perfil',
        personalInfo: 'Informação Pessoal',
        goals: 'Objectivos',
        preferences: 'Preferências',
        statistics: 'Estatísticas',
        settings: 'Definições'
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
        myPlans: 'My Plans'
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
        celebrateWinsText: 'Recognize every step towards your goals'
      },
      
      // Profile
      profile: {
        title: 'Your Profile',
        personalInfo: 'Personal Information',
        goals: 'Goals',
        preferences: 'Preferences',
        statistics: 'Statistics',
        settings: 'Settings'
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
    lng: 'pt', // idioma padrão
    fallbackLng: 'pt',
    
    interpolation: {
      escapeValue: false // react já faz escape
    }
  });

export default i18n;