# Signet Protocol Security Policy

## 1. Risk Assessment (LOG-2026-02-15-H)
- **Privilege Escalation**: [NEUTRALIZED] Admin access is strictly hardcoded to `shengliang.song.ai@gmail.com`.
- **Referrer Restrictions**: [ENFORCED] Website whitelisting is active for `*.signetai.io`, `*.aivoicecast.com`, and official Cloud Run endpoints.
- **Project Isolation**: [ENFORCED] To prevent 30-day GCP lock-in issues, `signetai.io` uses an independent Firebase project instance.

## 2. Mandatory GCP Configuration
Referrer shielding is currently ACTIVE. To maintain this:

1. **Authorized Domains:** 
   - Ensure `*.signetai.io/*` and `*.aivoicecast.com/*` are always present in the GCP Credentials Console.
   
2. **API Restrictions:** 
   - The key must be limited to Firestore, Storage, and Identity Toolkit.

## 3. Project Isolation Protocol (L-ISO-01)
To ensure the rapid 40-day pivot remains agile:
- **Project A (Legacy)**: `fir-cfb5e` - Maintained for `aivoicecast.com` compatibility.
- **Project B (Signet)**: `signet-identity-registry` (or similar) - Dedicated to `signetai.io`.
- **Rule Synchronization**: Security rules in `firestore.rules` and `storage.rules` should be deployed to BOTH projects to maintain standard compliance.

## 4. Post-Pivot Hardening (Day 40+)
1. **Rotate API Key**: Recommended for Project B once out of development.
2. **Firebase App Check**: Mandatory for production to eliminate CLI-based spoofing.
3. **Cloud Functions**: Migrate Registry write operations to server-side code.
