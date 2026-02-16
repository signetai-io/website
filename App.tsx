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
import { ProvenanceLab } from './components/ProvenanceLab';
import { SecurityIntegrityMonitor } from './components/SecurityIntegrityMonitor';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { VerifyView } from './components/VerifyView';

export type Theme = 'standard' | 'midnight';

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => (
  <aside 
    className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] z-40 transition-transform duration-300 transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
  >
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => window.location.hash = ''}>
        <div className="cr-badge text-[var(--trust-blue)]">cr</div>
        <span className="font-bold tracking-tight text-xl text-[var(--text-header)]">Signet v0.2.7</span>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        <p className="px-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Core Specification</p>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
        <a href="#standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
        <a href="#compliance" className={`sidebar-link ${currentView === 'compliance' ? 'active' : ''}`}>1.5. 2026 Strategy</a>
        <a href="#developers" className="sidebar-link">2. Neural Prism Pipeline</a>
        <a href="#schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
        <a href="#spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold text-[var(--text-body)] opacity-40 mb-4">Identity & Trust</p>
        <a href="#identity" className={`sidebar-link ${currentView === 'identity' ? 'active' : ''}`}>5. TrustKey Registry (Register)</a>
        <a href="#verify" className={`sidebar-link ${currentView === 'verify' ? 'active' : ''}`}>6. Public Verifier (/verify)</a>
        <a href="#auditor" className={`sidebar-link ${currentView === 'auditor' ? 'active' : ''}`}>7. Provenance Lab (Sign)</a>
        <a href="#branding" className={`sidebar-link ${currentView === 'branding' ? 'active' : ''}`}>8. Branding Kit</a>
        <a href="#manual" className={`sidebar-link ${currentView === 'manual' ? 'active' : ''}`}>9. Operator's Manual</a>
      </nav>

      <div className="pt-8 mt-8 border-t border-[var(--border-light)] space-y-6">
        <SecurityIntegrityMonitor />
        <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-[var(--text-body)]">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>MAINNET_NODE: ACTIVE</span>
        </div>
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
        Verifier SDK (∑)
      </button>
    </div>
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec' | 'standards' | 'schema' | 'branding' | 'manual' | 'auditor' | 'identity' | 'compliance' | 'verify'>('home');
  const [theme, setTheme] = useState<Theme>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash;
      if (hash === '#auditor') {
        setView('auditor');
      } else if (hash === '#identity') {
        setView('identity');
      } else if (hash === '#spec') {
        setView('spec');
      } else if (hash === '#standards') {
        setView('standards');
      } else if (hash === '#schema') {
        setView('schema');
      } else if (hash === '#branding') {
        setView('branding');
      } else if (hash === '#manual') {
        setView('manual');
      } else if (hash === '#compliance') {
        setView('compliance');
      } else if (hash === '#verify') {
        setView('verify');
      } else {
        setView('home');
      }
      setIsSidebarOpen(false);
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
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
                Signet Protocol acts as a specialized subdirectory of C2PA, mapping neural logic states into standard JUMBF manifest boxes.
              </Admonition>
              <Architecture />
              <hr className="hr-chapter" />
              <SchemaDefinition />
              <hr className="hr-chapter" />
              <ContactHub />
            </>
          )}
          {view === 'identity' && <TrustKeyService />}
          {view === 'auditor' && <ProvenanceLab />}
          {view === 'spec' && <SpecView />}
          {view === 'standards' && <StandardsView />}
          {view === 'schema' && <SchemaView />}
          {view === 'branding' && <BrandingView />}
          {view === 'manual' && <ManualView />}
          {view === 'compliance' && <ComplianceDashboard />}
          {view === 'verify' && <VerifyView />}

          <footer className="mt-24 pt-12 border-t border-[var(--border-light)] flex flex-wrap justify-between items-center gap-6 text-[10px] font-mono opacity-50 uppercase tracking-widest text-[var(--text-body)]">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026 | Master Signatory: signetai.io:ssl</span>
            </div>
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