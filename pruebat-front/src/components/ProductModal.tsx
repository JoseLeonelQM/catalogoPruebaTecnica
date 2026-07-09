import { useState, useEffect, useRef } from 'react';
import type { Item } from '../types';
import CategoryDropdown from '../components/CategoryDropdwn';

interface ProductModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

export default function ProductModal({ isOpen, editingItem, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setName(editingItem.name || '');
        setPrice(editingItem.price?.toString() || '');
        setCategory(editingItem.category || '');
        setDescription(editingItem.description || '');
        setPreviewUrl(editingItem.imageUrl || ''); 
        setSelectedFile(null);
      } else {
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setPreviewUrl(''); 
        setSelectedFile(null);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    
    if (selectedFile) {
      formData.append('image', selectedFile); 
    }

    onSave(formData);
  };

  const showImageColumn = editingItem && previewUrl;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full transform overflow-hidden rounded-2xl bg-(--color-surface) border border-(--color-border) p-6 shadow-xl transition-all animate-scale flex flex-col md:flex-row gap-6 ${showImageColumn ? 'max-w-2xl' : 'max-w-lg'}`}>
        {showImageColumn && (
          <div className="w-full md:w-52 shrink-0">
            <label className="block text-xs font-bold text-(--color-text-secondary) uppercase tracking-wider mb-2">
              Vista Previa
            </label>
            <div className="w-full aspect-square md:h-52 rounded-xl overflow-hidden border border-(--color-border) bg-(--color-surface-hover) flex flex-col items-center justify-center relative group">
              <img
                src={previewUrl}
                alt="Vista previa del producto"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => console.error("Error al cargar la imagen remota")}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-black text-(--color-text) tracking-tight">
              {editingItem ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </h3>
            <p className="text-xs text-(--color-text-secondary)">
              {editingItem ? 'Modifica los parámetros del artículo seleccionado.' : 'Completa la ficha para registrar el ítem en el inventario.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-(--color-text-secondary)">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2.5 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-sm focus:outline-(--color-primary)"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-(--color-text-secondary)">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-2.5 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-sm focus:outline-(--color-primary)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-(--color-text-secondary)">Categoría</label>
              <CategoryDropdown
                value={category}
                onChange={(selectedCategory) => setCategory(selectedCategory)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-(--color-text-secondary)">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="p-2 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-xs file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-(--color-primary)/10 file:text-(--color-primary) hover:file:bg-(--color-primary)/20 cursor-pointer"
              />
              {selectedFile && <span className='text-[10px] text-emerald-500 font-medium truncate'>✓ {selectedFile.name}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-(--color-text-secondary)">Descripción</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2.5 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-sm focus:outline-(--color-primary) resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-(--color-border)">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-(--color-border) bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-bg) cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-(--color-primary) text-white hover:bg-(--color-primary-hover) shadow-md shadow-(--color-primary)/10 cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}