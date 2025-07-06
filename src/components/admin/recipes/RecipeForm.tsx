import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import type { Recipe, RecipeForm as RecipeFormType } from '@/types/admin';

interface RecipeFormProps {
  form: RecipeFormType;
  setForm: (form: RecipeFormType) => void;
  editingRecipe: Recipe | null;
  onSave: () => void;
  onCancel: () => void;
}

export const RecipeForm = ({ form, setForm, editingRecipe, onSave, onCancel }: RecipeFormProps) => {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            placeholder="Nome da receita"
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            placeholder="Breve descrição da receita"
          />
        </div>

        <div>
          <Label htmlFor="ingredients">Ingredientes (um por linha) *</Label>
          <Textarea
            id="ingredients"
            value={form.ingredients}
            onChange={(e) => setForm({...form, ingredients: e.target.value})}
            placeholder="200g de farinha&#10;2 ovos&#10;250ml de leite"
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="instructions">Instruções *</Label>
          <Textarea
            id="instructions"
            value={form.instructions}
            onChange={(e) => setForm({...form, instructions: e.target.value})}
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
              value={form.prep_time}
              onChange={(e) => setForm({...form, prep_time: +e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="cook_time">Coze. (min)</Label>
            <Input
              id="cook_time"
              type="number"
              value={form.cook_time}
              onChange={(e) => setForm({...form, cook_time: +e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="servings">Doses</Label>
            <Input
              id="servings"
              type="number"
              value={form.servings}
              onChange={(e) => setForm({...form, servings: +e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="calories">Calorias</Label>
            <Input
              id="calories"
              type="number"
              value={form.calories}
              onChange={(e) => setForm({...form, calories: +e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select value={form.difficulty} onValueChange={(value) => setForm({...form, difficulty: value})}>
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
              value={form.image_url}
              onChange={(e) => setForm({...form, image_url: e.target.value})}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dica_zerogram">Dica ZeroGram</Label>
          <Textarea
            id="dica_zerogram"
            value={form.dica_zerogram}
            onChange={(e) => setForm({...form, dica_zerogram: e.target.value})}
            placeholder="Dica especial da ZeroGram para esta receita..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};