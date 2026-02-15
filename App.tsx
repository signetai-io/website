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
        <a href="#" className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
        <a href="#standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
        <a href="#architecture" className="sidebar-link">2. Neural Prism Pipeline</a>
        <a href="#schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
        <a href="#spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Identity & Trust</p>
        <a href="#tks" className="sidebar-link">5. TrustKey Registry</a>
        <a href="#branding" className={`sidebar-link ${currentView === 'branding' ? 'active' : ''}`}>6. Branding Kit</a>
        <a href="#contact" className="sidebar-link">7. Technical Inquiries</a>
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
        {theme === 'standard' ? 'Switch to Midnight' : 'Switch to Standard'}
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
  const [view, setView] = useState<'home' | 'spec' | 'standards' | 'schema' | 'branding'>('home');
  const [theme, setTheme] = useState<Theme>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Verification Subdomain Mapping Logic
      if (hash === '#verifier') {
        setIsPortalOpen(true);
        setView('home');
      } else if (hash === '#spec') {
        setView('spec');
      } else if (hash === '#standards') {
        setView('standards');
      } else if (hash === '#schema') {
        setView('schema');
      } else if (hash === '#branding') {
        setView('branding');
      } else {
        setView('home');
        // Handle anchor scrolling for sections on the home page
        const anchorSections = ['#architecture', '#tks', '#contact'];
        if (hash && anchorSections.includes(hash)) {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
      setIsSidebarOpen(false);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
                The Signet Protocol acts as a specialized extension to C2PA, mapping neural logic states into standard JUMBF manifest boxes.
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

          <footer className="mt-24 pt-12 border-t border-[var(--border-light)] flex justify-between items-center text-[10px] font-mono opacity-50 uppercase tracking-widest text-[var(--text-body)]">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026</span>
            </div>
            <span>ISO/IEC 19566-5 Compliance</span>
          </footer>
        </div>
      </main>

      <PortalView isOpen={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
      <VerificationBadge />
    </div>
  );
};

export default App;