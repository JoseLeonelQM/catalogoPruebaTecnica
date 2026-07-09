import { useEffect, useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ConfirmModal from '../components/ConfirmModal';
import CategoryDropdown from '../components/CategoryDropdwn';
import type { User } from "../types/auth";
import type { Item } from '../types';
import ThemeToggle from '../components/ThemeToggle';
import { Search, Plus, LogOut, Package, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import logoVertex from '../assets/VertexLogo.png'; 

interface CatalogScreenProps {
  user: User;
  onLogout: () => void;
}

export default function CatalogScreen({ user, onLogout }: CatalogScreenProps) {
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

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant: 'primary' | 'danger';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary',
    onConfirm: () => {},
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/items', {
        params: { search, category, page, limit: 8 },
      });
      setItems(response.data.items);
      setMeta(response.data.meta);
    } catch (err: unknown) {
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

  const openDeleteConfirmation = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar producto?',
      message: 'Esta acción es permanente y quitará el artículo del inventario visible. ¿Deseas continuar?',
      confirmText: 'Sí, eliminar',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await API.delete(`/items/${id}`);
          fetchItems();
        } catch (err: unknown) {
          if (err instanceof Error) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message || 'No se pudo eliminar el producto.');
          }
        }
      }
    });
  };

  const openLogoutConfirmation = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir del panel de administración del catálogo?',
      confirmText: 'Cerrar Sesión',
      variant: 'primary',
      onConfirm: () => {
        onLogout();
      }
    });
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    const total = meta.totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < total - 2) pages.push("...");
    pages.push(total);

    return pages;
  };

  const limit = 8;
  const startItem = meta.totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, meta.totalItems);

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text) w-full pb-16 transition-colors duration-200 selection:bg-(--color-primary)/20">
      <header className="w-full bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4"> 
      <div className="flex items-center gap-3.5 shrink-0 select-none">
        <div className="p-1.5 sm:p-2 rounded-xl transition-all duration-300 dark:bg-[#F8F9FA] dark:shadow-md dark:shadow-[#03070E]/50 flex items-center justify-center">
          <img 
            src={logoVertex} 
            alt="Logo Vertex" 
            className="h-7 w-auto sm:h-8 object-contain transition-transform hover:scale-105 duration-200"
          />
        </div>
        <div className="h-6 w-px bg-(--color-border) opacity-60 hidden sm:block" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-(--color-primary)">
              Prueba Técnica
            </h1>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-(--color-primary)/10 text-(--color-primary) font-black text-[9px] tracking-wider uppercase border border-(--color-primary)/20 animate-pulse">
            v1.0
          </span>
        </div>
      </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <button
              onClick={openLogoutConfirmation}
              className="btn bg-(--color-surface-hover) text-(--color-text) text-xs font-semibold h-10 px-4 rounded-xl border border-(--color-border) hover:bg-(--color-bg) transition-all flex items-center gap-2 cursor-pointer"
            >
            <span>Cerrar Sesión</span>
            <LogOut className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-9">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
          <span>¡Bienvenido, <strong className="text-(--color-text) font-semibold">{user.name}!</strong></span>
          <span className="inline-flex items-center self-center px-2 py-0.5 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-bold text-[10px] tracking-wide uppercase">
            {user.role}
          </span>
        </h2>
        <p className="text-sm text-(--color-text-secondary) mt-1.5">
        {user.role === 'ADMIN' ? (
          <>Explora y administra tu inventario.</>
        ) : (
          <>Descubre nuestros productos.</>
        )}
        </p>
        </div>
        <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--color-text-secondary) opacity-50">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, detalles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-sm placeholder-(--color-text-secondary)/40 focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) focus:outline-none transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-w-fit items-stretch sm:items-center">
            <div className="w-full sm:w-56"> 
              <CategoryDropdown 
                value={category} 
                onChange={(selectedCategory) => setCategory(selectedCategory)} 
              />
            </div>
            {user.role === "ADMIN" && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="btn bg-(--color-primary) hover:bg-(--color-primary-hover) text-white text-sm font-bold h-11 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Producto</span>
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="mb-8 p-4 border border-(--color-danger)/20 bg-(--color-danger)/5 text-(--color-danger) rounded-xl text-sm font-semibold flex items-center gap-3 animate-scale">
            <AlertTriangle className="w-5 h-5 shrink-0" /> 
            <span>{error}</span>
          </div>
        )}
        <div className="min-h-[45vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-(--color-text-secondary) animate-pulse">Sincronizando productos...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="border-2 border-(--color-border) border-dashed text-center py-24 px-4 rounded-2xl bg-(--color-surface)/20 flex flex-col items-center justify-center">
              <Package className="w-12 h-12 mb-3 text-(--color-text-secondary) opacity-60" />
              <h3 className="text-lg font-bold text-(--color-text)">No se encontraron productos</h3>
              <p className="text-sm text-(--color-text-secondary) mt-1 max-w-sm">
                Intenta cambiando las palabras clave de tu búsqueda o seleccionando otra categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 animate-fade">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  canEdit={user.role === "ADMIN"}
                  onEdit={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => openDeleteConfirmation(item.id)}
                />
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-16 pt-8 border-t border-(--color-border)">
            <p className="text-xs sm:text-sm text-(--color-text-secondary) order-2 sm:order-1 font-medium">
              Mostrando <span className="font-bold text-(--color-text)">{startItem}-{endItem}</span> de <span className="font-bold text-(--color-text)">{meta.totalItems}</span> artículos
            </p>
            <div className="flex items-center gap-1.5 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn h-10 px-4 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              <div className="hidden md:flex items-center gap-1.5">
                {getPages().map((p, index) =>
                  p === "..." ? (
                    <span key={index} className="px-2 text-(--color-text-secondary) font-bold">...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setPage(Number(p))}
                      className={`btn w-10 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        page === p
                          ? "bg-(--color-primary) border-(--color-primary) text-white shadow-md"
                          : "bg-(--color-surface) border-(--color-border) hover:bg-(--color-surface-hover) text-(--color-text)"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(page + 1)}
                className="btn h-10 px-4 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
      {user.role === "ADMIN" && isModalOpen && (
      <ProductModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={async (formData) => { 
          try {
            setError(''); 
            if (editingItem) {
              await API.put(`/items/${editingItem.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            } else {
              await API.post('/items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            }
            setIsModalOpen(false); 
            fetchItems();         
              } catch (err: unknown) {
              if (err instanceof Error) {
                const axiosError = err as AxiosError<{ message?: string }>; 
                setError(axiosError.response?.data?.message || 'Error al intentar guardar el producto.');
              } else {
                setError('Ocurrió un error inesperado al guardar.');
              }
          }
          }}
        />
      )}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}