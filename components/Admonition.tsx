import React from 'react';

interface AdmonitionProps {
  type: 'note' | 'security' | 'important';
  title?: string;
  children: React.ReactNode;
}

export const Admonition: React.FC<AdmonitionProps> = ({ type, title, children }) => {
  const themeStyles = {
    note: 'border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-[var(--trust-blue)]',
    security: 'border-red-600 bg-red-600/10 text-red-500',
    important: 'border-amber-500 bg-amber-500/10 text-amber-500'
  };

  return (
    <div className={`admonition border-l-4 p-6 my-8 rounded-r-sm ${themeStyles[type]}`}>
      <div className="flex items-center gap-3 mb-2 font-bold uppercase text-[11px] tracking-widest">
        <span>{type === 'note' ? 'ⓘ' : type === 'security' ? '⚠' : '!'}</span>
        <span>{title || type}</span>
      </div>
      <div className="text-[15px] leading-relaxed font-normal text-[var(--text-body)]">
        {children}
      </div>
    </div>
  );
};