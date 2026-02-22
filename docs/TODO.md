
# Signet AI Project Status & Roadmap

**Current Version:** 0.3.3_UTW  
**Protocol Spec:** v0.3.2

## Phase 1: Core Architecture (Foundation)
*Focus: Identity, Cryptography, and Basic Asset Signing*

- [x] **Identity Registry (TrustKeyService)**
    - [x] Firestore-based Global Anchor (`signetai.io:username`)
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
    - [x] **Deep Hash Verification** (Content Slicing)
    - [x] MP4 sample-frame metadata embedding (1 frame/min, +7s offset)
    - [x] Auto-verify on signed file load/sign complete
    - [x] YouTube OAuth resumable upload + metadata/comment publishing
    - [x] **Batch Telemetry** (Throughput/Velocity Metrics)

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

- [x] **Public Verifier Deep-Linking**
    - [x] Handle URL params `signetai.io/#verify?url=...`
    - [x] Drag-and-drop external URL support
    - [x] CORS Policy update for cross-origin fetching

- [x] **Batch Processor (GUI)**
    - [x] Recursive Directory Scanning (Discovery)
    - [x] Sidecar (.json) Generation & Verification
    - [x] Embedded (UTW) Verification with Slicing
    - [x] Hash-mode parity with Universal Signer (`SHA256_BLOCK_CHAINED` / `SHA256_FULL`)
    - [x] MP4 audit columns (frames checked, pHash preview, final hash, audit detail)
    - [x] Per-row `Open Report` handoff to `/#universal-lab` Universal Integrity Verified view

- [ ] **Resilience Layer (Soft-Binding)**
    - [ ] **Client-side pHash** calculation (WASM/JS) for Images
    - [ ] Audio Fingerprinting (Chromaprint/AcoustID) for WAV/MP3
    - [ ] Visual Duplicate Detection in Batch Verifier
    - [ ] Registry lookup for stripped assets (Recovery)

- [x] **CLI Tool Release**
    - [x] Node.js implementation of UTW for server-side pipelines
    - [ ] CI/CD Github Action for code provenance

- [ ] **Hardware Security**
    - [ ] WebAuthn / Passkey integration for Vault unlocking
    - [ ] Cloud HSM Stub for Enterprise Tier

## Known Issues / Optimization
- **PDF Incremental Updates**: Post-EOF injection is valid, but multiple signs need a formal xref table update to be "Adobe Compliant" (currently "Signet Compliant").
- **YouTube Browser Frame Limits**: The `/verify` browser flow remains thumbnail-anchor based for YouTube sources (soft-binding), not arbitrary decoded frame extraction.

---
*Last Updated: Feb 22, 2026 (Batch MP4 Report + Universal Handoff + YouTube Publish Integrated)*
