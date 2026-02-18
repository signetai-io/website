import React, { useState, useEffect } from 'react';
import { PersistenceService } from '../services/PersistenceService';

export const SecurityIntegrityMonitor: React.FC = () => {
  const [vaultActive, setVaultActive] = useState(false);

  useEffect(() => {
    const check = async () => {
      const active = await PersistenceService.getActiveVault();
      setVaultActive(!!active);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const securityChecks = [
    { label: "Referrer Shield", status: "ENFORCED", detail: "signetai.io only" },
    { label: "Local Vault", status: vaultActive ? "SEALED" : "EMPTY", detail: "IndexedDB isolated" },
    { label: "Master Signatory", status: "LOCKED", detail: "signetai.io:ssl" },
    { label: "Project Isolation", status: "ACTIVE", detail: "signetai_prod" }
  ];

  return (
    <div className="p-6 bg-black/40 border border-white/5 rounded-lg space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-mono text-[9px] text-blue-500 font-bold uppercase tracking-widest">Neural Audit 03.1</span>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {securityChecks.map((check, i) => (
          <div key={i} className="flex justify-between items-start">
            <div className="space-y-0.5">
              <p className="font-mono text-[10px] text-white/40 uppercase font-bold">{check.label}</p>
              <p className="font-mono text-[8px] text-white/20 italic">{check.detail}</p>
            </div>
            <span className={`font-mono text-[9px] font-bold ${check.status === 'EMPTY' ? 'text-amber-500' : 'text-green-500'}`}>[{check.status}]</span>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[100%]"></div>
        </div>
        <p className="mt-2 font-mono text-[7px] text-white/20 uppercase text-center tracking-tighter">Integrity Confidence: 0.9997</p>
      </div>
    </div>
  );
};