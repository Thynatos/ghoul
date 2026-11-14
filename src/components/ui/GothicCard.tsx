import React from 'react';

export interface GothicCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  ribbon?: 'crimson' | 'blood' | 'gold' | 'silver' | 'none';
  variant?: 'default' | 'raised' | 'dossier' | 'subtle';
  className?: string;
  bodyClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  hover?: boolean;
  cornerAccents?: boolean;
}

export const GothicCard: React.FC<GothicCardProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  footer,
  ribbon = 'none',
  variant = 'default',
  className = '',
  bodyClassName = '',
  onClick,
  hover = false,
  cornerAccents = true
}) => {
  const isClickable = !!onClick;
  const shouldHover = hover || isClickable;

  const variantClasses = {
    default: 'bg-[#0c0c12] border border-[#7f1d1d]/40 shadow-xl backdrop-blur-sm',
    raised: 'bg-[#12121b] border border-[#7f1d1d]/60 shadow-2xl backdrop-blur-md',
    dossier: 'bg-[#08080d] border border-rose-950/80 shadow-2xl relative',
    subtle: 'bg-[#0a0a0f]/90 border border-[#242436] shadow-md'
  }[variant];

  const hoverClasses = shouldHover
    ? 'hover:border-rose-700/70 hover:shadow-[0_8px_30px_rgba(225,29,72,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : 'transition-colors duration-200';

  const ribbonClasses = {
    crimson: 'bg-gradient-to-r from-rose-950 via-rose-800 to-rose-950 border-b border-rose-700/60 text-rose-100',
    blood: 'bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-b border-red-700/60 text-red-100',
    gold: 'bg-gradient-to-r from-amber-950 via-amber-700/80 to-amber-950 border-b border-amber-600/60 text-amber-100',
    silver: 'bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 border-b border-slate-500/50 text-slate-100',
    none: ''
  }[ribbon];

  const hasHeader = title || subtitle || Icon || action;

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as any);
              }
            }
          : undefined
      }
      className={`relative rounded-xl overflow-hidden group ${variantClasses} ${hoverClasses} ${className}`}
    >
      {/* Corner filigree accents */}
      {cornerAccents && (
        <>
          <span className="pointer-events-none absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-rose-800/40 group-hover:border-rose-500/70 transition-colors" />
          <span className="pointer-events-none absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-rose-800/40 group-hover:border-rose-500/70 transition-colors" />
          <span className="pointer-events-none absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-rose-800/40 group-hover:border-rose-500/70 transition-colors" />
          <span className="pointer-events-none absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-rose-800/40 group-hover:border-rose-500/70 transition-colors" />
        </>
      )}

      {/* Optional Top Ribbon */}
      {ribbon !== 'none' && (
        <div className={`px-4 py-1 text-[10px] font-cinzel font-bold tracking-widest uppercase flex items-center justify-between ${ribbonClasses}`}>
          <span>Classified Dossier</span>
          <span className="font-mono text-[9px] opacity-75">VTM//ARCHIVE</span>
        </div>
      )}

      {/* Header section */}
      {hasHeader && (
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#1c1c2a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="shrink-0 text-rose-400">
                {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: 'w-4 h-4' })}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                typeof title === 'string' ? (
                  <h3 className="font-cinzel text-sm font-bold text-white tracking-wider truncate">
                    {title}
                  </h3>
                ) : (
                  title
                )
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-[11px] text-neutral-400 font-sans truncate">
                    {subtitle}
                  </p>
                ) : (
                  subtitle
                )
              )}
            </div>
          </div>

          {action && (
            <div className="shrink-0 flex items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Card Content Body */}
      <div className={`p-4 sm:p-5 ${bodyClassName}`}>
        {children}
      </div>

      {/* Optional Footer */}
      {footer && (
        <div className="px-4 sm:px-5 py-3 bg-[#08080c]/80 border-t border-[#181824] flex items-center justify-between text-xs text-neutral-400">
          {footer}
        </div>
      )}
    </div>
  );
};
