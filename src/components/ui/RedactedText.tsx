import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface RedactedTextProps {
  children: React.ReactNode;
  /**
   * If true, forces the text to be revealed (e.g. Storyteller screen mode).
   */
  forceRevealed?: boolean;
  /**
   * Optional custom label shown on hover or in redacted state.
   */
  classifiedLabel?: string;
  className?: string;
}

export const RedactedText: React.FC<RedactedTextProps> = ({
  children,
  forceRevealed = false,
  classifiedLabel = 'CLASSIFIED [CLICK TO REVEAL]',
  className = ''
}) => {
  const [unredacted, setUnredacted] = useState(false);

  const isVisible = forceRevealed || unredacted;

  const toggle = () => {
    if (!forceRevealed) {
      setUnredacted(!unredacted);
    }
  };

  if (isVisible) {
    return (
      <span
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        title="Classified information revealed. Click to redact again."
        className={`
          inline cursor-pointer px-1.5 py-0.5 rounded
          bg-rose-950/30 text-rose-200 border-b border-rose-700/50
          transition-all duration-150 hover:bg-rose-900/40
          ${className}
        `}
      >
        {children}
        {!forceRevealed && (
          <EyeOff className="w-3 h-3 inline-block ml-1 opacity-60 hover:opacity-100 text-rose-400" />
        )}
      </span>
    );
  }

  return (
    <span
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      title={classifiedLabel}
      aria-label="Redacted secret. Click to unredact."
      className={`
        inline-block relative px-2 py-0.5 rounded
        bg-[#202028] text-transparent select-none
        hover:bg-[#2c2c38] transition-all duration-150 cursor-pointer
        before:content-[attr(data-label)] before:text-[10px] before:font-mono before:text-neutral-500 before:tracking-wider before:absolute before:inset-0 before:flex before:items-center before:justify-center before:opacity-0 hover:before:opacity-100
        ${className}
      `}
      data-label="CLASSIFIED"
    >
      <span className="invisible">{children}</span>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-neutral-400 tracking-widest uppercase pointer-events-none select-none">
        ████████
      </span>
    </span>
  );
};
