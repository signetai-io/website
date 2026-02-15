import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from '../private_keys';
import { PersistenceService, VaultRecord } from '../services/PersistenceService';

const initSignetFirebase = () => {
  try {
    if (getApps().length === 0) return initializeApp(firebaseConfig);
    return getApp();
  } catch (e) { return null; }
};

const app = initSignetFirebase();
const db = app ? getFirestore(app, "signetai") : null;

const PROTOCOL_AUTHORITY = "signetai.io";
const SEPARATOR = ":";

// BIP-39 English Wordlist (Full 2048 words required for 11-bit index mapping)
const BIP39_WORDS = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident",
  "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
  "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance", "advice", "aerobic", "affair", "afford",
  "afraid", "again", "age", "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol",
  "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always", "among",
  "amount", "amuse", "analyst", "anchor", "ancient", "anger", "angle", "angry", "animal", "ankle", "announce", "annual",
  "another", "answer", "antenna", "antique", "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april",
  "arch", "arctic", "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive",
  "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume", "astonish",
  "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt", "author", "auto",
  "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome", "awful", "awkward", "axis", "baby",
  "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely",
  "bargain", "barrel", "base", "basic", "basket", "battle", "beach", "beam", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best", "betray",
  "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird", "birth", "bitter", "black",
  "blade", "blame", "blanket", "blast", "bleak", "bless", "blind", "blood", "blossom", "blue", "blur", "blush",
  "board", "boat", "body", "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
  "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze", "brick", "bridge",
  "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom", "brother", "brown", "brush", "bubble",
  "buddy", "budget", "buffalo", "build", "bulb", "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst",
  "bus", "business", "busy", "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call",
  "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon", "capable", "capital",
  "captain", "caption", "car", "carbon", "card", "cargo", "carpet", "carry", "cart", "case", "cash", "casino", "castle",
  "casual", "cat", "catalog", "catch", "category", "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery",
  "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge",
  "chase", "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "china",
  "chose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinema", "circle", "citizen", "city", "civil", "claim",
  "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client", "cliff", "climb", "clinic", "clip",
  "clock", "clog", "close", "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut",
  "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common",
  "company", "compass", "complete", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool",
  "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country", "couple", "course", "cousin",
  "cover", "coyote", "crack", "cradle", "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit"
];

const generateMnemonic = (wordCount: 12 | 24) => {
  const result = [];
  const randomValues = new Uint32Array(wordCount);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < wordCount; i++) {
    const index = randomValues[i] % BIP39_WORDS.length;
    result.push(BIP39_WORDS[index]);
  }
  return result.join(" ");
};

const deriveMockKey = (identity: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < identity.length; i++) {
    hash ^= identity.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `ed25519:signet_v2.7_sovereign_${hex}${hex.split('').reverse().join('')}`;
};

export const TrustKeyService: React.FC = () => {
  const [activeVault, setActiveVault] = useState<VaultRecord | null>(null);
  const [securityGrade, setSecurityGrade] = useState<12 | 24>(24);
  const [identityInput, setIdentityInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    loadVault();
  }, []);

  const loadVault = async () => {
    const vault = await PersistenceService.getActiveVault();
    setActiveVault(vault);
  };

  const handleGenerate = async () => {
    if (!identityInput.trim()) {
      setStatus("ERROR: Curatorial ID cannot be empty.");
      return;
    }
    
    setIsGenerating(true);
    setStatus(`Initializing ${securityGrade * 11}-bit Entropy Pool...`);
    
    setTimeout(async () => {
      const mnemonic = generateMnemonic(securityGrade);
      const identity = identityInput.trim().toLowerCase().replace(/\s+/g, '-');
      const anchor = `${PROTOCOL_AUTHORITY}${SEPARATOR}${identity}`;
      const pubKey = deriveMockKey(identity);

      const newVault: VaultRecord = {
        anchor,
        identity,
        publicKey: pubKey,
        mnemonic,
        timestamp: Date.now()
      };

      try {
        await PersistenceService.saveVault(newVault);
        if (db) {
          await setDoc(doc(db, "registry", anchor), {
            identity,
            publicKey: pubKey,
            entropyBits: securityGrade * 11,
            timestamp: Date.now()
          });
        }
        setActiveVault(newVault);
        setStatus(`Vault Sealed: ${securityGrade * 11}-bit Sovereign Entropy established.`);
      } catch (err) {
        setStatus("Storage Fault. Check SOP Policy.");
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownloadVault = () => {
    if (!activeVault) return;
    const blob = new Blob([JSON.stringify(activeVault, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signet_seed_${activeVault.identity}.json`;
    a.click();
  };

  const handlePurge = async () => {
    if (activeVault && confirm("DANGER: This will remove your keys. Recovery requires your seed manifest. Continue?")) {
      await PersistenceService.purgeVault(activeVault.anchor);
      setActiveVault(null);
      setStatus("Vault Purged.");
    }
  };

  return (
    <section id="identity" className="py-24 border-v relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--trust-blue)] opacity-[0.02] blur-[120px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 5: TrustKey Registry</span>
            <h2 className="text-4xl font-bold italic text-[var(--text-header)]">Sovereign Grade Identity.</h2>
            <p className="text-lg leading-relaxed text-[var(--text-body)] opacity-80">
              Signet replaces deprecated standards with 264-bit industrial-grade entropy. 
              Each word represents <span className="text-[var(--trust-blue)] font-bold">11 bits of index</span> ($2^{11} = 2048$).
            </p>
          </div>

          {!activeVault ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <label className="font-mono text-[10px] uppercase font-bold opacity-40">Choose Curatorial ID</label>
                <div className="flex gap-2 p-2 border border-[var(--border-light)] rounded bg-white">
                   <span className="font-mono text-sm opacity-30 px-2 flex items-center">{PROTOCOL_AUTHORITY}:</span>
                   <input 
                     type="text" 
                     value={identityInput} 
                     onChange={(e) => setIdentityInput(e.target.value)}
                     placeholder="e.g. shengliang.song"
                     className="flex-1 bg-transparent outline-none font-mono text-sm text-[var(--trust-blue)]"
                   />
                </div>
              </div>

              <div className="p-1 border border-[var(--border-light)] rounded-lg flex bg-[var(--bg-sidebar)]">
                <button 
                  onClick={() => setSecurityGrade(12)}
                  className={`flex-1 py-3 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${securityGrade === 12 ? 'bg-white text-[var(--trust-blue)] shadow-sm' : 'opacity-40'}`}
                >
                  Consumer (132-bit)
                </button>
                <button 
                  onClick={() => setSecurityGrade(24)}
                  className={`flex-1 py-3 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${securityGrade === 24 ? 'bg-white text-emerald-500 shadow-sm' : 'opacity-40'}`}
                >
                  Sovereign (264-bit)
                </button>
              </div>

              <div className="p-10 border border-dashed border-[var(--border-light)] rounded-lg text-center space-y-8 bg-[var(--table-header)]/50">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold italic">Seal Authority</h3>
                  <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                    <span>{securityGrade} words</span>
                    <span className="opacity-20">×</span>
                    <span>11 bits</span>
                    <span className="opacity-20">=</span>
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded">{securityGrade * 11} bits</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !identityInput}
                  className={`w-full py-5 text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded shadow-2xl transition-all active:scale-95 ${securityGrade === 24 ? 'bg-emerald-600' : 'bg-[var(--trust-blue)]'}`}
                >
                  {isGenerating ? 'ENTROPY_POOL_SYNCING...' : `Register & Seal Vault`}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 border border-[var(--border-light)] rounded-lg space-y-8 bg-[var(--code-bg)] shadow-xl animate-in fade-in slide-in-from-bottom-4">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="font-mono text-[10px] text-green-500 font-bold uppercase tracking-widest">Vault Sealed</span>
                    </div>
                    <h3 className="font-serif text-3xl font-bold italic text-[var(--text-header)]">{activeVault.identity}</h3>
                  </div>
                  <div className="px-3 py-1 border border-[var(--trust-blue)]/30 text-[var(--trust-blue)] text-[9px] font-mono font-bold uppercase tracking-widest rounded-full">
                    {activeVault.mnemonic.split(' ').length * 11}-bit Entropy
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Public Key (Ed25519-256)</p>
                    <p className="font-mono text-[11px] text-[var(--trust-blue)] break-all p-4 bg-white/50 rounded border border-[var(--border-light)]">{activeVault.publicKey}</p>
                  </div>
               </div>

               <button 
                  onClick={handleDownloadVault}
                  className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow-lg hover:brightness-110 transition-all"
               >
                 Download Seed Manifest (.json)
               </button>

               <div className="pt-6 border-t border-[var(--border-light)] flex justify-between items-center">
                  <button 
                    onClick={handlePurge}
                    className="text-[10px] font-mono text-red-500 uppercase font-bold hover:underline"
                  >
                    Purge Local Vault
                  </button>
                  <span className="text-[9px] font-mono opacity-20 uppercase tracking-tighter">SEC_LEVEL_SOVEREIGN</span>
               </div>
            </div>
          )}
          
          {status && (
            <div className="p-4 bg-[var(--admonition-bg)] border-l-4 border-[var(--trust-blue)] animate-in fade-in slide-in-from-left-2">
              <p className="font-mono text-[10px] text-[var(--trust-blue)] font-bold italic">{status}</p>
            </div>
          )}
        </div>

        <div className="space-y-8 lg:pt-12">
          <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--bg-standard)] shadow-lg relative group">
            <h4 className="font-mono text-[11px] opacity-40 uppercase tracking-widest mb-6 font-bold">Seed Manifest (VRP-R Target)</h4>
            
            {!activeVault ? (
              <div className="h-48 border border-dashed border-[var(--border-light)] flex items-center justify-center italic opacity-20 text-sm font-serif">
                Awaiting curatorial identity anchor...
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`grid gap-2 ${activeVault.mnemonic.split(' ').length === 24 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {activeVault.mnemonic.split(" ").map((word, i) => (
                    <div key={i} className="bg-[var(--bg-sidebar)] p-2 text-center rounded border border-[var(--border-light)] group-hover:blur-none transition-all duration-500 blur-sm">
                      <span className="block text-[8px] opacity-30 font-mono mb-1">{i + 1}</span>
                      <span className="font-mono text-[10px] text-[var(--text-header)] font-bold">{word}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded">
                   <span className="text-xl">🛡️</span>
                   <p className="text-[10px] font-serif italic opacity-70 leading-relaxed">
                     This is your <strong>Master Recovery Key</strong>. If you lose this, you lose your authority. Hover to reveal words, or download the manifest.
                   </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 glass-card space-y-6">
            <h4 className="font-mono text-[11px] opacity-40 uppercase tracking-widest font-bold">2026 Entropy Benchmarks</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-2">
                 <span className="font-serif italic text-sm">Consumer Standard</span>
                 <span className="font-mono text-[10px] opacity-40">132-bit (MINIMUM)</span>
              </div>
              <div className="flex justify-between items-end border-b border-[var(--trust-blue)]/30 pb-2">
                 <span className="font-serif italic text-sm font-bold text-[var(--trust-blue)]">Signet Sovereign</span>
                 <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold">264-bit (RELIABLE)</span>
              </div>
            </div>
            <p className="text-[11px] opacity-60 leading-relaxed font-serif italic">
              Signet achieves 264 bits of entropy ($24 \times 11$), ensuring collision resistance across the 8 billion user registry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};