import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface GothicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnBackdropClick?: boolean;
  className?: string;
}

export const GothicModal: React.FC<GothicModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent document body scrolling while open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw] h-[90vh]'
  }[size];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses} bg-[#0c0c12] border border-[#7f1d1d]/60 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(225,29,72,0.18)] flex flex-col max-h-[92vh] overflow-hidden ${className}`}
      >
        {/* Ornate Gothic Corner Filigree */}
        <div className="pointer-events-none absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-rose-600/60" />
        <div className="pointer-events-none absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-rose-600/60" />
        <div className="pointer-events-none absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-rose-600/60" />
        <div className="pointer-events-none absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-rose-600/60" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#201524] bg-gradient-to-r from-[#0c0c12] via-[#140e1a] to-[#0c0c12] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_10px_rgba(225,29,72,0.3)]">
                {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: 'w-4 h-4' })}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                typeof title === 'string' ? (
                  <h2 className="font-cinzel text-base sm:text-lg font-black text-white tracking-wider truncate">
                    {title}
                  </h2>
                ) : (
                  title
                )
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-xs text-neutral-400 font-sans truncate">
                    {subtitle}
                  </p>
                ) : (
                  subtitle
                )
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg bg-[#16121c] hover:bg-rose-950/80 border border-[#2b1b30] hover:border-rose-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 bg-[#08080d] border-t border-[#1c1424] flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
