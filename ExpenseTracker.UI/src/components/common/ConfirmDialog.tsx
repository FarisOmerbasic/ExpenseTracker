import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl shadow-surface-950/10 border border-surface-100 w-full max-w-sm animate-scale-in p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-danger-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">{title}</h3>
            <p className="text-sm text-surface-500">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
