import React from 'react';

export type GothicButtonVariant = 'blood' | 'gold' | 'slate' | 'aggravated' | 'ghost';
export type GothicButtonSize = 'sm' | 'md' | 'lg';

export interface GothicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GothicButtonVariant;
  size?: GothicButtonSize;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const GothicButton: React.FC<GothicButtonProps> = ({
  variant = 'blood',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses: Record<GothicButtonVariant, string> = {
    blood: 'bg-gradient-to-r from-rose-900 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-rose-100 border border-rose-700/80 hover:border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.5)]',
    gold: 'bg-gradient-to-r from-amber-950 to-amber-900 hover:from-amber-900 hover:to-amber-800 text-amber-100 border border-amber-600/80 hover:border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.3)] hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]',
    slate: 'bg-[#151520] hover:bg-[#202030] text-slate-200 hover:text-white border border-[#2d2d42] hover:border-slate-500 shadow-sm',
    aggravated: 'bg-gradient-to-r from-red-950 via-rose-950 to-red-950 hover:from-red-900 hover:to-red-900 text-red-200 border border-red-600 hover:border-red-400 shadow-[0_0_20px_rgba(225,29,72,0.45)] animate-pulse-glow',
    ghost: 'bg-transparent hover:bg-rose-950/30 text-neutral-300 hover:text-rose-200 border border-transparent hover:border-rose-900/50'
  };

  const sizeClasses: Record<GothicButtonSize, string> = {
    sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs',
    md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs sm:text-sm',
    lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-sm sm:text-base'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl
        font-cinzel font-bold tracking-wider uppercase
        transition-all duration-150 ease-out select-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <span className="shrink-0">
          {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: 'w-4 h-4' })}
        </span>
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <span className="shrink-0">
          {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: 'w-4 h-4' })}
        </span>
      )}
    </button>
  );
};
