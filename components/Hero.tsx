import React from 'react';

export const Hero: React.FC<{ onOpenPortal: () => void }> = () => {
  return (
    <section className="mb-24">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl tracking-tight leading-[1.1] mb-8">
          Signet Protocol:<br />
          <span className="text-[#0055FF]">Verifiable Proof of Reasoning</span>
        </h1>
        
        <p className="text-xl text-[#222222] dark:text-gray-400 leading-relaxed max-w-2xl font-normal">
          A technical framework for the cryptographic attestation of AI-generated reasoning paths, built natively on the ISO/C2PA JUMBF manifest structure.
        </p>

        <div className="flex gap-4 pt-6">
          <a 
            href="#standards" 
            className="px-6 py-2.5 bg-[#0055FF] text-white text-[13px] font-bold rounded shadow-sm hover:opacity-90 transition-all"
          >
            Read Specification
          </a>
          <a 
            href="#schema" 
            className="px-6 py-2.5 border border-[#E1E4E8] text-[#222222] dark:text-white text-[13px] font-bold rounded hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            VPR Manifest L3
          </a>
        </div>
      </div>
    </section>
  );
};