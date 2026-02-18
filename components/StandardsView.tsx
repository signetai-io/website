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

  const keyMatrix = [
    { feature: "Root of Trust", c2pa: "Centralized CA (DigiCert)", signet: "Decentralized Registry (TKS)" },
    { feature: "Algorithm", c2pa: "RSA / ECDSA (X.509)", signet: "Ed25519 (Raw Public Key)" },
    { feature: "Cost / Access", c2pa: "$$$ (Enterprise Only)", signet: "Near-Zero (Democratized)" },
    { feature: "Revocation", c2pa: "OCSP / CRL Lists", signet: "Registry State Updates" }
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
        <h2 className="text-4xl font-bold mb-6 text-[var(--text-header)]">Standards & Compliance (v0.3.1)</h2>
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
           <div className="p-6 border border-[var(--border-light)] bg-[var(--code-bg)] rounded">
              <h4 className="font-bold text-sm uppercase mb-2 text-[var(--text-header)]">Why C2PA does it their way</h4>
              <p className="text-xs leading-relaxed opacity-70 text-[var(--text-body)]">
                Standard C2PA is designed for <strong>Hardware integration</strong> (Cameras, DSPs). Rewriting file structures ensures the metadata survives specialized editing software that might strip trailing bytes. It is robust but computationally expensive to parse.
              </p>
           </div>
           <div className="p-6 border border-blue-500/20 bg-blue-500/5 rounded">
              <h4 className="font-bold text-sm uppercase mb-2 text-blue-500">Why Signet does it our way</h4>
              <p className="text-xs leading-relaxed opacity-70 text-[var(--text-body)]">
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

      <section className="mb-16">
        <h3 className="text-xl font-bold mb-4 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1.4 Identity & Key Infrastructure</h3>
        <p className="mb-6 text-[var(--text-body)]">
          Signet departs from the traditional <strong>X.509 PKI</strong> infrastructure used by major C2PA providers (Adobe/Microsoft) in favor of a decentralized <strong>Ed25519</strong> system. This reduces the barrier to entry for the "8 Billion" human curators.
        </p>
        
        <div className="overflow-x-auto my-8 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">Infrastructure</th>
                <th className="px-6 py-4 font-bold text-[var(--text-header)]">C2PA (Institutional)</th>
                <th className="px-6 py-4 font-bold text-[var(--trust-blue)]">Signet (Sovereign)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {keyMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--text-header)]">{row.feature}</td>
                  <td className="px-6 py-4 text-[var(--text-body)] opacity-70">{row.c2pa}</td>
                  <td className="px-6 py-4 font-semibold text-[var(--trust-blue)]">{row.signet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pros & Cons Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* C2PA X.509 Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[var(--border-light)]">
              <span className="text-xl">🏢</span>
              <h4 className="font-bold text-[var(--text-header)]">C2PA (X.509 PKI)</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase font-bold text-green-500 mb-2">Pros</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Broad enterprise trust (Adobe/Microsoft roots).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Standardized revocation (OCSP/CRL).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Legal recognition in regulated industries.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-mono text-[9px] uppercase font-bold text-red-500 mb-2">Cons</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>High cost ($$$/yr per seat).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Gatekept by centralized CAs (DigiCert).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Complex certificate chain management.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signet Ed25519 Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[var(--border-light)]">
              <span className="text-xl">🛡️</span>
              <h4 className="font-bold text-[var(--trust-blue)]">Signet (Sovereign)</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[9px] uppercase font-bold text-green-500 mb-2">Pros</p>
                <ul className="space-y-4">
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold mt-1">✓</span>
                    <div className="space-y-2">
                      <span className="font-bold text-[var(--trust-blue)]">Amortized Trust Economy (Near Zero Cost)</span>
                      <p className="text-xs leading-relaxed">
                        Signet acts as the specification definer and key database service. The operational cost of signing is minimal (~$3). 
                        While high-quality content generation costs ~$3000/year, sharing it with 100 people amortizes the cost.
                      </p>
                      <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] p-3 rounded text-[10px] font-mono shadow-sm">
                        <p className="font-bold mb-1">Cost Formula: $3000 / 100 = $30</p>
                        <p className="opacity-70">
                          As the number of verifiers (N) grows, the amortized cost per trust-unit approaches zero.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Non-custodial (You own your keys).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Quantum-resistant key sizes (Small/Fast).</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-mono text-[9px] uppercase font-bold text-red-500 mb-2">Cons</p>
                <ul className="space-y-2">
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Trust is reputation-based (Web of Trust).</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Responsibility: Lost keys = Lost Identity.</span>
                  </li>
                  <li className="flex gap-2 text-sm opacity-80 text-[var(--text-body)]">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Newer standard (ISO/TC 290 adoption pending).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Admonition type="security" title="Cryptographic Assurance">
        All L4 attestation signatures MUST use 256-bit Ed25519. This ensures the integrity of the Human-in-the-loop signet against modern computational brute-force techniques.
      </Admonition>
    </div>
  );
};