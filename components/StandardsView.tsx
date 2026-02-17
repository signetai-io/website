import React from 'react';
import { Admonition } from './Admonition';

export const StandardsView: React.FC = () => {
  const matrix = [
    { feature: "Focus", c2pa: "Asset Integrity", signet: "Cognitive Integrity" },
    { feature: "Verification", c2pa: "Manifest Signature", signet: "Logic Trace Parity" },
    { feature: "Handling", c2pa: "Attribution", signet: "Deterministic Audit" },
    { feature: "Scope", c2pa: "Pixels/Text", signet: "Reasoning Substrate" }
  ];

  const svgMatrix = [
    { feature: "Format", c2pa: "Binary JUMBF (c2pa-js)", signet: "XML Metadata (Signet-Native)" },
    { feature: "Readability", c2pa: "Binary Blob (Base64)", signet: "Human-Readable XML" },
    { feature: "Tooling", c2pa: "Requires WASM/Rust", signet: "Lightweight JS/Regex" },
    { feature: "Compatibility", c2pa: "Standard Adobe Tools", signet: "Signet Verifier (Schema Aligned)" }
  ];

  const universalMatrix = [
    { feature: "Strategy", c2pa: "Specific Container Atoms (RIFF/MP4)", signet: "Universal Tail-Wrap (UTW)" },
    { feature: "Support", c2pa: "Limited by parser library", signet: "Any Binary File (MP3, WAV, MP4, AVI, JPG)" },
    { feature: "Mechanism", c2pa: "Structural Injection", signet: "Post-Stream Appending" },
    { feature: "Playback", c2pa: "Standard Compliant", signet: "Standard Compliant (Ignored by Decoders)" }
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
      
      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1.2 Universal Media Support (UTW)</h3>
        <p className="mb-6 text-[var(--text-body)]">
          To support the full spectrum of C2PA formats (Audio, Video, Images) without heavy WASM dependencies in the browser, Signet implements a <strong>Universal Tail-Wrap</strong> strategy. This allows any binary file (MP3, WAV, MP4, AVI, PNG) to carry a verifiable manifest.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Metric</th>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Standard C2PA (Native)</th>
                <th className="px-6 py-4 font-bold text-[var(--trust-blue)]">Signet Universal (UTW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {universalMatrix.map((row, i) => (
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

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1.3 Vector Attestation Strategy</h3>
        <p className="mb-6 text-[var(--text-body)]">
          For SVG assets, Signet employs a specialized <strong>XML-Hybrid</strong> approach. While C2PA defines a standard for embedding binary JUMBF data within SVGs, Signet prioritizes code readability for vector formats.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Metric</th>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Standard C2PA-JS</th>
                <th className="px-6 py-4 font-bold text-[var(--trust-blue)]">Signet Native SVG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {svgMatrix.map((row, i) => (
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
    </div>
  );
};