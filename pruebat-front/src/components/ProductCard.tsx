import type { Item } from '../types';

interface ProductCardProps {
  item: Item;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({ item, canEdit, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="product-card flex flex-col h-full overflow-hidden bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
      {/* SECCIÓN MULTIMEDIA */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-(--color-surface-hover) border-b border-(--color-border) group">
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/400x250?text=Sin+Imagen'} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Etiqueta de Categoría Minimalista */}
        {item.category && (
          <span className="absolute top-3 right-3 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-(--color-surface) text-(--color-text) shadow-md border border-(--color-border)/50 backdrop-blur-sm bg-opacity-90">
            {item.category}
          </span>
        )}
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        
        {/* Título y Resumen Breve */}
        <div className="flex-1 min-h-18">
          <h3 className="text-base font-extrabold text-(--color-text) line-clamp-1 tracking-tight mb-1.5" title={item.name}>
            {item.name}
          </h3>
          <p className="text-xs text-(--color-text-secondary) line-clamp-2 leading-relaxed font-medium">
            {item.description || 'Este producto no cuenta con una descripción detallada en el sistema todavía.'}
          </p>
        </div>

        {/* Separador Limpio Intermedio */}
        <div className="my-4 border-t border-(--color-border) opacity-60 w-full" />

        {/* Fila de Valor Comercial y Acciones */}
        <div className="flex items-center justify-between mt-auto gap-2">
          
          {/* Bloque de Precio */}
          <div className="shrink-0">
            <span className="block text-[9px] text-(--color-text-secondary) uppercase tracking-widest font-bold">
              Precio Final
            </span>
            <span className="text-xl font-black text-(--color-primary) tracking-tight">
              ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Panel de Control de Iconos Autónomos */}
          {canEdit && (
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Botón de Editar con Icono */}
              <button
                onClick={onEdit}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-(--color-primary)/10 text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all border border-transparent shadow-sm cursor-pointer"
                title="Editar este producto"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              
              {/* Botón de Eliminar con Icono */}
              <button
                onClick={onDelete}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-(--color-danger)/10 text-(--color-danger) hover:bg-(--color-danger) hover:text-white transition-all border border-transparent shadow-sm cursor-pointer"
                title="Eliminar este producto"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>

            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}