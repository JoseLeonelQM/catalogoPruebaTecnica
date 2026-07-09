import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import { optimizeImage } from '../utils/imageOptimizer';
import type { Item } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  editingItem: Item | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductModal({ editingItem, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   // ✅ AQUÍ VA EL useEffect
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description);
      setPrice(editingItem.price.toString());
      setCategory(editingItem.category);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
    }

    setFile(null);
    setError('');
  }, [editingItem]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

  
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);

      if (file) {
        const compressedFile = await optimizeImage(file);
        formData.append('image', compressedFile);
      }

      if (editingItem) {
        await API.put(`/items/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'Error al guardar el producto.');
      } else {
        setError('Ocurrió un error inesperado al optimizar o subir.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          {editingItem ? 'Editar Producto' : 'Añadir Nuevo Producto'}
        </h2>
        
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nombre</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Descripción</label>
            <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Precio ($)</label>
              <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Categoría</label>
              <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white outline-none">
                <option value="">Seleccionar...</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Hogar">Hogar</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Imagen {editingItem && '(Opcional)'}</label>
            <input type="file" accept="image/*" required={!editingItem} onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
          </div>
          <div className="flex gap-2 pt-2 justify-end">
            <button type="button" onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition disabled:bg-indigo-400">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}