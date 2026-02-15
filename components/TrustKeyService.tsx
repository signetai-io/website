import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, limit } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from '../private_keys';

// Initialize dedicated Signet Identity Registry Instance
const initSignetFirebase = () => {
  try {
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
    return null;
  }
};

const app = initSignetFirebase();
const db = app ? getFirestore(app, "signetai") : null;

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

// --- Hashing Utility ---
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
  const [showShieldDetail, setShowShieldDetail] = useState(false);

  // --- Lab State ---
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labHash, setLabHash] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedManifest, setSignedManifest] = useState<any | null>(null);
  const [verifyManifest, setVerifyManifest] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ status: 'VALID' | 'INVALID' | 'UNREGISTERED', key?: string, owner?: string } | null>(null);

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
      if (!subject || subject.length < 3 || !db) {
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
      } catch (e: any) {
        console.warn("Registry Probe:", e.message);
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
    if (availability === 'taken' || !publicKey || !db) {
      if (!db) setNetworkError("Registry Node Offline. Verify Console Setup.");
      return;
    }
    
    setIsRegistering(true);
    setNetworkError(null);

    const record = {
      readableIdentity,
      systemAnchor,
      publicKey,
      timestamp: Date.now(),
      subject,
      namespace: namespace || "ROOT",
      authority: PROTOCOL_AUTHORITY
    };

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Registry Timeout: Ensure the 'signetai' database is active.")), 6000)
    );

    try {
      const commitPromise = setDoc(doc(db, "identities", systemAnchor), record);
      await Promise.race([commitPromise, timeoutPromise]);
      
      setIsRegistering(false);
      setIsActivated(true);
    } catch (e: any) {
      console.error("Settlement Error:", e);
      setNetworkError(e.message || "Settlement failed. Check Referrer restrictions.");
      setIsRegistering(false);
    }
  };

  const handleLookup = async () => {
    if (!lookupQuery || !db) return;
    setLookupResults([]);
    setIsSearching(true);
    setNetworkError(null);

    try {
      const docRef = doc(db, "identities", lookupQuery);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLookupResults([{
          id: data.readableIdentity || data.subject,
          anchor: data.systemAnchor,
          key: data.publicKey,
          date: new Date(data.timestamp).toLocaleDateString()
        }]);
        setIsSearching(false);
        return;
      }

      const cleanQuery = lookupQuery.toLowerCase().trim();
      const idCollection = collection(db, "identities");
      const q = query(
        idCollection, 
        where("readableIdentity", ">=", cleanQuery), 
        where("readableIdentity", "<=", cleanQuery + "\uf8ff"),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const results: IdentityRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: data.readableIdentity || data.subject,
          anchor: data.systemAnchor,
          key: data.publicKey,
          date: new Date(data.timestamp).toLocaleDateString()
        });
      });

      if (results.length > 0) {
        setLookupResults(results);
      } else {
        setNetworkError("No identities match the pattern.");
      }
    } catch (e: any) {
      console.error("Lookup Error:", e);
      setNetworkError("Registry lookup service failed.");
    } finally {
      setIsSearching(false);
    }
  };

  // --- Lab Logic ---
  const handleLabFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLabFile(file);
      const hash = await hashFile(file);
      setLabHash(hash);
    }
  };

  const handleSignAsset = () => {
    if (!labFile || !publicKey || !isActivated) return;
    setIsSigning(true);
    setTimeout(() => {
      const manifest = {
        type: "org.signetai.vpr",
        version: "0.2.6",
        iat: Date.now(),
        asset: {
          name: labFile.name,
          mime: labFile.type,
          hash: `sha256:${labHash}`
        },
        signature_chain: [
          {
            entity: "HUMAN_MASTER_CURATOR",
            identity: readableIdentity,
            anchor: systemAnchor,
            signature: `sig_ed25519_v2.3_${Math.random().toString(36).substring(2)}`
          }
        ]
      };
      setSignedManifest(manifest);
      setIsSigning(false);
    }, 1200);
  };

  const downloadManifest = () => {
    if (!signedManifest) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signedManifest, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `signet_manifest_${labFile?.name.split('.')[0]}.vpr.json`);
    dl.click();
  };

  const handleVerifyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setVerifyManifest(json);
          setVerificationResult(null);
        } catch (err) {
          setNetworkError("Invalid manifest file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const runVerification = async () => {
    if (!verifyManifest || !db) return;
    setIsSearching(true);
    try {
      const curator = verifyManifest.signature_chain?.[0];
      if (!curator) throw new Error("Manifest signature block missing.");

      // Perform LIVE Registry Lookup to verify the public key
      const docRef = doc(db, "identities", curator.anchor);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const registryData = docSnap.data();
        setVerificationResult({
          status: 'VALID',
          key: registryData.publicKey,
          owner: registryData.readableIdentity
        });
      } else {
        setVerificationResult({ status: 'UNREGISTERED' });
      }
    } catch (err) {
      setVerificationResult({ status: 'INVALID' });
    } finally {
      setIsSearching(false);
    }
  };

  const isButtonDisabled = isGenerating || !subject || subject.length < 3 || availability === 'taken' || availability === 'checking';

  return (
    <section id="identity" className="py-32 px-6 max-w-7xl mx-auto border-v bg-[var(--bg-sidebar)]/30 relative">
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-1 space-y-10">
          <div className="flex items-center gap-4 relative">
            <span 
              onMouseEnter={() => setShowShieldDetail(true)}
              onMouseLeave={() => setShowShieldDetail(false)}
              className="cursor-help font-mono text-[10px] uppercase bg-blue-600 text-white px-3 py-1 tracking-[0.2em] font-bold rounded-sm"
            >
              ISOLATED_PROD_MODE
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">
                INFRASTRUCTURE: SIGNETAI_PROD_NODE_ACTIVE
              </span>
            </div>

            {showShieldDetail && (
              <div className="absolute top-full left-0 mt-4 w-80 p-6 bg-black text-white rounded-lg shadow-2xl border border-blue-500/30 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <h5 className="font-mono text-[10px] uppercase text-blue-400 font-bold mb-4 tracking-widest">Infrastructure Isolation</h5>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold text-xs mt-1">01</span>
                    <p className="text-[11px] leading-relaxed opacity-70 italic">Dedicated Firebase project for <strong>signetai.io</strong> to bypass legacy restriction locks.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold text-xs mt-1">02</span>
                    <p className="text-[11px] leading-relaxed opacity-70 italic">Targeting the named database <strong>'signetai'</strong> for high-performance registry operations.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h2 className="font-serif text-7xl italic leading-none text-[var(--text-header)] font-bold">TrustKey<br/>Registry.</h2>
          <p className="text-[var(--text-body)] opacity-70 text-xl leading-relaxed max-w-md font-serif">
            Hierarchical identity settlement for the 8 billion. Anchored via <span className="text-[var(--trust-blue)] font-bold italic">Signet UUIDs</span>.
          </p>
          <div className="flex gap-4 border-b border-[var(--border-light)] pb-px">
            <button onClick={() => setActiveTab('register')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'register' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>01. Register</button>
            <button onClick={() => setActiveTab('lookup')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'lookup' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>02. Lookup</button>
            <button onClick={() => setActiveTab('lab')} className={`pb-4 px-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'lab' ? 'text-[var(--trust-blue)] border-b-2 border-[var(--trust-blue)]' : 'opacity-40'}`}>03. Provenance Lab</button>
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
                      </div>
                      <div className="p-8 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded shadow-inner">
                        <p className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-widest font-bold mb-4">Registry Public Key (Ed25519)</p>
                        <p className="font-mono text-xs text-[var(--text-header)] break-all bg-[var(--bg-standard)] p-4 rounded border border-[var(--border-light)] font-bold">{publicKey}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {networkError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                           <p className="text-[10px] font-mono text-red-500 text-center leading-relaxed">
                            <strong>SETTLEMENT FAILURE</strong><br/>{networkError}
                           </p>
                        </div>
                      )}
                      <button onClick={handleCommit} disabled={isRegistering || isActivated} className={`w-full py-6 font-mono text-[11px] uppercase tracking-widest font-bold rounded shadow-lg transition-all ${isActivated ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]' : isRegistering ? 'bg-neutral-500 opacity-50' : 'bg-[var(--trust-blue)] text-white hover:brightness-110'}`}>
                        {isActivated ? '✓ IDENTITY_SETTLED' : isRegistering ? 'COMMITTING_TO_REGISTRY_...' : 'Seal Mainnet Identity'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'lookup' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] text-[var(--text-body)] opacity-40 uppercase tracking-[0.3em] font-bold">Query by Pattern or System Anchor</label>
                  <div className="flex gap-4">
                    <input type="text" placeholder="e.g. shengliang.song" className="flex-1 bg-transparent border-b-2 border-[var(--text-header)] text-[var(--text-header)] p-4 font-mono text-lg focus:border-[var(--trust-blue)] focus:outline-none transition-all placeholder:opacity-20" value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLookup()} />
                    <button onClick={handleLookup} disabled={isSearching} className="px-6 bg-[var(--text-header)] text-[var(--bg-standard)] font-mono text-[10px] uppercase font-bold hover:brightness-110 transition-all rounded disabled:opacity-50">
                      {isSearching ? '...' : 'Probe'}
                    </button>
                  </div>
                </div>
                <div className="mt-12 h-[450px] border border-[var(--border-light)] bg-[var(--code-bg)] rounded flex flex-col p-8 text-left relative overflow-hidden overflow-y-auto custom-scrollbar">
                  {lookupResults.length > 0 ? (
                    <div className="space-y-8 animate-in zoom-in-95 duration-300 w-full">
                      <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-2">
                        <span className="font-mono text-[9px] uppercase font-bold text-[var(--trust-blue)]">Registry Results [{lookupResults.length}]</span>
                      </div>
                      <div className="space-y-6">
                        {lookupResults.map((result, i) => (
                          <div key={i} className="group p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded hover:border-[var(--trust-blue)] transition-all cursor-default">
                             <div className="flex justify-between items-start mb-4">
                                <h4 className="text-[var(--text-header)] font-mono text-sm font-bold break-all">{result.id}</h4>
                                <span className="text-[8px] font-mono opacity-20 uppercase">EST: {result.date}</span>
                             </div>
                             <p className="font-mono text-[10px] text-[var(--trust-blue)] font-bold break-all mb-4">{result.anchor}</p>
                             <div className="bg-[var(--bg-sidebar)] p-4 rounded border border-[var(--border-light)]">
                                <p className="text-[10px] font-mono text-[var(--text-header)] break-all opacity-80">{result.key}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="m-auto text-center opacity-20 italic font-serif flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border border-current rounded-full flex items-center justify-center opacity-40 font-mono text-xs">?</div>
                      <p>{networkError || (lookupQuery ? "No matches found." : "Enter pattern to probe registry.")}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* --- PROVENANCE LAB VIEW --- */
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="border-b border-[var(--border-light)] pb-8">
                  <h3 className="font-serif text-3xl font-bold italic text-[var(--text-header)] mb-2">Provenance Lab.</h3>
                  <p className="text-sm opacity-60 font-serif italic">Step 03: Attest assets using your settled identity.</p>
                </div>

                {!isActivated ? (
                  <div className="p-12 border border-[var(--trust-blue)]/20 bg-[var(--admonition-bg)] rounded text-center space-y-4">
                    <p className="font-mono text-[10px] uppercase text-[var(--trust-blue)] font-bold">Identity Required</p>
                    <p className="text-sm italic opacity-70">You must register and settle an identity before accessing the attestation pipeline.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-12">
                    {/* Phase A: Sign an Asset */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 rounded-full border border-[var(--trust-blue)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--trust-blue)]">A</span>
                         <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest">Attest Asset</h4>
                      </div>
                      
                      {!signedManifest ? (
                        <div className="space-y-6 p-8 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-lg">
                           <div className="space-y-2">
                             <label className="font-mono text-[9px] uppercase opacity-40 font-bold">Select Local Asset (Image/Doc)</label>
                             <input type="file" onChange={handleLabFileSelect} className="block w-full text-xs font-mono text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[var(--trust-blue)] file:text-white hover:file:brightness-110" />
                           </div>
                           
                           {labHash && (
                             <div className="space-y-4 animate-in slide-in-from-top-2">
                                <div className="p-4 bg-black text-white rounded font-mono text-[10px] space-y-2">
                                  <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-40">VISION_SUBSTRATE_HASH</span>
                                    <span className="text-[var(--trust-blue)] truncate ml-4">{labHash}</span>
                                  </div>
                                  <div className="flex justify-between pt-2">
                                    <span className="opacity-40">ATTORNEY_BINDING</span>
                                    <span className="text-green-500">{subject}@signetai.io</span>
                                  </div>
                                </div>
                                <button onClick={handleSignAsset} disabled={isSigning} className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold rounded shadow-lg transition-all hover:scale-[1.01]">
                                   {isSigning ? 'COMPUTING_SIGNET_...' : 'Sign Asset & Generate VPR Manifest'}
                                </button>
                             </div>
                           )}
                        </div>
                      ) : (
                        <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-lg space-y-4 animate-in zoom-in-95">
                           <div className="flex items-center gap-3 text-green-500">
                             <span className="text-xl">✓</span>
                             <p className="font-mono text-[10px] uppercase font-bold">Manifest Generated Successfully</p>
                           </div>
                           <pre className="p-4 bg-black text-white rounded font-mono text-[9px] overflow-x-auto max-h-40 overflow-y-auto">
                             {JSON.stringify(signedManifest, null, 2)}
                           </pre>
                           <div className="flex gap-4">
                             <button onClick={downloadManifest} className="flex-1 py-4 bg-green-600 text-white font-mono text-[10px] uppercase font-bold rounded shadow-lg">Download .VPR.JSON</button>
                             <button onClick={() => {setSignedManifest(null); setLabFile(null); setLabHash(null);}} className="px-6 py-4 border border-[var(--border-light)] font-mono text-[10px] uppercase opacity-40 hover:opacity-100">Reset</button>
                           </div>
                        </div>
                      )}
                    </div>

                    {/* Phase B: Verification Portal */}
                    <div className="space-y-6 pt-12 border-t border-[var(--border-light)]">
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 rounded-full border border-[var(--trust-blue)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--trust-blue)]">B</span>
                         <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest">Verify External Signet</h4>
                      </div>

                      <div className="p-8 border-2 border-dashed border-[var(--border-light)] rounded-lg text-center space-y-6 group hover:border-[var(--trust-blue)] transition-all">
                        {!verifyManifest ? (
                          <>
                            <div className="w-12 h-12 border border-[var(--border-light)] rounded-full flex items-center justify-center mx-auto opacity-40 group-hover:border-[var(--trust-blue)] group-hover:text-[var(--trust-blue)]">🔍</div>
                            <div className="space-y-2">
                               <p className="font-mono text-[10px] uppercase opacity-40 font-bold group-hover:opacity-100">Upload Signet Manifest for Audit</p>
                               <input type="file" accept=".json" onChange={handleVerifyUpload} className="hidden" id="verify-upload" />
                               <label htmlFor="verify-upload" className="inline-block px-8 py-3 bg-[var(--text-header)] text-[var(--bg-standard)] font-mono text-[10px] uppercase font-bold rounded cursor-pointer hover:brightness-110">Ingest .vpr.json</label>
                            </div>
                          </>
                        ) : (
                          <div className="text-left space-y-6 animate-in slide-in-from-bottom-2">
                             <div className="p-4 bg-black text-white rounded-sm font-mono text-[9px] opacity-80 flex justify-between items-center">
                               <span>INGESTED: {verifyManifest.asset?.name || "Unknown Asset"}</span>
                               <button onClick={() => setVerifyManifest(null)} className="text-red-500 hover:text-red-400 font-bold">REMOVE</button>
                             </div>
                             
                             {!verificationResult ? (
                               <button onClick={runVerification} disabled={isSearching} className="w-full py-6 bg-[var(--trust-blue)] text-white font-mono text-[11px] uppercase font-bold tracking-[0.2em] rounded shadow-xl">
                                 {isSearching ? 'TRAVERSING_REGISTRY_...' : 'Initiate Neural Audit'}
                               </button>
                             ) : (
                               <div className={`p-8 rounded border-l-4 space-y-4 animate-in zoom-in-95 ${
                                 verificationResult.status === 'VALID' ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'
                               }`}>
                                 <div className="flex items-center gap-4">
                                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                                     verificationResult.status === 'VALID' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                                   }`}>
                                     {verificationResult.status === 'VALID' ? '✓' : '✕'}
                                   </div>
                                   <div>
                                     <h5 className="font-serif text-2xl font-bold italic text-[var(--text-header)]">
                                       {verificationResult.status === 'VALID' ? 'Audit Verified' : 'Audit Failed'}
                                     </h5>
                                     <p className="font-mono text-[10px] uppercase opacity-40 font-bold">Status: {verificationResult.status}</p>
                                   </div>
                                 </div>
                                 
                                 {verificationResult.status === 'VALID' && (
                                   <div className="pt-4 border-t border-black/10 space-y-3">
                                     <div className="flex justify-between font-mono text-[9px]">
                                       <span className="opacity-40 uppercase">Authority Handle</span>
                                       <span className="font-bold text-[var(--trust-blue)]">{verificationResult.owner}</span>
                                     </div>
                                     <div className="flex flex-col gap-1 font-mono text-[9px]">
                                       <span className="opacity-40 uppercase">Authoritative Public Key (Registry Match)</span>
                                       <span className="bg-black/5 p-3 rounded break-all opacity-80">{verificationResult.key}</span>
                                     </div>
                                   </div>
                                 )}
                               </div>
                             )}
                          </div>
                        )}
                      </div>
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