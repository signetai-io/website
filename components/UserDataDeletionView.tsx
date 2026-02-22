import React from 'react';

export const UserDataDeletionView: React.FC = () => {
  return (
    <article className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tighter text-[var(--text-header)] mb-6">User Data Deletion.</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          Instructions for deleting Signet account-linked data and local vault data.
        </p>
      </header>

      <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">1. What Data Exists</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Signet stores local vault data in your browser (IndexedDB). For global identity registry, only public identity records are kept (identity anchor, public key, owner reference).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">2. Delete Local Browser Vault Data</h2>
          <ol className="list-decimal pl-5 space-y-2 text-[var(--text-body)] opacity-80 leading-relaxed">
            <li>Open <code>https://www.signetai.io/#identity</code>.</li>
            <li>In vault list, remove local vault entries you no longer need.</li>
            <li>Optionally clear site storage in your browser settings for complete local deletion.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">3. Delete Global Identity Registry Entry</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Send a deletion request to <a className="text-[var(--trust-blue)] underline" href="mailto:legal@signetai.io">legal@signetai.io</a> from the email linked to your registry account.
          </p>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Include your anchor (example: <code>signetai.io:your-id</code>) and request subject: <code>DATA DELETION REQUEST</code>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">4. Processing Timeline</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            We target acknowledgement within 72 hours and completion within 30 days, subject to legal and security requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">5. OAuth App Scope</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            If you signed in with Google for YouTube upload, you may also revoke Signet access directly in your Google account permissions at any time.
          </p>
        </section>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] text-sm opacity-50 font-mono">
        Effective Date: February 22, 2026 | URL: <code>https://www.signetai.io/#data-deletion</code>
      </div>
    </article>
  );
};
