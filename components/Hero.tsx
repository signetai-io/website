import React from 'react';

export const Hero: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => {
  return (
    <section className="mb-24">
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="w-10 h-px bg-[var(--trust-blue)]"></span>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--trust-blue)] font-bold">Standard 0.2.7_ACTIVE</span>
        </div>
        <h1 className="text-5xl md:text-7xl tracking-tighter leading-[0.9] mb-8 text-[var(--text-header)] font-bold">
          Verifiable Proof <br />
          <span className="text-[var(--trust-blue)] italic font-normal">of Reasoning.</span>
        </h1>
        
        <p className="text-xl text-[var(--text-body)] opacity-90 leading-relaxed max-w-2xl font-normal font-serif">
          The technical framework for attesting AI logic paths. built natively on C2PA 2.3 standards for industrial-grade accountability.
        </p>

        <div className="flex flex-wrap gap-4 pt-10">
          <button 
            onClick={() => window.location.hash = '#verify'}
            className="px-8 py-3 bg-[var(--trust-blue)] text-white text-[11px] font-bold uppercase tracking-widest rounded shadow-2xl hover:brightness-110 transition-all active:scale-95"
          >
            Verify Asset (/verify)
          </button>
          
          <button 
            onClick={() => window.location.href = '#verify?url=./signed_signetai-solar-system.svg'}
            className="px-8 py-3 border border-[var(--trust-blue)] text-[var(--trust-blue)] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-[var(--trust-blue)] hover:text-white transition-all flex items-center gap-2"
          >
            <span>⚡</span> Try Demo
          </button>

          <a 
            href="#spec" 
            className="px-8 py-3 border border-[var(--border-light)] text-[var(--text-header)] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-white/5 transition-all text-center"
          >
            Developer Spec
          </a>
        </div>
      </div>
    </section>
  );
};