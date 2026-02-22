import React from 'react';

export const TermsOfServiceView: React.FC = () => {
  return (
    <article className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tighter text-[var(--text-header)] mb-6">Terms of Service.</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          Terms governing use of Signet AI web tools, registry services, and verification workflows.
        </p>
      </header>

      <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">1. Acceptance of Terms</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            By using <code>signetai.io</code> and its associated tools, you agree to these Terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">2. Local-First Security Model</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Signet is non-custodial. You are solely responsible for your vault materials (private key and mnemonic). Loss of key material cannot be reversed by Signet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">3. Acceptable Use</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            You agree not to use the service for unlawful content, impersonation, fraud, or attempts to compromise the service, registry, or other users.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">4. Third-Party APIs</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Some features integrate third-party services (for example, Google/YouTube/Firebase). Your use of those features is also subject to each provider's policies and terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">5. Warranty Disclaimer</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            The service is provided "as is" without warranties of any kind. Verification outputs are technical indicators and do not constitute legal, financial, or forensic certification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">6. Liability Limitation</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            To the maximum extent permitted by law, Signet Protocol Group is not liable for indirect, incidental, or consequential damages arising from use of the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--text-header)]">7. Contact</h2>
          <p className="text-[var(--text-body)] opacity-80 leading-relaxed">
            Questions about these Terms: <a className="text-[var(--trust-blue)] underline" href="mailto:legal@signetai.io">legal@signetai.io</a>
          </p>
        </section>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] text-sm opacity-50 font-mono">
        Effective Date: February 22, 2026 | URL: <code>https://www.signetai.io/#terms</code>
      </div>
    </article>
  );
};
