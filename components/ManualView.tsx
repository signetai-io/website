import React from 'react';

const ManualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-16">
    <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--trust-blue)] font-bold mb-6 border-b border-[var(--border-light)] pb-2">
      {title}
    </h3>
    <div className="space-y-6">
      {children}
    </div>
  </section>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="p-8 border border-[var(--border-light)] bg-[var(--table-header)] rounded shadow-sm">
    <div className="w-10 h-10 border border-[var(--trust-blue)] text-[var(--trust-blue)] flex items-center justify-center font-bold mb-6 italic">
      {icon}
    </div>
    <h4 className="font-serif text-xl font-bold text-[var(--text-header)] mb-3">{title}</h4>
    <p className="text-[14px] leading-relaxed text-[var(--text-body)] opacity-70 italic">{desc}</p>
  </div>
);

export const ManualView: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto">
      <header className="mb-20 space-y-4">
        <h1 className="text-6xl font-bold tracking-tighter italic text-[var(--text-header)]">Operator's Manual</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          v0.2.6 — Standardized Guidance for the Signet Accountability Layer.
        </p>
      </header>

      <ManualSection title="01. Identity Lifecycle (Registry)">
        <div className="space-y-4 text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif">
          <p>The <strong>TrustKey Registry</strong> is the authoritative root for all Signet-enabled nodes. Follow these steps to establish your cryptographic presence:</p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Define Subject:</strong> Enter your unique handle (e.g., <code>shengliang.song</code>). The system checks for "Anchor Availability" in real-time.</li>
            <li><strong>Namespace Binding:</strong> Optionally bind your identity to an organization (e.g., <code>signetai.io</code>). This creates a hierarchical system anchor.</li>
            <li><strong>Establish Anchor:</strong> Generate your Ed25519 keypair. <strong>Crucial:</strong> Secure your 12-word mnemonic. Signet AI Labs never stores your private key.</li>
            <li><strong>Registry Settlement:</strong> Click "Seal Mainnet Identity" to commit your public key to the global database. This creates a permanent, immutable record for verifiers.</li>
          </ol>
        </div>
      </ManualSection>

      <ManualSection title="02. The Signing Pipeline (Lab)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif">
          Once your identity is settled, you can transition to the <strong>Provenance Lab</strong> to attest to digital assets.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <FeatureCard 
            icon="Σ" 
            title="Asset Hashing" 
            desc="Signet computes a SHA-256 digest of your file. This 'Vision Substrate' hash is the immutable DNA of the asset, ensuring any future modification breaks the signature." 
          />
          <FeatureCard 
            icon="✓" 
            title="Attestation & Verification" 
            desc="Signing creates a VPR Manifest (org.signetai.vpr). Verifiers upload this manifest, which then triggers a live registry lookup to cross-check your public key and validate the signature." 
          />
        </div>
      </ManualSection>

      <ManualSection title="03. Understanding Trace IDs">
        <p className="text-lg leading-loose text-[var(--text-body)]">
          The Verifier SDK is your interface into the **Neural Lens**. It provides a real-time window into the cryptographic attestation process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <FeatureCard 
            icon="ID" 
            title="Logic Fingerprints" 
            desc="Every row in the Live Audit table represents a specific 'Logic Node' in the AI's reasoning path. The ID is a unique SHA-256 fingerprint." 
          />
          <FeatureCard 
            icon="∞" 
            title="Continuous Heartbeat" 
            desc="Signet uses 'Continuous Attestation'. The stream monitors for 'State Drift' — ensuring the asset hasn't been tampered with since the first ingredient was added." 
          />
        </div>
      </ManualSection>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Dashboard
        </a>
        <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">Certified by Signet Standards Group | v0.2.6</p>
      </div>
    </div>
  );
};