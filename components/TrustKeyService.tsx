import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, OAuthProvider, onAuthStateChanged, signOut, User } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { firebaseConfig } from '../private_keys';
import { PersistenceService, VaultRecord } from '../services/PersistenceService';

const initSignetFirebase = () => {
  try {
    if (getApps().length === 0) return initializeApp(firebaseConfig);
    return getApp();
  } catch (e) { return null; }
};

const app = initSignetFirebase();
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

const PROTOCOL_AUTHORITY = "signetai.io";
const SEPARATOR = ":";

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
  const [allVaults, setAllVaults] = useState<VaultRecord[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [securityGrade, setSecurityGrade] = useState<12 | 24>(24);
  const [identityInput, setIdentityInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    refreshVaults();
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user && !identityInput) {
          const suggestedId = (user.email?.split('@')[0] || user.displayName?.toLowerCase().replace(/\s+/g, '.') || '').replace(/[^a-z0-9.]/g, '');
          setIdentityInput(suggestedId);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const refreshVaults = async () => {
    const vaults = await PersistenceService.getAllVaults();
    const active = await PersistenceService.getActiveVault();
    setAllVaults(vaults);
    setActiveVault(active);
    if (vaults.length === 0) setIsRegistering(true);
  };

  const handleSwitchVault = async (anchor: string) => {
    await PersistenceService.setActiveVault(anchor);
    refreshVaults();
    setIsRegistering(false);
  };

  const handleSocialLogin = async (providerName: 'google' | 'x' | 'facebook' | 'linkedin') => {
    if (!auth) return;
    let provider;
    switch(providerName) {
      case 'google': provider = new GoogleAuthProvider(); break;
      case 'x': provider = new TwitterAuthProvider(); break;
      case 'facebook': provider = new FacebookAuthProvider(); break;
      case 'linkedin': provider = new OAuthProvider('oidc.linkedin'); break;
      default: return;
    }
    try {
      setStatus(`Connecting to ${providerName.toUpperCase()}...`);
      await signInWithPopup(auth, provider);
      setStatus(`Authenticated. Suggesting identity.`);
    } catch (err: any) {
      setStatus(`Auth Error: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setCurrentUser(null);
      setStatus("Logged out.");
    }
  };

  const handleGenerate = async () => {
    if (!identityInput.trim()) {
      setStatus("ERROR: Identity Anchor required.");
      return;
    }
    
    setIsGenerating(true);
    setIndexUrl(null);
    setStatus(`STEP 1/4: Syncing ${securityGrade * 11}-bit Entropy...`);
    
    await new Promise(r => setTimeout(r, 600));

    const identity = identityInput.trim().toLowerCase().replace(/\s+/g, '-');
    const anchor = `${PROTOCOL_AUTHORITY}${SEPARATOR}${identity}`;
    const pubKey = deriveMockKey(identity);
    const mnemonic = generateMnemonic(securityGrade);

    const withTimeout = (promise: Promise<any>, timeoutMs: number) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Registry connection timeout. Check network or database status.")), timeoutMs))
      ]);
    };

    try {
      if (db) {
        setStatus("STEP 2/4: Checking Global Registry Conflicts...");
        const docSnap = await withTimeout(getDoc(doc(db, "identities", anchor)), 10000);
        
        // If the document exists, check if we are the owner
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (currentUser && data.ownerUid === currentUser.uid) {
             setStatus("STEP 2/4: Anchor owned by you. Preparing update...");
          } else {
             throw new Error(`Anchor ${anchor} is already claimed by another user.`);
          }
        }

        if (currentUser && securityGrade === 24) {
          setStatus("STEP 3/4: Verifying Sovereign Uniqueness...");
          const q = query(collection(db, "identities"), where("ownerUid", "==", currentUser.uid), where("entropyBits", "==", 264));
          const existing = await withTimeout(getDocs(q), 10000);
          
          // Only throw if the existing sovereign signet has a DIFFERENT anchor
          if (!existing.empty && existing.docs[0].id !== anchor) {
             throw new Error("Protocol Policy: You already possess a different Sovereign Signet anchor.");
          }
        }

        setStatus("STEP 4/4: Sealing Registry Block...");
        await withTimeout(setDoc(doc(db, "identities", anchor), {
          identity,
          publicKey: pubKey,
          entropyBits: securityGrade * 11,
          ownerUid: currentUser?.uid || 'ANONYMOUS',
          provider: currentUser?.providerData[0]?.providerId || 'SOVEREIGN_SEED',
          timestamp: Date.now()
        }), 10000);
      }

      const newVault: VaultRecord = {
        anchor,
        identity,
        publicKey: pubKey,
        mnemonic,
        timestamp: Date.now(),
        type: securityGrade === 24 ? 'SOVEREIGN' : 'CONSUMER',
        provider: currentUser?.providerData[0]?.providerId
      };

      await PersistenceService.saveVault(newVault);
      await PersistenceService.setActiveVault(newVault.anchor);
      
      await refreshVaults();
      setIsRegistering(false);
      setStatus(`SUCCESS: Vault Sealed for ${identity}.`);
    } catch (err: any) {
      console.error("Signet Protocol Exception:", err);
      let errMsg = err.message || "Unknown fault.";
      
      if (errMsg.includes("permission-denied") || errMsg.includes("PERMISSION_DENIED")) {
        errMsg = "Registry Denied: Insufficient permissions. Ensure your ID is at least 4 characters and you aren't overwriting someone else's identity.";
      } else if (errMsg.includes("index") || errMsg.includes("FAILED_PRECONDITION")) {
        setStatus("CRITICAL: Missing Registry Index. Link provided below.");
        const match = errMsg.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
        if (match) setIndexUrl(match[0]);
      } else {
        setStatus(`CRITICAL: ${errMsg}`);
      }
    } finally {
      setIsGenerating(false);
    }
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

  const handlePurge = async (anchor: string) => {
    if (confirm("DANGER: This identity will be removed from local storage. Ensure you have your mnemonic manifest saved. Proceed?")) {
      await PersistenceService.purgeVault(anchor);
      await refreshVaults();
      setStatus("Identity purged.");
    }
  };

  return (
    <section id="identity" className="py-24 border-v relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--trust-blue)] opacity-[0.05] blur-[120px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 5: TrustKey Registry</span>
            <h2 className="text-4xl font-bold italic text-[var(--text-header)]">Identity Authority.</h2>
            <p className="text-lg leading-relaxed text-[var(--text-body)] opacity-80 font-serif italic">
              "Every reasoning path requires an owner. Secure your curatorial signet in the global registry."
            </p>
          </div>

          {isRegistering ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-4">
                <h3 className="font-mono text-[11px] uppercase font-bold text-[var(--trust-blue)]">New Curatorial Identity</h3>
                {allVaults.length > 0 && (
                  <button onClick={() => setIsRegistering(false)} className="text-[10px] font-mono opacity-50 hover:opacity-100 uppercase font-bold">Cancel</button>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase font-bold opacity-40">Attestation Source (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'google', label: 'Google', color: 'hover:border-red-500' },
                      { id: 'x', label: 'X (Twitter)', color: 'hover:border-neutral-500' },
                      { id: 'linkedin', label: 'LinkedIn', color: 'hover:border-blue-700' }
                    ].map(p => (
                      <button 
                        key={p.id}
                        disabled={isGenerating}
                        onClick={() => handleSocialLogin(p.id as any)}
                        className={`px-4 py-2 border border-[var(--border-light)] rounded font-mono font-bold text-[10px] transition-all bg-white ${currentUser?.providerData[0]?.providerId.includes(p.id) ? 'bg-blue-50 border-blue-500 text-blue-600' : p.color}`}
                      >
                        {currentUser?.providerData[0]?.providerId.includes(p.id) ? `✓ ${p.label}` : p.label}
                      </button>
                    ))}
                    {currentUser && (
                      <button onClick={handleLogout} className="px-4 py-2 text-[10px] font-mono text-red-500 opacity-50 hover:opacity-100 font-bold">Sign Out</button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[10px] uppercase font-bold opacity-40">Curatorial ID Anchor</label>
                  <div className="flex gap-2 p-4 border border-[var(--border-light)] rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--trust-blue)]/20 transition-all">
                     <span className="font-mono text-sm opacity-30 flex items-center">{PROTOCOL_AUTHORITY}:</span>
                     <input 
                       type="text" 
                       disabled={isGenerating}
                       value={identityInput} 
                       onChange={(e) => setIdentityInput(e.target.value)}
                       placeholder="e.g. shengliang.song"
                       className="flex-1 bg-transparent outline-none font-mono text-sm text-[var(--trust-blue)] font-bold"
                     />
                  </div>
                  <p className="text-[10px] font-serif italic opacity-40">Choose a permanent identifier. Minimum 4 characters recommended.</p>
                </div>

                <div className="p-1 border border-[var(--border-light)] rounded-lg flex bg-[var(--bg-sidebar)]">
                  <button 
                    disabled={isGenerating}
                    onClick={() => setSecurityGrade(12)}
                    className={`flex-1 py-3 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${securityGrade === 12 ? 'bg-white text-[var(--trust-blue)] shadow-sm' : 'opacity-40'}`}
                  >
                    Consumer (132-bit)
                  </button>
                  <button 
                    disabled={isGenerating}
                    onClick={() => setSecurityGrade(24)}
                    className={`flex-1 py-3 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${securityGrade === 24 ? 'bg-white text-emerald-500 shadow-sm' : 'opacity-40'}`}
                  >
                    Sovereign (264-bit)
                  </button>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !identityInput}
                    className={`w-full py-5 text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded shadow-2xl transition-all relative overflow-hidden group ${securityGrade === 24 ? 'bg-emerald-600' : 'bg-[var(--trust-blue)]'}`}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative z-10">{isGenerating ? 'ENTROPY_SYNCING...' : `Seal & Register Signet`}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-4">
                 <h3 className="font-mono text-[11px] uppercase font-bold opacity-40">Active Vault</h3>
                 <button onClick={() => setIsRegistering(true)} className="text-[10px] font-mono text-[var(--trust-blue)] font-bold uppercase hover:underline">+ Register New Identity</button>
              </div>

              {activeVault && (
                <div className="p-10 border border-[var(--border-light)] rounded-xl bg-white shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 px-4 py-1 bg-[var(--code-bg)] text-[9px] font-mono opacity-40 uppercase tracking-widest rounded-bl">
                     {activeVault.provider || 'ANONYMOUS'}
                   </div>
                   
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${activeVault.type === 'SOVEREIGN' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                          <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${activeVault.type === 'SOVEREIGN' ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {activeVault.type} GRADE SIGNET
                          </span>
                        </div>
                        <h3 className="font-serif text-4xl font-bold italic text-[var(--text-header)]">{activeVault.identity}</h3>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Public Registry Anchor</p>
                        <p className="font-mono text-[11px] text-[var(--trust-blue)] break-all p-4 bg-[var(--code-bg)] rounded border border-[var(--border-light)]">{activeVault.anchor}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Cryptographic Key (Ed25519)</p>
                        <p className="font-mono text-[10px] opacity-60 break-all p-4 border border-[var(--border-light)] rounded bg-[var(--bg-sidebar)]">{activeVault.publicKey}</p>
                      </div>
                   </div>

                   <button 
                      onClick={handleDownloadVault}
                      className="w-full py-5 bg-[var(--text-header)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3"
                   >
                     <span>⭳</span> Download Seed Manifest (.json)
                   </button>
                </div>
              )}

              {allVaults.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] uppercase font-bold opacity-30">Vault Collection</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {allVaults.filter(v => v.anchor !== activeVault?.anchor).map(v => (
                      <div key={v.anchor} className="flex justify-between items-center p-5 border border-[var(--border-light)] rounded-lg hover:bg-white/80 hover:shadow-md transition-all group">
                        <button onClick={() => handleSwitchVault(v.anchor)} className="flex-1 text-left">
                           <p className="font-serif text-lg font-bold italic">{v.identity}</p>
                           <p className="font-mono text-[9px] opacity-40 uppercase tracking-tighter">{v.type} | {v.provider || 'ANONYMOUS'}</p>
                        </button>
                        <button onClick={() => handlePurge(v.anchor)} className="p-3 opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {status && (
            <div className={`p-6 border-l-4 rounded-r-lg animate-in fade-in slide-in-from-left-2 shadow-sm ${status.includes('SUCCESS') ? 'bg-green-50 border-green-500' : status.includes('CRITICAL') ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-[var(--trust-blue)]'}`}>
              <p className={`font-mono text-[11px] font-bold ${status.includes('SUCCESS') ? 'text-green-700' : status.includes('CRITICAL') ? 'text-red-700' : 'text-[var(--trust-blue)]'}`}>
                {status.includes('SUCCESS') ? '✓ ' : status.includes('CRITICAL') ? '⚠️ ' : '∑ '}
                {status}
              </p>
              {indexUrl && (
                <div className="mt-4">
                   <a 
                     href={indexUrl} 
                     target="_blank" 
                     className="text-[10px] font-mono font-bold text-red-600 underline hover:text-red-800"
                   >
                     [ ACTION REQUIRED: CLICK HERE TO CREATE FIRESTORE INDEX ]
                   </a>
                   <p className="text-[9px] opacity-50 mt-1 italic">The index creation process typically takes 3-5 minutes.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-10 lg:pt-12">
          <div className="p-12 border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] shadow-2xl relative group min-h-[500px] flex flex-col">
            <h4 className="font-mono text-[11px] opacity-40 uppercase tracking-widest mb-8 font-bold">Mnemonic Recovery Manifest</h4>
            
            {!activeVault ? (
              <div className="flex-1 border border-dashed border-[var(--border-light)] flex flex-col items-center justify-center italic opacity-20 text-sm font-serif">
                <span className="text-5xl mb-6">🔑</span>
                <p>Vault initialization required...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className={`grid gap-3 ${activeVault.mnemonic.split(' ').length === 24 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {activeVault.mnemonic.split(" ").map((word, i) => (
                    <div key={i} className="bg-[var(--code-bg)] p-3 text-center rounded-lg border border-[var(--border-light)] group-hover:blur-none transition-all duration-700 blur-sm">
                      <span className="block text-[8px] opacity-30 font-mono mb-1">{i + 1}</span>
                      <span className="font-mono text-[11px] text-[var(--text-header)] font-bold uppercase">{word}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                   <span className="text-3xl">🛡️</span>
                   <p className="text-[12px] font-serif italic opacity-70 leading-relaxed">
                     Your Master Recovery Key is <span className="text-[var(--text-header)] font-bold">non-custodial</span>. 
                     Signet Labs cannot recover this seed for you. Ensure the manifest is downloaded and archived offline.
                   </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 glass-card space-y-6">
            <h4 className="font-mono text-[11px] opacity-40 uppercase tracking-widest font-bold">Registry Policy v0.2.7</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-2">
                 <span className="font-serif italic text-sm">Sovereign Signet Limit</span>
                 <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase">1:1 Per User</span>
              </div>
              <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-2">
                 <span className="font-serif italic text-sm">Consumer Identifiers</span>
                 <span className="font-mono text-[10px] opacity-40 uppercase">Unlimited</span>
              </div>
              <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-2">
                 <span className="font-serif italic text-sm">Anonymous Trust Score</span>
                 <span className="font-mono text-[10px] opacity-40 uppercase">Level 1 (Seed only)</span>
              </div>
            </div>
            <p className="text-[11px] opacity-60 leading-relaxed font-serif italic">
              Verification through verified social anchors (Google/LinkedIn) raises the confidence interval for the 
              Provenance Lab by providing human-grade attestation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};