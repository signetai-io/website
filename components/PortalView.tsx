import React, { useEffect, useState } from 'react';

export const PortalView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<{ id: string; msg: string; status: string }[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Simulate live verification stream
      const interval = setInterval(() => {
        const newLog = {
          id: Math.random().toString(36).substring(7).toUpperCase(),
          msg: [
            'Probing L2 DAG Nodes...',
            'Verifying Parity Score...',
            'Signing Master Artifact...',
            'Attesting identity binding...',
            'Calibrating Neural Lens...'
          ][Math.floor(Math.random() * 5)],
          status: Math.random() > 0.1 ? 'OK' : 'AUDIT'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 12));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 theme-bg/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] glass-card overflow-hidden flex flex-col border-theme-accent/20">
        {/* Header */}
        <div className="p-8 border-b-theme flex justify-between items-center bg-current/5">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 border border-current theme-text flex items-center justify-center rotate-45">
              <div className="w-2 h-2 theme-accent-bg"></div>
            </div>
            <div>
              <h2 className="font-serif text-3xl theme-text italic font-bold">Signet Command Center</h2>
              <p className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.4em]">Protocol Session: Active (V0.2.1-A)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center theme-text-secondary hover:theme-text transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            
            {/* Column 1: Identity & Stats */}
            <div className="space-y-8">
              <div className="p-8 glass-card border-l-4 border-l-[var(--accent)]">
                <span className="font-mono text-[10px] theme-text-secondary uppercase tracking-widest mb-4 block font-bold">TKS Registry Binding</span>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl theme-text italic">Anonymous_Architect</h3>
                  <p className="font-mono text-[11px] theme-text-secondary break-all opacity-60">ed25519:signet_8f2d...4a12</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 glass-card text-center">
                  <p className="font-mono text-[9px] theme-text-secondary uppercase mb-2">Verified Assets</p>
                  <p className="font-serif text-4xl theme-text font-bold italic">24</p>
                </div>
                <div className="p-6 glass-card text-center">
                  <p className="font-mono text-[9px] theme-text-secondary uppercase mb-2">Pool Rank</p>
                  <p className="font-serif text-4xl theme-text font-bold italic">Top 3%</p>
                </div>
              </div>

              <div className="p-8 glass-card">
                <span className="font-mono text-[10px] theme-text-secondary uppercase tracking-widest mb-6 block font-bold">Network Health</span>
                <div className="space-y-4">
                  {[
                    { label: 'Neural Lens Parity', val: '0.998', status: 'optimal' },
                    { label: 'Signet Pool Liquidity', val: '$1.2M', status: 'high' },
                    { label: 'Attestation Latency', val: '42ms', status: 'optimal' }
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-center border-b border-current/5 pb-2">
                      <span className="font-serif text-sm theme-text-secondary">{stat.label}</span>
                      <span className={`font-mono text-[10px] font-bold ${stat.status === 'optimal' ? 'theme-accent' : 'theme-text'}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Live Verification Feed */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className="flex-1 glass-card overflow-hidden flex flex-col">
                <div className="p-6 border-b-theme bg-current/5 flex justify-between items-center">
                  <span className="font-mono text-[11px] theme-text uppercase tracking-widest font-bold">Neural Lens Stream</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full theme-accent-bg animate-pulse"></span>
                    <span className="font-mono text-[9px] theme-accent uppercase tracking-tighter">Live Audit</span>
                  </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-4 theme-text-secondary">
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-6 animate-in slide-in-from-left-2 duration-300">
                      <span className="opacity-40 whitespace-nowrap">[{log.id}]</span>
                      <span className="flex-1">{log.msg}</span>
                      <span className={log.status === 'OK' ? 'theme-accent' : 'text-red-500'}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Scripture_V2', date: 'Feb 14', score: '0.992' },
                  { name: 'Lens_UI_Artifact', date: 'Feb 13', score: '0.998' },
                  { name: 'Podcast_Oracle', date: 'Feb 12', score: '0.985' }
                ].map(asset => (
                  <div key={asset.name} className="p-4 border border-current/10 glass-card hover:theme-accent-bg/5 transition-colors cursor-pointer group">
                    <p className="font-mono text-[9px] theme-text-secondary uppercase mb-2">{asset.date}</p>
                    <h4 className="font-serif text-sm theme-text group-hover:theme-accent transition-colors font-bold">{asset.name}</h4>
                    <p className="mt-2 font-mono text-[10px] theme-accent font-bold">VPR: {asset.score}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-theme bg-current/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] theme-text-secondary tracking-widest uppercase opacity-40">Session attestation provided by Signet Labs HSM Cluster-7</p>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-current theme-text font-mono text-[9px] uppercase tracking-widest font-bold hover:theme-accent-bg hover:text-white transition-all">
              Security Log
            </button>
            <button className="px-6 py-2 theme-accent-bg text-white font-mono text-[9px] uppercase tracking-widest font-bold shadow-lg">
              Withdrawal Proxy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};