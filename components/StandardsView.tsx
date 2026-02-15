import React from 'react';
import { Admonition } from './Admonition';

export const StandardsView: React.FC = () => {
  const matrix = [
    { feature: "Focus", c2pa: "Asset Integrity", signet: "Cognitive Integrity" },
    { feature: "Verification", c2pa: "Manifest Signature", signet: "Logic Trace Parity" },
    { feature: "Handling", c2pa: "Attribution", signet: "Deterministic Audit" },
    { feature: "Scope", c2pa: "Pixels/Text", signet: "Reasoning Substrate" }
  ];

  return (
    <article className="prose prose-slate max-w-none">
      <header className="mb-16">
        <div className="text-[10px] font-mono text-[var(--trust-blue)] uppercase font-bold mb-4 tracking-[0.3em]">Section 1.0</div>
        <h2 className="text-4xl font-bold mb-6 text-[var(--text-header)]">Standards & Compliance (v2.3)</h2>
        <p className="text-lg text-[var(--text-body)] opacity-80">
          Signet Protocol adheres to the <strong>C2PA 2.3 Technical Specification</strong>. This alignment ensures that VPR assertions are interoperable with standard JUMBF manifest consumers.
        </p>
      </header>

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1.1 Implementation Architecture</h3>
        <p className="mb-6 text-[var(--text-body)]">
          The Neural Prism engine signs assets using the standard C2PA toolchain aligned with <strong>ISO/TC 290</strong>. Every Signet-verified asset contains a standard JUMBF box with custom <code>org.signetai.vpr</code> assertions as defined in the 2.3 draft.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Feature</th>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">C2PA Native (2.3)</th>
                <th className="px-6 py-4 font-bold text-[var(--trust-blue)]">Signet VPR Extension</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {matrix.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--text-header)]">{row.feature}</td>
                  <td className="px-6 py-4 text-[var(--text-body)] opacity-70">{row.c2pa}</td>
                  <td className="px-6 py-4 font-semibold text-[var(--trust-blue)]">{row.signet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Admonition type="security" title="Cryptographic Assurance">
        All L4 attestation signatures MUST use 256-bit Ed25519. This ensures the integrity of the Human-in-the-loop signet against modern computational brute-force techniques.
      </Admonition>

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 text-[var(--text-header)]">1.2 External References</h3>
        <ul className="space-y-4">
          <li>
            <a href="https://spec.c2pa.org/specifications/specifications/2.3/index.html" target="_blank" className="text-[var(--trust-blue)] hover:underline font-medium">
              C2PA Technical Specification v2.3 (Current Baseline) &rarr;
            </a>
          </li>
          <li>
            <a href="https://contentauthenticity.org/" target="_blank" className="text-[var(--trust-blue)] hover:underline font-medium">
              Content Authenticity Initiative (CAI) &rarr;
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
};