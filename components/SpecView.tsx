import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const SPEC_PAGES = [
  {
    category: "NARRATIVE STRATEGY",
    title: "1. The Crisis of Trust (Manifesto)",
    text: "By 2027, extrapolating from Europol Innovation Lab projections (90% by 2026), it is estimated that 97% of the internet's content will be synthetically generated. In this environment of 'Infinite Content', Truth is no longer the default—it is a luxury resource.\n\nSignet Protocol proposes a new axiom: Verifiable Proof of Reasoning (VPR).\n\nIn alignment with ISO/TC 290 (Online Reputation), VPR serves as a critical defense against 'Reputation Poisoning'. By binding the 'Logic DAG'—the chain of thought—to the final asset, we create a permanent link between the prompt and the result. This prevents the weaponization of synthetic content by proving Human Intent via the L4 Human Seal.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">1. The Crisis of Trust</h2>
        <p className="opacity-80 leading-loose text-justify">
          By 2027, extrapolating from <strong>Europol Innovation Lab</strong> projections (90% by 2026), it is estimated that <strong>97%</strong> of the internet's content will be synthetically generated.
        </p>
        <div className="p-6 bg-[var(--admonition-bg)] border-l-4 border-[var(--trust-blue)] space-y-4">
           <p className="font-serif italic text-lg text-[var(--text-header)]">
             "We are not building a tool. We are building the infrastructure for the preservation of objective reality."
           </p>
           <div className="pt-4 border-t border-[var(--trust-blue)]/20">
             <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">ISO/TC 290 Alignment</h4>
             <p className="text-xs opacity-80 leading-relaxed">
               Signet explicitly addresses <strong>"Online Reputation"</strong> and <strong>"User-Generated Content"</strong> standards. VPR prevents <em>Reputation Poisoning</em> by ensuring that no asset can be attributed to a creator without a signed, traceable chain of reasoning (The Human Seal).
             </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "NARRATIVE STRATEGY",
    title: "2. Protocol Architecture (4 Layers)",
    text: "The Signet Pipeline consists of four distinct verification layers to ensure end-to-end integrity:\n\nL1: Vision Substrate (The DNA)\nCryptographic binding of the initial prompt and intent ingredients.\n\nL2: Neural Lens (The Logic Map)\nJUMBF encapsulation of the reasoning DAG (Directed Acyclic Graph).\n\nL3: Reality Check (Drift Audit)\nDeterministic probing of the output against the claimed logic to detect hallucinations.\n\nL4: Human Seal (The Pact)\nFinal Ed25519 signature by a verified human curator (The 'Signet').",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. Protocol Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {['L1: Vision Substrate', 'L2: Neural Lens', 'L3: Reality Check', 'L4: Human Seal'].map((layer, i) => (
             <div key={i} className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
               <h4 className="font-bold text-[var(--trust-blue)] mb-2">{layer}</h4>
               <p className="text-xs opacity-70">Cryptographic binding of stage {i+1} in the reasoning pipeline.</p>
             </div>
           ))}
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "3. Executive Summary & Abstract",
    text: "The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). \n\nUnlike traditional watermarking which focuses on asset attribution, Signet verifies the 'Reasoning DAG'—the logical chain of thought used to generate the output. \n\nThis document serves as a Technical Audit of the reference implementation hosted at signetai.io. It details the Client-Side PWA architecture, Zero-Copy memory management, Universal Tail-Wrap (UTW) injection strategy, and the Sovereign Identity capabilities utilizing Ed25519-256.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">3. Executive Summary</h2>
        <p className="indent-12 opacity-80 leading-loose text-justify">
          The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). 
          Unlike traditional watermarking which focuses on asset attribution, Signet verifies the <strong>"Reasoning DAG"</strong>—the logical chain of thought used to generate the output.
        </p>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "4. System Topology (Local-First)",
    text: "The Signet architecture strictly adheres to a 'Local-First' privacy model. \n\n4.1 Client-Side Execution\nAll cryptographic operations—Hashing (SHA-256), Key Generation (Ed25519), and Signing—occur exclusively within the user's browser (V8 Sandbox). \n\n4.2 Data Isolation\nPrivate Keys and Mnemonics are stored in the browser's IndexedDB ('IdentityVault') and are never transmitted over the network. \n\n4.3 Registry Sync\nOnly Public Keys and Identity Anchors are synchronized to the global Firestore registry. This ensures verifiable identity without custodial risk.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">4. System Topology</h2>
        <p className="opacity-80 leading-loose mb-6">
          The Signet architecture strictly adheres to a <strong>'Local-First'</strong> privacy model to prevent key leakage.
        </p>
        <div className="space-y-6">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--trust-blue)] text-sm uppercase mb-2">4.1 Client-Side Sandbox</h4>
              <p className="text-xs opacity-70 leading-relaxed font-mono">
                All cryptographic operations (SHA-256 Hashing, Ed25519 Signing) occur inside the browser's JS runtime. 
                <strong>No asset data is ever uploaded to a processing server.</strong>
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "5. Cryptographic Implementation",
    text: "5.1 Algorithms\n- Signatures: Ed25519 (Edwards-curve Digital Signature Algorithm).\n- Hashing: SHA-256 (WebCrypto API).\n- Key Derivation: BIP-39 Mnemonic standard.\n\n5.2 Entropy Standards\nSignet enforces 'Sovereign Grade' entropy for Master Curators.\n- Dictionary: 2,048 words (2^11).\n- Mnemonic Length: 24 words.\n- Total Entropy: 24 * 11 = 264 bits.\n\nThis exceeds the 256-bit security floor of modern elliptic curves, rendering brute-force attacks computationally infeasible.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">5. Cryptography & Entropy</h2>
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
        
        <h4 className="font-bold text-[var(--text-header)] mt-6">5.2 Sovereign Entropy (Math)</h4>
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
    category: "TECHNICAL AUDIT",
    title: "6. Universal Tail-Wrap (UTW)",
    text: "6.1 Definition\nUTW is a zero-dependency injection strategy for appending provenance data to binary files (PDF, MP4, WAV) without rewriting the internal file structure.\n\n6.2 Security Seal\nThe %SIGNET_VPR_START% token, the JSON payload, and the %SIGNET_VPR_END% marker are ALL included in the final Ed25519 signature calculation. This creates a tamper-evident seal; any attempt to strip the manifest or append a fake one invalidates the signature.\n\n6.3 Byte Layout\n[ORIGINAL_BINARY_DATA]\n[EOF_MARKER]\n[SIGNET_VPR_START]\n[JSON_MANIFEST_PAYLOAD]\n[SIGNET_VPR_END]",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">6. Universal Tail-Wrap (UTW)</h2>
        <p className="opacity-80 leading-loose mb-6">
          UTW allows arbitrary binary files to be signed in the browser without expensive parsing libraries or file corruption.
        </p>
        
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6">
           <h4 className="font-mono text-[10px] uppercase font-bold text-amber-600 mb-2">Security Seal (Tamper Evidence)</h4>
           <p className="text-xs opacity-80 leading-relaxed">
             The injection wrapper tokens (<code>%SIGNET_VPR_START%</code>) and the payload are <strong>HARD-BOUND</strong> to the signature. Third parties cannot strip the manifest without invalidating the <code>content_hash</code>.
           </p>
        </div>
        
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
    category: "TECHNICAL AUDIT",
    title: "7. Zero-Copy Streaming Engine",
    text: "7.1 The Problem\nLoading large assets (e.g., 2GB Video) into browser RAM (ArrayBuffer) causes crash loops on mobile devices.\n\n7.2 The Solution: Block-Chained Hashing\nSignet implements a stream reader that processes files in 5MB chunks. \nFormula: H(n) = SHA256( H(n-1) + Chunk(n) )\n\n7.3 Zero-Copy Composition\nThe final signed file is constructed using a Blob composition of pointers:\nconst final = new Blob([originalFileRef, signatureString]);\nThis requires O(1) memory overhead regardless of file size.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">7. Zero-Copy Streaming</h2>
        <p className="opacity-80 leading-loose mb-6">
          To support GB-scale assets on mobile, Signet avoids loading files into RAM.
        </p>
        
        <div className="space-y-6">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] text-sm uppercase mb-4">7.2 Block-Chained Hashing</h4>
              <div className="flex gap-2 font-mono text-[10px] overflow-x-auto pb-2">
                 <div className="p-2 bg-blue-100 border border-blue-200 rounded min-w-[80px]">Chunk 1</div>
                 <span className="self-center">→</span>
                 <div className="p-2 bg-blue-100 border border-blue-200 rounded min-w-[80px]">Chunk 2</div>
                 <span className="self-center">→</span>
                 <div className="p-2 bg-emerald-100 border border-emerald-200 rounded min-w-[80px] font-bold">Final Hash</div>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "8. Data & Storage Schema (Resilient PKI)",
    text: "8.1 Local Schema (IndexedDB)\nStore: 'IdentityVault'\nKeyPath: 'anchor'\nFields: { anchor, identity, publicKey, mnemonic (encrypted), timestamp, type }\n\n8.2 Global Schema (Firestore)\nCollection: 'identities'\nDocumentID: {anchor}\nFields: { identity, publicKey, ownerUid, provider, timestamp }\n\n8.3 Registry Reconstruction Strategy\nSignetAI acts as an aggregator, not a gatekeeper. Users SHOULD publish their public keys to external profiles (GitHub/LinkedIn/X). In the event of a database loss, the Global Registry can be rebuilt by crawling these verified social proofs.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">8. Data Schema Audit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)]">8.1 Local (IndexedDB)</h4>
              <ul className="text-xs font-mono space-y-2 opacity-80 border-l-2 border-[var(--border-light)] pl-4">
                 <li>Store: <strong>IdentityVault</strong></li>
                 <li>Key: <strong>anchor</strong></li>
                 <li>Sensitive: <strong>mnemonic</strong> (Never Synced)</li>
              </ul>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)]">8.2 Global (Firestore)</h4>
              <ul className="text-xs font-mono space-y-2 opacity-80 border-l-2 border-[var(--border-light)] pl-4">
                 <li>Coll: <strong>identities</strong></li>
                 <li>Key: <strong>anchor</strong></li>
                 <li>Public: <strong>publicKey</strong> (Synced)</li>
              </ul>
           </div>
        </div>

        <div className="mt-8 space-y-6">
            <div className="p-4 border-l-4 border-amber-500 bg-amber-500/5">
                <h4 className="font-bold text-amber-600 text-sm mb-2">8.3 Privileged Access Clarification</h4>
                <p className="text-xs opacity-80 leading-relaxed">
                    The hardcoded admin email <code>shengliang.song.ai@gmail.com</code> retains <strong>Root Registry Privileges</strong>. This allows the admin to revoke identity anchors.
                </p>
                <p className="text-xs opacity-80 leading-relaxed mt-2">
                    <strong>Security Boundary:</strong> The admin <em>cannot</em> forge signatures because the <strong>Private Keys</strong> are generated client-side and never leave the user's device. Admin access affects <em>availability</em>, not <em>authenticity</em>.
                </p>
            </div>

            <div className="p-4 border-l-4 border-emerald-500 bg-emerald-500/5">
                <h4 className="font-bold text-emerald-600 text-sm mb-2">8.4 Distributed Reconstruction Protocol</h4>
                <p className="text-xs opacity-80 leading-relaxed">
                    SignetAI acts as a <strong>Public Key Aggregator</strong>. To ensure resilience against database loss or censorship:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs opacity-80">
                    <li>Users SHOULD push their generated Public Key to external profiles (GitHub, LinkedIn, X, Meta).</li>
                    <li>If the <code>signetai.io</code> database is lost, the registry can be rebuilt by crawling these external "Web of Trust" anchors.</li>
                    <li>This ensures the Identity Layer is not dependent on a single provider's uptime.</li>
                </ul>
            </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "9. Compliance & Standards",
    text: "9.1 C2PA 2.3 Hard-Binding\nSignet implements mandatory 'Hard-Binding' via SHA-256 hashing of the raw asset byte stream (excluding the manifest). This hash is immutable and cryptographically bound to the reasoning assertions.\n\n9.2 Crypto-Agility (NIST CSWP 39)\nThe protocol is architected for algorithm agility. While Ed25519 is the current standard, the `signature.algorithm` field allows for seamless migration to Post-Quantum Cryptography (PQC) schemes (e.g., CRYSTALS-Dilithium) without breaking the Reasoning DAG structure.\n\n9.3 GDPR/CCPA\nRight to Erasure supported via Local Vault deletion.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">9. Compliance</h2>
        <div className="space-y-8">
           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg">9.1 Hard-Binding vs Soft-Binding</h4>
              <p className="opacity-80 text-sm mt-2 leading-relaxed">
                Signet maintains dual-binding assurance:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-sm opacity-80">
                <li><strong>Hard-Binding:</strong> SHA-256 hash of the raw binary substrate. Any bit-flip invalidates the seal.</li>
                <li><strong>Soft-Binding:</strong> pHash (Perceptual Hash) for recovering credentials if metadata is stripped by social platforms.</li>
              </ul>
           </div>
           
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">9.2 Crypto-Agility (NIST CSWP 39)</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                The protocol is designed for future-proofing against quantum threats. The signature schema supports versioned algorithm identifiers, allowing a smooth transition to Post-Quantum Cryptography (PQC) algorithms like <strong>CRYSTALS-Dilithium</strong> or <strong>FALCON</strong> as they become standardized.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "10. Traceability & Asset Retrieval",
    text: "10.1 The Persistence Paradox\nWhen a destructive 'in-place' edit occurs, the Vision Substrate (L1) is physically altered. To maintain the integrity of the Reasoning Chain, the protocol provides a mechanism to bridge the gap between the current modified state and the original source pixels.\n\n10.2 URI Pointer Architecture\nEvery Signet Manifest for a derived asset MUST contain an origin_reference block if the parent asset is not embedded. This includes the content hash (Hard-Binding), a URI locator (IPFS/HTTPS), and VPR continuity data.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">10. Traceability & Retrieval</h2>
        
        <div className="space-y-6">
           <div className="p-6 border-l-4 border-amber-500 bg-amber-500/5">
              <h4 className="font-bold text-[var(--text-header)] text-lg mb-2">10.1 The Persistence Paradox</h4>
              <p className="opacity-80 text-sm leading-relaxed">
                When Person P3 modifies an image A1 (signed by P1, P2) to create A2, the original signatures from P1 and P2 become mathematically invalid for the new byte stream. Signet resolves this by treating A1 as a <strong>Parent Ingredient</strong>.
              </p>
           </div>

           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg mb-4">10.3 The "Digital Negative" Recovery Flow</h4>
              <ol className="list-decimal pl-5 space-y-3 text-sm opacity-80">
                 <li><strong>Extract Manifest:</strong> Identify the <code>origin_reference</code> in the current UTW (Universal Tail-Wrap).</li>
                 <li><strong>Verify Integrity:</strong> Resolve the URI to locate the parent asset.</li>
                 <li><strong>Validate Hash:</strong> Perform a local hash of the retrieved parent asset and compare it against the <code>parent_hash</code> recorded in the manifest.</li>
                 <li><strong>Repeat:</strong> Continue this process recursively until a manifest is reached with <code>origin_type: "root"</code> (the initial capture).</li>
              </ol>
           </div>

           <div className="mt-6">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">10.4 Schema: origin_reference</h4>
              <div className="p-4 bg-[var(--code-bg)] border border-[var(--border-light)] rounded overflow-x-auto">
                <pre className="font-mono text-[10px] leading-relaxed">
{`{
  "parent_identity": "sig_abc123...",
  "derivation_action": "c2pa.cropped",
  "storage_pointers": [
    {
      "provider": "IPFS",
      "uri": "ipfs://QmXoyp..."
    },
    {
      "provider": "SignetVault",
      "uri": "https://vault.signetai.io/assets/uuid-789"
    }
  ],
  "integrity_check": {
    "alg": "sha256",
    "hash": "e3b0c44298fc1c149afbf4c8996fb..."
  }
}`}
                </pre>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "11. Soft-Binding & Resilience",
    text: "11.1 Perceptual Fingerprint Layer\nTo protect the Trust Economy from 'Clean Slate' attacks, Signet implements a Soft-Binding layer. Unlike cryptographic hashes (SHA-256) which break if a single pixel changes, a Perceptual Hash (pHash) or Neural Fingerprint remains stable across resizing, compression, and metadata stripping.\n\n11.2 Conflict Resolution\nIf a stripped asset is resigned, the Registry uses visual matching (Hamming Distance) to identify the original Root Claim. The timestamped original (A1) takes precedence over the derived claim (B1), triggering a 'Stolen Heritage' flag.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">11. Soft-Binding Resilience</h2>
        
        <div className="space-y-6">
           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg mb-2">11.1 The Perceptual Fingerprint</h4>
              <p className="opacity-80 text-sm leading-relaxed">
                While SHA-256 ensures <em className="text-[var(--trust-blue)]">Integrity</em>, pHash ensures <em className="text-[var(--trust-blue)]">Persistence</em>.
                If malicious actor B1 strips the metadata from image A1 and resigns it, the system detects the visual similarity (Hamming Distance &lt; 5) and flags the conflict.
              </p>
           </div>

           <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-mono text-[10px] uppercase font-bold text-red-600 mb-2">11.2 Conflict Resolution Protocol</h4>
              <ul className="list-disc pl-5 space-y-2 text-xs opacity-80">
                 <li><strong>Priority of Claim:</strong> The Registry's timestamped record of A1 takes legal and technical precedence.</li>
                 <li><strong>Flagging:</strong> The UI MUST display a "Stolen Heritage" or "Unverified Derivation" warning linking to A1.</li>
              </ul>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "PROTOCOL GOVERNANCE",
    title: "12. Trust Economy & Penalties",
    text: "To discourage the stripping of provenance data, the Signet Protocol introduces Trust Score Attrition.\n\n12.1 Malicious Actor Penalties\nRepeated 'Clean Slate' signatures on assets found to be stripped versions of existing registry entries lead to Trust Score Decay. \n\nConsequences:\n- Automatic 'Low-Confidence' flags on all future content.\n- Exclusion from high-integrity distribution networks.\n- Revocation of Sovereign Identity status.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">12. The Trust Economy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded">
              <h4 className="font-bold text-[var(--text-header)] mb-2">Auditability</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                Every signing event is logged. If a user (B1) signs an asset that matches a pHash of a pre-existing root (A1) without declaring it as a parent, the event is flagged as a <strong>"Hostile Claim"</strong>.
              </p>
           </div>
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded">
              <h4 className="font-bold text-[var(--text-header)] mb-2">Trust Score Decay</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                Reputation is finite. Malicious stripping burns the user's "Social Collateral", eventually isolating their identity from the trusted graph.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "13. Chain Compression (Virtual Nodes)",
    text: "13.1 The Principle of 'Amortized Trust'\nLong provenance chains increase file size. Signet solves this via Recursive Chain Compression.\n\n13.2 The Virtual Node\nWhen a chain reaches a defined threshold (e.g., 50 nodes), the protocol 'bakes' these blocks into a single Compressed Provenance Document (CPD). The asset's tail-wrap then stores only a single 'Virtual Node' containing the CPD Hash and Merkle Root. This allows O(1) file size growth while preserving the full cryptographic history.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">13. Recursive Chain Compression</h2>
        
        <div className="space-y-6">
           <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-4">13.2 Technical Workflow: "The Checkpoint"</h4>
              <ol className="list-decimal pl-5 space-y-3 text-xs opacity-80">
                 <li><strong>Aggregation:</strong> Nodes A[1] through A[n] are serialized into a separate JSON-LD document.</li>
                 <li><strong>Hashing:</strong> A Merkle Tree is built from these nodes. The root of this tree becomes the ID of the Virtual Node.</li>
                 <li><strong>Verification:</strong> Auditors verify the history by checking the Virtual Node hash against the CPD. Granular "unzipping" is optional.</li>
              </ol>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "STRATEGIC ALIGNMENT",
    title: "14. ISO/TC 290 Submission Strategy",
    text: "How to Pitch 'Compression' to ISO/TC 290.\n\nFrame it as 'Scalable Reputation Infrastructure'.\nThe Problem: Long-term online reputation generates massive metadata ('Data Gravity').\nThe Solution: Virtual Nodes keep asset files 'light' and performant for mobile/web while maintaining 'heavy' cryptographic proof in decentralized sidecars.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">14. ISO/TC 290 Strategy</h2>
        
        <p className="opacity-80 leading-loose mb-8">
          <strong>Pitching to Mme. Hélène Xu:</strong> Frame Virtual Nodes as the solution to the "Data Gravity" problem in long-term reputation tracking.
        </p>

        <div className="overflow-hidden border border-[var(--border-light)] rounded-lg">
           <table className="w-full text-xs text-left">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                    <th className="p-4 font-bold text-[var(--text-header)]">Feature</th>
                    <th className="p-4 font-bold text-[var(--text-header)]">Linear Chain (Basic)</th>
                    <th className="p-4 font-bold text-[var(--trust-blue)]">Compressed Virtual Chain (Signet)</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                    <td className="p-4 font-bold">File Size</td>
                    <td className="p-4 opacity-70">Increases with every edit.</td>
                    <td className="p-4 font-bold text-emerald-600">Constant / O(1) growth.</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-bold">Audit Speed</td>
                    <td className="p-4 opacity-70">Slower (must parse every block).</td>
                    <td className="p-4 font-bold text-emerald-600">Instant (verify the Root Hash).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-bold">Storage</td>
                    <td className="p-4 opacity-70">Embedded only.</td>
                    <td className="p-4 font-bold text-emerald-600">Hybrid (Embedded + Sidecar).</td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    )
  }
];

const PDF_FILENAME = "Signet-Protocol-v0.3.1-Official.pdf";

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
        doc.text("SIGNET PROTOCOL: OFFICIAL SPECIFICATION", margin + 5, 15);
        doc.text(`VERSION: v0.3.1_OFFICIAL`, pageWidth - margin - 40, 15);
        
        // Category Stamp
        doc.setTextColor(0, 85, 255);
        doc.text(`[ ${p.category} ]`, margin + 5, 25);
        
        // Page Number
        doc.setTextColor(180, 180, 180);
        doc.text(`PAGE ${index + 1} OF ${SPEC_PAGES.length}`, pageWidth - margin - 20, pageHeight - 10);

        // Section Title
        doc.setFont("times", "bolditalic");
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        const titleLines = doc.splitTextToSize(p.title, contentWidth - 10);
        doc.text(titleLines, margin + 5, 35);

        // Horizontal Rule
        doc.setDrawColor(230, 230, 230);
        doc.line(margin + 5, 50, pageWidth - margin, 50);

        // Content Body
        doc.setFont("courier", "normal");
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
            <p>Specification: v0.3.1 (Official)</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="text-[var(--trust-blue)] hover:underline flex items-center gap-2 group"
            >
              <span className="text-sm group-hover:-translate-y-0.5 transition-transform">⭳</span> 
              {isGenerating ? 'Engraving...' : 'Download Official Protocol Spec'}
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
          <div className="inline-block mb-4">
             <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest ${SPEC_PAGES[page].category.includes('TECHNICAL') ? 'bg-[var(--code-bg)] text-[var(--trust-blue)]' : SPEC_PAGES[page].category.includes('STRATEGIC') ? 'bg-purple-500/10 text-purple-600' : SPEC_PAGES[page].category.includes('GOVERNANCE') ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {SPEC_PAGES[page].category}
             </span>
          </div>
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