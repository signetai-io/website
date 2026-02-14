import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { VerificationBadge } from './components/VerificationBadge';
import { TrustKeyService } from './components/TrustKeyService';
import { ContactHub } from './components/ContactHub';
import { PortalView } from './components/PortalView';

export type Theme = 'midnight' | 'paper' | 'sepia';

const Footer: React.FC = () => (
  <footer className="py-24 px-6 border-t-theme max-w-7xl mx-auto border-v">
    <div className="flex flex-col md:flex-row justify-between items-start gap-16">
      <div className="space-y-6">
        <h2 className="font-serif text-4xl theme-text font-bold">SignetAI.io</h2>
        <p className="font-mono text-[10px] theme-text-secondary tracking-[0.3em] uppercase max-w-xs leading-loose">
          THE PROTOCOL LAYER FOR AUTONOMOUS ACCOUNTABILITY.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
        <div className="space-y-5">
          <h4 className="font-mono text-[11px] theme-text uppercase tracking-widest font-bold">Standards</h4>
          <ul className="theme-text-secondary text-sm space-y-3 font-serif italic">
            <li><a href="#spec" className="hover:theme-text transition-colors">Draft-Song-02</a></li>
            <li><a href="#architecture" className="hover:theme-text transition-colors">VPR Pipeline</a></li>
            <li><a href="#tks" className="hover:theme-text transition-colors">Trust Registry</a></li>
          </ul>
        </div>
        <div className="space-y-5">
          <h4 className="font-mono text-[11px] theme-text uppercase tracking-widest font-bold">Network</h4>
          <ul className="theme-text-secondary text-sm space-y-3 font-serif italic">
            <li className="hover:theme-text cursor-pointer transition-colors">Neural Lens</li>
            <li className="hover:theme-text cursor-pointer transition-colors">Protocol Nodes</li>
            <li className="hover:theme-text cursor-pointer transition-colors">API Docs</li>
          </ul>
        </div>
        <div className="space-y-5">
          <h4 className="font-mono text-[11px] theme-text uppercase tracking-widest font-bold">Connect</h4>
          <ul className="theme-text-secondary text-sm space-y-3 font-serif italic">
            <li><a href="#contact" className="hover:theme-text transition-colors">Contact Labs</a></li>
            <li className="hover:theme-text cursor-pointer transition-colors">GitHub Repository</li>
            <li className="hover:theme-text cursor-pointer transition-colors">SLA Status</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-24 pt-10 border-t-theme flex flex-col sm:flex-row justify-between items-center gap-6 theme-text-secondary font-mono text-[10px] tracking-tight">
      <p>&copy; 2026 SIGNET PROTOCOL GROUP. ALL RIGHTS ACCOUNTED FOR.</p>
      <div className="flex gap-8">
        <p>BUILD_HASH: 1A2F99B</p>
        <p>PROTOCOL: V0.2.1-A</p>
      </div>
    </div>
  </footer>
);

const Navbar: React.FC<{ 
  isSpec: boolean; 
  currentTheme: Theme; 
  onThemeChange: (t: Theme) => void;
  onPortalOpen: () => void;
}> = ({ isSpec, currentTheme, onThemeChange, onPortalOpen }) => (
  <nav className="fixed top-0 left-0 w-full z-50 border-b-theme" style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(24px)' }}>
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-v">
      <a href="/" onClick={(e) => { if(!isSpec) e.preventDefault(); window.location.hash = ''; }} className="flex items-center gap-4 group">
        <div className="w-5 h-5 theme-text border border-current rotate-45 flex items-center justify-center transition-transform group-hover:rotate-90 duration-500">
          <div className="w-1.5 h-1.5 theme-accent-bg"></div>
        </div>
        <span className="font-serif text-2xl tracking-tighter theme-text font-bold">SignetAI.io</span>
      </a>
      
      <div className="flex items-center gap-6 md:gap-10">
        <div className="hidden lg:flex items-center gap-10 font-mono text-[10px] uppercase tracking-widest theme-text-secondary font-bold">
          {!isSpec ? (
            <>
              <a href="#architecture" className="hover:theme-text transition-all">Pipeline</a>
              <a href="#tks" className="hover:theme-text transition-all">TKS Registry</a>
              <a href="#contact" className="hover:theme-text transition-all">Contact</a>
            </>
          ) : (
            <a href="#" className="hover:theme-text transition-all">← Back to Site</a>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-800/10 glass-card">
          {(['midnight', 'paper', 'sepia'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`w-8 h-8 rounded-full font-mono text-[8px] flex items-center justify-center uppercase transition-all duration-300 ${
                currentTheme === t 
                ? 'theme-accent-bg text-white scale-110 shadow-lg z-10' 
                : 'theme-text-secondary hover:theme-text hover:bg-black/5'
              }`}
              title={`Switch to ${t} theme`}
            >
              {t.charAt(0)}
            </button>
          ))}
        </div>

        <button 
          onClick={onPortalOpen}
          className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:theme-accent-bg hover:text-white transition-all shadow-xl"
        >
          Portal
        </button>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec'>('home');
  const [theme, setTheme] = useState<Theme>('midnight');
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#spec') {
        setView('spec');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className={`min-h-screen selection:bg-[var(--accent)] selection:text-white theme-bg`}>
      <Navbar 
        isSpec={view === 'spec'} 
        currentTheme={theme} 
        onThemeChange={setTheme} 
        onPortalOpen={() => setIsPortalOpen(true)}
      />
      <main>
        {view === 'home' ? (
          <>
            <Hero onOpenPortal={() => setIsPortalOpen(true)} />
            <Architecture />
            <TrustKeyService />
            <SchemaDefinition />
            <ContactHub />
          </>
        ) : (
          <SpecView />
        )}
      </main>
      <Footer />
      <VerificationBadge />
      <PortalView isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
    </div>
  );
};

export default App;