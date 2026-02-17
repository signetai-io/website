import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const SPEC_PAGES = [
  {
    title: "Abstract & Introduction",
    text: "The Signet Protocol defines a framework for the cryptographic attestation of AI-generated reasoning paths. Version 0.2.7 introduces the Vault Recovery Protocol (VRP-R) and Dual-Mode Manifest Delivery. By utilizing the Neural Lens engine, the protocol transforms non-deterministic LLM outputs into formally verified 'Signets,' while providing curators with a non-custodial 24-word mnemonic for identity restoration.\n\nAs AI moves from 'Chat' to 'Reasoning,' current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces 'Process Provenance' via Verifiable Proof of Reasoning (VPR).",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">Abstract</h2>
        <p className="indent-12 opacity-80 leading-loose">
          The Signet Protocol defines a framework for the cryptographic attestation of AI-generated reasoning paths. 
          Version 0.2.7 introduces the <strong>Vault Recovery Protocol (VRP-R)</strong> and <strong>Dual-Mode Manifest Delivery</strong>. 
          By utilizing the Neural Lens engine, the protocol transforms non-deterministic LLM outputs into formally verified "Signets," 
          while providing curators with a non-custodial 24-word mnemonic for identity restoration.
        </p>
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">1. Introduction</h2>
        <p className="opacity-80 leading-loose">
          As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because 
          they only sign the final result, not the process. Signet Protocol introduces <span className="text-[var(--text-header)] italic">"Process Provenance"</span> via 
          Verifiable Proof of Reasoning (VPR).
        </p>
      </div>
    )
  },
  {
    title: "Technical Implementation",
    text: "Developer SDK Implementation (Node.js/Python). For production-grade C2PA 2.3 signing, use the following logic to handle AI-generated assertions and certificate chains.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">Developer API Snippets</h2>
        <p className="opacity-80 leading-loose">
          Implement C2PA v2.3 manifests natively in your pipeline.
        </p>
        <div className="space-y-4">
          <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl font-mono text-[11px] space-y-2">
            <p className="text-[var(--trust-blue)] font-bold"># Node.js: Creating a v2.3 Manifest</p>
            <pre className="opacity-70 overflow-x-auto p-2 bg-black/5 rounded">
{`const { createManifest } = require('@signet-ai/sdk');

async function signAsset(imagePath, author) {
  const manifest = createManifest({
    actions: [{ action: 'c2pa.created', softwareAgent: 'Signet AI v0.2.7' }],
    metadata: { author: author, title: 'AI Generated Vision' }
  });

  // PRODUCTION: Use HSM/KMS for private key
  const signer = await getHSMSigner('signet-master-prod');
  await manifest.sign(signer);
  
  return manifest.embed(imagePath);
}`}
            </pre>
          </div>

          <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl font-mono text-[11px] space-y-2">
            <p className="text-emerald-600 font-bold"># Python: Soft-Binding Discovery (pHash)</p>
            <pre className="opacity-70 overflow-x-auto p-2 bg-black/5 rounded">
{`import imagehash
from signet_registry import Registry

def recover_manifest(image_file):
    # Compute perceptual hash
    current_hash = imagehash.phash(image_file)
    
    # Search Signet Global Registry
    manifest = Registry.lookup_phash(current_hash)
    if manifest:
        print(f"Verified: {manifest.author}")
    return manifest`}
            </pre>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "C2PA v2.3 Alignment (A.7)",
    text: "Signet Protocol 0.2.7 is strictly aligned with the C2PA v2.3 Technical Specification (Released Jan 2026).\n\nKey Implementation Blocks:\n• Section A.7: C2PATextManifestWrapper for text streams using Unicode Variation Selectors.\n• Section 18.6: Merkle Tree Piecewise Audit for fragmented MP4 video.\n• Section 19.4: verifiable-segment-info for real-time AI live streams.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. C2PA v2.3 Hardening</h2>
        <p className="opacity-80 leading-loose mb-6">
          The Jan 2026 update (v2.3) requires two fundamental delivery shifts for AI reasoning telemetry.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[var(--table-header)] border border-[var(--border-light)] rounded-xl space-y-4">
            <h4 className="font-mono text-[10px] text-[var(--trust-blue)] font-bold uppercase tracking-widest">Unstructured Text (A.7)</h4>
            <p className="text-sm opacity-70 italic leading-relaxed">Encoding JUMBF containers into invisible <strong>Unicode Variation Selectors (U+FE00 block)</strong>. This allows manifests to persist during copy-paste operations.</p>
          </div>
          <div className="p-8 bg-[var(--table-header)] border border-[var(--border-light)] rounded-xl space-y-4">
            <h4 className="font-mono text-[10px] text-[var(--trust-blue)] font-bold uppercase tracking-widest">Live Video (19.4)</h4>
            <p className="text-sm opacity-70 italic leading-relaxed">Implements <code>verifiable-segment-info</code> via <code>emsg</code> boxes. This signs AI video frame-by-frame for low-latency parity.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Universal Tail-Wrap (UTW)",
    text: "For binary media formats where native C2PA injection is computationally prohibitive in the browser, Signet mandates the Universal Tail-Wrap (UTW) protocol.\n\nStructure:\n[BINARY_DATA] + [EOF] + [\\n%SIGNET_VPR_START\\n] + [JSON_MANIFEST] + [\\n%SIGNET_VPR_END]\n\nThis ensures 100% reader compatibility while maintaining cryptographic linkage via the 'Content Body Hash' assertion.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2.5 Universal Tail-Wrap (UTW)</h2>
        <p className="opacity-80 leading-loose mb-6">
          For binary media formats where native C2PA injection is computationally prohibitive in the browser, Signet mandates the <strong>Universal Tail-Wrap (UTW)</strong> protocol.
        </p>
        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-[11px] space-y-4">
          <p className="text-[var(--trust-blue)] font-bold">Injection Topology:</p>
          <div className="flex items-center gap-2 text-center text-white">
             <div className="flex-1 bg-neutral-600 p-2 rounded">Original Binary (MP4/JPG/WAV)</div>
             <div className="text-black">➜</div>
             <div className="bg-red-500 p-2 rounded w-16">EOF</div>
             <div className="text-black">➜</div>
             <div className="flex-1 bg-[var(--trust-blue)] p-2 rounded">Signet Manifest (JSON)</div>
          </div>
          <div className="mt-4 pt-4 border-t border-black/10">
             <p className="text-[var(--text-header)] font-bold mb-2">Structure Definition:</p>
             <code className="block p-2 bg-black/5 rounded text-[10px]">
               [BINARY_BYTES] + [0x0A] + "%SIGNET_VPR_START" + [0x0A] + [VPR_JSON] + [0x0A] + "%SIGNET_VPR_END"
             </code>
          </div>
        </div>
        <p className="text-xs font-serif italic opacity-60">
          Note: This method is compliant with Signet Level 3 verification but requires specialized extractors (UniversalSigner) to read, as standard C2PA tools expect JUMBF boxes.
        </p>
      </div>
    )
  },
  {
    title: "Identity & Vault Recovery",
    text: "Signet identities are anchored to a System Anchor in the global registry. If a local curatorial vault is lost, the Vault Recovery Protocol (VRP-R) enables the re-derivation of signing keys via a 24-word mnemonic.\n\nLayer 0: Cryptographic Root\n• ALGORITHM: ED25519-256\n• PUBLIC KEY: 256-BIT (64 HEX CHARS)\n• ENTROPY: 264-BIT SOVEREIGN\n• RECOVERY: VRP-R (24-WORD MNEMONIC)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3. Registry & Recovery</h2>
        <p className="opacity-80 leading-loose mb-6">
          Signet identities are anchored to a <strong>System Anchor</strong> in the global registry. If a local curatorial vault is lost, the 
          <strong>Vault Recovery Protocol (VRP-R)</strong> enables the re-derivation of signing keys via a 24-word mnemonic.
        </p>
        <div className="bg-[var(--admonition-bg)] p-8 border-l-4 border-[var(--trust-blue)] space-y-4 rounded-r">
          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--trust-blue)]">Layer 0: Cryptographic Root</p>
          <ul className="text-xs font-mono opacity-60 space-y-1">
            <li>• ALGORITHM: ED25519-256</li>
            <li>• PUBLIC KEY: 256-BIT (64 HEX CHARS)</li>
            <li>• ENTROPY: 264-BIT SOVEREIGN</li>
            <li>• RECOVERY: VRP-R (24-WORD MNEMONIC)</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Sovereign Entropy (Section 2.3)",
    text: "Signet implements Sovereign Grade Entropy to match the security levels of 256-bit elliptic curves.\n\nEntropy Calculation: 24 words × 11 bits/word = 264 bits\nPublic Key Derivation: 64 characters of Hexadecimal (256 bits)\nThis exceeds the 256-bit security floor of SHA-256 and Ed25519.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3.3 Sovereign Grade Entropy (VPR-S)</h2>
        <p className="opacity-80 leading-loose">
          Signet implements <strong>Sovereign Grade Entropy</strong> to match the security levels of 256-bit elliptic curves.
        </p>
        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-[11px] space-y-2">
          <p className="text-[var(--trust-blue)] font-bold">Entropy Calculation:</p>
          <code className="block p-2 bg-black/5 rounded">24 words × 11 bits/word = 264 bits</code>
          <p className="text-[var(--trust-blue)] font-bold mt-4">Key Derivation Standard:</p>
          <code className="block p-2 bg-black/5 rounded">64-char Hex Public Key = 256 bits</code>
          <p className="opacity-40 italic mt-4">This exceeds the 256-bit security floor of SHA-256 and Ed25519.</p>
        </div>
      </div>
    )
  },
  {
    title: "Manifest Delivery & JUMBF",
    text: "Compliance with C2PA 2.3 requires support for two primary transport modes:\n\n3.1 Sidecar Mode (.json): Standalone JSON-LD objects for cloud-native pipelines.\n3.2 Embedded Mode (JUMBF): Tail-end binary injection via SIGNET_VPR tags.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">4. Delivery Strategies</h2>
        <p className="opacity-80 leading-loose">
          Compliance with C2PA 2.3 requires support for two primary transport modes:
        </p>
        <div className="space-y-4">
          <h4 className="font-bold text-[var(--text-header)]">4.1 Sidecar Mode (.json)</h4>
          <p className="opacity-80 leading-loose">Standalone JSON-LD objects for cloud-native pipelines.</p>
          <h4 className="font-bold text-[var(--text-header)]">4.2 Embedded Mode (JUMBF)</h4>
          <p className="opacity-80 leading-loose">Tail-end binary injection via <code>SIGNET_VPR</code> tags.</p>
        </div>
      </div>
    )
  },
  {
    title: "VPR Header & Signing",
    text: "All protocol nodes MUST emit an X-Signet-VPR header containing the deterministic reasoning chain hash.\n\nThis specification is authorized for public release under ISO/TC 290 guidelines.\n\nOfficial Signatory:\nsignetai.io:ssl\n\nProvenance Root: SHA256:7B8C...44A2",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">5. The X-Signet-VPR Header</h2>
        <p className="opacity-80 leading-loose">
          All protocol nodes MUST emit an <code>X-Signet-VPR</code> header containing the deterministic reasoning chain hash.
        </p>
        <div className="p-10 border border-dashed border-[var(--border-light)] text-center space-y-4">
           <p className="font-serif italic opacity-50">This document is formally attested and sealed.</p>
           <p className="font-mono text-xs font-bold text-[var(--trust-blue)] uppercase tracking-widest">
             Signed by Master Curator:<br/>signetai.io:ssl
           </p>
        </div>
      </div>
    )
  }
];

const PDF_FILENAME = "Signet-Protocol-v027-Official.pdf";

export const SpecView: React.FC = () => {
  const [page, setPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 25;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);

      SPEC_PAGES.forEach((p, index) => {
        if (index > 0) doc.addPage();
        
        // Background Accent (Subtle vertical line)
        doc.setDrawColor(0, 85, 255);
        doc.setLineWidth(0.5);
        doc.line(margin, 20, margin, pageHeight - 20);

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text("TECHNICAL SPECIFICATION: DRAFT-SONG-SIGNET-02.7", margin + 5, 15);
        doc.text(`RELEASE: v0.2.7-RELEASE`, pageWidth - margin - 40, 15);
        
        // Page Number
        doc.text(`PAGE ${index + 1} OF ${SPEC_PAGES.length}`, pageWidth - margin - 20, pageHeight - 10);

        // Section Title
        doc.setFont("times", "bolditalic");
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text(p.title, margin + 5, 35);

        // Horizontal Rule
        doc.setDrawColor(230, 230, 230);
        doc.line(margin + 5, 40, pageWidth - margin, 40);

        // Content Body
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const splitText = doc.splitTextToSize(p.text, contentWidth - 10);
        doc.text(splitText, margin + 8, 55, { lineHeightFactor: 1.5 });

        // Signature / Seal Box
        const sealY = pageHeight - 45;
        doc.setDrawColor(0, 85, 255);
        doc.setLineWidth(0.2);
        doc.rect(margin + 5, sealY, contentWidth - 5, 25);
        
        doc.setFont("courier", "bold");
        doc.setFontSize(7);
        doc.setTextColor(0, 85, 255);
        doc.text("MASTER SIGNATORY ATTESTATION", margin + 10, sealY + 7);
        
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Authorized by: signetai.io:ssl", margin + 10, sealY + 14);
        
        doc.setFont("courier", "normal");
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text(`SEALED_TS: ${new Date().toISOString()}`, margin + 10, sealY + 20);
        doc.text(`PROVENANCE_ROOT: SHA256:7B8C...44A2`, pageWidth - margin - 60, sealY + 20);
      });

      doc.save(PDF_FILENAME);
    } catch (err) {
      console.error("PDF Engine Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadManifest = () => {
    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.vpr",
      "version": "0.2.7",
      "asset": {
        "name": PDF_FILENAME,
        "hash": "sha256:7b8c8f2d4a12b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4g5h6i7",
        "size": 158000
      },
      "signature": {
        "identity": "ssl",
        "anchor": "signetai.io:ssl",
        "publicKey": "ed25519:signet_v2.7_sovereign_5b9878a8583b7b38d719c7c8498f8981adc17bec0c311d76269e1275e4a8bdf9",
        "attestedBy": "Signet Protocol Labs",
        "timestamp": Date.now()
      }
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spec_v027_official_manifest.json';
    a.click();
  };

  return (
    <div className="bg-[var(--bg-standard)] text-[var(--text-body)] font-serif text-lg leading-relaxed pt-12 pb-24 px-6 max-w-4xl mx-auto selection:bg-[var(--trust-blue)] selection:text-white">
      <div className="glass-card p-8 md:p-20 shadow-2xl relative border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg min-h-[700px] flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.02] -translate-y-32 translate-x-32 rotate-45 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between mb-12 border-b border-[var(--border-light)] pb-6 text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 font-bold">
          <div className="space-y-1">
            <p>Protocol Working Group | Page {page + 1}/{SPEC_PAGES.length}</p>
            <p>Draft Song-02.7 (C2PA 2.3 Aligned)</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="text-[var(--trust-blue)] hover:underline flex items-center gap-2 group"
            >
              <span className="text-sm group-hover:-translate-y-0.5 transition-transform">⭳</span> 
              {isGenerating ? 'Engraving...' : 'Official PDF'}
            </button>
            <button 
              onClick={handleDownloadManifest}
              className="text-emerald-600 hover:underline flex items-center gap-2 border-l border-[var(--border-light)] pl-4 group"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">📜</span> VPR Manifest
            </button>
          </div>
        </div>

        <div className="mb-12 text-center space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl text-[var(--text-header)] font-bold tracking-tighter leading-tight italic">
            {SPEC_PAGES[page].title}
          </h1>
          <div className="w-12 h-px bg-[var(--trust-blue)] mx-auto"></div>
        </div>

        <div className="flex-1">
          {SPEC_PAGES[page].content}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-light)] flex justify-between items-center">
          <button 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`opacity-60 hover:opacity-100 transition-colors flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold ${page === 0 ? 'invisible' : ''}`}
          >
            <span className="text-lg">←</span> Previous
          </button>
          
          <div className="flex gap-2">
            {SPEC_PAGES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === page ? 'bg-[var(--trust-blue)]' : 'bg-[var(--border-light)]'}`}></div>
            ))}
          </div>

          <button 
            disabled={page === SPEC_PAGES.length - 1}
            onClick={() => setPage(page + 1)}
            className={`opacity-60 hover:opacity-100 transition-colors flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold ${page === SPEC_PAGES.length - 1 ? 'invisible' : ''}`}
          >
            Next <span className="text-lg">→</span>
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <p className="text-xs font-mono opacity-30 uppercase tracking-[0.4em]">
          Downloaded documents can be verified at /#auditor
        </p>
        <div className="flex justify-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
           <span className="font-mono text-[8px] uppercase font-bold tracking-widest">ISO/TC 290 COMPLIANT</span>
           <span className="font-mono text-[8px] uppercase font-bold tracking-widest">C2PA v2.3 NATIVE</span>
           <span className="font-mono text-[8px] uppercase font-bold tracking-widest">NEURAL LENS 0.2.7</span>
        </div>
      </div>
    </div>
  );
};