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
        <div className="text-[10px] font-mono text-[#0055FF] uppercase font-bold mb-4 tracking-[0.3em]">Section 1.0</div>
        <h2 className="text-4xl font-bold mb-6">Standards & Compliance</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Signet Protocol leverages existing Content Credentials (C2PA) infrastructure to provide a "deep-logic" audit layer for autonomous agents.
        </p>
      </header>

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-2">1.1 Implementation Architecture</h3>
        <p className="mb-6">
          The Neural Prism engine signs files using the standard C2PA toolchain (`c2patool`). Every Signet-verified asset contains a standard JUMBF box with custom `org.signetai.vpr` assertions.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[#E1E4E8] rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FA] dark:bg-white/5 border-b border-[#E1E4E8]">
              <tr>
                <th className="px-6 py-4 font-bold">Feature</th>
                <th className="px-6 py-4 font-bold">C2PA Native</th>
                <th className="px-6 py-4 font-bold text-[#0055FF]">Signet VPR Extension</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E4E8]">
              {matrix.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{row.feature}</td>
                  <td className="px-6 py-4">{row.c2pa}</td>
                  <td className="px-6 py-4 font-semibold text-[#0055FF]">{row.signet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Admonition type="security" title="Adversarial Injection">
        Implementing VPR without the L3 Adversarial Probe layer exposes the manifest to logic-spoofing attacks. Auditors MUST verify the L3 signature before attesting to L2 logic parity.
      </Admonition>

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4">1.2 External References</h3>
        <ul className="space-y-4">
          <li>
            <a href="https://spec.c2pa.org/" target="_blank" className="text-[#0055FF] hover:underline font-medium">
              Official C2PA Specification (ISO/TC 290) &rarr;
            </a>
          </li>
          <li>
            <a href="https://contentauthenticity.org/" target="_blank" className="text-[#0055FF] hover:underline font-medium">
              Content Authenticity Initiative (CAI) &rarr;
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
};