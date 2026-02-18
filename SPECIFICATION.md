# Signet Protocol Specification (v0.3.1)
**Draft-Song-Signet-Neural-Lens-03.1**

## 1. Introduction
This document defines the Signet Protocol, a standard for attaching cryptographic proof of reasoning (VPR) to AI-generated content, aligned with **C2PA 2.3**.

## 2. Global Identity Registry (TrustKey Service)
To ensure the accountability of the 8 billion human curators, the protocol mandates a centralized settlement layer for Identity-to-Key binding.

### 2.1 Identity Uniqueness & Storage
- **System Anchor**: All identities MUST be indexed by a 32-byte deterministic UUID derived from the full hierarchical identity string.
- **Organization Home**: [github.com/signetai-io](https://github.com/signetai-io)

### 2.2 Vault Recovery Protocol (VRP-R)
- **Non-Custodial Root**: The root of trust is a 12-word or 24-word mnemonic seed. 
- **Recovery Logic**: If a user loses their private seed manifest (the local session file), they MAY re-derive their Ed25519 signing key using the BIP39-style mnemonic.

### 2.3 Sovereign Grade Entropy (VPR-S)
As of 2026, the protocol deprecates 160-bit (SHA-1) security for curatorial anchors. Signet implements **Sovereign Grade Entropy** to match the security levels of 256-bit elliptic curves.
- **BIP-39 Math**: The protocol uses a standard dictionary of 2,048 words. Each word provides **11 bits of entropy** ($\log_2(2048) = 11$).
- **Sovereign Grade**: 24 words = **264 bits of entropy** ($24 \times 11$). Required for high-stakes institutional or master curatorial roles. 

## 3. Manifest Delivery & Strategies
Compliance with C2PA 2.3 requires support for two primary transport modes.

### 3.1 Sidecar Mode (.json)
- Manifests are delivered as standalone JSON-LD objects.
- **Audit Logic**: The verifier calculates the hash of the *current file on disk* and compares it to the `content_hash` in the sidecar. If the file has been modified (e.g., signed via UTW) after the sidecar was generated, the audit MUST fail with a **TAMPERED** status.

### 3.2 Embedded Mode (Binary Substrate Injection)
- **Technique**: Manifests MUST be injected into the asset binary. 
- **Tail-End Injection**: Signet utilizes a "Tail-End Wrap" (UTW) for browser-based delivery, where the manifest is appended after the standard EOI (End of Image) marker.
- **Discovery Logic**: To verify a file without reading the entire binary into memory, parsers MUST implement a **Tail-End Scan**.
  - Read the last 10KB of the file.
  - Search for the delimiter `%SIGNET_VPR_START`.
  - If found, extract the JSON payload.

### 3.3 Deep Verification Logic (UTW)
When verifying an Embedded (UTW) asset, the file size has changed due to the appended signature. The verifier MUST NOT hash the entire file blindly.
1. Extract `byte_length` from the embedded manifest (representing the original asset size).
2. Create a virtual slice of the file from byte `0` to `byte_length`.
3. Calculate the SHA-256 hash of this slice.
4. Compare it against `manifest.asset.content_hash`.
This ensures the original binary substrate is cryptographically intact, even though the file on disk has been modified.

## 4. Cryptographic Requirements
- **Algorithm**: MUST use Ed25519-256 for all signatures. 
- **Public Key Representation**: 256-bit keys MUST be encoded as 64-character hexadecimal strings.

## 5. The X-Signet-VPR Header
All Signet-compliant API responses MUST include the `X-Signet-VPR` header.

---
**Official Master Signatory (v0.3.1):**
**Anchor:** `signetai.io:ssl`
**Organization:** [signetai-io](https://github.com/signetai-io)
**Public Key:** `ed25519:signet_v2.7_sovereign_5b9878a8583b7b38d719c7c8498f8981adc17bec0c311d76269e1275e4a8bdf9`
**Attested By:** Signet Protocol Labs Authority (signetai-io)