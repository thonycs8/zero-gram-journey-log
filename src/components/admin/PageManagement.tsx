import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  content: any;
  metadata?: any | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

interface PageForm {
  slug: string;
  title: string;
  description: string;
  content: string;
  metadata: string;
}

interface PageManagementProps {
  onDataChange: () => void;
}

export const PageManagement = ({ onDataChange }: PageManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<PageForm>({
    slug: '',
    title: '',
    description: '',
    content: '',
    metadata: ''
  });

  const resetForm = () => {
    setForm({
      slug: '',
      title: '',
      description: '',
      content: '',
      metadata: ''
    });
    setEditingPage(null);
    setShowDialog(false);
  };

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar páginas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPages();
  }, []);

  const editPage = (page: Page) => {
    setForm({
      slug: page.slug,
      title: page.title,
      description: page.description || '',
      content: typeof page.content === 'object' ? JSON.stringify(page.content, null, 2) : page.content || '',
      metadata: page.metadata ? JSON.stringify(page.metadata, null, 2) : ''
    });
    setEditingPage(page);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.slug || !form.title) {
      toast({
        title: "Erro",
        description: "Slug e título são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    let contentData;
    let metadataData;

    try {
      contentData = form.content ? JSON.parse(form.content) : {};
    } catch {
      contentData = form.content;
    }

    try {
      metadataData = form.metadata ? JSON.parse(form.metadata) : null;
    } catch {
      metadataData = form.metadata || null;
    }

    const pageData = {
      slug: form.slug,
      title: form.title,
      description: form.description || null,
      content: contentData,
      metadata: metadataData,
      created_by: user?.id
    };

    try {
      if (editingPage) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', editingPage.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Página atualizada!" });
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([pageData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Página criada!" });
      }
      
      resetForm();
      loadPages();
      onDataChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao salvar página",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta página?')) return;
    
    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Página eliminada!" });
      loadPages();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar página",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Páginas do App</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Página
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Editar Página' : 'Nova Página'}
              </DialogTitle>
              <DialogDescription>
                Gerir páginas completas da aplicação com conteúdo estruturado
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page-slug">Slug da Página *</Label>
                  <Input
                    id="page-slug"
                    value={form.slug}
                    onChange={(e) => setForm({...form, slug: e.target.value})}
                    placeholder="Ex: home, about, contact"
                    disabled={!!editingPage}
                  />
                </div>
                <div>
                  <Label htmlFor="page-title">Título *</Label>
                  <Input
                    id="page-title"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Título da página"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="page-description">Descrição</Label>
                <Input
                  id="page-description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descrição da página para SEO"
                />
              </div>

              <div>
                <Label htmlFor="page-content">Conteúdo (JSON) *</Label>
                <Textarea
                  id="page-content"
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  placeholder='{"components": [], "sections": []}'
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="page-metadata">Metadata (JSON)</Label>
                <Textarea
                  id="page-metadata"
                  value={form.metadata}
                  onChange={(e) => setForm({...form, metadata: e.target.value})}
                  placeholder='{"seo": {}, "customFields": {}}'
                  rows={5}
                  className="font-mono text-sm"
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {page.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    /{page.slug}
                  </CardDescription>
                  {page.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {page.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded text-sm mb-4 max-h-20 overflow-hidden">
                <code>
                  {typeof page.content === 'object' 
                    ? JSON.stringify(page.content).substring(0, 100)
                    : page.content?.toString().substring(0, 100)
                  }
                  {(typeof page.content === 'object' 
                    ? JSON.stringify(page.content).length 
                    : page.content?.toString().length || 0) > 100 ? '...' : ''
                  }
                </code>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                📅 {new Date(page.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editPage(page)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(page.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma página encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando a sua primeira página personalizada
          </p>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Página
          </Button>
        </div>
      )}
    </div>
  );
};