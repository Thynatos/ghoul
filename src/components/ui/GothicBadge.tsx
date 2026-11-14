import React from 'react';

export type GothicBadgeCategory = 'clan' | 'resonance' | 'sect' | 'discipline' | 'threat' | 'general';

export interface GothicBadgeProps {
  label: string;
  category?: GothicBadgeCategory;
  variant?: 'blood' | 'gold' | 'emerald' | 'slate' | 'violet' | 'amber' | 'cyan' | 'neutral';
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const GothicBadge: React.FC<GothicBadgeProps> = ({
  label,
  category = 'general',
  variant,
  icon: Icon,
  size = 'md',
  className = '',
  onClick
}) => {
  // Determine color scheme based on category or explicit variant
  const getScheme = () => {
    if (variant) {
      switch (variant) {
        case 'blood':
          return 'bg-rose-950/70 border-rose-700/80 text-rose-200 shadow-[0_0_8px_rgba(225,29,72,0.25)]';
        case 'gold':
          return 'bg-amber-950/70 border-amber-600/80 text-amber-200 shadow-[0_0_8px_rgba(217,119,6,0.25)]';
        case 'emerald':
          return 'bg-emerald-950/70 border-emerald-600/80 text-emerald-200 shadow-[0_0_8px_rgba(5,150,105,0.2)]';
        case 'slate':
          return 'bg-slate-900/80 border-slate-600/80 text-slate-200';
        case 'violet':
          return 'bg-purple-950/70 border-purple-600/80 text-purple-200 shadow-[0_0_8px_rgba(147,51,234,0.2)]';
        case 'cyan':
          return 'bg-sky-950/70 border-sky-600/80 text-sky-200 shadow-[0_0_8px_rgba(14,165,233,0.2)]';
        case 'amber':
          return 'bg-orange-950/70 border-orange-600/80 text-orange-200';
        default:
          return 'bg-[#151520] border-[#2c2c3e] text-neutral-300';
      }
    }

    const lower = label.toLowerCase();

    if (category === 'clan') {
      if (lower.includes('ventrue')) return 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]';
      if (lower.includes('brujah')) return 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.25)]';
      if (lower.includes('toreador')) return 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.25)]';
      if (lower.includes('tremere')) return 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.25)]';
      if (lower.includes('nosferatu')) return 'bg-emerald-950/80 border-emerald-600 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.25)]';
      if (lower.includes('gangrel')) return 'bg-amber-950/70 border-amber-700 text-amber-300';
      if (lower.includes('malkavian')) return 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.25)]';
      if (lower.includes('lasombra')) return 'bg-zinc-900 border-zinc-500 text-zinc-100 shadow-[0_0_8px_rgba(255,255,255,0.15)]';
      if (lower.includes('hecata')) return 'bg-slate-900 border-teal-600 text-teal-200';
      if (lower.includes('banu')) return 'bg-orange-950/80 border-orange-600 text-orange-200';
      return 'bg-rose-950/70 border-rose-800 text-rose-300';
    }

    if (category === 'resonance') {
      if (lower.includes('choleric')) return 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      if (lower.includes('melancholic')) return 'bg-slate-900 border-slate-500 text-slate-200';
      if (lower.includes('phlegmatic')) return 'bg-sky-950/80 border-sky-500 text-sky-200';
      if (lower.includes('sanguine')) return 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_8px_rgba(225,29,72,0.3)]';
      return 'bg-neutral-900 border-neutral-700 text-neutral-400';
    }

    if (category === 'sect') {
      if (lower.includes('camarilla')) return 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]';
      if (lower.includes('anarch')) return 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_8px_rgba(239,68,68,0.25)]';
      if (lower.includes('sabbat')) return 'bg-purple-950/80 border-purple-500 text-purple-200';
      if (lower.includes('autarkis')) return 'bg-slate-900 border-slate-600 text-slate-300';
      return 'bg-[#151520] border-[#2c2c3e] text-neutral-300';
    }

    if (category === 'threat') {
      if (lower.includes('critical') || lower.includes('lethal') || lower.includes('5')) {
        return 'bg-red-950 border-red-500 text-red-100 shadow-[0_0_10px_rgba(225,29,72,0.4)] animate-pulse';
      }
      if (lower.includes('elevated') || lower.includes('high') || lower.includes('3') || lower.includes('4')) {
        return 'bg-amber-950 border-amber-500 text-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      }
      return 'bg-slate-900 border-slate-700 text-slate-300';
    }

    return 'bg-rose-950/60 border-rose-800 text-rose-300';
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 tracking-wider gap-1',
    md: 'text-[11px] px-2.5 py-1 tracking-wider gap-1.5'
  }[size];

  const isClickable = !!onClick;

  return (
    <span
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`
        inline-flex items-center rounded-full font-cinzel font-bold border uppercase shrink-0 transition-all select-none
        ${getScheme()}
        ${sizeClasses}
        ${isClickable ? 'cursor-pointer hover:brightness-125 active:scale-95' : ''}
        ${className}
      `}
    >
      {Icon && (
        <span className="shrink-0">
          {React.isValidElement(Icon) ? Icon : React.createElement(Icon as any, { className: size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3' })}
        </span>
      )}
      <span>{label}</span>
    </span>
  );
};
