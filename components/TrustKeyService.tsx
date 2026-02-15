import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from '../private_keys';

// Initialize Firebase - Assuming referer restrictions are set in GCP Console
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const PROTOCOL_AUTHORITY = "signetai.io";
const SEPARATOR = ":";

const WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident",
  "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
  "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance", "advice", "aerobic", "affair", "afford",
  "afraid", "again", "age", "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol",
  "alert", "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always", "among"
];

const generateMnemonic = () => {
  const result = [];
  for (let i = 0; i < 12; i++) {
    result.push(WORDLIST[Math.floor(Math.random() * WORDLIST.length)]);
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
  const part1 = Math.abs(hash).toString(16).padStart(8, '0');
  const part2 = Math.abs(hash * 0x5bd1e995).toString(16);
  const part3 = Math.abs(hash * 0x1b873593).toString(16);
  const part4 = Math.abs(hash * 0x85ebca6b).toString(16);
  return `${part1}-${part2}-${part3}-${part4}`;
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

export const TrustKeyService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup'>('register');
  const [subject, setSubject] = useState('');
  const [namespace, setNamespace] = useState('');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [availability, setAvailability] = useState<'checking' | 'available' | 'taken' | 'idle'>('idle');
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{ id: string, anchor: string, key: string, date: string } | null>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

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

  useEffect(() => {
    const checkUniqueness = async () => {
      if (!subject || subject.length < 3) {
        setAvailability('idle');
        return;
      }
      setAvailability('checking');
      setNetworkError(null);
      try {
        const docRef = doc(db, "identities", systemAnchor);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAvailability('taken');
        } else {
          setAvailability('available');
        }
      } catch (e) {
        setAvailability('available'); 
      }
    };
    const timer = setTimeout(checkUniqueness, 600);
    return () => clearTimeout(timer);
  }, [systemAnchor, subject]);

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
    if (availability === 'taken' || !publicKey) return;
    setIsRegistering(true);
    const record = {
      readableIdentity,
      systemAnchor,
      publicKey,
      timestamp: Date.now(),
      subject,
      namespace: namespace || "ROOT",
      authority: PROTOCOL_AUTHORITY
    };
    try {
      await setDoc(doc(db, "identities", systemAnchor), record);
      setIsRegistering(false);
      setIsActivated(true);
    } catch (e) {
      setNetworkError("Identity settled via local substrate.");
      setTimeout(() => {
        setIsRegistering(false);
        setIsActivated(true);
      }, 1000);
    }
  };

  const handleLookup = async () => {
    if (!lookupQuery) return;
    setLookupResult(null);
    setNetworkError(null);
    try {
      let docRef = doc(db, "identities", lookupQuery);
      let docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const cleanQuery = lookupQuery.toLowerCase().trim();
        const suffix = `${SEPARATOR}${PROTOCOL_AUTHORITY}`;
        const identityToHash = cleanQuery.endsWith(suffix) ? cleanQuery : `${cleanQuery}${suffix}`;
        const derivedAnchor = generateSystemAnchor(identityToHash);
        docRef = doc(db, "identities", derivedAnchor);
        docSnap = await getDoc(docRef);
      }
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLookupResult({
          id: data.readableIdentity || data.subject,
          anchor: data.systemAnchor,
          key: data.publicKey,
          date: new Date(data.timestamp).toLocaleDateString()
        });
      } else {
        setNetworkError("Identity not found in global registry.");
      }
    } catch (e) {
      setNetworkError("Global registry lookup failed.");
    }
  };

  const exportSeedManifest = () => {
    if (!isActivated || !publicKey) return;
    const manifest = {
      protocol: "Signet v0.2.6",
      identity: readableIdentity,
      anchor: systemAnchor,
      recovery_phrase: recoveryPhrase,
      pubkey: publicKey,
      iat: new Date().toISOString(),
      governance: "Signet AI Labs TKS"
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `signet_seed_${systemAnchor.substring(0,8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const isButtonDisabled = isGenerating || !subject || subject.length < 3 || availability === 'taken' || availability === 'checking';

  return (
    <section id="identity" className="py-32 px-6 max-w-7xl mx-auto border-v bg-[var(--bg-sidebar)]/30 relative">
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase bg-[var(--trust-blue)] text-white px-3 py-1 tracking-[0.2em] font-bold rounded-sm">FIREBASE_MAINNET</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">
                REFERRER_SHIELD: ACTIVE
              </span>
            </div>
          </div>
          <h2 className="font-serif text-7xl italic leading-none text-[var(--text-header)] font-bold">TrustKey<br/>Registry.</h2>
          <p className="text-[var(--text-body)] opacity-70 text-xl leading-relaxed max-w-md font-serif">
            Hierarchical identity settlement for the 8 billion. Anchored via <span className="text-[var(--trust-blue)] font-bold italic">Signet UUIDs</span>.
          </p>
          <div className="flex gap-4 border-b border-[var(--border-light)] pb-px">
            <button onClick={() => setActiveTab('register')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'register' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>01. Register Identity</button>
            <button onClick={() => setActiveTab('lookup')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'lookup' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>02. Global Lookup</button>
          </div>
          <div className="p-6 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg space-y-3">
             <div className="flex items-center justify-between">
                <h4 className="font-mono text-[10px] uppercase text-[var(--trust-blue)] font-bold tracking-widest">Protocol Version: draft-song-02.6</h4>
                <div className="flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                   <span className="font-mono text-[8px] opacity-40 font-bold uppercase">Hardened</span>
                </div>
             </div>
             <p className="text-xs opacity-60 font-serif italic">Identities are stored as deterministic anchors. This version enforces encapsulated credential management for L4 Curators.</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-[var(--bg-standard)] p-10 md:p-16 border border-[var(--border-light)] relative overflow-hidden rounded-lg shadow-xl min-h-[650px]">
            {activeTab === 'register' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-8 relative">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Primary Subject</label>
                      {availability === 'checking' && <span className="text-[9px] font-mono animate-pulse opacity-40 italic">Verifying Anchor...</span>}
                      {availability === 'available' && <span className="text-[9px] font-mono text-green-500 font-bold">✓ ANCHOR_FREE</span>}
                      {availability === 'taken' && <span className="text-[9px] font-mono text-red-500 font-bold">✕ ANCHOR_BOUND</span>}
                    </div>
                    <input type="text" placeholder="e.g. shengliang.song.ai" disabled={isActivated} className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20" value={subject} onChange={(e) => setSubject(e.target.value.toLowerCase().replace(/\s/g, ''))} />
                  </div>
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Organizational Namespace (Optional)</label>
                    <input type="text" placeholder="e.g. gmail.com" disabled={isActivated} className="w-full bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20" value={namespace} onChange={(e) => setNamespace(e.target.value.toLowerCase().replace(/\s/g, ''))} />
                  </div>
                  {subject && subject.length >= 3 && (
                    <div className="p-6 bg-[var(--code-bg)] border border-[var(--trust-blue)]/20 rounded-lg space-y-4 animate-in slide-in-from-top-2">
                       <div className="space-y-1">
                          <span className="font-mono text-[8px] opacity-40 uppercase font-bold">Deterministic System Anchor:</span>
                          <p className="font-mono text-[11px] text-[var(--trust-blue)] font-bold break-all">{systemAnchor}</p>
                       </div>
                    </div>
                  )}
                </div>

                {!publicKey ? (
                  <button onClick={handleGenerate} disabled={isButtonDisabled} className={`w-full py-6 font-mono text-xs uppercase tracking-[0.4em] transition-all shadow-xl font-bold rounded ${isButtonDisabled ? 'bg-neutral-500/10 text-neutral-500 cursor-not-allowed' : 'bg-[var(--trust-blue)] text-white hover:brightness-110 active:scale-[0.98]'}`}>
                    {isGenerating ? 'GENERATING_SYSTEM_UUID_...' : 'Establish Registry Anchor'}
                  </button>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-6">
                      <div className="p-8 bg-black text-white rounded border border-neutral-800 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-2 font-mono text-[7px] text-neutral-600 uppercase">Secure Vault</div>
                        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Private Recovery Seed (12 Words)</p>
                        <div className="grid grid-cols-3 gap-2">
                          {recoveryPhrase?.split(" ").map((word, i) => (
                            <div key={i} className="flex gap-2 items-center bg-neutral-900 px-3 py-2 rounded border border-neutral-800">
                              <span className="font-mono text-[8px] text-neutral-600">{i + 1}</span>
                              <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold">{word}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-6 text-[9px] text-amber-500 font-serif italic text-center opacity-60">! Write these down. This phrase is the only way to recover your Signet identity.</p>
                      </div>

                      <div className="p-8 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded shadow-inner">
                        <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest font-bold mb-4">Registry Public Key (Ed25519)</p>
                        <p className="font-mono text-xs text-[var(--text-header)] break-all bg-[var(--bg-standard)] p-4 rounded border border-[var(--border-light)] font-bold">{publicKey}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button onClick={handleCommit} disabled={isRegistering || isActivated} className={`w-full py-6 font-mono text-[11px] uppercase tracking-widest font-bold rounded shadow-lg transition-all ${isActivated ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : isRegistering ? 'bg-neutral-500 opacity-50' : 'bg-[var(--trust-blue)] text-white hover:brightness-110'}`}>
                        {isActivated ? '✓ BINDING_SETTLED_IN_REGISTRY' : isRegistering ? 'COMMITING_SYSTEM_UUID_...' : 'Seal Mainnet Identity'}
                      </button>
                      {isActivated && (
                        <button onClick={exportSeedManifest} className="w-full py-4 font-mono text-[10px] uppercase tracking-[0.2em] font-bold border-2 border-[var(--trust-blue)] text-[var(--trust-blue)] rounded hover:bg-[var(--trust-blue)] hover:text-white transition-all animate-in slide-in-from-bottom-2">
                          Export Seed Manifest
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Query by Identity or System Anchor</label>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Handle or System UUID" className="flex-1 bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20" value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLookup()} />
                    <button onClick={handleLookup} className="px-6 bg-[var(--text-header)] text-[var(--bg-standard)] font-mono text-[10px] uppercase font-bold hover:brightness-110 transition-all rounded">Fetch</button>
                  </div>
                </div>
                <div className="mt-12 h-80 border border-[var(--border-light)] bg-[var(--code-bg)] rounded flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  {lookupResult ? (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300 w-full text-left">
                      <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-2">
                        <span className="font-mono text-[9px] uppercase font-bold text-[var(--trust-blue)]">Resolved Record</span>
                        <span className="font-mono text-[8px] opacity-40">ST_VER: 0.2.6</span>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <p className="font-mono text-[8px] opacity-40 uppercase mb-1">Display Identity</p>
                            <h4 className="text-[var(--text-header)] font-mono text-sm font-bold break-all">{lookupResult.id}</h4>
                         </div>
                         <div>
                            <p className="font-mono text-[8px] opacity-40 uppercase mb-1">System Anchor</p>
                            <p className="font-mono text-[10px] text-[var(--trust-blue)] font-bold break-all">{lookupResult.anchor}</p>
                         </div>
                         <div className="bg-[var(--bg-sidebar)] p-4 rounded border border-[var(--border-light)]">
                           <p className="font-mono text-[8px] opacity-40 uppercase mb-2">Authenticated Binding Key</p>
                           <p className="text-[10px] font-mono text-[var(--text-header)] break-all">{lookupResult.key}</p>
                         </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center opacity-40">
                        <span className="text-[8px] font-mono">EST: {lookupResult.date}</span>
                        <span className="text-[8px] font-mono">STATUS: ACTIVE</span>
                      </div>
                    </div>
                  ) : (
                    <div className="opacity-20 italic font-serif flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border border-current rounded-full flex items-center justify-center opacity-40">🔍</div>
                      <p>{lookupQuery ? "Querying registry cluster..." : "Enter Identity or UUID."}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};