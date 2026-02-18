import React from 'react';

export const MissionView: React.FC = () => {
  return (
    <article className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-20 space-y-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Manifesto</span>
          <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">HUMAN_FIRST</div>
        </div>
        <h1 className="text-6xl font-bold tracking-tighter italic text-[var(--text-header)]">
          The Trust Layer for <br/>the AI Age.
        </h1>
        <p className="text-xl text-[var(--text-body)] opacity-70 font-serif leading-relaxed italic max-w-2xl">
          We believe that in an era of infinite synthetic content, the most valuable commodity is <strong className="text-[var(--text-header)]">human intent</strong>. Signet is not just a tool; it is a declaration of reality.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <div className="space-y-6">
          <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold border-b border-[var(--border-light)] pb-2">The Problem</h3>
          <p className="text-lg leading-relaxed font-serif opacity-80">
            AI models are non-deterministic. They hallucinate. Without a cryptographic chain of custody, logic drift becomes indistinguishable from fact. The current internet cannot survive the flood of unverifiable tokens.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold border-b border-[var(--border-light)] pb-2 text-[var(--trust-blue)]">The Solution</h3>
          <p className="text-lg leading-relaxed font-serif opacity-80">
            <strong>Verifiable Proof of Reasoning (VPR).</strong> We don't just sign the pixels; we sign the process. By binding the "Reasoning DAG" to the final asset via C2PA standards, we create a permanent, auditable link between the prompt, the logic, and the result.
          </p>
        </div>
      </section>

      <section className="mb-24 p-10 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl">
        <h3 className="font-serif text-3xl font-bold italic mb-8 text-[var(--text-header)]">The "Human-in-the-Loop" Guarantee</h3>
        <div className="space-y-6 text-[var(--text-body)] opacity-80 leading-relaxed">
          <p>
            Signet Protocol is built on a non-negotiable axiom: <strong>Accountability cannot be automated.</strong>
          </p>
          <p>
            While AI agents generates the logic, a Human Curator must hold the cryptographic keys (Ed25519) to seal the manifest. This prevents "Runaway AI" scenarios by ensuring every chain of reasoning has a human anchor responsible for its output.
          </p>
        </div>
      </section>

      <section>
        <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold mb-10 opacity-40">Core Contributors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Song Sheng-Liang", role: "Product Architect", id: "ssl" },
            { name: "Neural Prism Group", role: "Core Engineering", id: "dev" },
            { name: "Open Source DAO", role: "Community Audit", id: "community" }
          ].map(member => (
            <div key={member.id} className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-standard)] hover:border-[var(--trust-blue)] transition-colors group">
              <div className="w-12 h-12 bg-[var(--code-bg)] rounded-full mb-4 flex items-center justify-center font-bold text-[var(--trust-blue)] border border-[var(--border-light)]">
                {member.name.charAt(0)}
              </div>
              <h4 className="font-bold text-[var(--text-header)]">{member.name}</h4>
              <p className="font-mono text-[10px] opacity-50 uppercase tracking-wider mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};