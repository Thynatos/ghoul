import React from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'blood';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const borderColors = {
          success: 'border-emerald-600 bg-emerald-950/90 text-emerald-100',
          error: 'border-rose-600 bg-rose-950/90 text-rose-100',
          info: 'border-blue-600 bg-blue-950/90 text-blue-100',
          blood: 'border-rose-800 bg-[#12080a]/95 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
        }[toast.type || 'info'];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border backdrop-blur-md transition-all shadow-xl ${borderColors}`}
            role="alert"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-cinzel font-bold text-sm tracking-wide">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-neutral-300 mt-0.5">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-neutral-400 hover:text-white text-xs p-1"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
