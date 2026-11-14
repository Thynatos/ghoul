import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export interface GothicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // defaults to 'max-w-xl'
  className?: string;
}

export const GothicDrawer: React.FC<GothicDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  footer,
  width = 'max-w-xl',
  className = ''
}) => {
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      soundEngine.playDrawerSlide();
    }
    prevOpenRef.current = isOpen;

    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in transition-opacity duration-200"
      />

      {/* Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${width} bg-[#0c0c12] border-l border-[#7f1d1d]/60 shadow-[0_0_50px_rgba(0,0,0,0.9),-10px_0_30px_rgba(225,29,72,0.15)] flex flex-col h-full animate-slide-left ${className}`}
      >
        {/* Ornate corner filigree on top/bottom-left edges */}
        <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-rose-600/50" />
        <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-rose-600/50" />

        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#201524] bg-gradient-to-r from-[#120c18] to-[#0c0c12] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_10px_rgba(225,29,72,0.3)]">
                {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: 'w-4 h-4' })}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                typeof title === 'string' ? (
                  <h2 className="font-cinzel text-base font-bold text-white tracking-wider truncate">
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

          <div className="flex items-center gap-2 shrink-0">
            {action}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-8 h-8 rounded-lg bg-[#16121c] hover:bg-rose-950/80 border border-[#2b1b30] hover:border-rose-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {children}
        </div>

        {/* Drawer Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-3.5 bg-[#08080d] border-t border-[#1c1424] flex items-center justify-between gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
