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
          v0.3.1 — Standardized Guidance for the Signet Accountability Layer.
        </p>
      </header>

      <ManualSection title="01. Identity & Vault Recovery">
        <div className="space-y-4 text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif">
          <p>Signet uses a <strong>Non-Custodial</strong> trust model. This means you alone hold the keys to your curatorial authority.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded">
               <h5 className="font-bold text-red-600 mb-2">If you lose your Seed Manifest:</h5>
               <p className="text-sm opacity-70">Use the <strong>24-Word Mnemonic</strong> in the "Vault Recovery" section to re-derive your signing keys. This resets your local session without changing your Registry Anchor.</p>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded">
               <h5 className="font-bold text-amber-600 mb-2">If you lose both Seed & Mnemonic:</h5>
               <p className="text-sm opacity-70">The identity is <strong>Orphaned</strong>. It remains in the registry for accountability (others can still verify old assets), but no new assets can ever be signed by this ID.</p>
            </div>
          </div>
        </div>
      </ManualSection>

      <ManualSection title="02. Unstructured Text Embedding (C2PA 2.3)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The Dec 2025 C2PA update introduces a specialized method for embedding provenance in text without binary containers.
        </p>
        <div className="p-8 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-xs space-y-4">
           <p className="text-[var(--trust-blue)] font-bold">// C2PATextManifestWrapper (Section A.7)</p>
           <p className="opacity-60 leading-relaxed">
             Signet encodes the JUMBF manifest into a sequence of <strong>Unicode Variation Selectors</strong> (U+FE00-U+FE0F). 
             These characters are invisible to human readers but parsed by Signet-compliant LLMs and editors.
           </p>
           <div className="bg-black/5 p-4 rounded border border-black/10">
             <code className="text-[var(--text-header)]">"The reasoning starts here.[SIGNET_VPR_WRAPPER]"</code>
           </div>
        </div>
      </ManualSection>

      <ManualSection title="03. Live Video Provenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📹" 
            title="Segmented Info" 
            desc="C2PA 2.3 Section 19.4 support. Each frame segment is signed independently using session keys, preventing stream manipulation or replay attacks." 
          />
          <FeatureCard 
            icon="🛡️" 
            title="Actions v2" 
            desc="The protocol has moved exclusively to the v2 Actions schema. This includes fine-grained watermarking and proportional resizing attestation." 
          />
        </div>
      </ManualSection>

      <ManualSection title="04. Vector Attestation (SVG)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          Unlike raster images, Vector Graphics require <strong>XML-DSig Hybrid</strong> attestation to maintain code readability and portability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📐" 
            title="Metadata Injection" 
            desc="Signet injects a JSON-LD manifest into a custom <metadata> block just before the closing tag, ensuring the visual rendering is unaffected." 
          />
          <FeatureCard 
            icon="🔍" 
            title="Visual Hashing" 
            desc="The verification engine separates the 'Code' (Metadata) from the 'Art' (Paths), calculating a SHA-256 hash of the visual data to detect tampering." 
          />
        </div>
      </ManualSection>

      <ManualSection title="05. Document Signing (PDF)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          For PDFs, Signet uses an "Append-Only" strategy. We do not rewrite the PDF structure (which risks breaking internal xref tables). Instead, we append a signed JSON block <strong>after the EOF marker</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📄" 
            title="Post-EOF Injection" 
            desc="Signet appends the signature block after the %%EOF tag. Standard PDF readers ignore this data, but the file remains valid and the provenance is readable as plain text." 
          />
          <FeatureCard 
            icon="🔐" 
            title="Content Body Hash" 
            desc="The signature covers the exact byte range of the original file (0 to EOF). Any modification to the content body will invalidate the Post-EOF signature." 
          />
        </div>
      </ManualSection>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Dashboard
        </a>
        <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">Certified by signetai.io:ssl | v0.3.1</p>
      </div>
    </div>
  );
};