import { useState, useRef, useEffect } from 'react';

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: 'Todas las Categorías', value: '' },
    { label: 'Electrónica', value: 'Electrónica' },
    { label: 'Accesorios', value: 'Accesorios' },
    { label: 'Hogar', value: 'Hogar' },
  ];

  // Encontrar la etiqueta actual basada en el valor seleccionado
  const currentLabel = options.find((opt) => opt.value === value)?.label || 'Todas las Categorías';

  // Cerrar el menú si el usuario hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full text-(--color-text)">
      
      {/* Botón Principal del Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 bg-(--color-bg) border rounded-xl text-sm font-medium transition-all cursor-pointer ${
          isOpen 
            ? 'border-(--color-primary) ring-2 ring-(--color-primary)/20' 
            : 'border-(--color-border) hover:bg-(--color-surface-hover)'
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        
        {/* Flecha Animada (gira 180 grados al abrirse) */}
        <svg
          className={`w-4 h-4 text-(--color-text-secondary) opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Lista Desplegable con Animación */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl bg-(--color-surface) border border-(--color-border) shadow-lg shadow-black/10 animate-scale origin-top">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-(--color-surface-hover) ${
                    value === option.value
                      ? 'text-(--color-primary) font-bold bg-(--color-primary)/5'
                      : 'text-(--color-text)'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}