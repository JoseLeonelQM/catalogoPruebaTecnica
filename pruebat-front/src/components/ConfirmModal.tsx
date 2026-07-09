interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // Determinar los colores del botón de acción según la variante
  const buttonStyles = 
    variant === 'danger'
      ? 'bg-[var(--color-danger)] text-white hover:opacity-95 shadow-[var(--color-danger)]/10'
      : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--color-primary)]/10';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Fondo Traslúcido con Blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Caja del Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-(--color-surface) border border-(--color-border) p-6 shadow-xl transition-all animate-scale">
        
        {/* Encabezado / Icono */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">
            {variant === 'danger' ? '🗑️' : '🔔'}
          </span>
          <h3 className="text-lg font-bold text-(--color-text) tracking-tight">
            {title}
          </h3>
        </div>

        {/* Mensaje Informativo */}
        <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-6">
          {message}
        </p>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn px-4 py-2 rounded-xl text-xs font-semibold border border-(--color-border) bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-bg) transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${buttonStyles}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}