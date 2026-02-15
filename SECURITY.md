# Signet Protocol Security Policy

## 1. Risk Assessment (LOG-2026-02-15-D)
- **API Key Leak**: Mitigated via **GCP Referrer Whitelisting**.
- **Privilege Escalation**: [RESOLVED] Group-based admin elevation is DISABLED. Administrative access is now strictly limited to the hardcoded primary architect email in security rules.
- **Identity Registry**: [FRICTIONLESS DEMO] Registry remains public for `create` to support the pivot demo, secured by domain whitelist.
- **Data Integrity**: Ledgers are **Append-Only** for users; deletions are restricted to the primary admin email.

## 2. Mandatory GCP Configuration
Security depends on the [GCP Credentials Console](https://console.cloud.google.com/apis/credentials). 

1. **Website Restrictions:**
   - `https://www.signetai.io/*`
   - `https://www.aivoicecast.com/*`
   - `http://localhost:*`

2. **API Restrictions:**
   - Limit key to: Firestore, Storage, and Identity Toolkit.

## 3. Deployment Checklist
- [x] Deploy Firestore Rules (v0.2.6_STRICT_EMAIL)
- [x] Deploy Storage Rules (v0.2.6_STRICT_EMAIL)
- [ ] Verify that only `shengliang.song.ai@gmail.com` can delete entries in `bible_ledger`.
