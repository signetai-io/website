# Signet Protocol: Verifiable Proof of Reasoning (VPR)
**Deterministic Telemetry for AI Assets**

Official Repository: [github.com/signetai-io/website](https://github.com/signetai-io/website)

The Signet Protocol (draft-song-signet-03.1) defines a framework for the cryptographic attestation of AI-generated reasoning paths. It transforms non-deterministic LLM outputs into formally verified "Signets" aligned with C2PA 2.3.

## 1. Introduction
As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because they only sign the final result, not the process. Signet Protocol introduces **"Process Provenance"** via Verifiable Proof of Reasoning (VPR).

## 2. Core Components
- **2.1. TrustKeyService (TKS)**: A registry of public keys bound to verifiable identities.
- **2.2. Neural Lens Engine**: A deterministic verifier that probes AI telemetry for logic drift.
- **2.3. Universal Tail-Wrap (UTW)**: A Zero-Copy injection method for arbitrary binary formats (Video/Audio/PDF).

## 3. CLI & Developer Tools (New in v0.3.1)
The protocol now includes standalone Node.js tools and a Web Batch Processor.

### 3.1 Batch Processor (Web)
A high-performance audit engine available at `/#batch`.
- **Supported Formats**: Universal support for **Images** (PNG, JPG, SVG), **Video** (MP4, MOV), **Audio** (WAV, MP3), and **Documents** (PDF).
- **Deep Audit**: Slices binary streams to verify original content integrity against appended signatures.
- **Telemetry**: Real-time reporting of **Throughput (MB/s)** and **Velocity (Files/s)**.
- **Dual Strategy**: Supports both **Embedded (UTW)** and **Sidecar (.json)** verification.

### 3.2 Batch Signer (CLI)
Zero-dependency script for recursively signing directory trees.
```bash
# Download from /#cli
node signet-cli.js --dir ./assets --identity "your.name"
```

## 4. Security Standards
- **Public Keys**: Professional-grade **256-bit** Ed25519.
- **Entropy Floor**: **264-bit Sovereign Grade** (24-word mnemonics).
- **Master Signatory**: `signetai.io:ssl`

## The 4-Layer Execution Pipeline
1. **Vision Substrate (L1)**: Immutable DNA/Thesis.
2. **Neural Lens (L2)**: DAG Mapping of Reasoning steps.
3. **Adversarial Probing (L3)**: Logic Stress Test.
4. **Human-in-the-Loop (L4)**: Final Curatorial Attestation.

## Quick Start
```bash
# Clone the official repository
git clone https://github.com/signetai-io/website.git

# Install dependencies (Optional - CLI is zero-dependency)
npm install
```

## Live Documentation
The official technical specification is served directly from the platform. Access it by navigating to:
`https://signetai.io/#spec`

---
*Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring architectural independence.*