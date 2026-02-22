import React from 'react';
import { Admonition } from './Admonition';

export const PrivacyView: React.FC = () => {
  return (
    <article className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tighter text-[var(--text-header)] mb-6">Data Sovereignty & Privacy.</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          Signet Protocol utilizes a "Local-First" architecture. We do not—and cannot—access your private keys.
        </p>
      </header>

      <Admonition type="security" title="Non-Custodial Warning">
        You are the sole custodian of your <strong>Private Key</strong> and <strong>24-Word Mnemonic</strong>. If you lose them, Signet AI cannot recover them for you. We do not store private keys on our servers.
      </Admonition>

      <div className="space-y-12 mt-12">
        <section className="space-y-4">
          <h3 className="font-bold text-xl text-[var(--text-header)]">1. Data Storage Architecture</h3>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            <strong>Local Storage (IndexedDB):</strong> Your generated Identity Vault, Private Keys, and Mnemonics are stored exclusively in your browser's encrypted IndexedDB sandbox. This data never leaves your device during the signing process.
          </p>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            <strong>Public Registry (Firestore):</strong> Only your <strong>Public Key</strong>, Identity Anchor (e.g., `signetai.io:username`), and Proof of Ownership are synced to the global registry. This allows others to verify your signatures without compromising your security.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xl text-[var(--text-header)]">2. Asset Processing</h3>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            <strong>Client-Side Hashing:</strong> When you use the Batch Processor, SvgSigner, or PDFSigner, the hashing operations occur locally in your browser (Client-Side). Your actual files (Images, Videos, PDFs) are <strong>never uploaded</strong> to our cloud servers for processing.
          </p>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            <strong>Streaming Engine:</strong> The Zero-Copy Streaming Engine processes bytes in memory chunks on your device. We do not retain copies of your assets.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xl text-[var(--text-header)]">3. User Analytics</h3>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            We use minimal, privacy-preserving telemetry to monitor the health of the Registry Nodes. We do not track individual asset contents or signature history linking back to specific IP addresses.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xl text-[var(--text-header)]">4. Open Source Transparency</h3>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            The Signet Protocol reference implementation is open source. You can audit our cryptographic implementation at <a href="https://github.com/signetai-io/website" className="text-[var(--trust-blue)] underline">github.com/signetai-io</a> to verify these claims.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xl text-[var(--text-header)]">5. Legal Endpoints</h3>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Terms of Service URL: <a href="#terms" className="text-[var(--trust-blue)] underline">https://www.signetai.io/#terms</a>
          </p>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            User Data Deletion URL: <a href="#data-deletion" className="text-[var(--trust-blue)] underline">https://www.signetai.io/#data-deletion</a>
          </p>
        </section>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] text-sm opacity-50 font-mono">
        Last Updated: February 20, 2026 | Legal Contact: legal@signetai.io
      </div>
    </article>
  );
};
