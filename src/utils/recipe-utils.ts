export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': 
    case 'fácil': 
      return 'bg-success text-success-foreground';
    case 'medium': 
    case 'médio': 
      return 'bg-info text-info-foreground';
    case 'hard': 
    case 'difícil': 
      return 'bg-destructive text-destructive-foreground';
    default: 
      return 'bg-muted text-muted-foreground';
  }
};