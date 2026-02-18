
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const SPEC_PAGES = [
  {
    category: "NARRATIVE STRATEGY",
    title: "1. The Crisis of Trust (Manifesto)",
    text: "Building on warnings from organizations such as the Europol Innovation Lab, many analysts expect synthetic and AI-assisted media to constitute a dominant share of newly created online content by the mid-to-late 2020s. While precise global percentages are uncertain, the overall trajectory suggests that a substantial majority of future internet content will involve generative systems.\n\nSignet Protocol proposes a new axiom: Verifiable Proof of Reasoning (VPR).\n\nIn alignment with ISO/TC 290 (Online Reputation), VPR serves as a critical defense against 'Reputation Poisoning'. By binding the 'Public Reasoning Graph (PRG)'—a post-hoc, declarative representation of the logic flow—to the final asset, we create a permanent link between the prompt and the result. This graph is distinct from the model's private chain-of-thought, serving strictly as an audit artifact.\n\nDefinition: Public Reasoning Graph (PRG)\nThe PRG is a structured, declarative representation of the rationale asserted for an output. It is NOT a raw model chain-of-thought or latent internal state. Instead, the PRG IS a post-hoc, auditable justification graph cryptographically bound to the VPR manifest.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">1. The Crisis of Trust</h2>
        <p className="opacity-80 leading-loose text-justify">
          Building on warnings from organizations such as the <strong>Europol Innovation Lab</strong>, many analysts expect synthetic and AI-assisted media to constitute a <strong>dominant share</strong> of newly created online content by the mid-to-late 2020s.
        </p>
        <p className="opacity-80 leading-loose text-justify">
          While precise global percentages are uncertain, the overall trajectory suggests that a substantial majority of future internet content will involve generative systems, fundamentally reshaping how online information is produced, distributed, and trusted.
        </p>
        <div className="p-6 bg-[var(--admonition-bg)] border-l-4 border-[var(--trust-blue)] space-y-4">
           <p className="font-serif italic text-lg text-[var(--text-header)]">
             "We are not building a tool. We are building the infrastructure for the preservation of objective reality."
           </p>
           <div className="pt-4 border-t border-[var(--trust-blue)]/20">
             <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">Definition: Public Reasoning Graph (PRG)</h4>
             <div className="text-xs opacity-80 leading-relaxed space-y-3">
               <p>The PRG is a structured, declarative representation of the rationale asserted for an output. <strong>It is NOT:</strong></p>
               <ul className="list-disc pl-4 space-y-1">
                 <li>A raw model chain-of-thought or latent internal state.</li>
                 <li>A claim about how a model "actually reasoned" (mechanistic interpretability).</li>
                 <li>An exposure of proprietary AI weights.</li>
               </ul>
               <p><strong>Instead, the PRG IS:</strong></p>
               <ul className="list-disc pl-4 space-y-1">
                 <li>A post-hoc, auditable justification graph.</li>
                 <li>Cryptographically bound to the VPR manifest.</li>
                 <li>A machine-verifiable structure linking assertions to outputs.</li>
               </ul>
             </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "NARRATIVE STRATEGY",
    title: "2. Protocol Architecture (4 Layers)",
    text: "The Signet Pipeline consists of four distinct verification layers:\n\nL1: Vision Substrate (The DNA)\nCryptographic binding of the initial prompt and intent ingredients.\n\nL2: Neural Lens (The PRG)\nJUMBF encapsulation of the Public Reasoning Graph. This is the claimed logic path.\n\nL3: Reality Check (Drift Audit & Threat Model)\nDeterministic probing of the output against the PRG. \n- Detects: Hallucinations, logic breaks.\n- Does Not Detect: Malicious but internally consistent reasoning.\n\nL4: Human Seal (Accountability)\nFinal Ed25519 signature. The Curator must select an attestation mode:\n1. Intent Seal: 'I intended this result.'\n2. Review Seal: 'I reviewed this result.'\n3. Authority Seal: 'I take liability for this.'\n\nISO/NIST Threat Model (v0.3.1):\n- T1 Provenance Stripping: Mitigated by Universal Tail-Wrap + Signature Binding (Risk: Low)\n- T2 Manifest Tampering: Mitigated by Ed25519 Signature Sealing (Risk: Low)\n- T4 Hallucinated Reasoning: Mitigated by L3 Drift Audit + L4 Human Seal (Risk: Medium)\n- T6 Clean-Slate Attack: Mitigated by Soft-Binding (pHash) + Registry Match (Risk: Medium)\n- T8 Authority Impersonation: Mitigated by Ed25519 Identity Anchoring (Risk: Low)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">2. Protocol Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
             <h4 className="font-bold text-[var(--trust-blue)] mb-2">L1: Vision Substrate</h4>
             <p className="text-xs opacity-70">Binding of prompt/intent ingredients.</p>
           </div>
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
             <h4 className="font-bold text-[var(--trust-blue)] mb-2">L2: Public Reasoning Graph</h4>
             <p className="text-xs opacity-70">Declarative map of logic steps (PRG).</p>
           </div>
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
             <h4 className="font-bold text-[var(--trust-blue)] mb-2">L3: Reality Check</h4>
             <p className="text-xs opacity-70">Drift Audit (Probabilistic Detection).</p>
           </div>
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
             <h4 className="font-bold text-[var(--trust-blue)] mb-2">L4: Human Seal</h4>
             <p className="text-xs opacity-70">Attestation Modes: Intent, Review, Authority.</p>
           </div>
        </div>
        
        <div className="mt-8">
           <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-4">ISO/NIST Threat Model (v0.3.1)</h5>
           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <table className="w-full text-[10px] text-left">
               <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                   <th className="p-2 font-bold">ID</th>
                   <th className="p-2 font-bold">Threat Vector</th>
                   <th className="p-2 font-bold">Mitigation</th>
                   <th className="p-2 font-bold">Residual Risk</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-2 font-mono">T1</td>
                   <td className="p-2">Provenance Stripping</td>
                   <td className="p-2">Universal Tail-Wrap + Signature Binding</td>
                   <td className="p-2 text-green-600 font-bold">Low</td>
                 </tr>
                 <tr>
                   <td className="p-2 font-mono">T2</td>
                   <td className="p-2">Manifest Tampering</td>
                   <td className="p-2">Ed25519 Signature Sealing</td>
                   <td className="p-2 text-green-600 font-bold">Low</td>
                 </tr>
                 <tr>
                   <td className="p-2 font-mono">T4</td>
                   <td className="p-2">Hallucinated Reasoning</td>
                   <td className="p-2">L3 Drift Audit + L4 Human Seal</td>
                   <td className="p-2 text-amber-600 font-bold">Medium</td>
                 </tr>
                 <tr>
                   <td className="p-2 font-mono">T6</td>
                   <td className="p-2">Clean-Slate Attack</td>
                   <td className="p-2">Soft-Binding (pHash) + Registry Match</td>
                   <td className="p-2 text-amber-600 font-bold">Medium</td>
                 </tr>
                 <tr>
                   <td className="p-2 font-mono">T8</td>
                   <td className="p-2">Authority Impersonation</td>
                   <td className="p-2">Ed25519 Identity Anchoring</td>
                   <td className="p-2 text-green-600 font-bold">Low</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "NORMATIVE STANDARD",
    title: "3. Seal Mode Schemas",
    text: "Defines the JSON schema for L4 Human Seals. \n\nSemantics:\n1. Intent Seal: 'I intended this result.' Establishes origin of intent. No claim of correctness. Used by Prompt Authors.\n\n2. Review Seal: 'I reviewed this result.' Confirms human inspection. Asserts reasonable diligence. Used by Editors/Moderators.\n\n3. Authority Seal: 'I take liability for this.' Strongest accountability. Highest trust-weight. Used by Publishers/Institutions.\n\nValidation Rule: A Seal MUST NOT be interpreted beyond its declared mode.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">3. Seal Mode Schemas</h2>
        
        <div className="grid grid-cols-1 gap-6">
           <div className="p-6 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-lg">
              <h4 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Mode 1: Intent Seal</h4>
              <p className="text-sm italic opacity-80 mb-2">"I intentionally initiated or directed the generation of this asset."</p>
              <ul className="list-disc pl-4 text-xs opacity-70 space-y-1">
                 <li><strong>Claims:</strong> Establishes origin of intent. No claim of correctness.</li>
                 <li><strong>Typical Use:</strong> Prompt authors, Commissioners.</li>
              </ul>
           </div>

           <div className="p-6 border-l-4 border-amber-500 bg-amber-500/5 rounded-r-lg">
              <h4 className="font-bold text-amber-600 uppercase text-xs tracking-widest mb-2">Mode 2: Review Seal</h4>
              <p className="text-sm italic opacity-80 mb-2">"I have reviewed this output and find it consistent with its stated intent."</p>
              <ul className="list-disc pl-4 text-xs opacity-70 space-y-1">
                 <li><strong>Claims:</strong> Confirms human inspection. Asserts reasonable diligence.</li>
                 <li><strong>Typical Use:</strong> Editors, Moderators, Curators.</li>
              </ul>
           </div>

           <div className="p-6 border-l-4 border-red-600 bg-red-600/5 rounded-r-lg">
              <h4 className="font-bold text-red-600 uppercase text-xs tracking-widest mb-2">Mode 3: Authority Seal</h4>
              <p className="text-sm italic opacity-80 mb-2">"I stand behind this output as authoritative within my declared role."</p>
              <ul className="list-disc pl-4 text-xs opacity-70 space-y-1">
                 <li><strong>Claims:</strong> Strongest accountability. Highest trust-weight.</li>
                 <li><strong>Typical Use:</strong> Publishers, Institutions, Certified Experts.</li>
              </ul>
           </div>
        </div>

        <div className="mt-8">
           <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">JSON Schema: Seal Object</h4>
           <div className="p-4 bg-[var(--code-bg)] border border-[var(--border-light)] rounded overflow-x-auto">
             <pre className="font-mono text-[10px] leading-relaxed">
{`{
  "seal": {
    "seal_id": "uuid-v4",
    "seal_mode": "intent | review | authority",
    "signer": {
      "anchor": "did:synet:abc123",
      "public_key": "ed25519:BASE64",
      "identity_claim": "string"
    },
    "scope": {
      "asset_hash": "sha256:HEX",
      "prg_hash": "sha256:HEX"
    },
    "timestamp": "ISO-8601",
    "signature": {
      "algorithm": "Ed25519",
      "value": "BASE64"
    }
  }
}`}
             </pre>
           </div>
           <p className="text-[10px] mt-4 font-bold text-red-500 uppercase tracking-widest">
             Critical: A Seal MUST NOT be interpreted beyond its declared mode.
           </p>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "4. Executive Summary & Abstract",
    text: "The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). \n\nUnlike traditional watermarking which focuses on asset attribution, Signet verifies the 'Reasoning DAG'—the logical chain of thought used to generate the output. \n\nThis document serves as a Technical Audit of the reference implementation hosted at signetai.io. It details the Client-Side PWA architecture, Zero-Copy memory management, Universal Tail-Wrap (UTW) injection strategy, and the Sovereign Identity capabilities utilizing Ed25519-256.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic underline underline-offset-8 decoration-1 decoration-neutral-500/30">4. Executive Summary</h2>
        <p className="indent-12 opacity-80 leading-loose text-justify">
          The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). 
          Unlike traditional watermarking which focuses on asset attribution, Signet verifies the <strong>"Public Reasoning Graph"</strong>—the logical chain of thought used to generate the output.
        </p>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "5. System Topology (Local-First)",
    text: "The Signet architecture strictly adheres to a 'Local-First' privacy model. \n\n4.1 Client-Side Execution\nAll cryptographic operations—Hashing (SHA-256), Key Generation (Ed25519), and Signing—occur exclusively within the user's browser (V8 Sandbox). \n\n4.2 Data Isolation\nPrivate Keys and Mnemonics are stored in the browser's IndexedDB ('IdentityVault') and are never transmitted over the network. \n\n4.3 Registry Sync\nOnly Public Keys and Identity Anchors are synchronized to the global Firestore registry. This ensures verifiable identity without custodial risk.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">5. System Topology</h2>
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
    title: "6. Cryptographic Implementation",
    text: "5.1 Algorithms\n- Signatures: Ed25519 (Edwards-curve Digital Signature Algorithm).\n- Hashing: SHA-256 (WebCrypto API).\n- Key Derivation: BIP-39 Mnemonic standard.\n\n5.2 Entropy Standards\nSignet enforces 'Sovereign Grade' entropy for Master Curators.\n- Dictionary: 2,048 words (2^11).\n- Mnemonic Length: 24 words.\n- Total Entropy: 24 * 11 = 264 bits.\n\nThis exceeds the 256-bit security floor of modern elliptic curves, rendering brute-force attacks computationally infeasible.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">6. Cryptography & Entropy</h2>
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
    title: "7. Universal Tail-Wrap (UTW)",
    text: "6.1 Definition\nUTW is a zero-dependency injection strategy for appending provenance data to binary files (PDF, MP4, WAV) without rewriting the internal file structure.\n\n6.2 Security Seal\nThe %SIGNET_VPR_START% token, the JSON payload, and the %SIGNET_VPR_END% marker are ALL included in the final Ed25519 signature calculation. This creates a tamper-evident seal; any attempt to strip the manifest or append a fake one invalidates the signature.\n\n6.3 Byte Layout\n[ORIGINAL_BINARY_DATA]\n[EOF_MARKER]\n[SIGNET_VPR_START]\n[JSON_MANIFEST_PAYLOAD]\n[SIGNET_VPR_END]",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">7. Universal Tail-Wrap (UTW)</h2>
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
    title: "8. Zero-Copy Streaming Engine",
    text: "7.1 The Problem\nLoading large assets (e.g., 2GB Video) into browser RAM (ArrayBuffer) causes crash loops on mobile devices.\n\n7.2 The Solution: Block-Chained Hashing\nSignet implements a stream reader that processes files in 5MB chunks. \nFormula: H(n) = SHA256( H(n-1) + Chunk(n) )\n\n7.3 Zero-Copy Composition\nThe final signed file is constructed using a Blob composition of pointers:\nconst final = new Blob([originalFileRef, signatureString]);\nThis requires O(1) memory overhead regardless of file size.",
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
    text: "8.1 Local Schema (IndexedDB)\nStore: 'IdentityVault'\nKeyPath: 'anchor'\nFields: { anchor, identity, publicKey, mnemonic (encrypted), timestamp, type }\n\n8.2 Global Schema (Firestore)\nCollection: 'identities'\nDocumentID: {anchor}\nFields: { identity, publicKey, ownerUid, provider, timestamp }\n\n8.3 Registry Reconstruction Strategy\nSignetAI acts as an aggregator, not a gatekeeper. Users SHOULD publish their public keys to external profiles (GitHub/LinkedIn/X). In the event of a database loss, the Global Registry can be rebuilt by crawling these verified social proofs.",
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
    text: "9.1 C2PA 2.3 Hard-Binding\nSignet implements mandatory 'Hard-Binding' via SHA-256 hashing of the raw asset byte stream (excluding the manifest). This hash is immutable and cryptographically bound to the reasoning assertions.\n\n9.2 Crypto-Agility (NIST CSWP 39)\nThe protocol is architected for algorithm agility. While Ed25519 is the current standard, the `signature.algorithm` field allows for seamless migration to Post-Quantum Cryptography (PQC) schemes (e.g., CRYSTALS-Dilithium) without breaking the Reasoning DAG structure.\n\n9.3 GDPR/CCPA\nRight to Erasure supported via Local Vault deletion.",
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
    title: "11. Traceability & Asset Retrieval",
    text: "10.1 The Persistence Paradox\nWhen a destructive 'in-place' edit occurs, the Vision Substrate (L1) is physically altered. To maintain the integrity of the Reasoning Chain, the protocol provides a mechanism to bridge the gap between the current modified state and the original source pixels.\n\n10.2 URI Pointer Architecture\nEvery Signet Manifest for a derived asset MUST contain an origin_reference block if the parent asset is not embedded. This includes the content hash (Hard-Binding), a URI locator (IPFS/HTTPS), and VPR continuity data.\n\n10.3 The 'Digital Negative' Recovery Flow\n1. Extract Manifest: Identify the origin_reference in the current UTW.\n2. Verify Integrity: Resolve the URI to locate the parent asset.\n3. Validate Hash: Perform a local hash of the retrieved parent asset and compare it against the parent_hash recorded in the manifest.\n4. Repeat: Continue this process recursively until a manifest is reached with origin_type: 'root' (the initial capture).",
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
    text: "11.1 Perceptual Fingerprint Layer\nTo protect the Trust Economy from 'Clean Slate' attacks, Signet implements a Soft-Binding layer. Unlike cryptographic hashes (SHA-256) which break if a single pixel changes, a Perceptual Hash (pHash) or Neural Fingerprint remains stable across resizing, compression, and metadata stripping.\n\n11.2 Conflict Resolution\nIf a stripped asset is resigned, the Registry uses visual matching (Hamming Distance) to identify the original Root Claim. The timestamped original (A1) takes precedence over the derived claim (B1), triggering a 'Stolen Heritage' flag.\n\nProtocol:\n- Priority of Claim: The Registry's timestamped record of A1 takes legal and technical precedence.\n- Flagging: The UI MUST display a 'Stolen Heritage' or 'Unverified Derivation' warning linking to A1.",
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
    category: "PROTOCOL GOVERNANCE",
    title: "13. Trust Economy & Penalties",
    text: "To discourage the stripping of provenance data, the Signet Protocol introduces Trust Score Attrition.\n\n12.1 Malicious Actor Penalties\nRepeated 'Clean Slate' signatures on assets found to be stripped versions of existing registry entries lead to Trust Score Decay. \n\nConsequences:\n- Automatic 'Low-Confidence' flags on all future content.\n- Exclusion from high-integrity distribution networks.\n\n12.2 Redemption & Decay\nPenalties follow a decay half-life of 90 days. Users may appeal via manual human review, ensuring the system remains equitable.",
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
    text: "13.1 The Principle of 'Amortized Trust'\nLong provenance chains increase file size. Signet solves this via Recursive Chain Compression.\n\n13.2 The Virtual Node\nWhen a chain reaches a defined threshold (e.g., 50 nodes), the protocol 'bakes' these blocks into a single Compressed Provenance Document (CPD). The asset's tail-wrap then stores only a single 'Virtual Node' containing the CPD Hash and Merkle Root. This allows O(1) file size growth while preserving the full cryptographic history.",
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
  },
  {
    category: "STRATEGIC ALIGNMENT",
    title: "15. ISO/TC 290 Strategy: The Ledger",
    text: "How to Pitch 'Compression' to ISO/TC 290.\n\nFrame it as 'Scalable Reputation Ledger for Synthetic Media'.\nThe Problem: Long-term online reputation generates massive metadata ('Data Gravity').\nThe Solution: Virtual Nodes keep asset files 'light' and performant for mobile/web while maintaining 'heavy' cryptographic proof in decentralized sidecars.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">15. ISO/TC 290 Strategy</h2>
        
        <p className="opacity-80 leading-loose mb-8">
          <strong>Strategic Framing:</strong> Shift language from "Infrastructure" to <strong>"Scalable Reputation Ledger"</strong> to align with auditability, neutrality, and composability standards.
        </p>

        <div className="overflow-hidden border border-[var(--border-light)] rounded-lg">
           <table className="w-full text-xs text-left">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                    <th className="p-4 font-bold text-[var(--text-header)]">Feature</th>
                    <th className="p-4 font-bold text-[var(--text-header)]">Linear Chain (Basic)</th>
                    <th className="p-4 font-bold text-[var(--trust-blue)]">Compressed Ledger (Signet)</th>
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
  },
  {
    category: "TRANSPARENCY & AUDIT",
    title: "16. Multimodal & Git Traceability",
    text: "The Signet Protocol specification is not static text; it is a living, version-controlled artifact. \n\n15.1 Git Provenance\nAll architectural decisions (ADRs), code changes, and protocol updates are cryptographically traced in our public repository: https://github.com/shengliangsong-ai/signetai.\n\n15.2 AI-Generated Synthesis\nWe utilize Google's NotebookLM to autonomously generate high-level audio/video summaries of this very specification. This circular feedback loop—where the spec generates its own explainer material—validates our 'Cognitive Provenance' thesis.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">16. Multimodal Audit</h2>
        
        <div className="space-y-6">
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-xl">🐙</span> Git Provenance
              </h4>
              <p className="text-sm opacity-70 mb-4">
                Full commit history and architectural evolution are public.
              </p>
              <a href="https://github.com/shengliangsong-ai/signetai" target="_blank" className="text-[var(--trust-blue)] hover:underline font-mono text-xs">
                github.com/shengliangsong-ai/signetai
              </a>
           </div>

           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
              <h4 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-xl">🎙️</span> NotebookLM Synthesis
              </h4>
              <p className="text-sm opacity-70 mb-4">
                Listen to the AI-generated "Deep Dive" podcast derived from this specification.
              </p>
              <a href="https://notebooklm.google.com/notebook/f21cb4f4-4193-4497-b1c3-5d0b25e3b56a" target="_blank" className="text-[var(--trust-blue)] hover:underline font-mono text-xs">
                notebooklm.google.com/notebook/f21cb...
              </a>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "SECURITY AUDIT",
    title: "17. Adversarial Analysis (Red Team)",
    text: "Adversarial review of protocol resilience against realistic attack vectors.\n\nGoal #1: 'Make Fake Content Look Legit'\nAttack: Generate synthetic content + fabricate a plausible PRG + self-sign.\nOutcome: Attack technically succeeds, but Trust Impact is limited due to L4 Human Seal accountability. (Defense: Good)\n\nGoal #2: 'Strip Provenance Without Detection'\nAttack: Remove UTW tail-wrap and redistribute asset.\nOutcome: Fails cryptographically. Verification tools report 'Unsigned'. (Defense: Strong)\n\nGoal #3: 'Rewrite History (Clean-Slate Attack)'\nAttack: Modify asset slightly, re-sign as original.\nOutcome: Partial success possible, but detectable via soft-binding (pHash) registry matching. (Defense: Medium)",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">17. Adversarial Analysis (Red Team)</h2>
        <div className="space-y-6">
           <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
              <h4 className="font-bold text-red-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #1: "Make Fake Content Look Legit"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Generate synthetic content + fabricate a plausible PRG + self-sign.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-green-600 font-bold">🛡️ Defense Strength: Good</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Mitigated by L4 Human Accountability. Trust score must be earned.</span>
              </div>
           </div>

           <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
              <h4 className="font-bold text-red-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #2: "Strip Provenance"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Remove UTW tail-wrap and redistribute asset.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-green-600 font-bold">🛡️ Defense Strength: Strong</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Cryptographic failure. Asset becomes "Unverified" immediately.</span>
              </div>
           </div>

           <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <h4 className="font-bold text-amber-600 mb-2 text-sm uppercase tracking-widest">Attacker Goal #3: "Rewrite History"</h4>
              <p className="text-xs opacity-70 mb-2"><strong>Attack:</strong> Modify asset slightly, re-sign as original.</p>
              <div className="flex items-center gap-3 text-xs">
                 <span className="text-amber-600 font-bold">🛡️ Defense Strength: Medium</span>
                 <span className="opacity-50">|</span>
                 <span className="opacity-80">Detectable via pHash Soft-Binding + Registry Collision.</span>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "SECURITY AUDIT",
    title: "18. Formal Security Considerations",
    text: "ISO/RFC style security assessment. Defines Integrity, Non-Repudiation, Tamper Evidence, and Key Sovereignty. Lists Out-of-Scope threats such as social engineering and coercion.\n\nKey Security Properties:\n- Integrity: Cryptographic signatures bind assets, reasoning, and seals. Any modification invalidates the signature.\n- Non-Repudiation: Ed25519 signatures provide strong proof of key possession at signing time.\n- Tamper Evidence: Universal Tail-Wrap ensures provenance removal is detectable by standard auditors.\n- Key Sovereignty: Private keys never leave the client environment. No custodial key escrow exists.\n\nOut-of-Scope Threats:\n- Collusion between malicious humans and AI systems.\n- Social engineering attacks on end-users.\n- Coercion or false legal claims by signatories.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">18. Formal Security Considerations</h2>
        <p className="text-sm opacity-80 leading-relaxed italic">
          The Signet Protocol enhances accountability and provenance. It does not guarantee factual correctness or prevent all forms of deception.
        </p>

        <div className="space-y-6">
           <div className="p-6 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-4">Key Security Properties</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Integrity</strong>
                    <p className="opacity-70">Cryptographic signatures bind assets, reasoning, and seals. Any modification invalidates the signature.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Non-Repudiation</strong>
                    <p className="opacity-70">Ed25519 signatures provide strong proof of key possession at signing time.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Tamper Evidence</strong>
                    <p className="opacity-70">Universal Tail-Wrap ensures provenance removal is detectable by standard auditors.</p>
                 </div>
                 <div>
                    <strong className="block mb-1 text-[var(--text-header)]">Key Sovereignty</strong>
                    <p className="opacity-70">Private keys never leave the client environment. No custodial key escrow exists.</p>
                 </div>
              </div>
           </div>

           <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded">
              <h4 className="font-mono text-[10px] uppercase font-bold text-amber-600 mb-2">Out-of-Scope Threats</h4>
              <ul className="list-disc pl-4 text-xs opacity-70 space-y-1">
                 <li>Collusion between malicious humans and AI systems.</li>
                 <li>Social engineering attacks on end-users.</li>
                 <li>Coercion or false legal claims by signatories.</li>
              </ul>
              <p className="mt-4 text-xs italic opacity-60">These are governance, legal, or societal issues rather than cryptographic ones.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "STRATEGIC AUDIT",
    title: "19. ISO Reviewer Q&A",
    text: "Simulated dialogue with ISO/TC 290 reviewers. Addresses Chain-of-Thought leakage, legal liability of seals, and protocol centralization risks.\n\nQ1: Are you claiming to expose or store AI chain-of-thought?\nAnswer: No. Signet records a Public Reasoning Graph (PRG), which is a declarative justification artifact. It is explicitly not a model’s internal reasoning state.\n\nQ2: Does a Human Seal imply legal liability?\nAnswer: No. Seal modes distinguish intent, review, and authority. Each conveys a different level of accountability and must not be interpreted beyond its declared scope.\n\nQ4: What prevents malicious users from signing false content?\nAnswer: Nothing—and this is intentional. Signet does not attempt to prevent deception; it ensures deception is attributable and auditable.\n\nQ6: What happens if your registry disappears?\nAnswer: The registry is reconstructible via public key anchors published externally (Github/X).",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">19. ISO Reviewer Q&A</h2>
        
        <div className="space-y-6">
           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q1: Are you claiming to expose or store AI chain-of-thought?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: No.</strong> Signet records a Public Reasoning Graph (PRG), which is a declarative justification artifact. It is explicitly not a model’s internal reasoning state and does not expose proprietary or private chain-of-thought data.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q2: Does a Human Seal imply legal liability?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: No.</strong> Seal modes distinguish intent, review, and authority. Each conveys a different level of accountability and must not be interpreted beyond its declared scope. Legal interpretation is jurisdiction-dependent.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q4: What prevents malicious users from signing false content?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer: Nothing—and this is intentional.</strong> Signet does not attempt to prevent deception; it ensures deception is attributable and auditable. Trust accrues over time, not by single signatures.
                 </p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="font-bold text-sm text-[var(--text-header)]">Q6: What happens if your registry disappears?</p>
              <div className="pl-4 border-l-2 border-[var(--trust-blue)]">
                 <p className="text-xs opacity-80 leading-relaxed">
                   <strong>Answer:</strong> The registry is reconstructible via public key anchors published externally (Github/X). The protocol is not dependent on a single operator.
                 </p>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "NORMATIVE STANDARD",
    title: "20. Formal Definitions",
    text: "Normative definitions to eliminate ambiguity and constrain interpretation.\n\n- Asset: A digital artifact subject to provenance attestation.\n- Public Reasoning Graph (PRG): A declarative, post-hoc representation of the asserted rationale linking inputs, constraints, intermediate claims, and outputs.\n- Verifiable Proof of Reasoning (VPR): A cryptographically bound package consisting of the Vision Substrate (L1), Public Reasoning Graph (L2), Drift Audit metadata (L3), and Human Seal(s) (L4).\n- Vision Substrate (L1): The structured representation of human intent, constraints, and objectives provided prior to or during asset generation.\n- Neural Lens (L2): The protocol layer responsible for constructing, serializing, and binding the Public Reasoning Graph to the asset.\n- Drift Audit (L3): A deterministic or probabilistic validation process that probes consistency between the PRG and the generated asset.\n- Human Seal (L4): A cryptographic signature applied by a verified human identity, asserting intent, review, or authority.\n- Universal Tail-Wrap (UTW): A zero-dependency method for appending provenance metadata to an asset without modifying its internal structure.\n- Virtual Node: A compressed provenance representation that aggregates multiple historical nodes into a single cryptographic commitment.\n- Trust Score: A dynamic reputation metric derived from historical behavior, seal usage, and conflict resolution outcomes.\n- Hard-Binding: Cryptographic binding of provenance to the exact byte representation of an asset (e.g., SHA-256 hash).\n- Soft-Binding (pHash): A perceptual fingerprint (using DCT or Wavelet transforms) that remains stable across resizing, compression, and format shifting. Similarity is measured via Hamming Distance thresholds (< 5).\n- Seal Mode: A normative classification defining the semantic meaning of a Human Seal (intent, review, authority).",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">20. Formal Definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
           <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-2">Asset</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A digital artifact (e.g., text, image, audio, video, software) subject to provenance attestation under the Signet Protocol.
              </p>
           </div>
           
           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Public Reasoning Graph (PRG)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A declarative, post-hoc representation of the asserted rationale linking inputs, constraints, intermediate claims, and outputs. The PRG is <strong>not</strong> an AI system’s internal chain-of-thought and does not expose proprietary or latent model states.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Verifiable Proof of Reasoning (VPR)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A cryptographically bound package consisting of the Vision Substrate (L1), Public Reasoning Graph (L2), Drift Audit metadata (L3), and Human Seal(s) (L4).
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Vision Substrate (L1)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                The structured representation of human intent, constraints, and objectives provided prior to or during asset generation.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Neural Lens (L2)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                The protocol layer responsible for constructing, serializing, and binding the Public Reasoning Graph to the asset.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Drift Audit (L3)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A deterministic or probabilistic validation process that probes consistency between the PRG and the generated asset to detect hallucination, omission, or logical divergence.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Human Seal (L4)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A cryptographic signature applied by a verified human identity, asserting intent, review, or authority over an asset within a declared scope.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Universal Tail-Wrap (UTW)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A zero-dependency method for appending provenance metadata to an asset without modifying its internal structure, while remaining cryptographically bound to the asset via Hard-Binding.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Virtual Node</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A compressed provenance representation that aggregates multiple historical nodes into a single cryptographic commitment to preserve scalability.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Trust Score</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A dynamic reputation metric derived from historical behavior, seal usage, and conflict resolution outcomes.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Hard-Binding</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                Cryptographic binding of provenance to the exact byte representation of an asset (e.g., SHA-256 hash). Any bit-level modification invalidates this binding.
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Soft-Binding (pHash)</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A perceptual fingerprint (using DCT or Wavelet transforms) that remains stable across resizing, compression, and format shifting. Similarity is measured via Hamming Distance thresholds (< 5).
              </p>
           </div>

           <div className="p-4 border-l-2 border-[var(--border-light)] bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Seal Mode</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                A normative classification defining the semantic meaning of a Human Seal. Valid values: <code>intent</code>, <code>review</code>, <code>authority</code>.
              </p>
           </div>
        </div>

        <div className="p-6 border-l-4 border-red-500 bg-red-500/5 mt-6">
           <h4 className="font-mono text-[10px] uppercase font-bold text-red-600 mb-2">Terminology Conventions</h4>
           <ul className="list-disc pl-4 text-xs opacity-80 leading-relaxed space-y-1">
             <li>MUST / MUST NOT / SHOULD / MAY are interpreted as defined in RFC 2119.</li>
             <li>"Reasoning" refers to asserted justification, not internal cognition.</li>
             <li>"Authority" is contextual and role-bound, not universal truth.</li>
           </ul>
        </div>
      </div>
    )
  },
  {
    category: "AUDIT FRAMEWORK",
    title: "21. Conformance Checklist",
    text: "Auditor-friendly verification matrix.\n\nCore Conformance (Mandatory):\n[ ] C-01 Assets MUST be hard-bound via cryptographic hash\n[ ] C-02 PRG MUST be serialized as a DAG\n[ ] C-03 PRG MUST be cryptographically bound to asset\n[ ] C-04 Human Seal MUST include seal_mode\n[ ] C-05 Private keys MUST remain client-side\n[ ] C-06 Signature MUST cover full UTW payload\n[ ] C-07 Verification MUST be possible offline\n\nSecurity & Resilience (Mandatory):\n[ ] S-01 Tampering invalidates signature\n[ ] S-02 Replay attacks are prevented by hard-binding\n[ ] S-03 Algorithm agility is supported\n[ ] S-04 Registry loss does not invalidate proofs\n\nGovernance & Trust (Recommended):\n[ ] G-01 Trust score decay implemented\n[ ] G-02 Clean-slate detection supported\n[ ] G-03 Seal modes enforced semantically\n[ ] G-04 Appeal or remediation path documented\n\nInteroperability (Optional):\n[ ] I-01 C2PA compatible hard-binding\n[ ] I-02 External identity anchors supported\n[ ] I-03 PQC readiness declared",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">21. Conformance Checklist</h2>
        
        <div className="space-y-8">
           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--trust-blue)]">
               Core Conformance (Mandatory)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-01</td>
                   <td className="p-3">Assets MUST be hard-bound via cryptographic hash</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-02</td>
                   <td className="p-3">PRG MUST be serialized as a DAG</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-03</td>
                   <td className="p-3">PRG MUST be cryptographically bound to asset</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-04</td>
                   <td className="p-3">Human Seal MUST include seal_mode</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-05</td>
                   <td className="p-3">Private keys MUST remain client-side</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-06</td>
                   <td className="p-3">Signature MUST cover full UTW payload</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">C-07</td>
                   <td className="p-3">Verification MUST be possible offline</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-green-600">
               Security & Resilience (Mandatory)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-01</td>
                   <td className="p-3">Tampering invalidates signature</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-02</td>
                   <td className="p-3">Replay attacks are prevented by hard-binding</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-03</td>
                   <td className="p-3">Algorithm agility is supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">S-04</td>
                   <td className="p-3">Registry loss does not invalidate proofs</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">
               Governance & Trust (Recommended)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-01</td>
                   <td className="p-3">Trust score decay implemented</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-02</td>
                   <td className="p-3">Clean-slate detection supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-03</td>
                   <td className="p-3">Seal modes enforced semantically</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">G-04</td>
                   <td className="p-3">Appeal or remediation path documented</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="border border-[var(--border-light)] rounded overflow-hidden">
             <div className="bg-[var(--table-header)] p-3 border-b border-[var(--border-light)] font-mono text-[10px] font-bold uppercase tracking-widest text-purple-600">
               Interoperability (Optional)
             </div>
             <table className="w-full text-[10px] text-left">
               <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-01</td>
                   <td className="p-3">C2PA compatible hard-binding</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-02</td>
                   <td className="p-3">External identity anchors supported</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
                 <tr>
                   <td className="p-3 font-mono opacity-50">I-03</td>
                   <td className="p-3">PQC readiness declared</td>
                   <td className="p-3 text-right font-bold">☐</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "TECHNICAL AUDIT",
    title: "Appendix A: Worked Example (MP4)",
    text: "A concrete example of a signed 30-second MP4 asset. \n\n1. Input Hash (SHA-256): e3b0...c442\n2. UTW Payload: %SIGNET_VPR_START% ... %SIGNET_VPR_END%\n3. Final Output: A valid MP4 file playable in VLC, with appended audit data.",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">Appendix A: MP4 Signing Example</h2>
        <div className="space-y-6">
           <div className="p-4 border border-[var(--border-light)] rounded bg-[var(--bg-standard)]">
              <h4 className="font-mono text-[10px] font-bold uppercase mb-2">1. Original Asset</h4>
              <code className="block text-xs font-mono bg-[var(--code-bg)] p-2 rounded">
                File: demo_clip.mp4<br/>
                Size: 15,400,000 bytes<br/>
                Hash: sha256:7f83b165... (Hash of raw video data)
              </code>
           </div>
           
           <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)] rounded-r">
              <h4 className="font-mono text-[10px] font-bold uppercase text-[var(--trust-blue)] mb-2">2. UTW Injection (Tail)</h4>
              <pre className="text-[10px] font-mono whitespace-pre-wrap">
{`... [EOF of MP4] ...
%SIGNET_VPR_START
{
  "type": "org.signetai.media_provenance",
  "asset": { "content_hash": "7f83b165..." },
  "signature": { "signer": "signetai.io:ssl", "sig": "ed25519:..." }
}
%SIGNET_VPR_END`}
              </pre>
           </div>

           <div className="p-4 border border-green-500/20 bg-green-500/5 rounded">
              <h4 className="font-mono text-[10px] font-bold uppercase text-green-600 mb-2">3. Verification Result</h4>
              <p className="text-xs opacity-80">
                The verifier slices the file at `byte_length`, hashes the video body, and matches it to `content_hash`. <br/>
                <strong>Status: VERIFIED (Deterministic)</strong>
              </p>
           </div>
        </div>
      </div>
    )
  },
  {
    category: "STRATEGIC COMM",
    title: "Appendix B: ISO Submission",
    text: "Draft submission letter for ISO/TC 290. Formally requests consideration of Signet Protocol v0.3.2 as a candidate contribution for digital trust and reputation systems.\n\nDear Members of ISO/TC 290,\n\nWe respectfully submit the Signet Protocol (v0.3.2) for consideration as a candidate contribution to ongoing work in online reputation, digital trust, and content authenticity.\n\nThe Signet Protocol addresses a growing gap in existing provenance standards: while current systems effectively attribute origin, they do not capture asserted reasoning, human intent, or accountable authorization behind AI-assisted content.\n\nKey characteristics of the proposal include:\n- A four-layer verification model separating intent, reasoning representation, drift analysis, and human accountability.\n- A local-first cryptographic architecture that preserves user sovereignty and privacy.\n- A scalable provenance compression mechanism enabling long-lived reputation without asset bloat.\n- Explicit differentiation between generation, review, and authority through sealed attestations.\n\nThe protocol is designed to complement, not replace, existing standards such as C2PA, and intentionally avoids claims about factual correctness or internal AI cognition.\n\nWe believe this work aligns with ISO/TC 290’s mission to support trustworthy digital reputation systems in an era of large-scale synthetic media, and we welcome technical review, critique, and collaborative refinement.\n\nThank you for your consideration.\n\nRespectfully submitted,\nSignet Protocol Project\nWorking Group: Neural Prism Implementation",
    content: (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-[var(--text-header)] font-serif text-2xl font-bold mb-6 italic">Appendix B: ISO/TC Submission Draft</h2>
        
        <div className="p-8 md:p-12 bg-white border border-[var(--border-light)] shadow-sm font-serif text-sm leading-relaxed text-black max-w-3xl mx-auto">
           <div className="mb-8 font-mono text-xs opacity-60">
             <p>To: Members of ISO/TC 290</p>
             <p>Subject: Submission for Consideration — Signet Protocol v0.3.2</p>
             <p>Date: {new Date().toLocaleDateString()}</p>
           </div>

           <div className="space-y-6">
             <p>Dear Members of ISO/TC 290,</p>
             
             <p>
               We respectfully submit the <strong>Signet Protocol (v0.3.2)</strong> for consideration as a candidate contribution to ongoing work in online reputation, digital trust, and content authenticity.
             </p>
             
             <p>
               The Signet Protocol addresses a growing gap in existing provenance standards: while current systems effectively attribute origin, they do not capture asserted reasoning, human intent, or accountable authorization behind AI-assisted content.
             </p>
             
             <p>Key characteristics of the proposal include:</p>
             <ul className="list-disc pl-6 space-y-2">
               <li>A four-layer verification model separating intent, reasoning representation, drift analysis, and human accountability.</li>
               <li>A local-first cryptographic architecture that preserves user sovereignty and privacy.</li>
               <li>A scalable provenance compression mechanism enabling long-lived reputation without asset bloat.</li>
               <li>Explicit differentiation between generation, review, and authority through sealed attestations.</li>
             </ul>

             <p>
               The protocol is designed to complement, not replace, existing standards such as C2PA, and intentionally avoids claims about factual correctness or internal AI cognition.
             </p>

             <p>
               We believe this work aligns with ISO/TC 290’s mission to support trustworthy digital reputation systems in an era of large-scale synthetic media, and we welcome technical review, critique, and collaborative refinement.
             </p>

             <p>Thank you for your consideration.</p>

             <div className="mt-12">
               <p>Respectfully submitted,</p>
               <br/>
               <p className="font-bold">Signet Protocol Project</p>
               <p className="text-xs font-mono opacity-60">Working Group: Neural Prism Implementation</p>
             </div>
           </div>
        </div>
      </div>
    )
  }
];

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const SpecView: React.FC = () => {
  const [activePage, setActivePage] = useState(0);

  const handleDownload = async () => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const pageWidth = width;
    const pageHeight = height;
    const margin = 20;

    // --- HELPER: FOOTER ---
    const addFooter = (pageNo: number, total: number) => {
        doc.setFont("times", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("MASTER SIGNATORY ATTESTATION | Authorized by: signetai.io:ssl | PROVENANCE_ROOT: SHA256:7B8C...44A2", margin, pageHeight - 10);
        doc.text(`Page ${pageNo} of ${total}`, pageWidth - margin - 20, pageHeight - 10);
        doc.setTextColor(0);
    };

    // --- HELPER: HEADER ---
    const addHeader = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text("SIGNET PROTOCOL v0.3.1_OFFICIAL", margin, 15);
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(margin, 18, pageWidth - margin, 18);
        doc.setTextColor(0);
        
        doc.setFont("times", "bolditalic");
        doc.setFontSize(12);
        doc.text(title, margin, 25);
    };

    // --- PAGE 1: COVER PAGE ---
    // Background - Clean White
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, width, height, 'F');
    
    // Attempt to load Banner Image
    try {
        const banner = await loadImage('/public/signetai_banner.png');
        // Calculate aspect ratio fit
        const imgProps = doc.getImageProperties(banner);
        const imgHeight = (width * imgProps.height) / imgProps.width;
        doc.addImage(banner, 'PNG', 0, 0, width, imgHeight); // Top banner
    } catch (e) {
        console.warn("Banner image failed to load, falling back to text header");
        // Fallback Logo Block
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, width, 80, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(60);
        doc.text("SA", margin, 60);
    }

    // Title Block
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "bold");
    doc.setFontSize(42);
    doc.text("SIGNET PROTOCOL", margin, 120);
    
    doc.setFontSize(24);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80); // Dark Gray
    doc.text("Verifiable Proof of Reasoning (VPR)", margin, 135);
    
    // Spec Details
    const coverMetaY = 200;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("VERSION 0.3.1", margin, coverMetaY);
    doc.setFont("helvetica", "normal");
    doc.text("ISO/TC 290 Alignment Draft", margin, coverMetaY + 7);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, coverMetaY + 14);
    doc.text("Classification: PUBLIC SPECIFICATION", margin, coverMetaY + 21);

    // Bottom Bar
    doc.setFillColor(0, 85, 255);
    doc.rect(0, height - 15, width, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("NEURAL PRISM IMPLEMENTATION GROUP - CONFIDENTIAL DRAFT", width/2, height - 6, { align: 'center' });

    // --- PAGE 2: PROLOG / DOCUMENT CONTROL ---
    doc.addPage();
    doc.setTextColor(0);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Document Control", margin, 40);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const metaY = 60;
    const metaGap = 10;
    
    const metaData = [
        ["Document ID:", "SPC-VPR-2026-003"],
        ["Version:", "0.3.1"],
        ["Status:", "Active Draft / Implementation Ready"],
        ["Date:", new Date().toLocaleDateString()],
        ["Author:", "Signet Protocol Group"],
        ["Master Signatory:", "signetai.io:ssl"],
        ["Format:", "PDF/A-3 (Archival)"]
    ];

    metaData.forEach((item, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(item[0], margin, metaY + (i * metaGap));
        doc.setFont("helvetica", "normal");
        doc.text(item[1], margin + 50, metaY + (i * metaGap));
    });

    doc.setLineWidth(0.5);
    doc.line(margin, 140, pageWidth - margin, 140);

    doc.setFont("times", "italic");
    doc.setFontSize(11);
    const abstract = "ABSTRACT: This document specifies the technical requirements for the Signet Protocol, a framework for ensuring the cryptographic provenance of AI-generated reasoning paths. It defines the schemas for JSON-LD manifests, Ed25519 identity binding, and Universal Tail-Wrap (UTW) injection strategies for binary assets.";
    const splitAbstract = doc.splitTextToSize(abstract, pageWidth - (margin * 2));
    doc.text(splitAbstract, margin, 155);

    addFooter(1, SPEC_PAGES.length + 4); 

    // --- PAGE 3: TABLE OF CONTENTS ---
    doc.addPage();
    addHeader("Table of Contents");
    
    let tocY = 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    SPEC_PAGES.forEach((page, i) => {
        if (tocY > pageHeight - 30) {
            doc.addPage();
            addHeader("Table of Contents (Cont.)");
            tocY = 40;
        }
        
        const title = page.title;
        const pageNum = (i + 4).toString(); 
        doc.text(title, margin, tocY);
        doc.text(pageNum, pageWidth - margin - 10, tocY, { align: 'right' });
        
        // Dot Leaders
        const titleWidth = doc.getTextWidth(title);
        const dotsStart = margin + titleWidth + 2;
        const dotsEnd = pageWidth - margin - 15;
        doc.setFontSize(10);
        doc.setTextColor(180);
        if (dotsEnd > dotsStart) {
            doc.text(".".repeat(Math.floor((dotsEnd - dotsStart) / 2)), dotsStart, tocY);
        }
        doc.setFontSize(11);
        doc.setTextColor(0);
        
        tocY += 10;
    });
    
    addFooter(2, SPEC_PAGES.length + 4);

    // --- CONTENT PAGES ---
    let currentPageNum = 3; 
    
    SPEC_PAGES.forEach((page, i) => {
        currentPageNum++;
        doc.addPage();
        addHeader(page.category);
        
        let cursorY = 40;
        
        // Section Title
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text(page.title, margin, cursorY);
        cursorY += 15;
        
        // Body Text
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.setLineHeightFactor(1.5);
        
        const splitBody = doc.splitTextToSize(page.text, pageWidth - (margin * 2));
        doc.text(splitBody, margin, cursorY);
        
        addFooter(currentPageNum, SPEC_PAGES.length + 4);
    });

    // --- BACK COVER ---
    doc.addPage();
    // Light Gray Background for Back Cover
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, width, height, 'F');
    
    // Barcode Simulation (Clean Black on Light)
    doc.setFillColor(0, 0, 0);
    const barcodeY = height / 2 - 20;
    const barcodeX = width / 2 - 60;
    for(let i=0; i<60; i++) {
        const w = Math.random() * 3 + 1;
        doc.rect(barcodeX + (i * 2.5), barcodeY, w, 40, 'F');
    }
    
    doc.setTextColor(50, 50, 50);
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.text("GENERATED BY: www.signetai.io", width/2, barcodeY + 55, { align: 'center' });
    doc.text(new Date().toISOString(), width/2, barcodeY + 65, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("SIGNED BY PUBLIC KEY:", width/2, barcodeY + 85, { align: 'center' });
    doc.setTextColor(0, 85, 255); // Trust Blue
    doc.text("ed25519:signet_v3.1_sovereign_5b98...8bdf9", width/2, barcodeY + 95, { align: 'center' });
    
    // --- SIGNATURE INJECTION (UTW) ---
    const pdfBuffer = doc.output('arraybuffer');
    
    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.document_provenance",
      "version": "0.3.1",
      "strategy": "POST_EOF_INJECTION",
      "asset": {
        "type": "application/pdf",
        "hash_algorithm": "SHA-256",
        "filename": "signet_spec_v0.3.1.pdf",
        "generated_by": "signetai.io"
      },
      "signature": {
        "signer": "signetai.io:ssl",
        "timestamp": new Date().toISOString(),
        "role": "MASTER_SIGNATORY",
        "note": "Self-signed specification artifact (UTW)"
      }
    };

    const injectionString = `
%SIGNET_VPR_START
${JSON.stringify(manifest, null, 2)}
%SIGNET_VPR_END
`;
    const encoder = new TextEncoder();
    const injectionBuffer = encoder.encode(injectionString);

    const combinedBuffer = new Uint8Array(pdfBuffer.byteLength + injectionBuffer.byteLength);
    combinedBuffer.set(new Uint8Array(pdfBuffer), 0);
    combinedBuffer.set(injectionBuffer, pdfBuffer.byteLength);

    const blob = new Blob([combinedBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "signet_spec_v0.3.1.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto border-v">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-80 space-y-8">
           <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-lg">
              <h3 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] mb-4 tracking-widest">Table of Contents</h3>
              <div className="space-y-1">
                 {SPEC_PAGES.map((page, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePage(i)}
                      className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-tight rounded transition-all ${activePage === i ? 'bg-[var(--trust-blue)] text-white font-bold' : 'text-[var(--text-body)] opacity-60 hover:opacity-100 hover:bg-[var(--bg-sidebar)]'}`}
                    >
                      {page.title.split('.')[0]}. {page.title.split('.')[1]}
                    </button>
                 ))}
              </div>
           </div>
           
           <button 
             onClick={handleDownload}
             className="w-full py-4 bg-[var(--text-header)] text-[var(--bg-standard)] font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
           >
             <span>⭳</span> Download PDF
           </button>
        </div>

        <div className="flex-1">
           <div className="mb-8 flex justify-between items-end border-b border-[var(--border-light)] pb-4">
              <div>
                <span className="font-mono text-[10px] text-[var(--trust-blue)] uppercase tracking-[0.3em] font-bold">{SPEC_PAGES[activePage].category}</span>
                <h1 className="text-4xl font-serif italic font-bold text-[var(--text-header)] mt-2">{SPEC_PAGES[activePage].title}</h1>
              </div>
              <span className="font-mono text-[10px] opacity-30">Page {activePage + 1} of {SPEC_PAGES.length}</span>
           </div>

           <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-[var(--text-body)] prose-headings:text-[var(--text-header)]">
              {SPEC_PAGES[activePage].content}
           </div>

           <div className="mt-16 flex justify-between pt-8 border-t border-[var(--border-light)]">
              <button 
                onClick={() => setActivePage(Math.max(0, activePage - 1))}
                disabled={activePage === 0}
                className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 disabled:opacity-20"
              >
                &larr; Previous
              </button>
              <button 
                onClick={() => setActivePage(Math.min(SPEC_PAGES.length - 1, activePage + 1))}
                disabled={activePage === SPEC_PAGES.length - 1}
                className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 disabled:opacity-20"
              >
                Next &rarr;
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
