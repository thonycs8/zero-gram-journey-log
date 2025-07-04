import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  difficulty: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);

  // Form states
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prep_time: 0,
    cook_time: 0,
    servings: 4,
    calories: 0,
    difficulty: 'Fácil',
    category: '',
    image_url: ''
  });

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false
  });

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [recipesResponse, postsResponse] = await Promise.all([
        supabase.from('recipes').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      ]);

      if (recipesResponse.data) setRecipes(recipesResponse.data);
      if (postsResponse.data) setBlogPosts(postsResponse.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipeForm.title || !recipeForm.instructions) {
      toast({
        title: "Erro",
        description: "Título e instruções são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const ingredientsArray = recipeForm.ingredients.split('\n').filter(i => i.trim());
    
    const recipeData = {
      ...recipeForm,
      ingredients: ingredientsArray,
      created_by: user?.id
    };

    try {
      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Receita atualizada!" });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Receita criada!" });
      }
      
      resetRecipeForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar receita",
        variant: "destructive"
      });
    }
  };

  const handleSavePost = async () => {
    if (!postForm.title || !postForm.content) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const postData = {
      ...postForm,
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
      
      resetPostForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar post",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta receita?')) return;
    
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Receita eliminada!" });
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar receita",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este post?')) return;
    
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Post eliminado!" });
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar post",
        variant: "destructive"
      });
    }
  };

  const resetRecipeForm = () => {
    setRecipeForm({
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      prep_time: 0,
      cook_time: 0,
      servings: 4,
      calories: 0,
      difficulty: 'Fácil',
      category: '',
      image_url: ''
    });
    setEditingRecipe(null);
    setShowRecipeDialog(false);
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false
    });
    setEditingPost(null);
    setShowPostDialog(false);
  };

  const editRecipe = (recipe: Recipe) => {
    setRecipeForm({
      title: recipe.title,
      description: recipe.description || '',
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions,
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 4,
      calories: recipe.calories || 0,
      difficulty: recipe.difficulty || 'Fácil',
      category: recipe.category || '',
      image_url: recipe.image_url || ''
    });
    setEditingRecipe(recipe);
    setShowRecipeDialog(true);
  };

  const editPost = (post: BlogPost) => {
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      published: post.published
    });
    setEditingPost(post);
    setShowPostDialog(true);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
        <p className="text-lg text-muted-foreground">
          Gerir receitas e posts do blog
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold">Receitas</h3>
            <p className="text-2xl font-bold text-primary">{recipes.length}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold">Posts do Blog</h3>
            <p className="text-2xl font-bold text-primary">{blogPosts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes">Receitas</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gerir Receitas</h2>
            <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingRecipe(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Receita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={recipeForm.title}
                        onChange={(e) => setRecipeForm({...recipeForm, title: e.target.value})}
                        placeholder="Nome da receita"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={recipeForm.category}
                        onChange={(e) => setRecipeForm({...recipeForm, category: e.target.value})}
                        placeholder="Ex: Pratos principais"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={recipeForm.description}
                      onChange={(e) => setRecipeForm({...recipeForm, description: e.target.value})}
                      placeholder="Breve descrição da receita"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ingredients">Ingredientes (um por linha) *</Label>
                    <Textarea
                      id="ingredients"
                      value={recipeForm.ingredients}
                      onChange={(e) => setRecipeForm({...recipeForm, ingredients: e.target.value})}
                      placeholder="200g de farinha&#10;2 ovos&#10;250ml de leite"
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instruções *</Label>
                    <Textarea
                      id="instructions"
                      value={recipeForm.instructions}
                      onChange={(e) => setRecipeForm({...recipeForm, instructions: e.target.value})}
                      placeholder="Passo a passo da preparação"
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="prep_time">Prep. (min)</Label>
                      <Input
                        id="prep_time"
                        type="number"
                        value={recipeForm.prep_time}
                        onChange={(e) => setRecipeForm({...recipeForm, prep_time: +e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cook_time">Coze. (min)</Label>
                      <Input
                        id="cook_time"
                        type="number"
                        value={recipeForm.cook_time}
                        onChange={(e) => setRecipeForm({...recipeForm, cook_time: +e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="servings">Doses</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={recipeForm.servings}
                        onChange={(e) => setRecipeForm({...recipeForm, servings: +e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories">Calorias</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={recipeForm.calories}
                        onChange={(e) => setRecipeForm({...recipeForm, calories: +e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Dificuldade</Label>
                      <Select value={recipeForm.difficulty} onValueChange={(value) => setRecipeForm({...recipeForm, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fácil">Fácil</SelectItem>
                          <SelectItem value="Médio">Médio</SelectItem>
                          <SelectItem value="Difícil">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image_url">URL da Imagem</Label>
                      <Input
                        id="image_url"
                        value={recipeForm.image_url}
                        onChange={(e) => setRecipeForm({...recipeForm, image_url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetRecipeForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveRecipe}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{recipe.title}</CardTitle>
                      <CardDescription>{recipe.category}</CardDescription>
                    </div>
                    <Badge variant="secondary">{recipe.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <span>⏱️ {recipe.prep_time + recipe.cook_time} min</span>
                    <span>🍽️ {recipe.servings} doses</span>
                    <span>🔥 {recipe.calories} cal</span>
                    <span>📅 {new Date(recipe.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => editRecipe(recipe)}
                      className="flex-1"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Gerir Posts do Blog</h2>
            <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
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
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      placeholder="Título do post"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                      placeholder="Breve resumo do post"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      placeholder="Conteúdo completo do post"
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="post-image">URL da Imagem</Label>
                    <Input
                      id="post-image"
                      value={postForm.image_url}
                      onChange={(e) => setPostForm({...postForm, image_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={postForm.published}
                      onCheckedChange={(checked) => setPostForm({...postForm, published: checked})}
                    />
                    <Label htmlFor="published">Publicar post</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetPostForm}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSavePost}>
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
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;