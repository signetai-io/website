import React from 'react';

export const SchemaView: React.FC = () => {
  const schemaCode = `{
  "$schema": "https://signetai.io/standards/vpr-schema.json",
  "type": "org.signetai.vpr",
  "version": "0.2.2",
  "provenance": {
    "protocol": "C2PA-Signet-Hybrid",
    "c2pa_manifest_id": "urn:uuid:6e8bc431...",
    "vpr_identity_binding": "ed25519:signet_8f2d...4a12"
  },
  "assertions": [
    {
      "label": "org.signetai.logic_dag",
      "data": {
        "nodes": 42,
        "edges": 84,
        "root_hash": "sha256:7b8c...44a2"
      }
    },
    {
      "label": "org.signetai.neural_lens_parity",
      "data": {
        "score": 0.9982,
        "drift_threshold": 0.05,
        "status": "deterministic"
      }
    }
  ],
  "signatures": [
    {
      "entity": "HUMAN_MASTER_CURATOR",
      "identity": "ssl.signet",
      "sig": "0x5f9a..."
    }
  ]
}`;

  return (
    <div className="py-24">
      <div className="mb-12">
        <span className="font-mono text-[10px] uppercase text-[var(--trust-blue)] tracking-[0.4em] font-bold block mb-4">L3 Manifest Draft</span>
        <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">org.signetai.vpr</h1>
        <p className="text-xl mt-6 text-[var(--text-body)] opacity-80">The JSON-LD schema for Verifiable Proof of Reasoning manifests.</p>
      </div>

      <div className="border border-[var(--border-light)] rounded overflow-hidden">
        <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-body)] opacity-40">VPR_MANIFEST_STUB_SONG02</span>
        </div>
        <div className="p-8 md:p-12 overflow-x-auto" style={{ backgroundColor: 'var(--code-bg)' }}>
          <pre className="font-mono text-[13px] leading-relaxed border-none p-0 bg-transparent">
            <code>{schemaCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border-l-2 border-[var(--border-light)]">
          <h4 className="font-bold text-lg text-[var(--text-header)] mb-4">Compliance Note</h4>
          <p className="text-sm leading-relaxed text-[var(--text-body)] opacity-70">
            The `org.signetai.vpr` assertion MUST be embedded within the standard C2PA JUMBF metadata store.
          </p>
        </div>
        <div className="p-6 border-l-2 border-[var(--border-light)]">
          <h4 className="font-bold text-lg text-[var(--text-header)] mb-4">Identity Binding</h4>
          <p className="text-sm leading-relaxed text-[var(--text-body)] opacity-70">
            The `vpr_identity_binding` MUST correspond to the public key registered in the TKS registry.
          </p>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)]">
        <a href="#" className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Specification Intro
        </a>
      </div>
    </div>
  );
};