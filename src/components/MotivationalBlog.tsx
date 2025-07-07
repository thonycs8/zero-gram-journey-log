import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useMotivationalQuote } from '@/hooks/useMotivationalQuote';
import { useBlogPosts } from '@/hooks/useBlogPosts';


const MotivationalBlog = () => {
  const { t } = useTranslation();
  const { quote, loading: quoteLoading, refreshQuote } = useMotivationalQuote();
  const { posts, loading: postsLoading, error } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground">{t('blog.title')}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Citação inspiracional */}
      <Card className="gradient-secondary animate-slide-up">
        <CardContent className="pt-6">
          <div className="text-center">
            <blockquote className="text-xl font-medium text-foreground italic">
              {quoteLoading ? 'Carregando inspiração...' : `"${quote}"`}
            </blockquote>
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-sm text-muted-foreground">{t('blog.motivationOfDay')}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshQuote}
                disabled={quoteLoading}
                className="gap-2 text-xs"
              >
                <RefreshCw className={`h-3 w-3 ${quoteLoading ? 'animate-spin' : ''}`} />
                Nova
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de posts */}
      {postsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando posts...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              className="glass-effect hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt="" 
                          className="w-6 h-6 rounded object-cover"
                        />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Blog
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-tight mb-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.content.length > 200 
                    ? post.content.substring(0, 200) + '...' 
                    : post.content
                  }
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <span 
                    className="text-xs text-primary font-medium hover:underline cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {t('blog.readMore')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dicas rápidas */}
      <Card className="glass-effect animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">{t('blog.quickTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🍎</div>
              <h4 className="font-medium mb-1">{t('blog.focusQuality')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('blog.focusQualityText')}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-medium mb-1">{t('blog.beConsistent')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('blog.beConsistentText')}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl mb-2">🎉</div>
              <h4 className="font-medium mb-1">{t('blog.celebrateWins')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('blog.celebrateWinsText')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para mostrar post completo */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {new Date(selectedPost.created_at).toLocaleDateString('pt-BR')}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                {selectedPost.image_url && (
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={selectedPost.image_url} 
                      alt={selectedPost.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                
                <Card className="border-none shadow-none bg-muted/30">
                  <CardContent className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-foreground leading-relaxed space-y-4">
                        {selectedPost.content.split('\n\n').map((paragraph: string, index: number) => (
                          <p key={index} className="text-sm leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    Publicado em {new Date(selectedPost.created_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MotivationalBlog;