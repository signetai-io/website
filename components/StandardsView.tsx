import React from 'react';

export const StandardsView: React.FC = () => {
  const comparisonData = [
    { feature: "Identity Logic", standard: "Anonymous / Black Box", c2pa: "Verified Asset (Ed25519)", signet: "Bound TrustKey (Hardware-Verified)" },
    { feature: "Provenance", standard: "None", c2pa: "Asset Chain (Who/When)", signet: "Cognitive Chain (How/Why)" },
    { feature: "Reasoning Depth", standard: "Implicit / Opaque", c2pa: "Surface Level Metadata", signet: "Deterministic VPR JUMBF Mapping" },
    { feature: "Auditability", standard: "Proprietary / Locked", c2pa: "Public Manifest", signet: "Neural Prism Symbolic Parity" },
    { feature: "Compliance", standard: "Post-hoc Policy", c2pa: "ISO/TC 290 - C2PA 2.2", signet: "C2PA-Native Hybrid v0.2.5" }
  ];

  const c2paSnippet = `# Sign an asset with Signet VPR Cognitive Assertions
# Using standard c2patool v0.8.0+

c2patool my_asset.mp4 \\
  --manifest signet_vpr_manifest.json \\
  --private-key signet_tks_identity.key \\
  --sign \\
  --output signed_asset.mp4

# Content of signet_vpr_manifest.json
{
  "vendor": "org.signetai.vpr",
  "assertions": [
    {
      "label": "org.signetai.vpr.cognitive_dag",
      "data": { "root": "0x8f2d...", "nodes": 128 }
    }
  ]
}`;

  return (
    <div className="min-h-screen theme-bg theme-text pt-32 pb-24 px-6 max-w-6xl mx-auto font-serif">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-24 border-b-theme pb-20">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-mono text-emerald-500 font-bold text-xl">cr</div>
            <span className="font-mono text-[10px] uppercase theme-text-secondary tracking-[0.4em] font-bold">Official C2PA Implementer</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tighter leading-[0.9] italic">
            Standard-Native<br/>Auditability.
          </h1>
          <p className="theme-text-secondary text-xl leading-relaxed max-w-xl">
            Signet AI Labs adopts the **ISO/C2PA** JUMBF manifest structure. We are not a side-chain; we are a specialized Cognitive Assertion Provider integrated into the industry-standard provenance stack.
          </p>
          <div className="flex gap-4">
            <a href="https://contentcredentials.org/verify" target="_blank" className="px-8 py-4 theme-accent-bg text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl">
              Verify via C2PA
            </a>
            <a href="#schema" className="px-8 py-4 border border-current theme-text font-mono text-xs uppercase tracking-widest font-bold hover:theme-accent-bg hover:text-white transition-all">
              JUMBF Schema
            </a>
          </div>
        </div>
        <div className="w-full md:w-80 p-8 glass-card space-y-6">
          <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold">Standard Adherence</h4>
          <div className="space-y-4">
            {[
              { label: 'Manifest Format', val: 'ISO/JUMBF', status: 'PASS' },
              { label: 'Ingredient Link', val: 'C2PA/Parent', status: 'PASS' },
              { label: 'Signature Format', val: 'Cose_Sign1', status: 'PASS' }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center text-xs">
                <span className="theme-text-secondary font-mono">{item.label}</span>
                <span className="theme-accent font-bold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="mb-24 space-y-12">
        <div className="space-y-4">
          <span className="font-mono text-[10px] theme-accent tracking-[0.4em] uppercase font-bold">Implementation Guide</span>
          <h2 className="text-5xl font-bold italic">c2patool Integration.</h2>
          <p className="theme-text-secondary text-lg max-w-2xl leading-relaxed">
            Neural Prism acts as an assertion provider that plugs directly into existing C2PA build pipelines.
          </p>
        </div>

        <div className="p-8 md:p-12 glass-card" style={{ backgroundColor: 'var(--code-bg)' }}>
          <pre className="font-mono text-[12px] md:text-[14px] leading-relaxed overflow-x-auto selection:bg-emerald-500/20">
            <code className="theme-text-secondary">{c2paSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl italic font-bold mb-4">The Trust Hierarchy</h2>
          <p className="theme-text-secondary font-mono text-[10px] uppercase tracking-widest">Cognitive Provenance vs. Standard Attribution</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-800/10 glass-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="theme-bg-secondary font-mono text-[10px] uppercase tracking-[0.2em] theme-text-secondary">
                <th className="p-8 border-b border-neutral-800/10">Verification Tier</th>
                <th className="p-8 border-b border-neutral-800/10">Black Box AI</th>
                <th className="p-8 border-b border-neutral-800/10">C2PA Standard</th>
                <th className="p-8 border-b border-neutral-800/10 theme-accent">Signet C2PA-Native</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/10">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:theme-bg-secondary/20 transition-colors">
                  <td className="p-8 font-bold italic text-lg">{row.feature}</td>
                  <td className="p-8 theme-text-secondary text-sm italic">{row.standard}</td>
                  <td className="p-8 theme-text-secondary text-sm italic">{row.c2pa}</td>
                  <td className="p-8 theme-text font-bold text-sm italic border-l border-emerald-500/10 bg-emerald-500/5">{row.signet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};