import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { SchemaDefinition } from './components/SchemaDefinition';
import { SpecView } from './components/SpecView';
import { StandardsView } from './components/StandardsView';
import { SchemaView } from './components/SchemaView';
import { Admonition } from './components/Admonition';

export type Theme = 'standard' | 'midnight';

const Sidebar: React.FC<{ currentView: string; isOpen: boolean }> = ({ currentView, isOpen }) => (
  <aside 
    className={`fixed left-0 top-0 h-screen w-72 bg-[#F8F9FA] dark:bg-[#010409] border-r border-[#E1E4E8] dark:border-[#30363D] z-40 transition-transform duration-300 transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
  >
    <div className="p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="cr-badge text-[#0055FF]">cr</div>
        <span className="font-bold tracking-tight text-xl">Signet v0.2.5</span>
      </div>

      <nav className="space-y-1">
        <p className="px-4 text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">Core Specification</p>
        <a href="#" className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`}>0. Introduction</a>
        <a href="#standards" className={`sidebar-link ${currentView === 'standards' ? 'active' : ''}`}>1. Standards & C2PA</a>
        <a href="#architecture" className="sidebar-link">2. Neural Prism Pipeline</a>
        <a href="#schema" className={`sidebar-link ${currentView === 'schema' ? 'active' : ''}`}>3. VPR JSON Manifest</a>
        <a href="#spec" className={`sidebar-link ${currentView === 'spec' ? 'active' : ''}`}>4. Technical Draft</a>
        
        <p className="px-4 pt-8 text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">Identity & Trust</p>
        <a href="#tks" className="sidebar-link">5. TrustKey Registry</a>
        <a href="#contact" className="sidebar-link">6. Technical Inquiries</a>
      </nav>
    </div>

    <div className="absolute bottom-8 left-8">
      <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span>MAINNET_NODE: ACTIVE</span>
      </div>
    </div>
  </aside>
);

const Header: React.FC<{ onToggleSidebar: () => void; theme: Theme; onToggleTheme: () => void }> = ({ onToggleSidebar, theme, onToggleTheme }) => (
  <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white dark:bg-[#0D1117] border-b border-[#E1E4E8] dark:border-[#30363D] z-30 flex items-center justify-between px-8">
    <button onClick={onToggleSidebar} className="lg:hidden p-2 text-2xl">☰</button>
    <div className="hidden lg:block text-[11px] font-mono opacity-40 uppercase tracking-widest">
      ISO/TC 290 - Cognitive Provenance Standard
    </div>
    
    <div className="flex items-center gap-6">
      <button 
        onClick={onToggleTheme}
        className="text-[10px] font-mono uppercase tracking-widest hover:text-[#0055FF] transition-colors"
      >
        {theme === 'standard' ? 'Dark Mode' : 'Light Mode'}
      </button>
      <a 
        href="https://verify.signetai.io" 
        target="_blank"
        className="px-4 py-1.5 bg-[#0055FF] text-white text-[11px] font-bold rounded hover:opacity-90 transition-all"
      >
        Launch Verifier
      </a>
    </div>
  </header>
);

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'spec' | 'standards' | 'schema'>('home');
  const [theme, setTheme] = useState<Theme>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'midnight' ? 'midnight' : 'standard');
    if (theme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#spec') setView('spec');
      else if (hash === '#standards') setView('standards');
      else if (hash === '#schema') setView('schema');
      else setView('home');
      window.scrollTo(0, 0);
      setIsSidebarOpen(false);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar currentView={view} isOpen={isSidebarOpen} />
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'standard' ? 'midnight' : 'standard')}
      />
      
      <main className="lg:pl-72 pt-16">
        <div className="content-column">
          {view === 'home' && (
            <>
              <Hero onOpenPortal={() => {}} />
              <Admonition type="note" title="Cognitive Assertion Layer">
                The Signet Protocol acts as a specialized extension to C2PA, mapping neural logic states into standard JUMBF manifest boxes.
              </Admonition>
              <Architecture />
              <hr className="hr-chapter" />
              <SchemaDefinition />
            </>
          )}
          {view === 'spec' && <SpecView />}
          {view === 'standards' && <StandardsView />}
          {view === 'schema' && <SchemaView />}

          <footer className="mt-24 pt-12 border-t border-[#E1E4E8] dark:border-[#30363D] flex justify-between items-center text-[10px] font-mono opacity-50 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <div className="cr-badge">cr</div>
              <span>Signet Protocol Group © 2026</span>
            </div>
            <span>Status: Draft-Song-02</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;