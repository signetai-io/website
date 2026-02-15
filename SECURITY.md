# Signet Protocol Security Policy

## 1. Key Management (TKS-SEC-01)
As of v0.2.6, all sensitive credentials MUST be stored in `private_keys.ts`. This file is explicitly ignored by version control.

## 2. Deferred Rotation Incident (LOG-2026-02-15)
- **Status**: [MITIGATION ACTIVE / ROTATION DEFERRED]
- **Context**: The Firebase API Key was exposed in a public commit. Due to an active Hackathon Judging Period (frozen deployment at `aivoicecast.com`), full key rotation is deferred for 30 days to maintain uptime for evaluators.

### Phase A: Hardening (ACTIVE)
- **Website Referrer Restrictions**: Applied in GCP Console to only allow requests from `*.signetai.io`, `*.aivoicecast.com`, and authorized `.run.app` origins.
- **Service Restrictions**: Key usage restricted strictly to `Cloud Firestore` and `Identity Toolkit`.
- **Identity Uniqueness**: Enforced at the Firestore Document level to prevent collision attacks.

### Phase B: Scheduled Rotation
- **Rotation Date**: Scheduled for March 15, 2026 (Post-Judging).
- **Action**: Regeneration of all API keys and migration of `aivoicecast.com` and `signetai.io` to new credentials.

## 3. Contact
For security disclosures, contact `trust@signetai.io`.
