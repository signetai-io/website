import React from 'react';
import { Admonition } from './Admonition';

export const BrandingView: React.FC = () => {
  return (
    <article className="py-24">
      <header className="mb-20">
        <div className="text-[10px] font-mono text-[var(--trust-blue)] uppercase font-bold mb-4 tracking-[0.3em]">Identity Guidelines</div>
        <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)] mb-6">SignetAI Branding Kit</h1>
        <p className="text-xl text-[var(--text-body)] opacity-80 max-w-2xl">
          Visual requirements for the Signet Protocol. A minimalist, industrial aesthetic designed for the future of verifiable AI.
        </p>
      </header>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-8 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">1. Palette & Tone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="h-24 bg-[#0055FF] rounded shadow-sm"></div>
            <p className="font-mono text-[10px] uppercase font-bold">Trust Blue</p>
            <p className="font-mono text-[12px] opacity-60">#0055FF</p>
          </div>
          <div className="space-y-3">
            <div className="h-24 bg-[#1B1F23] rounded shadow-sm"></div>
            <p className="font-mono text-[10px] uppercase font-bold">Deep Charcoal</p>
            <p className="font-mono text-[12px] opacity-60">#1B1F23</p>
          </div>
          <div className="space-y-3">
            <div className="h-24 bg-white border border-[var(--border-light)] rounded shadow-sm"></div>
            <p className="font-mono text-[10px] uppercase font-bold">Standard White</p>
            <p className="font-mono text-[12px] opacity-60">#FFFFFF</p>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-12 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">2. Variations</h2>
        
        <div className="grid grid-cols-1 gap-12">
          {/* Variation A: The Icon */}
          <div className="space-y-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-body)] opacity-60">Variation A: The Icon (1:1 Monogram)</h3>
            <div className="flex items-center gap-12">
              <div className="w-48 h-48 bg-[#1B1F23] flex items-center justify-center rounded-xl relative overflow-hidden group border border-[#30363D]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #0055FF 1px, transparent 0)`,
                  backgroundSize: '12px 12px'
                }}></div>
                <span className="text-7xl font-bold text-white tracking-tighter relative z-10 select-none">SA</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0055FF]"></div>
              </div>
              <div className="space-y-4 max-w-sm">
                <p className="text-sm italic opacity-70">"The SA monogram is set in a bold sans-serif with an underlying neural mesh texture representing the reasoning substrate."</p>
              </div>
            </div>
          </div>

          {/* Variation B: The Wordmark */}
          <div className="space-y-6 pt-12">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-body)] opacity-60">Variation B: Horizontal Wordmark</h3>
            <div className="p-12 bg-white border border-[var(--border-light)] rounded-lg flex flex-col items-start gap-1 group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1B1F23] flex items-center justify-center rounded">
                    <span className="text-white font-bold text-lg tracking-tighter">SA</span>
                  </div>
                  <span className="text-4xl font-bold text-[#1B1F23] tracking-tighter">SignetAI.io</span>
               </div>
               <div className="pl-14">
                 <span className="text-[#0055FF] font-medium text-sm tracking-[0.15em] uppercase">Verifiable Proof of Reasoning</span>
               </div>
            </div>
            <p className="text-xs font-mono opacity-50 mt-4 uppercase">Asset Rendering: High-Fidelity 2K PWA Manifest Optimized</p>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-2xl font-bold mb-12 border-b border-[var(--border-light)] pb-2 text-[var(--text-header)]">3. PWA Iconography</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-8 border border-[var(--border-light)] bg-[var(--bg-sidebar)] rounded-xl space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-black rounded-xl border border-neutral-700 shadow-lg relative overflow-hidden">
                   {/* Abstract representation of the 192px icon content */}
                   <div className="absolute inset-0 bg-[url('./192.png')] bg-cover opacity-80"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs opacity-50">192</div>
                </div>
                <div className="w-32 h-32 bg-black rounded-xl border border-neutral-700 shadow-lg relative overflow-hidden">
                   {/* Abstract representation of the 512px icon content */}
                   <div className="absolute inset-0 bg-[url('./512.png')] bg-cover opacity-80"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg opacity-50">512</div>
                </div>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold italic text-[var(--text-header)]">The "Trust Stack" Metaphor</h4>
                <p className="text-sm opacity-70 mt-2 leading-relaxed">
                  The PWA icons utilize a "Zoom-in" macro composition. Instead of showing the full logo, we crop into the <strong>Digital Fingerprint</strong>. This communicates "Inspection" and "Granularity"—Signet verifies the microscopic reasoning path, not just the final output.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase font-bold text-[var(--trust-blue)] tracking-widest">Technical Implementation</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="font-mono text-xs font-bold text-[var(--text-header)]">192px (The Token)</span>
                  <p className="text-xs opacity-60 leading-relaxed">
                    Optimized for Android Homescreens and Task Switchers. The high-contrast black hexagon against the white/transparent background ensures the silhouette is legible even at 48dp.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-xs font-bold text-[var(--text-header)]">512px (The Manifest)</span>
                  <p className="text-xs opacity-60 leading-relaxed">
                    Required for PWA Splash Screens and Desktop Installs. The high resolution allows the <strong>interwoven circuitry</strong> (The AI Agent) to be clearly visible threading through the <strong>fingerprint ridges</strong> (The Human N=100).
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Admonition type="important" title="Typography Usage">
        The Wordmark MUST use a clean, bold sans-serif (Inter Bold or similar) with 100% spelling accuracy. The tagline MUST be set in a lighter weight with increased letter-spacing.
      </Admonition>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)]">
        <a href="#" className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Core Specification
        </a>
      </div>
    </article>
  );
};