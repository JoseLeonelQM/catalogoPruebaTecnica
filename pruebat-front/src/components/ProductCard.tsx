import type { Item } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductCardProps {
  item: Item;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({ item, canEdit, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="product-card flex flex-col h-full overflow-hidden bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
      {/* Imagen */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-(--color-surface-hover) border-b border-(--color-border) group">
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/400x250?text=Sin+Imagen'} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Etiqueta para categoria */}
        {item.category && (
          <span className="absolute top-3 right-3 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-(--color-surface) text-(--color-text) shadow-md border border-(--color-border)/50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-80">
            {item.category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Título y resumen */}
        <div className="flex-1 min-h-18">
          <h3 className="text-base font-extrabold text-(--color-text) line-clamp-1 tracking-tight mb-1.5" title={item.name}>
            {item.name}
          </h3>
          <p className="text-xs text-(--color-text-secondary) line-clamp-2 leading-relaxed font-medium">
            {item.description || 'Este producto no cuenta con una descripción detallada en el sistema todavía.'}
          </p>
        </div>

        <div className="my-4 border-t border-(--color-border) opacity-40 w-full" />
        
        <div className="flex items-center justify-between mt-auto gap-2">
          
          {/* Precio */}
          <div className="shrink-0">
            <span className="block text-[10px] text-(--color-text-secondary) uppercase tracking-widest font-black mb-0.5">
              Precio Final
            </span>
            <span className="text-xl font-black text-(--color-primary) tracking-tight">
              S/.{Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Editar y eliminar */}
          {canEdit && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onEdit}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-(--color-primary)/10 text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all border border-transparent shadow-sm cursor-pointer"
                title="Editar este producto"
              >
                <Pencil className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-(--color-danger)/10 text-(--color-danger) hover:bg-(--color-danger) hover:text-white transition-all border border-transparent shadow-sm cursor-pointer"
                title="Eliminar este producto"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}