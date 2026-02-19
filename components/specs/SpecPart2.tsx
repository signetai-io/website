
import React from 'react';

export const PART_2 = [
  {
    category: "TECHNICAL AUDIT",
    title: "8. Zero-Copy Streaming Engine",
    text: "7.1 The Problem\nLoading large assets (e.g., 2GB Video) into browser RAM (ArrayBuffer) causes crash loops on mobile devices.\n\n7.2 The Solution: Block-Chained Hashing\nSignet implements a stream reader that processes files in 5MB chunks. \nFormula: H(n) = SHA256( H(n-1) + Chunk(n) )",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">8. Zero-Copy Streaming</h2>
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
    title: "9. Data & Storage Schema (Resilient PKI)",
    text: "8.1 Local Schema (IndexedDB)\nStore: 'IdentityVault'\nKeyPath: 'anchor'\nFields: { anchor, identity, publicKey, mnemonic (encrypted), timestamp, type }\n\n8.2 Global Schema (Firestore)\nCollection: 'identities'\nDocumentID: {anchor}\nFields: { identity, publicKey, ownerUid, provider, timestamp }",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">9. Data Schema Audit</h2>
        
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
    title: "10. Compliance & Standards",
    text: "9.1 C2PA 2.3 Hard-Binding\nSignet implements mandatory 'Hard-Binding' via SHA-256 hashing of the raw asset byte stream (excluding the manifest). This hash is immutable and cryptographically bound to the reasoning assertions.\n\n9.2 Crypto-Agility (NIST CSWP 39)\nThe protocol is architected for algorithm agility.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">10. Compliance</h2>
        <div className="space-y-8">
           <div>
              <h4 className="font-bold text-[var(--text-header)] text-lg">9.1 Hard-Binding vs Soft-Binding</h4>
              <p className="opacity-80 text-sm mt-2 leading-relaxed">
                Signet maintains dual-binding assurance:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-sm opacity-80">
                <li><strong>Hard-Binding:</strong> SHA-256 hash of the raw binary substrate. Any bit-level modification invalidates the seal.</li>
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
    title: "11. Traceability & Asset Retrieval",
    text: "10.1 The Persistence Paradox\nWhen a destructive 'in-place' edit occurs, the Vision Substrate (L1) is physically altered. To maintain the integrity of the Reasoning Chain, the protocol provides a mechanism to bridge the gap between the current modified state and the original source pixels.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">11. Traceability & Retrieval</h2>
        
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
    title: "12. Soft-Binding & Resilience",
    text: "11.1 Perceptual Fingerprint Layer\nTo protect the Trust Economy from 'Clean Slate' attacks, Signet implements a Soft-Binding layer. Unlike cryptographic hashes (SHA-256) which break if a single pixel changes, a Perceptual Hash (pHash) or Neural Fingerprint remains stable across resizing, compression, and metadata stripping.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">12. Soft-Binding Resilience</h2>
        
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
    category: "TECHNICAL AUDIT",
    title: "12.5 The Difference Engine (Audit Scoring)",
    text: "12.5.1 The Difference Engine (formerly Audit Engine)\nMoving beyond binary 'Truth' verification, Signet 0.3.3 introduces the Difference Engine.\n\nCore Concept: Source A vs Source B\nInstead of verifying a single asset against a registry, the engine calculates the perceptual and temporal distance between a Reference (Source A) and a Candidate (Source B).\n\nDifference Bands (Δ):\n0-30: MINIMAL DIFFERENCE (Match)\n30-120: LOW DIFFERENCE (Consistent)\n120-300: MODERATE DIFFERENCE (Modified)\n>300: HIGH DIFFERENCE (Distinct)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">12.5 The Difference Engine</h2>
        
        <p className="opacity-80 leading-loose mb-6">
          To accommodate a decentralized web where "Truth" is relative to the observer, Signet introduces the <strong>Difference Engine</strong>. This module quantifies the <em>distance</em> between two assets (Source A vs Source B) rather than asserting absolute validity.
        </p>

        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg mb-8">
           <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">12.5.1 Dual-Hash Fusion Algorithm</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono opacity-80">
              <div className="p-3 border border-[var(--border-light)] rounded bg-white/5">
                 <strong>dHash (0.6 weight)</strong><br/>
                 Tracks gradient structure. Resistant to brightness/contrast shifts.
              </div>
              <div className="p-3 border border-[var(--border-light)] rounded bg-white/5">
                 <strong>pHash (0.4 weight)</strong><br/>
                 Tracks luminance frequency. Resistant to scaling/compression.
              </div>
           </div>
        </div>

        <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg mb-8">
           <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">12.5.2 Pairwise Comparison Logic</h4>
           <p className="text-xs opacity-80 mb-3">The engine allows users to define their own <strong>Reference (Source A)</strong>, such as a YouTube Playlist or original broadcast, against which <strong>Candidates (Source B)</strong> are measured.</p>
           <ul className="list-disc pl-4 text-xs opacity-70 font-mono space-y-1">
              <li><strong>Dynamic Anchors:</strong> Temporal anchors are generated on-the-fly from Source A's duration.</li>
              <li><strong>Neutral Scoring:</strong> The system reports <code>Δ (Delta)</code> instead of "Pass/Fail".</li>
           </ul>
        </div>

        <h4 className="font-bold text-[var(--text-header)] text-lg mb-4">Difference Bands (Δ)</h4>
        <div className="space-y-2">
           {[
             { band: "0 - 30", label: "MINIMAL DIFFERENCE (Match)", desc: "Perceptually identical. Bit-perfect or negligible drift.", color: "bg-emerald-500" },
             { band: "30 - 120", label: "LOW DIFFERENCE (Consistent)", desc: "Transcoding artifacts (YouTube/compression) detected but structurally consistent.", color: "bg-blue-500" },
             { band: "120 - 300", label: "MODERATE DIFFERENCE (Modified)", desc: "Valid derivation (cropping, filters, text overlay) or significant compression.", color: "bg-amber-500" },
             { band: "> 300", label: "HIGH DIFFERENCE (Distinct)", desc: "Fundamental disconnect. Different content or deep modification.", color: "bg-red-500" }
           ].map((b, i) => (
             <div key={i} className="flex items-center gap-4 p-3 border-b border-[var(--border-light)]">
                <div className={`w-24 font-mono text-xs font-bold ${b.color.replace('bg-', 'text-')}`}>{b.band}</div>
                <div className="flex-1">
                   <strong className="block text-sm text-[var(--text-header)]">{b.label}</strong>
                   <span className="text-xs opacity-60">{b.desc}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${b.color}`}></div>
             </div>
           ))}
        </div>
      </div>
    )
  },
  {
    category: "PROTOCOL GOVERNANCE",
    title: "13. Trust Economy & Penalties",
    text: "To discourage the stripping of provenance data, the Signet Protocol introduces Trust Score Attrition.\n\n12.1 Malicious Actor Penalties\nRepeated 'Clean Slate' signatures on assets found to be stripped versions of existing registry entries lead to Trust Score Decay.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">13. The Trust Economy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded">
              <h4 className="font-bold text-[var(--text-header)] mb-2">Auditability</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                Every signing event is logged. If a user (B1) signs an asset that matches a pHash of a pre-existing root (A1) without declaring it as a parent, the event is flagged as a <strong>"Hostile Claim"</strong>.
              </p>
           </div>
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded">
              <h4 className="font-bold text-[var(--text-header)] mb-2">Remediation Path</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                Trust Score Attrition has a <strong>half-life of 90 days</strong>. Users can rehabilitate their score through consistent, verifiable behavior or manual appeal.
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "14. Chain Compression (Virtual Nodes)",
    text: "13.1 The Principle of 'Amortized Trust'\nLong provenance chains increase file size. Signet solves this via Recursive Chain Compression.\n\n13.2 The Virtual Node\nWhen a chain reaches a defined threshold (e.g., 50 nodes), the protocol 'bakes' these blocks into a single Compressed Provenance Document (CPD).",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">14. Recursive Chain Compression</h2>
        
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
  }
];
