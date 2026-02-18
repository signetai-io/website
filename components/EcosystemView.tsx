import React from 'react';
import { Admonition } from './Admonition';

const ECOSYSTEM_REPOS = [
  {
    name: "website",
    tagline: "Core Platform & Specification",
    desc: "The primary interactive portal, documentation hub, and landing zone for the Signet Protocol.",
    status: "v0.3.1_ACTIVE",
    color: "bg-blue-500",
    url: "https://github.com/signetai-io/website"
  },
  {
    name: "spec",
    tagline: "Technical Standard Drafts",
    desc: "Formal documentation of VPR and JUMBF implementation details for ISO/TC 290 alignment.",
    status: "STABLE",
    color: "bg-neutral-800",
    url: "https://github.com/signetai-io/spec"
  },
  {
    name: "benchmark",
    tagline: "Parity & Logic Scoring",
    desc: "Public test suites and performance metrics for Verifiable Proof of Reasoning (VPR). Monitors logic drift in frontier models.",
    status: "STABLE",
    color: "bg-emerald-500",
    url: "https://github.com/signetai-io/benchmark"
  },
  {
    name: "tools",
    tagline: "CLI & Injection Utilities",
    desc: "Industrial-grade CLI tools for manifest injection, sidecar generation, and pHash soft-binding discovery.",
    status: "BETA",
    color: "bg-amber-500",
    url: "https://github.com/signetai-io/tools"
  },
  {
    name: "agents",
    tagline: "Autonomous Signing Nodes",
    desc: "Built on the openClaw pattern. Integration layers for LLM reasoning agents to natively sign their own logic paths autonomously.",
    status: "DRAFT",
    pattern: "openClaw",
    color: "bg-purple-500",
    url: "https://github.com/signetai-io/agents"
  },
  {
    name: "skills",
    tagline: "Reasoning Attestation Modules",
    desc: "Modular skills following the openClaw architecture for specialized reasoning in math, code, and ethical alignment.",
    status: "EXPERIMENTAL",
    pattern: "openClaw",
    color: "bg-red-500",
    url: "https://github.com/signetai-io/skills"
  },
  {
    name: "llm",
    tagline: "Native Reasoning Engine",
    desc: "Specialized model integrations and adapters for high-fidelity reasoning capture directly from the inference substrate.",
    status: "ALPHA",
    pattern: "openClaw",
    color: "bg-indigo-500",
    url: "https://github.com/signetai-io/llm"
  }
];

export const EcosystemView: React.FC = () => {
  return (
    <div className="py-12 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Organization Infrastructure</span>
          <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">ORG_SYNC_v1.2</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">The signetai-io Org.</h2>
        <p className="text-xl opacity-60 max-w-3xl font-serif italic leading-relaxed">
          The Signet Protocol is officially decentralized into the <code>signetai-io</code> GitHub organization. All repositories follow the <a href="https://github.com/shengliangsong-ai/openclaw" target="_blank" className="text-[var(--trust-blue)] hover:underline decoration-1">openClaw</a> agent pattern where applicable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ECOSYSTEM_REPOS.map((repo) => (
          <a 
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-10 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm hover:shadow-2xl hover:border-[var(--trust-blue)] transition-all flex flex-col h-full relative overflow-hidden"
          >
            {repo.pattern && (
              <div className="absolute top-0 right-12 px-3 py-1 bg-neutral-900 text-white font-mono text-[8px] font-bold uppercase tracking-widest rounded-b-sm">
                Pattern: {repo.pattern}
              </div>
            )}
            
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <span className="font-mono text-[10px] opacity-40 font-bold uppercase tracking-widest">Signet Protocol Group</span>
                <h3 className="font-serif text-3xl font-bold text-[var(--text-header)] group-hover:text-[var(--trust-blue)] transition-colors">{repo.name}</h3>
              </div>
              <div className={`px-3 py-1 rounded-sm text-white font-mono text-[9px] font-bold ${repo.color}`}>
                {repo.status}
              </div>
            </div>

            <p className="font-mono text-[11px] text-[var(--trust-blue)] font-bold uppercase mb-4 tracking-tighter">
              {repo.tagline}
            </p>
            <p className="text-[14px] leading-relaxed text-[var(--text-body)] opacity-70 italic font-serif flex-1">
              {repo.desc}
            </p>

            <div className="mt-8 pt-8 border-t border-[var(--border-light)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-30">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-mono text-[9px] opacity-30 font-bold uppercase">View on GitHub</span>
              </div>
              <span className="text-[var(--trust-blue)] group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        ))}
      </div>

      <Admonition type="note" title="Unified Namespace">
        Repositories under the <code>signetai-io</code> organization are strictly for protocol artifacts. Personal projects and experimental forks are maintained separately to ensure the integrity of the Master Signatory root.
      </Admonition>
    </div>
  );
};