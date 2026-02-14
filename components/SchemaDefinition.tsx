import React from 'react';

export const SchemaDefinition: React.FC = () => {
  const vprHeaderSample = {
    "X-Signet-VPR": "0.2; 0.998; 0x8f2d...4a12",
    "payload": {
      "version": "0.2",
      "timestamp": 1740000000,
      "parity_score": 0.9982,
      "chain": [
        { "entity": "MODEL", "id": "gemini-3-pro", "hash": "sha256:45ea..." },
        { "entity": "TOOL", "id": "podcast-oracle-v2", "hash": "sha256:88bc..." },
        { "entity": "HUMAN", "id": "curator-09", "sig": "ed25519:f9a1..." }
      ]
    }
  };

  const appMapping = [
    { "app": "Scripture", "layer": "L1: VISION", "task": "Truth Anchor" },
    { "app": "Neural Lens", "layer": "L2: COMPILER", "task": "Logic Graphing" },
    { "app": "Verifier", "layer": "L3: ADVERSARIAL", "task": "Drift Detection" },
    { "app": "TKS Hub", "layer": "L4: HUMAN", "task": "Final Attestation" }
  ];

  return (
    <section id="schema-intro" className="py-24 border-v">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Standard Artifacts</span>
            <h2 className="text-4xl font-bold italic text-[var(--text-header)]">The VPR Header.</h2>
            <p className="text-lg leading-relaxed text-[var(--text-body)] opacity-80">
              Protocol nodes emit an `X-Signet-VPR` header containing a deterministic reasoning chain.
            </p>
          </div>
          
          <div className="p-8 rounded border border-[var(--border-light)]" style={{ backgroundColor: 'var(--code-bg)' }}>
            <div className="flex gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
            </div>
            <pre className="font-mono text-[12px] leading-relaxed overflow-x-auto border-none p-0">
              <code>{JSON.stringify(vprHeaderSample, null, 2)}</code>
            </pre>
          </div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[var(--text-body)] opacity-40 tracking-[0.4em] uppercase font-bold">Ecosystem Distribution</span>
            <h2 className="text-4xl font-bold italic text-[var(--text-header)]">Functional Mapping.</h2>
            <p className="text-lg leading-relaxed text-[var(--text-body)] opacity-80">
              Mapping functional responsibility across protocol layers.
            </p>
          </div>

          <div className="border border-[var(--border-light)] rounded overflow-hidden">
            <table className="w-full font-mono text-[11px] uppercase tracking-wider">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)] text-[var(--text-header)]">
                <tr>
                  <th className="p-4 text-left font-bold">Component</th>
                  <th className="p-4 text-left font-bold">Layer</th>
                  <th className="p-4 text-left font-bold">Task</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {appMapping.map(m => (
                  <tr key={m.app} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-[var(--text-header)] font-bold">{m.app}</td>
                    <td className="p-4 text-[var(--text-body)] opacity-60 text-[10px]">{m.layer}</td>
                    <td className="p-4 text-[var(--trust-blue)] font-bold">{m.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};