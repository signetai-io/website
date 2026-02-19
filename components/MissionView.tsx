
import React from 'react';

export const MissionView: React.FC = () => {
  return (
    <article className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-24 space-y-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--bg-sidebar)] mx-auto">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">The Manifesto</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter italic text-[var(--text-header)] leading-tight">
          The Great Filtering.
        </h1>
        <p className="text-xl text-[var(--text-body)] opacity-70 font-serif leading-relaxed italic max-w-2xl mx-auto">
          "We are not building a tool. We are building the infrastructure for the preservation of objective reality."
        </p>
      </header>

      <div className="space-y-32">
        {/* Chapter 1 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 sticky top-24">
             <span className="font-mono text-[14px] font-bold text-[var(--trust-blue)] opacity-50 block mb-2">01</span>
             <h3 className="text-3xl font-bold italic text-[var(--text-header)] mb-4">The Flood.</h3>
             <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">Current Status: Critical</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-loose font-serif opacity-80 text-[var(--text-body)]">
             <p>
               Building on warnings from organizations such as the <a href="https://www.europol.europa.eu/media-press/newsroom/news/facing-reality-law-enforcement-and-challenge-of-deepfakes" target="_blank" className="underline decoration-dotted hover:text-[var(--trust-blue)]">Europol Innovation Lab</a>, many analysts expect synthetic and AI-assisted media to constitute a <strong>dominant share of newly created online content</strong> by the mid-to-late 2020s.
             </p>
             <p>
               While precise global percentages are uncertain and depend on definitions and measurement methods, the overall trajectory suggests that a <strong>substantial majority</strong> of future internet content will involve generative systems, fundamentally reshaping how online information is produced, distributed, and trusted.
             </p>
             <div className="p-6 bg-red-500/5 border-l-2 border-red-500 text-red-600 text-sm font-sans">
               <span className="block font-bold mb-1 uppercase text-[10px] tracking-widest">Thesis Statement</span>
               "The internet cannot survive as a trusted medium if the signal-to-noise ratio drops below 1%."
             </div>
          </div>
        </section>

        {/* Chapter 2 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 sticky top-24">
             <span className="font-mono text-[14px] font-bold text-[var(--trust-blue)] opacity-50 block mb-2">02</span>
             <h3 className="text-3xl font-bold italic text-[var(--text-header)] mb-4">The Ark.</h3>
             <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">Protocol: VPR</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-loose font-serif opacity-80 text-[var(--text-body)]">
             <p>
               Signet Protocol proposes a new axiom: <strong>Verifiable Proof of Reasoning (VPR)</strong>.
             </p>
             <p>
               We do not just attest to the final pixels (Attribution); we attest to the <em>process</em> (Reasoning). By binding the "Logic DAG"—the chain of thought used to reach a conclusion—to the final asset, we create a permanent, auditable link between the prompt and the result.
             </p>
             <ul className="space-y-4 mt-4">
                <li className="flex items-center gap-4 text-sm font-sans">
                   <div className="w-8 h-px bg-[var(--trust-blue)]"></div>
                   <span>If the reasoning is flawed, the Signet breaks.</span>
                </li>
                <li className="flex items-center gap-4 text-sm font-sans">
                   <div className="w-8 h-px bg-[var(--trust-blue)]"></div>
                   <span>If the origin is masked, the Signet refuses to seal.</span>
                </li>
             </ul>
          </div>
        </section>

        {/* Chapter 3 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 sticky top-24">
             <span className="font-mono text-[14px] font-bold text-[var(--trust-blue)] opacity-50 block mb-2">03</span>
             <h3 className="text-3xl font-bold italic text-[var(--text-header)] mb-4">The Pact.</h3>
             <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">Role: Human-in-the-Loop</p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-loose font-serif opacity-80 text-[var(--text-body)]">
             <p>
               Technology alone cannot solve a crisis of trust. Signet is built on a non-negotiable principle: <strong>Accountability cannot be automated.</strong>
             </p>
             <p>
               While AI agents generate the logic, a Human Curator must hold the cryptographic keys (Ed25519) to seal the manifest. This prevents "Runaway AI" scenarios by ensuring every chain of reasoning has a human anchor responsible for its output.
             </p>
             <div className="mt-8 p-8 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-xl">
               <h4 className="font-bold text-[var(--text-header)] mb-4 font-sans text-sm uppercase tracking-widest">The Curator's Oath</h4>
               <p className="italic text-[var(--text-header)]">
                 "I verify not just the output, but the thought that produced it. My key is my bond."
               </p>
             </div>
          </div>
        </section>
      </div>

      <section className="mt-32 border-t border-[var(--border-light)] pt-16">
        <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold mb-10 opacity-40 text-center">Stewards of the Protocol</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Song Sheng-Liang", role: "Product Architect", id: "ssl" },
            { name: "Signet Protocol Group", role: "Core Engineering", id: "dev" },
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
