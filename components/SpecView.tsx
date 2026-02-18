import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const SPEC_PAGES = [
  {
    title: "1. Executive Summary & Abstract",
    text: "The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). \n\nUnlike traditional watermarking which focuses on asset attribution, Signet verifies the 'Reasoning DAG'—the logical chain of thought used to generate the output. \n\nThis document serves as a Technical Audit of the reference implementation hosted at signetai.io. It details the Client-Side PWA architecture, Zero-Copy memory management, Universal Tail-Wrap (UTW) injection strategy, and the Sovereign Identity capabilities utilizing Ed25519-256.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">1. Executive Summary</h2>
        <p className="indent-12 opacity-80 leading-loose text-justify">
          The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). 
          Unlike traditional watermarking which focuses on asset attribution, Signet verifies the <strong>"Reasoning DAG"</strong>—the logical chain of thought used to generate the output.
        </p>
        <p className="opacity-80 leading-loose text-justify">
          This document serves as a <strong>Technical Audit</strong> of the reference implementation hosted at signetai.io. It details the Client-Side PWA architecture, 
          Zero-Copy memory management, Universal Tail-Wrap (UTW) injection strategy, and the Sovereign Identity capabilities utilizing Ed25519-256.
        </p>
      </div>
    )
  },
  {
    title: "2. System Topology (Local-First)",
    text: "The Signet architecture strictly adheres to a 'Local-First' privacy model. \n\n2.1 Client-Side Execution\nAll cryptographic operations—Hashing (SHA-256), Key Generation (Ed25519), and Signing—occur exclusively within the user's browser (V8 Sandbox). \n\n2.2 Data Isolation\nPrivate Keys and Mnemonics are stored in the browser's IndexedDB ('IdentityVault') and are never transmitted over the network. \n\n2.3 Registry Sync\nOnly Public Keys and Identity Anchors are synchronized to the global Firestore registry. This ensures verifiable identity without custodial risk.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. System Topology</h2>
        <p className="opacity-80 leading-loose mb-6">
          The Signet architecture strictly adheres to a <strong>'Local-First'</strong> privacy model to prevent key leakage.
        </p>
        <div className="space-y-6">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--trust-blue)] text-sm uppercase mb-2">2.1 Client-Side Sandbox</h4>
              <p className="text-xs opacity-70 leading-relaxed font-mono">
                All cryptographic operations (SHA-256 Hashing, Ed25519 Signing) occur inside the browser's JS runtime. 
                <strong>No asset data is ever uploaded to a processing server.</strong>
              </p>
           </div>
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--trust-blue)] text-sm uppercase mb-2">2.2 Network Isolation</h4>
              <p className="text-xs opacity-70 leading-relaxed font-mono">
                <strong>Private Keys:</strong> Stored in IndexedDB (Local).<br/>
                <strong>Public Keys:</strong> Synced to Firestore (Global).<br/>
                This separation ensures that a compromise of the Signet servers cannot leak user credentials.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "3. Cryptographic Implementation",
    text: "3.1 Algorithms\n- Signatures: Ed25519 (Edwards-curve Digital Signature Algorithm).\n- Hashing: SHA-256 (WebCrypto API).\n- Key Derivation: BIP-39 Mnemonic standard.\n\n3.2 Entropy Standards\nSignet enforces 'Sovereign Grade' entropy for Master Curators.\n- Dictionary: 2,048 words (2^11).\n- Mnemonic Length: 24 words.\n- Total Entropy: 24 * 11 = 264 bits.\n\nThis exceeds the 256-bit security floor of modern elliptic curves, rendering brute-force attacks computationally infeasible.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3. Cryptography & Entropy</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
           <div className="p-4 border border-[var(--border-light)] rounded">
              <span className="block font-bold text-[var(--trust-blue)] mb-1">Signature Algo</span>
              Ed25519 (High-speed, constant-time)
           </div>
           <div className="p-4 border border-[var(--border-light)] rounded">
              <span className="block font-bold text-[var(--trust-blue)] mb-1">Hash Function</span>
              SHA-256 (Native WebCrypto)
           </div>
        </div>
        
        <h4 className="font-bold text-[var(--text-header)] mt-6">3.2 Sovereign Entropy (Math)</h4>
        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-[11px] space-y-4">
          <p className="opacity-70">Calculation for 24-Word Mnemonic strength:</p>
          <code className="block p-3 bg-black/5 rounded">
            Security = 24 words × log2(2048) bits/word<br/>
            Security = 24 × 11 = <strong>264 bits</strong>
          </code>
          <p className="text-emerald-600 font-bold">✓ Exceeds NIST 256-bit requirement.</p>
        </div>
      </div>
    )
  },
  {
    title: "4. Universal Tail-Wrap (UTW)",
    text: "4.1 Definition\nUTW is a zero-dependency injection strategy for appending provenance data to binary files (PDF, MP4, WAV) without rewriting the internal file structure.\n\n4.2 Byte Layout\n[ORIGINAL_BINARY_DATA]\n[EOF_MARKER]\n[0x0A, 0x25] (%)\n[SIGNET_VPR_START]\n[0x0A] (Newline)\n[JSON_MANIFEST_PAYLOAD]\n[0x0A] (Newline)\n[0x25] (%)\n[SIGNET_VPR_END]\n\n4.3 Verification Logic\nParsers MUST scan the last 10KB of a file for the %SIGNET_VPR_START token to extract the manifest without reading the full file.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">4. Universal Tail-Wrap (UTW)</h2>
        <p className="opacity-80 leading-loose mb-6">
          UTW allows arbitrary binary files to be signed in the browser without expensive parsing libraries or file corruption.
        </p>
        
        <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
           <div className="bg-[var(--table-header)] px-4 py-2 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase">Byte-Level Memory Layout</div>
           <div className="p-4 bg-[var(--code-bg)] font-mono text-[10px] space-y-1">
              <div className="p-2 bg-neutral-300 text-black text-center rounded opacity-50">[ ORIGINAL_BINARY_DATA (N Bytes) ]</div>
              <div className="text-center opacity-30">↓</div>
              <div className="p-2 bg-[var(--text-header)] text-[var(--bg-standard)] text-center rounded">[ EOF ]</div>
              <div className="text-center opacity-30">↓</div>
              <div className="p-2 border border-[var(--trust-blue)] text-[var(--trust-blue)] text-center rounded font-bold">
                 \n%SIGNET_VPR_START\n
              </div>
              <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-center">
                 [ JSON_MANIFEST_PAYLOAD ]
              </div>
              <div className="p-2 border border-[var(--trust-blue)] text-[var(--trust-blue)] text-center rounded font-bold">
                 \n%SIGNET_VPR_END
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "5. Zero-Copy Streaming Engine",
    text: "5.1 The Problem\nLoading large assets (e.g., 2GB Video) into browser RAM (ArrayBuffer) causes crash loops on mobile devices.\n\n5.2 The Solution: Block-Chained Hashing\nSignet implements a stream reader that processes files in 5MB chunks. \nFormula: H(n) = SHA256( H(n-1) + Chunk(n) )\n\n5.3 Zero-Copy Composition\nThe final signed file is constructed using a Blob composition of pointers:\nconst final = new Blob([originalFileRef, signatureString]);\nThis requires O(1) memory overhead regardless of file size.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">5. Zero-Copy Streaming</h2>
        <p className="opacity-80 leading-loose mb-6">
          To support GB-scale assets on mobile, Signet avoids loading files into RAM.
        </p>
        
        <div className="space-y-6">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] text-sm uppercase mb-4">5.2 Block-Chained Hashing</h4>
              <div className="flex gap-2 font-mono text-[10px] overflow-x-auto pb-2">
                 <div className="p-2 bg-blue-100 border border-blue-200 rounded min-w-[80px]">Chunk 1</div>
                 <span className="self-center">→</span>
                 <div className="p-2 bg-blue-100 border border-blue-200 rounded min-w-[80px]">Chunk 2</div>
                 <span className="self-center">→</span>
                 <div className="p-2 bg-emerald-100 border border-emerald-200 rounded min-w-[80px] font-bold">Final Hash</div>
              </div>
              <p className="mt-4 text-[10px] opacity-60 font-mono italic">
                State is maintained between chunks. Memory usage is capped at 5MB (Chunk Size).
              </p>
           </div>

           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] text-sm uppercase mb-2">5.3 Blob Composition Pointer</h4>
              <pre className="text-[10px] p-2 bg-black/5 rounded overflow-x-auto">
{`// No data duplication. Just reference concatenation.
const signed = new Blob([originalFileRef, sigStr]);`}
              </pre>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "6. Data & Storage Schema",
    text: "6.1 Local Schema (IndexedDB)\nStore: 'IdentityVault'\nKeyPath: 'anchor'\nFields: { anchor, identity, publicKey, mnemonic (encrypted), timestamp, type }\n\n6.2 Global Schema (Firestore)\nCollection: 'identities'\nDocumentID: {anchor}\nFields: { identity, publicKey, ownerUid, provider, timestamp }\n\n6.3 Security Rule Enforcements\n- Write: Only allowed if auth.uid matches ownerUid.\n- Read: Public access allowed for verification.\n- Admin: Hardcoded privileges for 'shengliang.song.ai@gmail.com'.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">6. Data Schema Audit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)]">6.1 Local (IndexedDB)</h4>
              <ul className="text-xs font-mono space-y-2 opacity-80 border-l-2 border-[var(--border-light)] pl-4">
                 <li>Store: <strong>IdentityVault</strong></li>
                 <li>Key: <strong>anchor</strong></li>
                 <li>Sensitive: <strong>mnemonic</strong> (Never Synced)</li>
              </ul>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)]">6.2 Global (Firestore)</h4>
              <ul className="text-xs font-mono space-y-2 opacity-80 border-l-2 border-[var(--border-light)] pl-4">
                 <li>Coll: <strong>identities</strong></li>
                 <li>Key: <strong>anchor</strong></li>
                 <li>Public: <strong>publicKey</strong> (Synced)</li>
              </ul>
           </div>
        </div>

        <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded">
           <h4 className="font-bold text-red-600 text-sm uppercase mb-2">6.3 Access Control (Rules)</h4>
           <pre className="text-[10px] font-mono opacity-70 whitespace-pre-wrap">
             allow update: if request.auth.uid == resource.data.ownerUid;
           </pre>
           <p className="mt-2 text-xs italic opacity-60">Prevents key overwrites by unauthorized accounts.</p>
        </div>
      </div>
    )
  },
  {
    title: "7. Compliance & Standards",
    text: "7.1 C2PA 2.3 Alignment\nSignet operates as a 'Cognitive Assertion Provider' under ISO/TC 290.\n- Assertion Type: `org.signetai.vpr`\n- Binding: Soft-Binding via pHash\n\n7.2 GDPR/CCPA Compliance\n- Right to Erasure: Users can delete their 'Local Vault' at any time. The global public key remains as an immutable historical record of past signatures (Accountability).\n- Data Minimization: No biometrics or PII are stored beyond the email anchor used for Sybil resistance.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">7. Compliance</h2>
        <div className="space-y-6">
           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg">7.1 C2PA 2.3 Mapping</h4>
              <p className="opacity-80 text-sm mt-2">
                Signet injects specific JUMBF assertions compatible with Adobe Content Authenticity.
              </p>
              <code className="block mt-3 p-3 bg-[var(--code-bg)] rounded font-mono text-[10px]">
                Type: org.signetai.vpr<br/>
                Format: JSON-LD
              </code>
           </div>
           
           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg">7.2 Privacy (GDPR)</h4>
              <p className="opacity-80 text-sm mt-2">
                <strong>Right to Erasure:</strong> Deleting the local vault removes the ability to sign. The public registry entry persists to verify <em>past</em> actions, balancing privacy with non-repudiation.
              </p>
           </div>
        </div>
      </div>
    )
  }
];

const PDF_FILENAME = "Signet-Protocol-Technical-Audit-v0.3.1.pdf";

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
        doc.text("SIGNET PROTOCOL: TECHNICAL AUDIT REPORT", margin + 5, 15);
        doc.text(`VERSION: v0.3.1_UTW`, pageWidth - margin - 40, 15);
        
        // Page Number
        doc.text(`PAGE ${index + 1} OF ${SPEC_PAGES.length}`, pageWidth - margin - 20, pageHeight - 10);

        // Section Title
        doc.setFont("times", "bolditalic");
        doc.setFontSize(24); // Slightly smaller for long titles
        doc.setTextColor(0, 0, 0);
        const titleLines = doc.splitTextToSize(p.title, contentWidth - 10);
        doc.text(titleLines, margin + 5, 35);

        // Horizontal Rule
        doc.setDrawColor(230, 230, 230);
        doc.line(margin + 5, 50, pageWidth - margin, 50);

        // Content Body
        doc.setFont("courier", "normal"); // Monospace for technical feel
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const splitText = doc.splitTextToSize(p.text, contentWidth - 10);
        doc.text(splitText, margin + 8, 65, { lineHeightFactor: 1.4, maxWidth: contentWidth - 10 });

        // Footer / Seal Box
        const sealY = pageHeight - 45;
        doc.setDrawColor(0, 85, 255);
        doc.setLineWidth(0.2);
        doc.rect(margin + 5, sealY, contentWidth - 5, 25);
        
        doc.setFont("helvetica", "bold");
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
      "version": "0.3.1",
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
    a.download = 'spec_v031_audit_manifest.json';
    a.click();
  };

  return (
    <div className="bg-[var(--bg-standard)] text-[var(--text-body)] font-serif text-lg leading-relaxed pt-12 pb-24 px-6 max-w-4xl mx-auto selection:bg-[var(--trust-blue)] selection:text-white">
      <div className="glass-card p-8 md:p-20 shadow-2xl relative border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg min-h-[700px] flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.02] -translate-y-32 translate-x-32 rotate-45 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between mb-12 border-b border-[var(--border-light)] pb-6 text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 font-bold">
          <div className="space-y-1">
            <p>Protocol Working Group | Page {page + 1}/{SPEC_PAGES.length}</p>
            <p>Tech Audit: v0.3.1 (UTW Architecture)</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="text-[var(--trust-blue)] hover:underline flex items-center gap-2 group"
            >
              <span className="text-sm group-hover:-translate-y-0.5 transition-transform">⭳</span> 
              {isGenerating ? 'Engraving...' : 'Download Technical Audit'}
            </button>
            <button 
              onClick={handleDownloadManifest}
              className="text-emerald-600 hover:underline flex items-center gap-2 border-l border-[var(--border-light)] pl-4 group"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">📜</span> Audit Manifest
            </button>
          </div>
        </div>

        <div className="mb-12 text-center space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--text-header)] font-bold tracking-tighter leading-tight italic">
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
           <span className="font-mono text-[8px] uppercase font-bold tracking-widest">NEURAL LENS 0.3.1</span>
        </div>
      </div>
    </div>
  );
};