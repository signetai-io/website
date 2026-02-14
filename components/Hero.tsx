import React from 'react';
import { SignetChainVisual } from './SignetChain';

export const Hero: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => {
  return (
    <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto border-v">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 glass-card">
            <div className="w-4 h-4 rounded-full border border-emerald-500/50 flex items-center justify-center font-mono text-[8px] text-emerald-500 font-bold">cr</div>
            <span className="font-mono text-[10px] uppercase tracking-tighter theme-text-secondary">C2PA-Native Cognitive Provenance</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-6xl md:text-9xl leading-[0.9] theme-text tracking-tighter font-bold">
              Cognitive<br />
              <span className="italic font-normal">Accountability.</span>
            </h1>
            <div className="w-24 h-px theme-accent-bg"></div>
          </div>
          
          <p className="max-w-xl theme-text-secondary text-xl leading-relaxed font-serif italic">
            Signet AI Labs implements the global C2PA standard, extending it with Verifiable Proof of Reasoning (VPR) to secure the logic substrate of autonomous AI.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onOpenPortal}
              className="px-8 py-5 theme-accent-bg text-white font-mono text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all text-center"
            >
              Portal Interface
            </button>
            <a 
              href="#standards" 
              className="px-8 py-5 border border-current theme-text font-mono text-xs uppercase tracking-widest hover:theme-accent-bg hover:text-white transition-all text-center"
            >
              Compliance Guide
            </a>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <SignetChainVisual />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-6 glass-card">
              <p className="font-mono text-[10px] theme-text-secondary uppercase">Manifest Structure</p>
              <h3 className="font-serif text-3xl mt-2 italic theme-text font-bold">JUMBF ISO</h3>
            </div>
            <div className="p-6 glass-card">
              <p className="font-mono text-[10px] theme-text-secondary uppercase">Standard Compliance</p>
              <h3 className="font-serif text-3xl mt-2 theme-text font-bold">C2PA v2.2</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};