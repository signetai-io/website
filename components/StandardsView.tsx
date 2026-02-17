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

  const architecturalComparison = [
    { 
      metric: "Injection Strategy", 
      c2pa: "Intra-Container (Binary Atoms)", 
      signet: "Post-Container (Tail-Wrap)",
      desc: "C2PA injects data *inside* the file (e.g., MP4 'moov', JPEG 'APP11'). Signet appends *after* the EOF."
    },
    { 
      metric: "File Structure", 
      c2pa: "Rewrites Internal Offsets", 
      signet: "Preserves Original Binary",
      desc: "C2PA requires complex re-indexing of video atoms. Signet treats the original file as an immutable block."
    },
    { 
      metric: "Decoder Complexity", 
      c2pa: "High (Requires Format Parsers)", 
      signet: "Low (Universal Text Scan)",
      desc: "Verifying C2PA requires format-aware libraries (WASM/Rust). Signet verification is a simple string search."
    },
    { 
      metric: "Audit Transparency", 
      c2pa: "Opaque (Binary Box)", 
      signet: "Transparent (Plain Text)",
      desc: "Signet manifests can be read by opening the asset in a text editor, adhering to the 'Open Web' ethos."
    }
  ];

  return (
    <article className="prose prose-slate max-w-none">
      <header className="mb-16">
        <div className="text-[10px] font-mono text-[var(--trust-blue)] uppercase font-bold mb-4 tracking-[0.3em]">Section 1.0</div>
        <h2 className="text-4xl font-bold mb-6 text-[var(--text-header)]">Standards & Compliance (v2.3)</h2>
        <p className="text-lg text-[var(--text-body)] opacity-80">
          Signet Protocol adheres to the <strong>C2PA 2.3 Technical Specification</strong> while introducing specialized architectural patterns for lightweight, browser-native verification.
        </p>
      </header>

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1.1 Implementation Architecture</h3>
        <p className="mb-6 text-[var(--text-body)]">
          The Neural Prism engine signs assets using the standard C2PA toolchain aligned with <strong>ISO/TC 290</strong>. Every Signet-verified asset contains a standard JUMBF box with custom <code>org.signetai.vpr</code> assertions.
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
          For binary media (Video, Audio, Images), Signet implements a <strong>Universal Tail-Wrap (UTW)</strong> strategy. This architectural divergence prioritizes accessibility and zero-dependency verification over binary compactness.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[var(--border-light)] rounded bg-[var(--bg-standard)] shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[var(--text-header)] uppercase tracking-wider text-xs">Architectural Component</th>
                <th className="px-6 py-4 font-bold text-[var(--text-header)] uppercase tracking-wider text-xs">Standard C2PA (Hardware Layer)</th>
                <th className="px-6 py-4 font-bold text-[var(--trust-blue)] uppercase tracking-wider text-xs">Signet Protocol (Human Layer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {architecturalComparison.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold block text-[var(--text-header)]">{row.metric}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="block text-[var(--text-body)] font-medium">{row.c2pa}</span>
                  </td>
                  <td className="px-6 py-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)]">
                    <span className="block text-[var(--trust-blue)] font-bold">{row.signet}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
           <div className="p-6 border border-neutral-200 bg-neutral-50 rounded">
              <h4 className="font-bold text-sm uppercase mb-2 text-neutral-600">Why C2PA does it their way</h4>
              <p className="text-xs leading-relaxed opacity-70">
                Standard C2PA is designed for <strong>Hardware integration</strong> (Cameras, DSPs). Rewriting file structures ensures the metadata survives specialized editing software that might strip trailing bytes. It is robust but computationally expensive to parse.
              </p>
           </div>
           <div className="p-6 border border-blue-200 bg-blue-50 rounded">
              <h4 className="font-bold text-sm uppercase mb-2 text-blue-600">Why Signet does it our way</h4>
              <p className="text-xs leading-relaxed opacity-70 text-blue-900">
                Signet is designed for the <strong>Web & Human Layer</strong>. By appending signatures after the EOF, we allow any file to be signed instantly in the browser without 5MB+ WASM libraries. It ensures the "Source of Truth" is readable by anyone with a text editor.
              </p>
           </div>
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