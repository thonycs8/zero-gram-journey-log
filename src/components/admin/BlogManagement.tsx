import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, PostForm } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';

interface BlogManagementProps {
  blogPosts: BlogPost[];
  onDataChange: () => void;
}

export const BlogManagement = ({ blogPosts, onDataChange }: BlogManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<PostForm>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false
  });

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false
    });
    setEditingPost(null);
    setShowDialog(false);
  };

  const editPost = (post: BlogPost) => {
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      published: post.published
    });
    setEditingPost(post);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const postData = {
      ...form,
      created_by: user?.id
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Post atualizado!" });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Post criado!" });
      }
      
      resetForm();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar post",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este post?')) return;
    
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Post eliminado!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar post",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Posts do Blog</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPost(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Editar Post' : 'Novo Post do Blog'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-title">Título *</Label>
                <Input
                  id="post-title"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Título do post"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({...form, excerpt: e.target.value})}
                  placeholder="Breve resumo do post"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  placeholder="Conteúdo completo do post"
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="post-image">URL da Imagem</Label>
                <Input
                  id="post-image"
                  value={form.image_url}
                  onChange={(e) => setForm({...form, image_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => setForm({...form, published: checked})}
                />
                <Label htmlFor="published">Publicar post</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </CardDescription>
                </div>
                <div className="ml-4">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                📅 {new Date(post.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editPost(post)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};