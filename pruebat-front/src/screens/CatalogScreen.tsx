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

  // --- ESTADOS PARA LA CONFIRMACIÓN PERSONALIZADA ---
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

  // Manejo de Eliminación con el nuevo Modal
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

  // Manejo de Cierre de Sesión con el nuevo Modal
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
      
      {/* NAVBAR SUPERIOR LIMPIA */}
      <header className="w-full bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo e Info de Usuario */}
          <div className="flex items-center gap-4 truncate">
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-(--color-primary) whitespace-nowrap">
                CÁTALOGO XYZ
              </h1>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-(--color-text-secondary)">
                <span className="truncate hidden sm:inline">Hola, <strong className="text-(--color-text) font-semibold">{user.name}</strong></span>
                <span className="opacity-30 hidden sm:inline">|</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-bold text-[10px] tracking-wide uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          {/* Controles del Sistema */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            
            <button
              onClick={openLogoutConfirmation}
              className="btn bg-(--color-surface-hover) text-(--color-text) text-xs font-semibold h-10 px-4 rounded-xl border border-(--color-border) hover:bg-(--color-bg) transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explorar Inventario</h2>
          <p className="text-sm text-(--color-text-secondary) mt-1">
            Administra, filtra y busca tus productos en tiempo real de forma eficiente.
          </p>
        </div>

        {/* FILTROS MEJORADOS (El botón de Añadir se movió aquí abajo) */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          
          {/* Buscador */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm pointer-events-none opacity-50">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, detalles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-(--color-bg) border border-(--color-border) text-(--color-text) rounded-xl text-sm placeholder-(--color-text-secondary)/40 focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) focus:outline-none transition-all"
            />
          </div>

          {/* Bloque de Categoría y Botón Añadir */}
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
                className="btn bg-(--color-primary) hover:bg-(--color-primary-hover) text-white text-sm font-bold h-11 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <span className="text-lg font-light leading-none">+</span>
                <span>Añadir Producto</span>
              </button>
            )}
            
          </div>
        </div>

        {/* ERRORES */}
        {error && (
          <div className="mb-8 p-4 border border-(--color-danger)/20 bg-(--color-danger)/5 text-(--color-danger) rounded-xl text-sm font-semibold flex items-center gap-3 animate-scale">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* CONTROL DE ESTADOS (LOADING / EMPTY / GRID) */}
        <div className="min-h-[45vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-(--color-text-secondary) animate-pulse">Sincronizando productos...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="border-2 border-(--color-border) border-dashed text-center py-24 px-4 rounded-2xl bg-(--color-surface)/20 flex flex-col items-center justify-center">
              <span className="text-4xl mb-3 opacity-60">📦</span>
              <h3 className="text-lg font-bold text-(--color-text)">No se encontraron productos</h3>
              <p className="text-sm text-(--color-text-secondary) mt-1 max-w-sm">
                Intenta cambiando las palabras clave de tu búsqueda o seleccionando otra categoría.
              </p>
            </div>
          ) : (
            /* Grilla Estilizada */
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
        
        {/* PAGINACIÓN */}
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-16 pt-8 border-t border-(--color-border)">
            <p className="text-xs sm:text-sm text-(--color-text-secondary) order-2 sm:order-1 font-medium">
              Mostrando <span className="font-bold text-(--color-text)">{startItem}-{endItem}</span> de <span className="font-bold text-(--color-text)">{meta.totalItems}</span> artículos
            </p>
            
            <div className="flex items-center gap-1.5 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn h-10 px-4 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-all"
              >
                Anterior
              </button>
              
              <div className="hidden md:flex items-center gap-1.5">
                {getPages().map((p, index) =>
                  p === "..." ? (
                    <span key={index} className="px-2 text-(--color-text-secondary) font-bold">...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setPage(Number(p))}
                      className={`btn w-10 h-10 rounded-xl border text-xs font-bold transition-all ${
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
                className="btn h-10 px-4 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover) disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {user.role === "ADMIN" && isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          editingItem={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchItems();
          }}
        />
      )}

      {/* MODAL GLOBAL DE CONFIRMACIÓN (REUTILIZABLE) */}
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