import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: "5 Passos para uma Alimentação Mais Consciente",
    excerpt: "Descubra como desenvolver uma relação mais saudável com a comida através da atenção plena.",
    category: "Nutrição",
    readTime: "5 min",
    image: "🥗",
    content: "A alimentação consciente não é sobre restringir, mas sobre conectar-se verdadeiramente com suas necessidades corporais..."
  },
  {
    id: 2,
    title: "Por que a Jornada é Mais Importante que o Destino",
    excerpt: "Cada pequeno passo em direção à saúde é uma vitória que merece ser celebrada.",
    category: "Motivação",
    readTime: "3 min",
    image: "🌱",
    content: "Lembre-se: não existe caminho perfeito, apenas o seu caminho. Cada escolha saudável é um investimento em você..."
  },
  {
    id: 3,
    title: "Hidratação: O Combustível Esquecido",
    excerpt: "A água é essencial para o metabolismo e pode ser sua aliada na manutenção do peso ideal.",
    category: "Bem-estar",
    readTime: "4 min",
    image: "💧",
    content: "Seu corpo é composto por cerca de 60% de água. Manter-se hidratado acelera o metabolismo e reduz a fome falsa..."
  },
  {
    id: 4,
    title: "Transforme Seus Hábitos em 21 Dias",
    excerpt: "Estratégias cientificamente comprovadas para criar mudanças duradouras na sua rotina.",
    category: "Hábitos",
    readTime: "6 min",
    image: "⭐",
    content: "A neuroplasticidade do cérebro permite que novos hábitos se tornem automáticos. Comece pequeno, seja consistente..."
  }
];

const motivationalQuotes = [
  "Sua única competição é quem você era ontem",
  "Pequenos progressos ainda são progressos",
  "Cuide do seu corpo, é o único lugar que você tem para viver",
  "A mudança começa no momento em que você decide tentar"
];

const MotivationalBlog = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground">Blog ZeroGram</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Inspiração, dicas e conhecimento para acompanhar você em cada passo da sua jornada saudável
        </p>
      </div>

      {/* Citação inspiracional */}
      <Card className="gradient-secondary animate-slide-up">
        <CardContent className="pt-6">
          <div className="text-center">
            <blockquote className="text-xl font-medium text-foreground italic">
              "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
            </blockquote>
            <p className="text-sm text-muted-foreground mt-2">💪 Motivação do dia</p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post, index) => (
          <Card 
            key={post.id} 
            className="glass-effect hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{post.image}</span>
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">• {post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight mb-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.content}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
                  Ler artigo completo →
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dicas rápidas */}
      <Card className="glass-effect animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">🎯 Dicas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🍎</div>
              <h4 className="font-medium mb-1">Foque na Qualidade</h4>
              <p className="text-xs text-muted-foreground">
                Prefira alimentos integrais e minimamente processados
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-medium mb-1">Seja Consistente</h4>
              <p className="text-xs text-muted-foreground">
                Pequenas mudanças diárias geram grandes resultados
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🎉</div>
              <h4 className="font-medium mb-1">Celebre Vitórias</h4>
              <p className="text-xs text-muted-foreground">
                Reconheça cada passo em direção aos seus objetivos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationalBlog;