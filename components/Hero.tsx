import React from 'react';

export const Hero: React.FC<{ onOpenPortal: () => void }> = ({ onOpenPortal }) => {
  return (
    <section className="mb-24">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl tracking-tight leading-[1.1] mb-8 text-[var(--text-header)]">
          Signet Protocol:<br />
          <span className="text-[var(--trust-blue)]">Verifiable Proof of Reasoning</span>
        </h1>
        
        <p className="text-xl text-[var(--text-body)] opacity-90 leading-relaxed max-w-2xl font-normal">
          A technical framework for the cryptographic attestation of AI-generated reasoning paths, built natively on the ISO/C2PA JUMBF manifest structure.
        </p>

        <div className="flex flex-wrap gap-4 pt-6">
          <button 
            onClick={onOpenPortal}
            className="px-6 py-2.5 bg-[var(--trust-blue)] text-white text-[13px] font-bold rounded shadow-md hover:brightness-110 transition-all"
          >
            Launch Verifier
          </button>
          <a 
            href="#standards" 
            className="px-6 py-2.5 border border-[var(--border-light)] text-[var(--text-header)] text-[13px] font-bold rounded hover:bg-white/5 transition-all text-center"
          >
            Read Specification
          </a>
          <a 
            href="#schema" 
            className="px-6 py-2.5 border border-[var(--border-light)] text-[var(--text-header)] text-[13px] font-bold rounded hover:bg-white/5 transition-all text-center"
          >
            VPR Manifest L3
          </a>
        </div>
      </div>
    </section>
  );
};