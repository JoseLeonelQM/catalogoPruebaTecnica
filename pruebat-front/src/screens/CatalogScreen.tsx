import { useEffect, useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import type { User } from "../types/auth";
import type { Item } from '../types';

interface CatalogScreenProps {
  user: User;
  onLogout: () => void;
}

export default function CatalogScreen({user,onLogout}: CatalogScreenProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  });
  
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/items', {
        params: { search, category, page, limit: 8 },
      });
      console.log(response.data);
      setItems(response.data.items);
      setMeta(response.data.meta);
    } catch (err: unknown) {
      // 🧠 Alternativa segura que cumple con ESLint sin importar la instancia de axios completa
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'No se pudieron cargar los productos.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await API.delete(`/items/${id}`);
      fetchItems();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || 'No se pudo eliminar el producto.');
      }
    }
  };


  const getPages = () => {

  const pages: (number | string)[] = [];

  const total = meta.totalPages;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (page > 3) {
    pages.push("...");
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
};

const limit = 8;

const startItem =
  meta.totalItems === 0
    ? 0
    : (page - 1) * limit + 1;

const endItem = Math.min(
  page * limit,
  meta.totalItems
);
  
  return (
    <div className="min-h-screen bg-gray-50 w-full p-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm mb-6 gap-4">
        <div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">
              Catálogo XYZ
            </h1>
            <p className="text-sm text-gray-500">Bienvenido {user.name}</p>
            <p className="text-xs text-gray-400">Rol: {user.role}</p>
          </div>          
            <p className="text-xs text-gray-500">Módulo de gestión con imágenes optimizadas</p>
        </div>
        <div className="flex gap-2">
          {user.role==="ADMIN" && (
            <button
              onClick={()=>{
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
            >
            + Añadir Producto
            </button>
          )}
          <button
            onClick={onLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg"
          >
          Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-45"
        >
          <option value="">Todas las Categorías</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Hogar">Hogar</option>
        </select>
      </div>

      {error && <div className="max-w-7xl mx-auto mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">❌ {error}</div>}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Cargando catálogo...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No se encontraron productos.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                canEdit={user.role==="ADMIN"}
                onEdit={()=>{
                setEditingItem(item);
                setIsModalOpen(true);
              }}
                onDelete={()=>{
                handleDelete(item.id);
              }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4 mt-10">
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
          Anterior
          </button>
          {getPages().map((p, index) =>
            p === "..." ? (
          <span key={index}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => setPage(Number(p))}
              className={`w-10 h-10 rounded-lg border ${
              page === p
              ? "bg-indigo-600 text-white"
              : "bg-white hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
            )
          )}
          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
          Siguiente
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Mostrando{" "}
          <span className="font-semibold">{startItem}</span>
          {" - "}
          <span className="font-semibold">{endItem}</span>
          {" de "}
          <span className="font-semibold">{meta.totalItems}</span>
          {" productos"}
        </p>
      </div>
      
      {user.role==="ADMIN" && isModalOpen && (
      <ProductModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={()=>setIsModalOpen(false)}
        onSave={()=>{
            setIsModalOpen(false);
            fetchItems();
        }}
      />
      
      )}
    </div>
  );
}
