
import React from 'react';

export const PART_1 = [
  {
    category: "NARRATIVE STRATEGY",
    title: "1. The Crisis of Trust (Manifesto)",
    text: "Building on warnings from organizations such as the Europol Innovation Lab, many analysts expect synthetic and AI-assisted media to constitute a dominant share of newly created online content by the mid-to-late 2020s. While precise global percentages are uncertain, the overall trajectory suggests that a substantial majority of future internet content will involve generative systems.\n\nSignet Protocol proposes a new axiom: Verifiable Proof of Reasoning (VPR).\n\nIn alignment with ISO/TC 290 (Online Reputation), VPR serves as a critical defense against 'Reputation Poisoning'. By binding the 'Public Reasoning Graph (PRG)'—a post-hoc, declarative representation of the logic flow—to the final asset, we create a permanent link between the prompt and the result. This graph is distinct from the model's private chain-of-thought, serving strictly as an audit artifact.",
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
    text: "The Signet Pipeline consists of four distinct verification layers:\n\nL1: Vision Substrate (The DNA)\nCryptographic binding of the initial prompt and intent ingredients.\n\nL2: Neural Lens (The PRG)\nJUMBF encapsulation of the Public Reasoning Graph. This is the claimed logic path.\n\nL3: Reality Check (Drift Audit & Threat Model)\nDeterministic probing of the output against the PRG.\n\nL4: Human Seal (Accountability)\nFinal Ed25519 signature. The Curator must select an attestation mode:\n1. Intent Seal: 'I intended this result.'\n2. Review Seal: 'I reviewed this result.'\n3. Authority Seal: 'I take liability for this.'",
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
    text: "Defines the JSON schema for L4 Human Seals. \n\nSemantics:\n1. Intent Seal: 'I intended this result.' Establishes origin of intent. No claim of correctness. Used by Prompt Authors.\n\n2. Review Seal: 'I reviewed this result.' Confirms human inspection. Asserts reasonable diligence. Used by Editors/Moderators.\n\n3. Authority Seal: 'I take liability for this.' Strongest accountability. Highest trust-weight. Used by Publishers/Institutions.",
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
    text: "The Signet Protocol (v0.3.1) defines a decentralized framework for the cryptographic attestation of AI-generated reasoning paths (VPR). \n\nUnlike traditional watermarking which focuses on asset attribution, Signet verifies the 'Reasoning DAG'—the logical chain of thought used to generate the output.",
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
    text: "The Signet architecture strictly adheres to a 'Local-First' privacy model. \n\n4.1 Client-Side Execution\nAll cryptographic operations—Hashing (SHA-256), Key Generation (Ed25519), and Signing—occur exclusively within the user's browser (V8 Sandbox).",
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
    text: "5.1 Algorithms\n- Signatures: Ed25519 (Edwards-curve Digital Signature Algorithm).\n- Hashing: SHA-256 (WebCrypto API).\n- Key Derivation: BIP-39 Mnemonic standard.",
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
    text: "6.1 Definition\nUTW is a zero-dependency injection strategy for appending provenance data to binary files (PDF, MP4, WAV) without rewriting the internal file structure.\n\n6.3 Byte Layout\n[ORIGINAL_BINARY_DATA]\n[EOF_MARKER]\n[SIGNET_VPR_START]\n[JSON_MANIFEST_PAYLOAD]\n[SIGNET_VPR_END]",
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
                 %SIGNET_VPR_START
              </div>
              <div className="p-4 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-center">
                 [ JSON_MANIFEST_PAYLOAD ]
              </div>
              <div className="p-2 border border-[var(--trust-blue)] text-[var(--trust-blue)] text-center rounded font-bold">
                 %SIGNET_VPR_END
              </div>
           </div>
        </div>
      </div>
    )
  }
];
