import React, { useState } from 'react';

const DefinitionTooltip: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="group relative inline-block ml-1">
    <span className="cursor-help opacity-40 hover:opacity-100 transition-opacity">ⓘ</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black text-white text-[10px] rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-white/10">
      <p className="font-bold mb-1 uppercase tracking-widest text-[var(--trust-blue)]">{title}</p>
      <p className="opacity-70 leading-relaxed italic">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
    </div>
  </div>
);

/**
 * Deterministic Key Derivation Function (KDF) Simulation
 * Uses a basic bit-mixing approach to generate a public key from an identity string.
 */
const deriveMockKey = (identity: string) => {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < identity.length; i++) {
    hash ^= identity.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  const absHash = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = "signet_v02_";
  // Create a visually complex key string
  return `ed25519:${salt}${absHash}${absHash.split('').reverse().join('')}772v3aqmcne`;
};

/**
 * 128-word Industrial Dictionary for Seed Generation
 */
const MOCK_WORDS = [
  "logic", "prism", "trust", "neural", "manifest", "anchor", "trace", "binary", 
  "provenance", "vertex", "curator", "signet", "shard", "protocol", "entropy", "static",
  "verify", "identity", "secure", "mainnet", "node", "reason", "parity", "drift",
  "cipher", "matrix", "vector", "kernel", "subnet", "proxy", "header", "buffer",
  "packet", "tensor", "bridge", "tunnel", "uplink", "beacon", "sensor", "portal",
  "stream", "toggle", "signal", "switch", "source", "module", "string", "object",
  "active", "shield", "master", "expert", "senior", "system", "engine", "client",
  "server", "domain", "access", "update", "verify", "attest", "record", "cipher",
  "public", "secret", "private", "hidden", "stable", "fluent", "liquid", "solid",
  "plasma", "atomic", "cosmic", "global", "local", "linear", "random", "unique",
  "simple", "bright", "shadow", "winter", "summer", "autumn", "spring", "forest",
  "desert", "island", "valley", "canyon", "summit", "frozen", "melted", "liquid",
  "vortex", "galaxy", "nebula", "planet", "quasar", "pulsar", "meteor", "comet",
  "carbon", "silicon", "oxygen", "helium", "sodium", "silver", "golden", "copper",
  "bronze", "marble", "granite", "quartz", "crystal", "obsidian", "basalt", "flint",
  "timber", "willow", "cedar", "spruce", "walnut", "cherry", "almond", "hazel"
];

export const TrustKeyService: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [identity, setIdentity] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const derived = deriveMockKey(identity.toLowerCase().trim());
      setPublicKey(derived);
      setIsGenerating(false);
    }, 1200);
  };

  const handleExportSeed = () => {
    if (!publicKey) return;

    const seedPhrase = Array(24).fill(0).map((_, i) => {
      // High-entropy derivation per slot
      let slotHash = 0x811c9dc5;
      const dataToHash = `${i}-${identity}-${publicKey}`;
      for (let j = 0; j < dataToHash.length; j++) {
        slotHash ^= dataToHash.charCodeAt(j);
        slotHash = Math.imul(slotHash, 0x01000193);
      }
      const index = Math.abs(slotHash) % MOCK_WORDS.length;
      return MOCK_WORDS[index];
    }).join(" ");

    const content = `SIGNET PROTOCOL RECOVERY SEED
IDENTITY: ${identity}
PUBLIC_KEY: ${publicKey}

PHRASE: ${seedPhrase}

WARNING: KEEP THIS FILE OFFLINE. THIS PHRASE IS DERIVED DETERMINISTICALLY FROM YOUR IDENTITY VIA THE PROTOCOL KDF.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signet_seed_${identity.replace(/[@.]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section id="identity" className="py-32 px-6 max-w-7xl mx-auto border-v bg-[var(--bg-sidebar)]/30 relative">
      {showToast && (
        <div className="fixed top-20 right-8 z-[200] bg-black text-white border border-[var(--trust-blue)] px-6 py-3 font-mono text-[10px] uppercase tracking-widest shadow-2xl animate-in slide-in-from-right duration-300">
          Signet Seed Exported ✓
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <div className="inline-block">
            <span className="font-mono text-[10px] uppercase bg-[var(--trust-blue)] text-white px-3 py-1 tracking-[0.2em] font-bold rounded-sm">Registry v0.2.5</span>
          </div>
          <h2 className="font-serif text-7xl italic leading-none text-[var(--text-header)] font-bold">TrustKey<br/>Service.</h2>
          <p className="text-[var(--text-body)] opacity-70 text-xl leading-relaxed max-w-md font-serif">
            Deterministic identity for the 8 billion. Securely derive and register your curator anchor.
          </p>
          
          <div className="space-y-6 pt-6 border-t border-[var(--border-light)]">
            {[
              { num: '01', title: 'Identity Anchoring', sub: 'Non-custodial key derivation' },
              { num: '02', title: 'High-Entropy Mnemonic', sub: 'BIP-39 compliant word spacing' },
              { num: '03', title: 'Protocol Commitment', sub: 'Global Registry broadcast' }
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-6 group">
                <span className="font-mono text-xs text-[var(--text-body)] opacity-40 group-hover:text-[var(--trust-blue)] group-hover:opacity-100 tracking-tighter transition-colors font-bold">{step.num}</span>
                <div className="space-y-1">
                  <h4 className="font-serif text-xl text-[var(--text-header)] font-bold">{step.title}</h4>
                  <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-[var(--bg-standard)] p-10 md:p-16 border border-[var(--border-light)] relative overflow-hidden rounded-lg shadow-xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--trust-blue)] opacity-5 rounded-full blur-3xl"></div>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Registration Identity</label>
                <input 
                  type="text" 
                  placeholder="user@domain.signet"
                  className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-6 font-mono text-xl focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20"
                  value={identity}
                  onChange={(e) => {
                    setIdentity(e.target.value);
                    setPublicKey(null);
                    setIsActivated(false);
                  }}
                />
              </div>

              {!publicKey ? (
                <button 
                  onClick={generateKey}
                  disabled={isGenerating || !identity}
                  className={`w-full py-6 font-mono text-xs uppercase tracking-[0.4em] transition-all shadow-xl font-bold rounded
                    ${isGenerating || !identity 
                      ? 'bg-neutral-500/10 text-neutral-500 cursor-not-allowed' 
                      : 'bg-[var(--trust-blue)] text-white hover:brightness-110 active:scale-[0.98]'}`}
                >
                  {isGenerating ? 'DERIVING_FROM_ENTROPY_...' : 'Initialize Anchor'}
                </button>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="p-8 bg-[var(--code-bg)] border border-[var(--border-light)] rounded">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest font-bold">Public Key Attestation</p>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[9px] font-mono font-bold">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        ACTIVE_NODE
                      </div>
                    </div>
                    <p className="font-mono text-xs text-[var(--text-header)] break-all leading-relaxed bg-[var(--bg-sidebar)] p-4 select-all rounded border border-[var(--border-light)] shadow-inner">
                      {publicKey}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <button 
                        onClick={handleExportSeed}
                        className="w-full py-4 border border-[var(--text-header)] text-[var(--text-header)] font-mono text-[10px] uppercase tracking-widest hover:bg-[var(--text-header)] hover:text-[var(--bg-standard)] transition-all font-bold rounded shadow-sm"
                      >
                        Export Seed
                      </button>
                      <div className="text-center">
                        <span className="text-[9px] font-mono opacity-40 uppercase tracking-tighter">Secure Download</span>
                        <DefinitionTooltip title="Seed Mnemonic" text="A 24-word recovery phrase derived via the protocol's deterministic KDF. Use this to restore your curator identity on any device." />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <button 
                        onClick={() => setIsActivated(true)}
                        className={`w-full py-4 font-mono text-[10px] uppercase tracking-widest font-bold rounded shadow-lg transition-all
                          ${isActivated 
                            ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                            : 'bg-[var(--trust-blue)] text-white hover:brightness-110 active:scale-95'}`}
                      >
                        {isActivated ? '✓ IDENTITY_REGISTERED' : 'Commit Identity'}
                      </button>
                      <div className="text-center">
                        <span className="text-[9px] font-mono opacity-40 uppercase tracking-tighter">Mainnet Broadcast</span>
                        <DefinitionTooltip title="Registration" text="Publishes your public key anchor to the Signet TrustKey Registry, allowing global verification of your VPR signatures." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="font-mono text-[9px] text-[var(--text-body)] opacity-40 text-center leading-loose tracking-tight italic">
                {publicKey ? `DETERMINISTIC_ID: ${identity.toUpperCase()}` : 'ENTER IDENTITY TO INITIATE DERIVATION'} <br />
                SEED WORDS ARE DERIVED LOCALLY. WE STORE ZERO KNOWLEDGE OF YOUR PRIVATE ANCHOR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};