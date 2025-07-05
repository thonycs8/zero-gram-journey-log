-- Criar tabela para frases motivacionais
CREATE TABLE public.motivational_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_pt TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir frases motivacionais para o ZeroGram
INSERT INTO public.motivational_quotes (quote_pt, quote_en, category) VALUES
('A tua única competição é quem eras ontem', 'Your only competition is who you were yesterday', 'motivation'),
('Pequenos progressos continuam a ser progressos', 'Small progress is still progress', 'progress'),
('Cuida do teu corpo, é o único lugar que tens para viver', 'Take care of your body, it''s the only place you have to live', 'health'),
('A mudança começa no momento em que decides tentar', 'Change begins the moment you decide to try', 'motivation'),
('Cada refeição saudável é um investimento no teu futuro', 'Every healthy meal is an investment in your future', 'nutrition'),
('A consistência vence a perfeição sempre', 'Consistency beats perfection every time', 'consistency'),
('O teu corpo consegue. É a tua mente que precisas de convencer', 'Your body can do it. It''s your mind you need to convince', 'mindset'),
('Não se trata de ser perfeito, trata-se de ser melhor que ontem', 'It''s not about being perfect, it''s about being better than yesterday', 'improvement'),
('A jornada de mil quilómetros começa com um passo', 'The journey of a thousand miles begins with one step', 'beginning'),
('Acredita em ti mesmo e serás imparável', 'Believe in yourself and you will be unstoppable', 'confidence'),
('A disciplina é escolheres entre o que queres agora e o que mais queres', 'Discipline is choosing between what you want now and what you want most', 'discipline'),
('Cada dia é uma nova oportunidade para recomeçar', 'Every day is a new opportunity to start over', 'restart'),
('O sucesso é a soma de pequenos esforços repetidos diariamente', 'Success is the sum of small efforts repeated day after day', 'success'),
('A tua força interior é maior que qualquer obstáculo', 'Your inner strength is greater than any obstacle', 'strength'),
('Foca no progresso, não na perfeição', 'Focus on progress, not perfection', 'progress'),
('A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora', 'The best time to plant a tree was 20 years ago. The second best time is now', 'timing'),
('O que não te desafia não te muda', 'What doesn''t challenge you doesn''t change you', 'challenge'),
('A mudança é difícil no início, confusa no meio e linda no final', 'Change is hard at first, messy in the middle, and gorgeous at the end', 'change'),
('Tu és mais forte do que pensas e mais capaz do que imaginas', 'You are stronger than you think and more capable than you imagine', 'empowerment'),
('A saúde não é apenas a ausência de doença, é um estado de vitalidade', 'Health is not just the absence of disease, it''s a state of vitality', 'health');

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_motivational_quotes_updated_at
  BEFORE UPDATE ON public.motivational_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;

-- Criar política para leitura pública (não precisa de autenticação)
CREATE POLICY "Motivational quotes are viewable by everyone" 
  ON public.motivational_quotes 
  FOR SELECT 
  USING (is_active = true);

-- Criar política para admin gerenciar as frases
CREATE POLICY "Only admins can manage motivational quotes"
  ON public.motivational_quotes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );