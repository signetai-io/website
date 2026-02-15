# Signet Protocol Specification (v0.2.7)
**Draft-Song-Signet-Neural-Lens-02.7**

## 1. Introduction
This document defines the Signet Protocol, a standard for attaching cryptographic proof of reasoning (VPR) to AI-generated content, aligned with **C2PA 2.3**.

## 2. Global Identity Registry (TrustKey Service)
To ensure the accountability of the 8 billion human curators, the protocol mandates a centralized settlement layer for Identity-to-Key binding.

### 2.1 Identity Uniqueness & Storage
- **System Anchor**: All identities MUST be indexed by a 32-byte deterministic UUID derived from the full hierarchical identity string.
- **Uniqueness**: The Registry MUST enforce a "First-to-Claim" policy. Registration attempts for existing anchor IDs MUST be rejected.

### 2.2 Vault Recovery Protocol (VRP-R)
- **Non-Custodial Root**: The root of trust is a 12-word mnemonic seed. 
- **Recovery Logic**: If a user loses their private seed manifest (the local session file), they MAY re-derive their Ed25519 signing key using the BIP39-style mnemonic.
- **Anchor Immutability**: Recovery resets the curatorial authority without changing the System Anchor, preserving the integrity of previously signed assets.

## 3. Manifest Delivery & Strategies
Compliance with C2PA 2.3 requires support for two primary transport modes.

### 3.1 Sidecar Mode (.json)
- Manifests are delivered as standalone JSON-LD objects.
- Recommended for cloud-native pipelines and LLM context injection.

### 3.2 Embedded Mode (JUMBF)
- Manifests MUST be injected into the asset binary using the Joint Universal Media Binary Framework (JUMBF).
- For JPEG/PNG, assertions reside in the `APP11` or equivalent metadata segments.

## 4. Cryptographic Requirements
- **Algorithm**: MUST use Ed25519 for all signatures.
- **Hashing**: SHA-256 MUST be used for generating system anchors and content hashes.

## 5. The X-Signet-VPR Header
All Signet-compliant API responses MUST include the `X-Signet-VPR` header.

### 5.1 Payload Structure
```json
{
  "protocol_version": "0.2.7",
  "timestamp": 1740000000,
  "strategy": "embedded | sidecar",
  "chain": [
    {
      "entity": "MODEL",
      "id": "gemini-3-pro-preview",
      "signature": "..."
    },
    {
      "entity": "HUMAN",
      "id": "master-curator-01",
      "signature": "..."
    }
  ]
}
```