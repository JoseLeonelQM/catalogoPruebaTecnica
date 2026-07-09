import type { Item } from '../types';

interface ProductCardProps {
  item: Item;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  item,
  canEdit,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-48 w-full bg-gray-100 relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-base line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">
            {item.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 border-t mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          ${item.price.toFixed(2)}
        </span>

        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-medium px-2 py-1 rounded transition"
            >
              Editar
            </button>

            <button
              onClick={onDelete}
              className="text-xs text-red-600 bg-red-50 hover:bg-red-100 font-medium px-2 py-1 rounded transition"
            >
              Borrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}