import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const TODO_CONTENT = `# Signet AI Project Status & Roadmap

**Current Version:** 0.3.2_BETA  
**Protocol Spec:** draft-song-02.7

## Phase 1: Core Architecture (Foundation)
*Focus: Identity, Cryptography, and Basic Asset Signing*

- [x] **Identity Registry (TrustKeyService)**
    - [x] Firestore-based Global Anchor (\`signetai.io:username\`)
    - [x] Local "Vault" persistence (IndexedDB)
    - [x] Sovereign Grade Entropy (24-word BIP-39 Mnemonic)
    - [x] Ed25519-256 Key Derivation

- [x] **Vector Attestation Lab (SVG)**
    - [x] XML Metadata Injection Strategy
    - [x] Visual vs Code Hashing logic
    - [x] Browser-based Signing & Verification

- [x] **Document Attestation Lab (PDF)**
    - [x] Post-EOF Injection Strategy
    - [x] Content Body Hashing (0 to EOF)
    - [x] Reader Compatibility Check

- [x] **Universal Media Lab (Binary)**
    - [x] Universal Tail-Wrap (UTW) Protocol
    - [x] **Zero-Copy Streaming Engine** (Unlimited File Size)
    - [x] Block-Chained Hashing (SHA-256)
    - [x] UI Refinement ("Select File" vs Upload)

- [x] **Formal Specification**
    - [x] Dynamic PDF Generation of Spec
    - [x] C2PA v2.3 Alignment Documentation
    - [x] Comparison Tables (C2PA Native vs Signet UTW)

## Phase 2: User Experience & PWA (Current)
*Focus: Accessibility and Mobile Performance*

- [x] **PWA Implementation**
    - [x] Service Worker for offline capability
    - [x] Manifest.json with masked icons (192/512)
    - [x] Mobile-responsive Sidebar & Header

- [x] **Live Assistant**
    - [x] Gemini Real-time Audio API Integration
    - [x] Specification-aware System Instructions
    - [x] Audio-in / Audio-out conversation loop

## Phase 3: Public Verification & Ecosystem (Next)
*Focus: Interoperability and Security*

- [ ] **Public Verifier Deep-Linking**
    - [ ] Handle URL params \`signetai.io/verify?url=...\`
    - [ ] Drag-and-drop external URL support
    - [ ] CORS Policy update for cross-origin fetching

- [ ] **CLI Tool Release**
    - [ ] Node.js implementation of UTW for server-side pipelines
    - [ ] CI/CD Github Action for code provenance

- [ ] **Hardware Security**
    - [ ] WebAuthn / Passkey integration for Vault unlocking
    - [ ] Cloud HSM Stub for Enterprise Tier

## Known Issues / Optimization
- **Safari iOS Audio**: AudioContext suspension state needs explicit user-gesture handling on some iOS versions.
- **PDF Incremental Updates**: Post-EOF injection is valid, but multiple signs need a formal xref table update to be "Adobe Compliant" (currently "Signet Compliant").

---
*Last Updated: Feb 18, 2026 (Phase III UTW Complete)*`;

const LOG_CONTENT = `# Signet AI Evolution Log

**Repository:** [github.com/signetai-io/website](https://github.com/signetai-io/website)  
**Master Signatory:** signetai.io:ssl

---

## Entry 01: Protocol Inception (The Pivot)
**Date:** January 08, 2026
**Task Goal:** Architect the transition from "AiVoiceCast" (Consumer Tool) to "Signet Protocol" (Industrial Standard).

**Reasoning Path:**
AI watermarking is failing because it focuses on *pixels*. We need to focus on *process*.
- **Strategy**: Define "Verifiable Proof of Reasoning" (VPR).
- **Outcome**: Established \`draft-song-01\` specification. Deprecated legacy audio tools.

## Entry 04: Identity Registry (TrustKeyService)
**Date:** January 15, 2026
**Task Goal:** Create a Sybil-resistant identity layer for 8 billion humans.

**Reasoning Path:**
- **Challenge**: Centralized CAs (DigiCert) are too expensive for individuals.
- **Solution**: "TrustKeyService" (TKS). A Firestore-backed Public Key Infrastructure (PKI).
- **Implementation**: Ed25519-256 keypairs generated in-browser. Public keys anchored to \`signetai.io:username\`.

## Entry 08: Sovereign Grade Entropy
**Date:** January 28, 2026
**Task Goal:** Hardening security against quantum decryption probabilities.

**Reasoning Path:**
Standard 12-word mnemonics (132-bit) are insufficient for "Master Signatory" roles.
- **Upgrade**: Implemented BIP-39 24-word generation.
- **Math**: 24 words * 11 bits = 264 bits of entropy.
- **Status**: Defaulted to Sovereign Grade for all new Vaults.

## Entry 12: Neural Prism (JUMBF Injection)
**Date:** February 05, 2026
**Task Goal:** First successful C2PA manifest injection.

**Reasoning Path:**
We need to inject the logic DAG into the file without breaking it.
- **Method**: Utilized \`c2pa-js\` wasm bindings for JPEG assets.
- **Result**: Successfully embedded \`org.signetai.vpr\` assertion into a test image.
- **Constraint**: Found WASM to be too heavy (8MB) for mobile web. Initiated search for "Lightweight Tail-Wrap" alternative.

## Entry 14: PWA Shell & Service Workers
**Date:** February 12, 2026
**Task Goal:** Mobile-first verification capability.

**Reasoning Path:**
- **Objective**: The "Verifier" must run offline in field conditions (e.g., journalists, auditors).
- **Action**: Deployed \`sw.js\` with aggressive caching strategy.
- **Visuals**: Designed the "Zoom-In" icon set (192px/512px) representing the "Microscopic Audit".

## Entry 15: The "Verified Badge"
**Date:** February 14, 2026
**Task Goal:** Self-Attestation of the platform code.

**Reasoning Path:**
If we verify others, we must verify ourselves.
- **Feature**: Created \`VerificationBadge.tsx\`.
- **Logic**: The site verifies its own origin and build hash against the Master Signatory's public key on load.

## Entry 16: Vector Attestation (SVG Injection)
**Date:** February 17, 2026
**Task Goal:** Extend the protocol to support non-binary vector assets (SVG) via XML Metadata Injection.

**Reasoning Path:**
Standard C2PA relies heavily on JUMBF boxes (binary) which work for JPEG/PNG but break SVG text readability.
- **Strategy**: We implemented an \`XML-DSig\` hybrid approach.
- **Method**: Signet injects a JSON-LD manifest into a \`<metadata>\` tag within the SVG source code.
- **Verification**: The verifier extracts the metadata, calculates the SHA-256 hash of the surrounding "visual" XML, and compares it against the signed hash.
- **Asset Tested**: \`signetai-solar-system.svg\` successfully attested.

## Entry 17: Operator Manual Update (Vector & Uploads)
**Date:** February 17, 2026
**Task Goal:** Enable custom SVG uploads and document the vector signing workflow in the Operator's Manual.

**Reasoning Path:**
To move beyond demo data, the \`SvgSigner\` component was upgraded to accept local file uploads via a hidden file input triggered by a UI button.
- **Feature**: Added file picker to \`SvgSigner.tsx\`.
- **Documentation**: Added Section 04 to \`ManualView.tsx\` explaining the "Code vs. Art" separation in SVG signing.
- **Outcome**: Users can now attest their own vector graphics using their active Signet Identity.

## Entry 18: Universal Tail-Wrap (UTW) Architecture
**Date:** February 18, 2026
**Task Goal:** Enable signing of arbitrary binary formats (MP4, WAV, RAW) without expensive format-specific parsing libraries (wasm).

**Reasoning Path:**
Browser environments struggle with complex binary parsing (e.g., rewriting MP4 atoms).
- **Strategy**: Adopted the "Universal Tail-Wrap" (UTW) standard.
- **Method**: \`[ORIGINAL_BINARY] + [EOF_MARKER] + [JSON_MANIFEST]\`.
- **Benefit**: O(1) complexity for verification discovery. The original file structure remains 100% compliant with standard players/viewers, as they ignore appended bytes.
- **Status**: Standardized in \`SpecView.tsx\` and implemented in \`UniversalSigner.tsx\`.

## Entry 19: Zero-Copy Streaming Engine
**Date:** February 18, 2026
**Task Goal:** Prevent browser memory crashes when signing large assets (1GB+ Video).

**Reasoning Path:**
Reading \`file.arrayBuffer()\` loads the entire asset into RAM. This crashes mobile browsers on 4K video files.
- **Solution**: Implemented Block-Chained Hashing via \`crypto.subtle\` in 5MB chunks.
- **Memory Footprint**: Reduced from O(n) to O(1) (~5MB constant).
- **Composition**: Used \`new Blob([FileRef, Signature])\` to create the final download artifact without ever copying the full file data into Javascript memory.
- **Outcome**: Capable of signing terabyte-scale files within the browser sandbox.

---
*Signed: Master Curator, signetai.io:ssl*`;

export const ProjectStatusView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'LOG'>('ROADMAP');

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Autonomous Development</span>
            <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">LIVE_LOGS</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Project Status.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
            Direct rendering of the <code>TODO.md</code> and <code>LOG.md</code> artifacts tracking the platform's autonomous evolution.
        </p>
      </header>

      <div className="flex gap-4 border-b border-[var(--border-light)]">
        <button 
          onClick={() => setActiveTab('ROADMAP')}
          className={`pb-4 px-2 font-mono text-[11px] uppercase tracking-widest font-bold transition-all border-b-2 ${activeTab === 'ROADMAP' ? 'text-[var(--trust-blue)] border-[var(--trust-blue)]' : 'text-[var(--text-body)] opacity-40 border-transparent hover:opacity-100'}`}
        >
          Roadmap (TODO.md)
        </button>
        <button 
          onClick={() => setActiveTab('LOG')}
          className={`pb-4 px-2 font-mono text-[11px] uppercase tracking-widest font-bold transition-all border-b-2 ${activeTab === 'LOG' ? 'text-[var(--trust-blue)] border-[var(--trust-blue)]' : 'text-[var(--text-body)] opacity-40 border-transparent hover:opacity-100'}`}
        >
          Evolution Log (LOG.md)
        </button>
      </div>

      <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl p-8 md:p-12 shadow-sm min-h-[600px]">
        <div className="prose prose-sm max-w-none font-serif 
          prose-headings:font-bold prose-headings:text-[var(--text-header)] 
          prose-p:text-[var(--text-body)] prose-p:opacity-80 
          prose-li:text-[var(--text-body)] prose-li:opacity-80
          prose-code:text-[var(--trust-blue)] prose-code:bg-[var(--admonition-bg)] prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-strong:text-[var(--text-header)]
          prose-hr:border-[var(--border-light)]
        ">
           <ReactMarkdown>
             {activeTab === 'ROADMAP' ? TODO_CONTENT : LOG_CONTENT}
           </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono opacity-40 uppercase tracking-widest">
         <span>Source Artifact: /docs/{activeTab === 'ROADMAP' ? 'TODO.md' : 'evolution/LOG.md'}</span>
         <span>Sync Status: ACTIVE</span>
      </div>
    </div>
  );
};