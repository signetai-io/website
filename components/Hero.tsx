import React from 'react';

export const Hero: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => {
  const handleDemoClick = () => {
    const origin = window.location.origin;
    const demoUrl = `${origin}/public/signed_signetai-solar-system.svg`;
    window.location.href = `#verify?url=${encodeURIComponent(demoUrl)}`;
  };

  return (
    <section className="mb-32 pt-12">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 rounded-full border border-[var(--trust-blue)] bg-[var(--trust-blue)]/5 text-[var(--trust-blue)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Narrative Sequence 01
          </span>
          <span className="h-px w-12 bg-[var(--border-light)]"></span>
          <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">The Crisis of 2026</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl tracking-tighter leading-[0.9] text-[var(--text-header)] font-bold">
          When content <br />
          is <span className="text-[var(--trust-blue)] italic font-serif font-light">Infinite.</span>
        </h1>
        
        <p className="text-2xl text-[var(--text-body)] opacity-80 leading-relaxed max-w-3xl font-serif italic border-l-4 border-[var(--trust-blue)] pl-6 py-2">
          "In a world flooded by synthetic noise, the only scarce resource left is <strong>Proof of Intent</strong>. Signet is the cryptographic anchor that separates the signal from the simulation."
        </p>

        <div className="flex flex-wrap gap-4 pt-10">
          <button 
            onClick={() => window.location.hash = '#verify'}
            className="px-8 py-4 bg-[var(--trust-blue)] text-white text-[11px] font-bold uppercase tracking-widest rounded shadow-2xl hover:brightness-110 transition-all active:scale-95 flex flex-col items-center"
          >
            <span>Start Verification</span>
            <span className="opacity-50 text-[9px] lowercase font-normal">/verify endpoint</span>
          </button>
          
          <button 
            onClick={handleDemoClick}
            className="px-8 py-4 border border-[var(--trust-blue)] text-[var(--trust-blue)] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-[var(--trust-blue)] hover:text-white transition-all flex flex-col items-center justify-center gap-1 group"
          >
            <div className="flex items-center gap-2">
               <span>⚡</span> <span>Experience the Protocol</span>
            </div>
            <span className="opacity-50 text-[9px] lowercase font-normal group-hover:text-white/80">Interactive Demo</span>
          </button>

          <a 
            href="#mission" 
            className="px-8 py-4 border border-[var(--border-light)] text-[var(--text-header)] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-white/5 transition-all flex flex-col items-center justify-center"
          >
            <span>Read The Manifesto</span>
            <span className="opacity-40 text-[9px] lowercase font-normal">Why we built this</span>
          </a>
        </div>
        
        <div className="pt-12 flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest">Problem</span>
              <span className="font-serif italic text-sm">Logic Hallucination</span>
           </div>
           <div className="w-px h-10 bg-[var(--border-light)]"></div>
           <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest">Solution</span>
              <span className="font-serif italic text-sm">Reasoning Attestation</span>
           </div>
           <div className="w-px h-10 bg-[var(--border-light)]"></div>
           <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest">Standard</span>
              <span className="font-serif italic text-sm">ISO/TC 290</span>
           </div>
        </div>
      </div>
    </section>
  );
};