# Signet AI Project Status & Roadmap

**Current Version:** 0.3.2_BETA  
**Protocol Spec:** draft-song-02.7

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
    - [ ] Handle URL params `signetai.io/verify?url=...`
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
*Last Updated: Feb 18, 2026 (Phase III UTW Complete)*