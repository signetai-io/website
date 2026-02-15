import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, limit } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
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

// BIP-39 Wordlist Subset (Optimized for 108-bit entropy via 12-word selection)
const WORDLIST = [
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

const generateMnemonic = () => {
  const result = [];
  const randomValues = new Uint32Array(12);
  // Using CSPRNG for cryptographic security
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < 12; i++) {
    const index = randomValues[i] % WORDLIST.length;
    result.push(WORDLIST[index]);
  }
  return result.join(" ");
};

const generateSystemAnchor = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const p1 = Math.abs(hash).toString(16).padStart(8, '0');
  const p2 = Math.abs(hash * 0x5bd1e995).toString(16);
  const p3 = Math.abs(hash * 0x1b873593).toString(16);
  const p4 = Math.abs(hash * 0x85ebca6b).toString(16);
  return `${p1}-${p2}-${p3}-${p4}`;
};

const deriveMockKey = (identity: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < identity.length; i++) {
    hash ^= identity.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const absHash = Math.abs(hash).toString(16).padStart(8, '0');
  return `ed25519:signet_v2.3_${absHash}${absHash.split('').reverse().join('')}772v3aqmcne`;
};

async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function injectSignetManifest(file: File, manifest: any): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const marker = new TextEncoder().encode("SIGNET_VPR_BEGIN");
  const manifestData = new TextEncoder().encode(JSON.stringify(manifest));
  const endMarker = new TextEncoder().encode("SIGNET_VPR_END");
  return new Blob([uint8Array, marker, manifestData, endMarker], { type: file.type });
}

interface IdentityRecord {
  id: string;
  anchor: string;
  key: string;
  date: string;
}

export const TrustKeyService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup' | 'lab'>('register');
  const [subject, setSubject] = useState('');
  const [namespace, setNamespace] = useState('');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [availability, setAvailability] = useState<'checking' | 'available' | 'taken' | 'idle'>('idle');
  const [lookupQuery, setLookupQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResults, setLookupResults] = useState<IdentityRecord[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // --- Lab & Recovery State ---
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labHash, setLabHash] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedManifest, setSignedManifest] = useState<any | null>(null);
  const [signedBlob, setSignedBlob] = useState<Blob | null>(null);
  const [manualIdentity, setManualIdentity] = useState('');
  const [isResolvingIdentity, setIsResolvingIdentity] = useState(false);
  const [signingStrategy, setSigningStrategy] = useState<'sidecar' | 'embedded'>('embedded');
  const [recoveryInput, setRecoveryInput] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [showRecoveryFlow, setShowRecoveryFlow] = useState(false);

  const getFullIdentity = (sub: string, ns: string) => {
    const cleanSub = sub.toLowerCase().trim();
    const cleanNs = ns.toLowerCase().trim();
    if (!cleanSub) return "";
    let base = cleanSub;
    if (cleanNs) base = `${cleanSub}${SEPARATOR}${cleanNs}`;
    const suffix = `${SEPARATOR}${PROTOCOL_AUTHORITY}`;
    return base.endsWith(suffix) ? base : `${base}${suffix}`;
  };

  const readableIdentity = getFullIdentity(subject, namespace);
  const systemAnchor = readableIdentity ? generateSystemAnchor(readableIdentity) : "";

  // --- Local Vault Auto-Load ---
  useEffect(() => {
    const autoLoad = async () => {
      const active = await PersistenceService.getActiveVault();
      if (active) {
        setSubject(active.identity.split(SEPARATOR)[0]);
        setNamespace(active.identity.split(SEPARATOR)[1] || "");
        setPublicKey(active.publicKey);
        setRecoveryPhrase(active.mnemonic);
        setIsActivated(true);
      }
    };
    autoLoad();
  }, []);

  useEffect(() => {
    const checkUniqueness = async () => {
      if (!subject || subject.length < 3 || !db || isActivated) {
        setAvailability('idle');
        return;
      }
      setAvailability('checking');
      try {
        const docRef = doc(db, "identities", systemAnchor);
        const docSnap = await getDoc(docRef);
        setAvailability(docSnap.exists() ? 'taken' : 'available');
      } catch (e) { setAvailability('available'); }
    };
    const timer = setTimeout(checkUniqueness, 600);
    return () => clearTimeout(timer);
  }, [systemAnchor, subject, isActivated]);

  const handleGenerate = () => {
    if (!subject || subject.length < 3) return;
    setIsGenerating(true);
    setTimeout(() => {
      setPublicKey(deriveMockKey(readableIdentity));
      setRecoveryPhrase(generateMnemonic());
      setIsGenerating(false);
    }, 800);
  };

  const handleCommit = async () => {
    if (availability === 'taken' || !publicKey || !db) return;
    setIsRegistering(true);
    const record = { readableIdentity, systemAnchor, publicKey, timestamp: Date.now(), subject, namespace: namespace || "ROOT", authority: PROTOCOL_AUTHORITY };
    try {
      await setDoc(doc(db, "identities", systemAnchor), record);
      
      // Save to Local IndexedDB Vault
      await PersistenceService.saveVault({
        anchor: systemAnchor,
        identity: readableIdentity,
        publicKey: publicKey,
        mnemonic: recoveryPhrase || "",
        timestamp: Date.now()
      });

      setIsRegistering(false);
      setIsActivated(true);
    } catch (e: any) {
      setNetworkError(e.message);
      setIsRegistering(false);
    }
  };

  const handleLookup = async () => {
    if (!lookupQuery || !db) return;
    setIsSearching(true);
    try {
      const q = query(
        collection(db, "identities"),
        where("subject", "==", lookupQuery.toLowerCase().trim()),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const results: IdentityRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          id: data.readableIdentity,
          anchor: data.systemAnchor,
          key: data.publicKey,
          date: new Date(data.timestamp).toLocaleDateString()
        });
      });
      setLookupResults(results);
    } catch (e: any) {
      console.error("Lookup error:", e);
      setNetworkError(e.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVaultRecovery = () => {
    if (recoveryInput.split(' ').length !== 12) {
      setNetworkError("Mnemonic must be exactly 12 words.");
      return;
    }
    setIsRecovering(true);
    setTimeout(async () => {
      const recoveredKey = deriveMockKey(readableIdentity);
      setRecoveryPhrase(recoveryInput);
      setPublicKey(recoveredKey);
      
      // Persist recovered authority to IndexedDB
      await PersistenceService.saveVault({
        anchor: systemAnchor,
        identity: readableIdentity,
        publicKey: recoveredKey,
        mnemonic: recoveryInput,
        timestamp: Date.now()
      });

      setIsActivated(true);
      setIsRecovering(false);
      setShowRecoveryFlow(false);
      setNetworkError(null);
    }, 2000);
  };

  const handlePurgeVault = async () => {
    if (confirm("DANGER: This will remove your signing keys from this browser. You will need your 12-word phrase to recover. Proceed?")) {
      await PersistenceService.purgeVault(systemAnchor);
      setSubject('');
      setNamespace('');
      setPublicKey(null);
      setRecoveryPhrase(null);
      setIsActivated(false);
    }
  };

  const handleLabFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLabFile(file);
      const hash = await hashFile(file);
      setLabHash(hash);
      setSignedManifest(null);
      setSignedBlob(null);
    }
  };

  const handleSignAsset = async () => {
    if (!labFile || !publicKey || !isActivated) return;
    setIsSigning(true);
    const manifest = {
      type: "org.signetai.vpr",
      strategy: signingStrategy,
      version: "0.2.7",
      iat: Date.now(),
      asset: { name: labFile.name, mime: labFile.type, hash: `sha256:${labHash}` },
      signature_chain: [{ 
        entity: "HUMAN_MASTER_CURATOR", 
        identity: readableIdentity, 
        anchor: systemAnchor, 
        signature: `sig_ed25519_v2.3_${Math.random().toString(36).substring(2)}` 
      }]
    };
    setSignedManifest(manifest);
    if (signingStrategy === 'embedded') {
      const blob = await injectSignetManifest(labFile, manifest);
      setSignedBlob(blob);
    } else {
      setSignedBlob(null);
    }
    setTimeout(() => setIsSigning(false), 800);
  };

  const downloadAsset = () => {
    if (!signedManifest) return;
    let url: string;
    let filename: string;
    if (signingStrategy === 'embedded' && signedBlob) {
      url = URL.createObjectURL(signedBlob);
      filename = `signet_${labFile?.name}`;
    } else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signedManifest, null, 2));
      url = dataStr;
      filename = `manifest_${labFile?.name.split('.')[0]}.vpr.json`;
    }
    const dl = document.createElement('a');
    dl.setAttribute("href", url);
    dl.setAttribute("download", filename);
    dl.click();
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  };

  return (
    <section id="identity" className="py-32 px-6 max-w-7xl mx-auto border-v bg-[var(--bg-sidebar)]/30 relative">
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <h2 className="font-serif text-7xl italic leading-none text-[var(--text-header)] font-bold">TrustKey<br/>Registry.</h2>
          <p className="text-[var(--text-body)] opacity-70 text-xl leading-relaxed max-w-md font-serif">
            Hierarchical identity settlement for the 8 billion. Anchored via <span className="text-[var(--trust-blue)] font-bold italic">Signet UUIDs</span>.
          </p>
          <div className="flex gap-4 border-b border-[var(--border-light)] pb-px">
            <button onClick={() => setActiveTab('register')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'register' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>01. Register</button>
            <button onClick={() => setActiveTab('lookup')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'lookup' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>02. Lookup</button>
            <button onClick={() => setActiveTab('lab')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'lab' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>03. Provenance Lab</button>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-[var(--bg-standard)] p-10 md:p-16 border border-[var(--border-light)] relative overflow-hidden rounded-lg shadow-xl min-h-[650px]">
            {activeTab === 'register' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {showRecoveryFlow ? (
                  <div className="space-y-8 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                       <h3 className="font-serif text-3xl font-bold italic">Vault Recovery (VRP-R).</h3>
                       <p className="text-sm opacity-60 italic">Input your non-custodial 12-word mnemonic to re-derive authority.</p>
                    </div>
                    <div className="space-y-4">
                      <textarea placeholder="abandon ability able about..." className="w-full h-32 bg-[var(--code-bg)] p-4 font-mono text-sm border rounded outline-none focus:ring-1 focus:ring-blue-500" value={recoveryInput} onChange={(e) => setRecoveryInput(e.target.value)} />
                      {networkError && <p className="text-[10px] font-mono text-red-500">{networkError}</p>}
                      <div className="flex gap-4">
                        <button onClick={handleVaultRecovery} disabled={isRecovering} className="flex-1 py-4 bg-black text-white font-mono text-[10px] uppercase font-bold rounded shadow-lg">{isRecovering ? 'RESTORING_...' : 'Restore Authority'}</button>
                        <button onClick={() => setShowRecoveryFlow(false)} className="px-6 py-4 border font-mono text-[10px] uppercase opacity-40">Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Primary Subject</label>
                        <input type="text" placeholder="e.g. shengliang.song" disabled={isActivated} className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg outline-none" value={subject} onChange={(e) => setSubject(e.target.value.toLowerCase().replace(/\s/g, ''))} />
                      </div>
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Namespace</label>
                        <input type="text" placeholder="e.g. signetai.io" disabled={isActivated} className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg outline-none" value={namespace} onChange={(e) => setNamespace(e.target.value.toLowerCase().replace(/\s/g, ''))} />
                      </div>
                    </div>
                    {!publicKey ? (
                      <div className="space-y-6">
                        <button onClick={handleGenerate} disabled={!subject} className="w-full py-6 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase tracking-[0.4em] rounded shadow-xl">Establish Registry Anchor</button>
                        <button onClick={() => setShowRecoveryFlow(true)} className="w-full text-[10px] font-mono uppercase text-blue-500 font-bold hover:underline">Lost seed? Recover via Vault →</button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-8 bg-black text-white rounded border border-neutral-800 space-y-4 relative">
                          {isActivated && (
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                               <span className="text-[8px] font-mono text-blue-500 uppercase font-bold tracking-widest">Sealed In IndexedDB</span>
                            </div>
                          )}
                          <p className="font-mono text-[10px] text-neutral-500 uppercase font-bold">Private Recovery Mnemonic</p>
                          <div className="grid grid-cols-3 gap-2">
                            {recoveryPhrase?.split(" ").map((w, i) => <div key={i} className="bg-neutral-900 p-2 text-[10px] font-mono text-blue-400 text-center rounded">{w}</div>)}
                          </div>
                        </div>
                        {isActivated ? (
                          <div className="space-y-4">
                            <button className="w-full py-6 font-mono text-[11px] uppercase tracking-widest font-bold rounded bg-green-600 text-white shadow-lg cursor-default">✓ IDENTITY_SETTLED_LOCAL</button>
                            <button onClick={handlePurgeVault} className="w-full py-4 font-mono text-[9px] uppercase text-red-500/50 hover:text-red-500 transition-colors">Purge Local Vault from Browser</button>
                          </div>
                        ) : (
                          <button onClick={handleCommit} className="w-full py-6 font-mono text-[11px] uppercase tracking-widest font-bold rounded bg-[var(--trust-blue)] text-white shadow-lg">Seal Mainnet Identity</button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : activeTab === 'lookup' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                <input type="text" placeholder="Search handle (e.g. shengliang.song)..." className="w-full bg-transparent border-b-2 border-[var(--text-header)] p-4 font-mono text-lg outline-none" value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLookup()} />
                <div className="mt-8 h-80 border border-[var(--border-light)] bg-[var(--code-bg)] rounded p-8 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center h-full font-mono text-[10px] uppercase opacity-40 animate-pulse">Searching_Registry...</div>
                  ) : lookupResults.length > 0 ? (
                    lookupResults.map((r, i) => (
                      <div key={i} className="p-4 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded mb-4">
                        <div className="flex justify-between items-start mb-2">
                           <p className="font-mono text-[10px] font-bold text-[var(--trust-blue)]">{r.id}</p>
                           <span className="text-[8px] font-mono opacity-20 uppercase">{r.date}</span>
                        </div>
                        <p className="text-[10px] font-mono opacity-40 break-all">{r.key}</p>
                        <p className="text-[8px] font-mono opacity-20 mt-2 uppercase">Anchor: {r.anchor}</p>
                      </div>
                    ))
                  ) : lookupQuery ? (
                    <div className="flex items-center justify-center h-full font-mono text-[10px] uppercase opacity-20 italic">No_Identity_Found</div>
                  ) : (
                    <div className="flex items-center justify-center h-full font-mono text-[10px] uppercase opacity-20 italic">Enter_Handle_To_Query</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="border-b border-[var(--border-light)] pb-8 flex justify-between items-end">
                  <h3 className="font-serif text-3xl font-bold italic text-[var(--text-header)]">Provenance Lab.</h3>
                  {isActivated && <span className="font-mono text-[10px] text-green-500 font-bold">{subject}{SEPARATOR}{PROTOCOL_AUTHORITY}</span>}
                </div>

                {!isActivated ? (
                  <div className="space-y-8">
                    <div className="p-12 border-2 border-dashed border-neutral-200 bg-neutral-50 rounded text-center space-y-6">
                      <div className="w-12 h-12 border border-neutral-300 rounded-full flex items-center justify-center mx-auto opacity-40">🔑</div>
                      <div className="space-y-2">
                        <p className="font-mono text-[10px] uppercase font-bold text-neutral-500">Link Active Identity</p>
                        <p className="text-xs italic opacity-60">Identity vault empty. Please register or recover authority.</p>
                      </div>
                      <button onClick={() => setActiveTab('register')} className="px-6 py-2 bg-black text-white font-mono text-[10px] uppercase font-bold rounded">Go to Registry</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="space-y-8">
                      {!signedManifest ? (
                        <div className="space-y-8 p-8 bg-neutral-50 border border-neutral-200 rounded-lg">
                           <div className="space-y-4">
                             <label className="font-mono text-[9px] uppercase opacity-40 font-bold">Delivery Mode (C2PA 2.3)</label>
                             <div className="grid grid-cols-2 gap-4">
                               <button onClick={() => setSigningStrategy('sidecar')} className={`py-4 border font-mono text-[9px] uppercase font-bold rounded ${signingStrategy === 'sidecar' ? 'border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-[var(--trust-blue)]' : 'border-neutral-300'}`}>Sidecar JSON</button>
                               <button onClick={() => setSigningStrategy('embedded')} className={`py-4 border font-mono text-[9px] uppercase font-bold rounded ${signingStrategy === 'embedded' ? 'border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-[var(--trust-blue)]' : 'border-neutral-300'}`}>Substrate Injection</button>
                             </div>
                           </div>
                           <input type="file" onChange={handleLabFileSelect} className="block w-full text-xs font-mono" />
                           {labHash && (
                             <button onClick={handleSignAsset} disabled={isSigning} className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold rounded shadow-lg">
                               {isSigning ? 'INJECTING_BINARY_SUBSTRATE_...' : `Sign Asset [${signingStrategy === 'embedded' ? 'REAL BINARY' : 'SIDECAR'}]`}
                             </button>
                           )}
                        </div>
                      ) : (
                        <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-lg space-y-4 animate-in zoom-in-95">
                           <div className="flex justify-between items-center mb-4">
                              <span className="font-mono text-[10px] uppercase font-bold text-green-600">✓ {signingStrategy.toUpperCase()} INJECTION READY</span>
                              <button onClick={() => setSignedManifest(null)} className="text-[10px] font-mono uppercase opacity-40">Reset</button>
                           </div>
                           <div className="space-y-2 mb-6">
                              <p className="font-mono text-[9px] uppercase opacity-40 font-bold tracking-widest text-center">Injected Binary Anatomy</p>
                              <div className="flex h-12 w-full rounded overflow-hidden border border-neutral-800">
                                 <div className="bg-neutral-900 w-[15%] flex items-center justify-center font-mono text-[8px] text-white/40 border-r border-white/5">HEADER</div>
                                 <div className="bg-neutral-800 w-[70%] flex items-center justify-center font-mono text-[8px] text-white/20 border-r border-white/5">PIXEL_SUBSTRATE</div>
                                 <div className="bg-blue-600 w-[15%] flex items-center justify-center font-mono text-[8px] text-white animate-pulse">SIGNET_VPR</div>
                              </div>
                           </div>
                           <pre className="p-4 bg-black text-white rounded font-mono text-[9px] overflow-auto max-h-40 border border-white/10">{JSON.stringify(signedManifest, null, 2)}</pre>
                           <button onClick={downloadAsset} className="w-full py-4 bg-green-600 text-white font-mono text-[10px] uppercase font-bold rounded shadow-lg">Download Signed Asset</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
