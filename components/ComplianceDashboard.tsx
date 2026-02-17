import React, { useState } from 'react';
import { Admonition } from './Admonition';

const STRATEGY_PILLARS = [
  { 
    id: "TECH", 
    title: "Technical Hardening", 
    icon: "🛡️", 
    tasks: ["SDK v2.3 compliance", "pHash Soft-Binding", "HSM/KMS Cloud Signing"],
    color: "text-blue-500",
    desc: "Moving beyond basic JUMBF to durable, persistent cloud-anchored manifests."
  },
  { 
    id: "TRUST", 
    title: "User Trust (L1-L3)", 
    icon: "👁️", 
    tasks: ["Cr Icon Popup L2", "Nutrition Label Popup", "Mobile Long-press"],
    color: "text-emerald-500",
    desc: "Standardizing transparency popups to meet global AI safety regulations."
  },
  { 
    id: "INTEROP", 
    title: "Interoperability", 
    icon: "🌐", 
    tasks: ["Public /verify tool", "Social Proof Dashboard", "ISO/TC 290 Audit"],
    color: "text-amber-500",
    desc: "Ensuring Signet-signed assets work across Adobe, Microsoft, and Google ecosystems."
  }
];

const ROADMAP = [
  { phase: "I", days: "1-10", goal: "Identity & Substrate", status: "COMPLETED", desc: "Established TrustKey Service (TKS), Sovereign Entropy (264-bit), and Base C2PA Injection." },
  { phase: "II", days: "11-20", goal: "Vector & Doc Labs", status: "COMPLETED", desc: "Deployed SVG XML-Hybrid signing and PDF Post-EOF injection strategies." },
  { phase: "III", days: "21-30", goal: "Universal Tail-Wrap", status: "CURRENT", desc: "Finalizing Zero-Copy Streaming Engine for GB-scale binary assets (Video/Audio)." },
  { phase: "IV", days: "31-40", goal: "Public Verifier Launch", status: "UPCOMING", desc: "Deploying the universal /verify portal with deep-linking and drag-and-drop auditing." }
];

export const ComplianceDashboard: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState(2); // Default to Current Phase (III)

  return (
    <div className="py-12 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Pivot Strategy</span>
          <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">2026_MANDATE</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Improvement Roadmap.</h2>
        <p className="text-xl opacity-60 max-w-3xl font-serif italic leading-relaxed">
          Signet AI's 40-day sprint focuses on three pillars: Technical Hardening, User Trust, and Platform Interoperability.
        </p>
      </header>

      {/* Strategy Map Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STRATEGY_PILLARS.map((p) => (
          <div key={p.id} className="p-8 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm space-y-6 hover:shadow-lg transition-all group flex flex-col h-full">
            <div className="flex justify-between items-center">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{p.icon}</span>
              <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${p.color}`}>Pillar_{p.id}</span>
            </div>
            <h4 className="font-serif text-xl font-bold text-[var(--text-header)]">{p.title}</h4>
            <p className="text-xs opacity-50 font-serif leading-relaxed italic">{p.desc}</p>
            <ul className="space-y-2 mt-auto">
              {p.tasks.map(t => (
                <li key={t} className="flex gap-3 text-[11px] font-serif italic opacity-70">
                  <span className={p.color}>■</span> {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Execution Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-4">
            <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">40-Day Sprint (V2.3)</h3>
            <span className="font-mono text-[9px] opacity-30">Status: Phase {ROADMAP[selectedPhase].phase}</span>
          </div>
          
          <div className="space-y-4">
            {ROADMAP.map((item, i) => (
              <div 
                key={i}
                onClick={() => setSelectedPhase(i)}
                className={`p-6 border rounded-lg transition-all cursor-pointer flex gap-6 items-center ${
                  selectedPhase === i ? 'border-[var(--trust-blue)] bg-[var(--admonition-bg)] scale-[1.02]' : 'border-[var(--border-light)] opacity-50 hover:opacity-100'
                }`}
              >
                <div className="w-16 text-center border-r border-[var(--border-light)] pr-6">
                   <p className="font-mono text-[10px] opacity-40 font-bold mb-1">PHASE</p>
                   <p className="font-serif text-3xl font-bold italic text-[var(--trust-blue)]">{item.phase}</p>
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                      <h4 className="font-serif text-lg font-bold text-[var(--text-header)]">{item.goal}</h4>
                      <span className="font-mono text-[9px] opacity-40">DAYS {item.days}</span>
                   </div>
                   <p className="text-xs font-serif italic opacity-70 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {item.status === 'CURRENT' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                  )}
                  {item.status === 'COMPLETED' && (
                    <span className="text-emerald-500 font-bold text-xl">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Summary */}
        <div className="space-y-6">
           <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">Strategy Map</h3>
           <div className="p-8 border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] space-y-8">
              <div className="space-y-4">
                <p className="font-mono text-[10px] font-bold uppercase text-[var(--trust-blue)]">Current Velocity</p>
                <p className="text-sm font-serif italic leading-relaxed opacity-70">
                  "Phase III (Universal Tail-Wrap) is effectively complete. The streaming engine now handles 4K video signatures. Focus shifting to Phase IV (Public Verification)."
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border-light)] space-y-2">
                 <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span>Sprint Completion</span>
                    <span className="text-emerald-500">75%</span>
                 </div>
                 <div className="h-1 bg-[var(--border-light)] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]"></div>
                 </div>
              </div>
              <div className="pt-2">
                 <button 
                  onClick={() => window.location.hash = '#universal-lab'}
                  className="w-full py-3 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded"
                 >
                  Launch Universal Lab
                 </button>
              </div>
           </div>
        </div>
      </div>

      <Admonition type="important" title="Phase IV Preparations">
        The upcoming Public Verifier (Phase IV) will require strict CORS policy updates on the storage bucket to allow browser-based streaming verification from third-party origins.
      </Admonition>
    </div>
  );
};