import React from 'react';

interface AdmonitionProps {
  type: 'note' | 'security' | 'important';
  title?: string;
  children: React.ReactNode;
}

export const Admonition: React.FC<AdmonitionProps> = ({ type, title, children }) => {
  const styles = {
    note: 'border-[#0055FF] bg-[#0055FF]/[0.03] text-[#0055FF]',
    security: 'border-red-500 bg-red-500/[0.03] text-red-600',
    important: 'border-amber-500 bg-amber-500/[0.03] text-amber-700'
  };

  return (
    <div className={`admonition border-l-4 p-6 my-8 rounded-r-sm ${styles[type]}`}>
      <div className="flex items-center gap-3 mb-2 font-bold uppercase text-[10px] tracking-widest">
        <span>{type === 'note' ? 'ⓘ' : type === 'security' ? '⚠' : '!'}</span>
        <span>{title || type}</span>
      </div>
      <div className="text-body text-[15px] leading-relaxed dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};