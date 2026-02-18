import React from 'react';

const CryptoCard: React.FC<{ symbol: string; name: string; address: string; color: string }> = ({ symbol, name, address, color }) => (
  <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 p-2 opacity-10 font-bold text-4xl ${color}`}>{symbol}</div>
    <div className="relative z-10">
        <h4 className="font-bold text-[var(--text-header)] mb-1">{name}</h4>
        <p className="font-mono text-[10px] opacity-50 uppercase tracking-widest mb-4">Protocol Treasury</p>
        
        <div className="bg-[var(--code-bg)] p-3 rounded border border-[var(--border-light)] flex justify-between items-center gap-4">
            <code className="text-[10px] font-mono text-[var(--trust-blue)] truncate">{address}</code>
            <button 
                onClick={() => navigator.clipboard.writeText(address)}
                className="text-[10px] font-bold uppercase opacity-40 hover:opacity-100 hover:text-[var(--trust-blue)]"
            >
                Copy
            </button>
        </div>
    </div>
  </div>
);

export const DonationView: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--admonition-bg)] border border-[var(--trust-blue)] mb-8">
           <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold uppercase tracking-widest">Public Good Infrastructure</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--text-header)] mb-8 italic">
          Sustain the Protocol.
        </h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic max-w-2xl mx-auto">
          Signet is building the immutable trust layer for the AI age. Your grants and contributions ensure the registry remains neutral, decentralized, and accessible to all 8 billion humans.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
         <div className="p-10 bg-black text-white rounded-xl shadow-2xl flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-50"></div>
            <div className="relative z-10">
                <h3 className="text-3xl font-bold italic mb-2">GitHub Sponsors</h3>
                <p className="opacity-70 text-sm">Recurring support for ongoing development and server costs.</p>
            </div>
            <a 
                href="https://github.com/sponsors/signetai-io" 
                target="_blank" 
                rel="noreferrer"
                className="relative z-10 w-full py-4 bg-white text-black font-mono text-xs uppercase font-bold tracking-[0.3em] rounded text-center hover:bg-neutral-200 transition-colors"
            >
                Become a Sponsor
            </a>
         </div>

         <div className="p-10 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-xl shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
                <h3 className="text-3xl font-bold italic mb-2 text-[var(--text-header)]">Enterprise Grants</h3>
                <p className="opacity-70 text-sm text-[var(--text-body)]">For organizations requiring SLA support, custom implementation, or private registry nodes.</p>
            </div>
            <a 
                href="mailto:grants@signetai.io"
                className="w-full py-4 border border-[var(--text-header)] text-[var(--text-header)] font-mono text-xs uppercase font-bold tracking-[0.3em] rounded text-center hover:bg-[var(--text-header)] hover:text-[var(--bg-standard)] transition-colors"
            >
                Contact Labs
            </a>
         </div>
      </div>

      <section>
        <h3 className="font-mono text-[11px] uppercase tracking-widest font-bold mb-8 text-center opacity-40">Direct Crypto Contribution</h3>
        <div className="grid grid-cols-1 gap-6">
            <CryptoCard 
                symbol="ETH" 
                name="Ethereum / EVM" 
                address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" 
                color="text-indigo-500"
            />
            <CryptoCard 
                symbol="SOL" 
                name="Solana" 
                address="H79V...Solana_Address_Placeholder...9XyZ" 
                color="text-purple-500"
            />
        </div>
      </section>
    </div>
  );
};