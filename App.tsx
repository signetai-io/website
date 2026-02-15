import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { StandardsView } from './components/StandardsView';
import { SchemaView } from './components/SchemaView';
import { Admonition } from './components/Admonition';
import { TrustKeyService } from './components/TrustKeyService';
import { ContactHub } from './components/ContactHub';
import { PortalView } from './components/PortalView';
import { VerificationBadge } from './components/VerificationBadge';
import { BrandingView } from './components/BrandingView';
import { ManualView } from './components/ManualView';
import { LiveAssistant } from './components/LiveAssistant';
import { AuditorView } from './components/AuditorView';

export type Theme = 'standard' | 'midnight';

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => (
  <aside 
    className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
  >
    <div className="p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="cr-badge text-[var(--trust-blue)]">cr</div>
        <span className="font-bold tracking-tight text-xl text-[var(--text-header)]">Signet v0.2.5</span>
      </div>

      <nav className="space-y-1">
        <p className="px-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Core Specification</p>
        <a href="/" className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
        <a href="#standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
        <a href="#developers" className="sidebar-link">2. Neural Prism Pipeline</a>
        <a href="#schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
        <a href="#spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Identity & Trust</p>
        <a href="#identity" className="sidebar-link">5. TrustKey Registry</a>
        <a href="#auditor" className={`sidebar-link ${currentView === 'auditor' ? 'active' : ''}`}>6. C2PA Test Suite</a>
        <a href="#branding" className={`sidebar-link ${currentView === 'branding' ? 'active' : ''}`}>7. Branding Kit</a>
        <a href="#manual" className={`sidebar-link ${currentView === 'manual' ? 'active' : ''}`}>8. Operator's Manual</a>
        <a href="#contact" className="sidebar-link">9. Technical Inquiries</a>
      </nav>
    </div>

    <div className="absolute bottom-8 left-8">
      <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span>MAINNET_NODE: ACTIVE</span>
      </div>
    </div>
  </aside>
);

const Header: React.FC<{ onToggleSidebar: () => void; theme: Theme; onToggleTheme: () => void; onOpenPortal: () => void }> = ({ onToggleSidebar, theme, onToggleTheme, onOpenPortal }) => (
  <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-[var(--bg-standard)] border-b border-[var(--border-light)] z-30 flex items-center justify-between px-8">
    <button onClick={onToggleSidebar} className="lg:hidden p-2 text-2xl text-[var(--text-header)]">☰</button>
    <div className="hidden lg:block text-[11px] font-mono text-[var(--text-body)] opacity-40 uppercase tracking-widest">
      ISO/TC 290 - Cognitive Provenance Standard
    </div>
    
    <div className="flex items-center gap-6">
      <button 
        onClick={onToggleTheme}
        className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-body)] hover:text-[var(--trust-blue)] transition-colors"
      >
        {theme === 'standard' ? 'Midnight' : 'Standard'}
      </button>
      <button 
        onClick={onOpenPortal}
        className="px-4 py-1.5 bg-[var(--trust-blue)] text-white text-[11px] font-bold rounded hover:brightness-110 transition-all shadow-sm"
      >
        Verifier SDK
      </button>
    </div>
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec' | 'standards' | 'schema' | 'branding' | 'apps' | 'manual' | 'auditor'>('home');
  const [theme, setTheme] = useState<Theme>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      
      // Handle /apps/[app-name] subdirectory
      if (path.startsWith('/apps/')) {
        const parts = path.split('/');
        if (parts[2]) {
          setView('apps');
          setActiveApp(parts[2]);
          setIsSidebarOpen(false);
          return;
        }
      }

      // Handle Anchors & Main Site Views
      if (hash === '#verifier') {
        setIsPortalOpen(true);
        setView('home');
      } else if (hash === '#auditor') {
        setView('auditor');
      } else if (hash === '#manual') {
        setView('manual');
      } else if (hash === '#spec') {
        setView('spec');
      } else if (hash === '#standards') {
        setView('standards');
      } else if (hash === '#schema') {
        setView('schema');
      } else if (hash === '#branding') {
        setView('branding');
      } else if (hash === '#identity' || hash === '#developers' || hash === '#contact') {
        setView('home');
        // Let the browser handle native scroll or trigger a smooth scroll
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setView('home');
      }
      setIsSidebarOpen(false);
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-standard)] transition-colors duration-200">
      <Sidebar currentView={view} isOpen={isSidebarOpen} />
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'standard' ? 'midnight' : 'standard')}
        onOpenPortal={() => setIsPortalOpen(true)}
      />
      
      <main className="lg:pl-72 pt-16">
        <div className="content-column">
          {view === 'home' && (
            <>
              <Hero onOpenPortal={() => setIsPortalOpen(true)} />
              <Admonition type="note" title="Cognitive Assertion Layer">
                Signet Protocol acts as a specialized subdirectory of C2PA, mapping neural logic states into standard JUMBF manifest boxes at `/apps/*`.
              </Admonition>
              <Architecture />
              <hr className="hr-chapter" />
              <SchemaDefinition />
              <hr className="hr-chapter" />
              <TrustKeyService />
              <hr className="hr-chapter" />
              <ContactHub />
            </>
          )}
          {view === 'spec' && <SpecView />}
          {view === 'standards' && <StandardsView />}
          {view === 'schema' && <SchemaView />}
          {view === 'branding' && <BrandingView />}
          {view === 'manual' && <ManualView />}
          {view === 'auditor' && <AuditorView />}
          {view === 'apps' && (
            <div className="py-24 space-y-12">
              <header className="space-y-2">
                <span className="font-mono text-[10px] uppercase text-[var(--trust-blue)] tracking-[0.4em] font-bold">Signet Ecosystem Subdirectory</span>
                <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">
                  {activeApp?.toUpperCase()} <span className="text-[var(--text-body)] opacity-20 text-3xl">v1.0.4</span>
                </h1>
                <p className="font-mono text-[11px] opacity-40 uppercase tracking-widest">Path: signetai.io/apps/{activeApp}</p>
              </header>
              <div className="aspect-video bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--trust-blue) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="text-center space-y-6 relative z-10">
                  <div className="w-16 h-16 border-2 border-[var(--trust-blue)] flex items-center justify-center mx-auto rounded-lg animate-pulse">
                    <span className="text-[var(--trust-blue)] font-bold text-xl">∑</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-xs opacity-40 uppercase tracking-[0.3em]">Isolated Execution Substrate</p>
                    <button className="px-10 py-4 bg-[var(--trust-blue)] text-white text-[11px] font-bold uppercase tracking-widest rounded shadow-2xl hover:scale-105 transition-all active:scale-95">
                      Establish Neural Link
                    </button>
                  </div>
                </div>
              </div>
              <Admonition type="important" title="Sandboxed Provenance">
                This application is running within an isolated Signet sandbox. All telemetry is hashed and appended to the local VPR manifest at `signetai.io/apps/{activeApp}/manifest.json`.
              </Admonition>
            </div>
          )}

          <footer className="mt-24 pt-12 border-t border-[var(--border-light)] flex flex-wrap justify-between items-center gap-6 text-[10px] font-mono opacity-50 uppercase tracking-widest text-[var(--text-body)]">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026</span>
            </div>
            <div className="flex gap-8">
              <a href="#identity" className="hover:text-[var(--trust-blue)] transition-colors">/#identity</a>
              <a href="#auditor" className="hover:text-[var(--trust-blue)] transition-colors">/#auditor</a>
              <a href="/apps/summarizer" className="hover:text-[var(--trust-blue)] transition-colors">/apps/summarizer</a>
            </div>
            <span>ISO/IEC 19566-5 Compliance</span>
          </footer>
        </div>
      </main>

      <PortalView isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
      <VerificationBadge />
      <LiveAssistant />
    </div>
  );
};

export default App;