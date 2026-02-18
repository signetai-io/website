import React from 'react';

export const DonationView: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--admonition-bg)] border border-[var(--trust-blue)] mb-8">
           <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold uppercase tracking-widest">Public Good Infrastructure</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--text-header)] mb-8 italic">
          Sustain the Protocol.
        </h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic max-w-2xl mx-auto">
          Signet is building the immutable trust layer for the AI age. Your grants and contributions ensure the registry remains neutral, decentralized, and accessible to all 8 billion humans.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
         <div className="p-10 bg-black text-white rounded-xl shadow-2xl flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-50"></div>
            <div className="relative z-10">
                <h3 className="text-3xl font-bold italic mb-2">GitHub Sponsors</h3>
                <p className="opacity-70 text-sm">Recurring support for ongoing development and server costs.</p>
            </div>
            <a 
                href="https://github.com/sponsors/signetai-io" 
                target="_blank" 
                rel="noreferrer"
                className="relative z-10 w-full py-4 bg-white text-black font-mono text-xs uppercase font-bold tracking-[0.3em] rounded text-center hover:bg-neutral-200 transition-colors"
            >
                Become a Sponsor
            </a>
         </div>

         <div className="p-10 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
                <h3 className="text-3xl font-bold italic mb-2 text-[var(--text-header)]">Enterprise Grants</h3>
                <p className="opacity-70 text-sm text-[var(--text-body)]">For organizations requiring SLA support, custom implementation, or private registry nodes.</p>
            </div>
            <a 
                href="mailto:grants@signetai.io"
                className="w-full py-4 border border-[var(--text-header)] text-[var(--text-header)] font-mono text-xs uppercase font-bold tracking-[0.3em] rounded text-center hover:bg-[var(--text-header)] hover:text-[var(--bg-standard)] transition-colors"
            >
                Contact Labs
            </a>
         </div>
      </div>
    </div>
  );
};