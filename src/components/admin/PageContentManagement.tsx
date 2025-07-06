import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { PageContent, PageContentForm } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

interface PageContentManagementProps {
  pageContent: PageContent[];
  onDataChange: () => void;
}

export const PageContentManagement = ({ pageContent, onDataChange }: PageContentManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingPageContent, setEditingPageContent] = useState<PageContent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const [form, setForm] = useState<PageContentForm>({
    page_key: '',
    content_type: 'text',
    content: '',
    description: ''
  });

  const [storeForm, setStoreForm] = useState({
    url: '',
    namePt: '',
    nameEn: ''
  });

  const resetForm = () => {
    setForm({
      page_key: '',
      content_type: 'text',
      content: '',
      description: ''
    });
    setEditingPageContent(null);
    setShowDialog(false);
  };

  const loadStoreConfig = () => {
    const urlContent = pageContent.find(c => c.page_key === 'store_button_url');
    const namePtContent = pageContent.find(c => c.page_key === 'store_button_name_pt');
    const nameEnContent = pageContent.find(c => c.page_key === 'store_button_name_en');
    
    setStoreForm({
      url: urlContent?.content || '',
      namePt: namePtContent?.content || '',
      nameEn: nameEnContent?.content || ''
    });
  };

  React.useEffect(() => {
    loadStoreConfig();
  }, [pageContent]);

  const editPageContent = (content: PageContent) => {
    setForm({
      page_key: content.page_key,
      content_type: content.content_type,
      content: content.content,
      description: content.description || ''
    });
    setEditingPageContent(content);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.page_key || !form.content) {
      toast({
        title: "Erro",
        description: "Chave e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const contentData = {
      ...form,
      created_by: user?.id
    };

    try {
      if (editingPageContent) {
        const { error } = await supabase
          .from('page_content')
          .update(contentData)
          .eq('id', editingPageContent.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Conteúdo atualizado!" });
      } else {
        const { error } = await supabase
          .from('page_content')
          .insert([contentData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Conteúdo criado!" });
      }
      
      resetForm();
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar conteúdo",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este conteúdo?')) return;
    
    try {
      const { error } = await supabase.from('page_content').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Conteúdo eliminado!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao eliminar conteúdo",
        variant: "destructive"
      });
    }
  };

  const handleStoreConfigSave = async () => {
    if (!storeForm.url || !storeForm.namePt || !storeForm.nameEn) {
      toast({
        title: "Erro",
        description: "Todos os campos da loja são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const updates = [
        { page_key: 'store_button_url', content: storeForm.url },
        { page_key: 'store_button_name_pt', content: storeForm.namePt },
        { page_key: 'store_button_name_en', content: storeForm.nameEn }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('page_content')
          .update({ content: update.content, created_by: user?.id })
          .eq('page_key', update.page_key);
        
        if (error) throw error;
      }

      toast({ title: "Sucesso", description: "Configurações da loja atualizadas!" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações da loja",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerir Conteúdo das Páginas</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPageContent(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPageContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page-key">Chave da Página *</Label>
                  <Input
                    id="page-key"
                    value={form.page_key}
                    onChange={(e) => setForm({...form, page_key: e.target.value})}
                    placeholder="Ex: home_title"
                    disabled={!!editingPageContent}
                  />
                </div>
                <div>
                  <Label htmlFor="content-type">Tipo de Conteúdo</Label>
                  <Select value={form.content_type} onValueChange={(value) => setForm({...form, content_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content-description">Descrição</Label>
                <Input
                  id="content-description"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descrição do que este conteúdo representa"
                />
              </div>

              <div>
                <Label htmlFor="page-content">Conteúdo *</Label>
                <Textarea
                  id="page-content"
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  placeholder="Conteúdo da página"
                  rows={8}
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

      {/* Store Configuration Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">⚙️ Configurações da Loja Online</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="store-url">URL da Loja *</Label>
            <Input
              id="store-url"
              value={storeForm.url}
              onChange={(e) => setStoreForm({...storeForm, url: e.target.value})}
              placeholder="https://sualore.com"
            />
          </div>
          <div>
            <Label htmlFor="store-name-pt">Nome do Botão (PT) *</Label>
            <Input
              id="store-name-pt"
              value={storeForm.namePt}
              onChange={(e) => setStoreForm({...storeForm, namePt: e.target.value})}
              placeholder="Visitar Loja"
            />
          </div>
          <div>
            <Label htmlFor="store-name-en">Nome do Botão (EN) *</Label>
            <Input
              id="store-name-en"
              value={storeForm.nameEn}
              onChange={(e) => setStoreForm({...storeForm, nameEn: e.target.value})}
              placeholder="Visit Store"
            />
          </div>
        </div>
        <Button onClick={handleStoreConfigSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          Guardar Configurações da Loja
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pageContent.map((content) => (
          <Card key={content.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{content.page_key}</CardTitle>
                  <CardDescription className="mt-2">
                    {content.description}
                  </CardDescription>
                </div>
                <div className="ml-4">
                  <Badge variant="outline">{content.content_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded text-sm mb-4 max-h-20 overflow-hidden">
                {content.content.substring(0, 150)}{content.content.length > 150 ? '...' : ''}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                📅 {new Date(content.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editPageContent(content)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(content.id)}
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