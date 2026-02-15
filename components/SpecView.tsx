import React from 'react';

export const SpecView: React.FC = () => {
  return (
    <div className="bg-[var(--bg-standard)] text-[var(--text-body)] font-serif text-lg leading-relaxed pt-12 pb-24 px-6 max-w-4xl mx-auto selection:bg-[var(--trust-blue)] selection:text-white">
      <div className="glass-card p-8 md:p-20 shadow-2xl relative border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
        {/* Editorial Watermark */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.02] -translate-y-32 translate-x-32 rotate-45 pointer-events-none"></div>

        {/* Draft Metadata */}
        <div className="flex flex-col md:flex-row justify-between mb-20 border-b border-[var(--border-light)] pb-10 text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 font-bold">
          <div className="space-y-2">
            <p>Protocol Working Group</p>
            <p>Draft Song-02 (C2PA 2.3 Aligned)</p>
            <p>Status: Professional Standard</p>
          </div>
          <div className="text-right space-y-2 mt-4 md:mt-0">
            <p>Principal Architect: SSL</p>
            <p>Signet AI Labs</p>
            <p>Feb 15, 2026</p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-20 text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl text-[var(--text-header)] font-bold tracking-tighter leading-tight italic">
            Signet Protocol: Deterministic Telemetry & VPR
          </h1>
          <div className="w-20 h-px bg-[var(--trust-blue)] mx-auto"></div>
          <p className="opacity-40 font-mono text-xs uppercase tracking-[0.5em]">Standardization Track v2.3</p>
        </div>

        {/* Abstract */}
        <div className="mb-16">
          <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">Abstract</h2>
          <p className="indent-12 opacity-80 leading-loose">
            The Signet Protocol defines a framework for the cryptographic attestation of AI-generated reasoning paths. 
            By utilizing the Neural Lens engine, the protocol transforms non-deterministic LLM outputs into formally verified "Signets." 
            This ensures a verifiable chain of custody from Model to Tool to Human, enabling high-fidelity knowledge sharing 
            at 100x lower marginal costs for the global population. This version (0.2.5) is built atop the **C2PA 2.3 Core Specification**.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          <section>
            <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">1. Introduction</h2>
            <p className="opacity-80 leading-loose">
              As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because 
              they only sign the final result, not the process. Signet Protocol introduces <span className="text-[var(--text-header)] italic">"Process Provenance"</span> via 
              Verifiable Proof of Reasoning (VPR).
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. Cryptographic Security Standards</h2>
            <div className="bg-[var(--admonition-bg)] p-8 border-l-4 border-[var(--trust-blue)] space-y-4 rounded-r">
              <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--trust-blue)]">Layer 0: Cryptographic Root</p>
              <p className="opacity-80 leading-loose italic">
                Signet Protocol mandates <strong>256-bit Ed25519</strong> (Edwards-curve Digital Signature Algorithm) for all identity anchors. 
                With a state space of <strong>$1.1 \times 10^{77}$ combinations</strong>, the private keys are mathematically immune to classical brute-force 
                attacks, providing security parity with global financial settlement layers.
              </p>
              <ul className="text-xs font-mono opacity-60 space-y-1">
                <li>• ALGORITHM: ED25519 (CURVE25519)</li>
                <li>• HASH_STRENGTH: 256 BITS</li>
                <li>• ENTROPY_SOURCE: CSPRNG (LOCAL_CLIENT)</li>
                <li>• COMPLIANCE: C2PA 2.3 JUMBF</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3. The VPR Pipeline</h2>
            <p className="mb-8 opacity-80 font-serif italic">The protocol mandates a four-stage verification cycle aligned with ISO/TC 290:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)]">
                <h4 className="text-[var(--text-header)] uppercase text-[10px] font-mono tracking-widest mb-3">L1: Vision</h4>
                <p className="opacity-60 text-sm leading-relaxed italic">Definition of immutable DNA anchors for the reasoning task.</p>
              </div>
              <div className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)]">
                <h4 className="text-[var(--text-header)] uppercase text-[10px] font-mono tracking-widest mb-3">L2: Compilation</h4>
                <p className="opacity-60 text-sm leading-relaxed italic">Mapping continuous output into discrete logical nodes (DAG).</p>
              </div>
              <div className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)]">
                <h4 className="text-[var(--text-header)] uppercase text-[10px] font-mono tracking-widest mb-3">L3: Probing</h4>
                <p className="opacity-60 text-sm leading-relaxed italic">Adversarial stress testing to ensure zero circular logic.</p>
              </div>
              <div className="p-6 border-l-2 border-l-[var(--trust-blue)] border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)]">
                <h4 className="text-[var(--text-header)] uppercase text-[10px] font-mono tracking-widest mb-3">L4: Attestation</h4>
                <p className="opacity-60 text-sm leading-relaxed italic">Final identity signature binding the human to the asset using Ed25519.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation back */}
        <div className="mt-24 pt-12 border-t border-[var(--border-light)] flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="opacity-60 hover:opacity-100 text-[var(--trust-blue)] transition-colors flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold">
            <span className="text-lg">←</span> RETURN_TO_HOME
          </a>
          <span className="opacity-30 font-mono text-[9px] uppercase tracking-widest">© SIGNET PROTOCOL LABS 2026 | C2PA v2.3</span>
        </div>
      </div>
    </div>
  );
};