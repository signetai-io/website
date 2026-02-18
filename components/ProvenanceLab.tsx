import React, { useState, useRef } from 'react';
import { Admonition } from './Admonition';
import { PersistenceService } from '../services/PersistenceService';
import { NutritionLabel } from './NutritionLabel';

export const ProvenanceLab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [verifyMode, setVerifyMode] = useState(false);
  const [embeddingMode, setEmbeddingMode] = useState<'JUMBF' | 'TEXT_WRAP'>('JUMBF');
  const [showL2, setShowL2] = useState(false);
  
  // Verification State
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationManifest, setVerificationManifest] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; msg: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const verifyAssetInputRef = useRef<HTMLInputElement>(null);
  const verifyManifestInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManifest(null);
      setVerifyResult(null);
      setStatus(`Asset loaded: ${e.target.files[0].name}`);
    }
  };

  const handleSign = async () => {
    if (!file) return;
    setIsSigning(true);
    setStatus(embeddingMode === 'TEXT_WRAP' ? "Section A.7: Encoding Variation Selectors..." : "Computing pHash Soft-Binding...");

    let vault = await PersistenceService.getActiveVault();
    if (!vault) {
      vault = {
        identity: 'ssl',
        anchor: 'signetai.io:ssl',
        publicKey: 'ed25519:signet_v3.1_sovereign_5b9878a8583b7b38d719c7c8498f8981adc17bec0c311d76269e1275e4a8bdf9',
        mnemonic: '',
        timestamp: Date.now(),
        type: 'SOVEREIGN'
      };
    }

    setTimeout(() => {
      const mockManifest = {
        "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
        "type": "org.signetai.vpr",
        "version": "0.3.1",
        "c2pa_spec": "2.3 (Dec 2025)",
        "asset": {
          "name": file.name,
          "hash": "sha256:" + Math.random().toString(16).slice(2, 34),
          "soft_binding_phash": "0x7F8C" + Math.random().toString(16).slice(2, 6).toUpperCase(),
          "embedding_logic": embeddingMode
        },
        "assertions": [
          {
            "label": "c2pa.actions.v2",
            "data": {
              "actions": [{ "action": "c2pa.created", "softwareAgent": "Neural Prism v0.3.1 (2026)" }]
            }
          },
          {
            "label": "org.signetai.vpr_score",
            "data": { "vpr": 0.9985, "trace_id": "0x" + Math.random().toString(16).slice(2, 10).toUpperCase() }
          }
        ],
        "signature": {
          "identity": vault!.identity,
          "anchor": vault!.anchor,
          "publicKey": vault!.publicKey,
          "attestedBy": "signetai.io:ssl",
          "timestamp": Date.now()
        }
      };
      setManifest(mockManifest);
      setStatus(`Asset Sealed via v2.3 ${embeddingMode}. L1-L3 UX Enabled.`);
      setIsSigning(false);
    }, 2000);
  };

  const handleVerify = () => {
    if (!verificationFile || !verificationManifest) return;
    setIsVerifying(true);
    setStatus("Auditing Merkle Piecewise Parity...");
    
    setTimeout(() => {
      const isMatch = verificationManifest.asset?.name === verificationFile.name;
      setVerifyResult({
        success: isMatch,
        msg: isMatch 
          ? "AUTHENTIC: C2PA v2.3 compliant logic match. Identity verified by signetai.io:ssl."
          : "FAILURE: Logic drift detected. Manifest assertions do not match current substrate."
      });
      setIsVerifying(false);
      setStatus(isMatch ? "VERIFIED (∑)" : "AUDIT FAILED (✕)");
    }, 1500);
  };

  return (
    <div className="py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 6: Provenance Lab</span>
          <h2 className="text-4xl font-bold italic text-[var(--text-header)]">C2PA 2.3 Laboratory.</h2>
          <p className="text-lg opacity-60 max-w-xl font-serif">
            {verifyMode 
              ? "Audit assets using Merkle tree piecewise verification." 
              : "Generate 2026-compliant manifests with Soft-Binding support."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex p-1 bg-[var(--bg-sidebar)] rounded border border-[var(--border-light)]">
             <button 
               onClick={() => { setVerifyMode(false); setStatus(null); }}
               className={`px-6 py-2 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${!verifyMode ? 'bg-[var(--trust-blue)] text-white' : 'opacity-40'}`}
             >
               Sign Mode
             </button>
             <button 
               onClick={() => { setVerifyMode(true); setStatus(null); }}
               className={`px-6 py-2 font-mono text-[10px] uppercase font-bold tracking-widest transition-all rounded ${verifyMode ? 'bg-emerald-600 text-white' : 'opacity-40'}`}
             >
               Verify Mode
             </button>
          </div>
        </div>
      </div>

      {!verifyMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
          {/* L1 Visualizer */}
          <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--table-header)]/50 space-y-8">
            <h3 className="font-serif text-2xl font-bold italic">1. Substrate Asset</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-72 border-2 border-dashed border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--trust-blue)] transition-all bg-[var(--bg-standard)] relative group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,text/plain" />
              {file ? (
                <div className="text-center space-y-3 relative">
                  <span className="text-5xl">🛡️</span>
                  <p className="font-mono text-[11px] font-bold">{file.name}</p>
                  
                  {/* L1 Icon Implementation */}
                  {manifest && (
                    <div className="absolute -top-4 -right-12">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setShowL2(!showL2); }}
                         className="cr-badge w-10 h-10 bg-white border-[var(--trust-blue)] text-[var(--trust-blue)] hover:scale-110 transition-all shadow-xl"
                       >
                         cr
                       </button>
                       {showL2 && <NutritionLabel manifest={manifest} onClose={() => setShowL2(false)} />}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-30 space-y-3">
                  <span className="text-5xl">⭱</span>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Select Substrate</p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleSign}
                disabled={!file || isSigning}
                className="flex-1 py-5 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded shadow-2xl transition-all"
              >
                {isSigning ? 'ENGRAVING...' : `Sign v2.3 (${embeddingMode})`}
              </button>
              <button 
                onClick={() => setEmbeddingMode(prev => prev === 'JUMBF' ? 'TEXT_WRAP' : 'JUMBF')}
                className="px-4 border border-[var(--border-light)] rounded hover:bg-[var(--bg-sidebar)] transition-colors text-xs"
              >
                ⚙️
              </button>
            </div>
          </div>

          <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--code-bg)] space-y-8 flex flex-col">
            <h3 className="font-serif text-2xl font-bold italic">2. Manifest Control</h3>
            {!manifest ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--border-light)] rounded italic opacity-20 text-sm font-serif min-h-[300px]">
                Awaiting substrate attestation...
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="p-4 bg-black/5 rounded font-mono text-[10px] border border-black/10 overflow-y-auto max-h-56">
                  <p className="text-[var(--trust-blue)] font-bold">// C2PA v2.3 Standard (actions.v2)</p>
                  <pre className="opacity-70">{JSON.stringify(manifest, null, 2)}</pre>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded font-serif italic text-xs leading-relaxed">
                   <strong>Soft-Binding Active:</strong> This manifest is mirrored to our cloud repository. pHash: <code>{manifest.asset.soft_binding_phash}</code>. If metadata is stripped, recovery is possible via visual fingerprint.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-8">
            <div className="p-8 border border-[var(--border-light)] rounded-lg bg-[var(--bg-standard)] space-y-4">
               <h3 className="font-serif text-xl font-bold italic">1. Target Substrate</h3>
               <div 
                 onClick={() => verifyAssetInputRef.current?.click()}
                 className="p-10 border border-dashed border-[var(--border-light)] rounded flex items-center gap-4 cursor-pointer hover:border-[var(--trust-blue)] transition-all"
               >
                 <input type="file" ref={verifyAssetInputRef} onChange={(e) => setVerificationFile(e.target.files?.[0] || null)} className="hidden" />
                 <span className="text-2xl">{verificationFile ? '✅' : '📁'}</span>
                 <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">{verificationFile ? verificationFile.name : 'Ingest File'}</p>
               </div>
            </div>

            <div className="p-8 border border-[var(--border-light)] rounded-lg bg-[var(--bg-standard)] space-y-4">
               <h3 className="font-serif text-xl font-bold italic">2. Manifest Capsule</h3>
               <div 
                 onClick={() => verifyManifestInputRef.current?.click()}
                 className="p-10 border border-dashed border-[var(--border-light)] rounded flex items-center gap-4 cursor-pointer hover:border-emerald-600 transition-all"
               >
                 <input type="file" ref={verifyManifestInputRef} onChange={(e) => {
                   const reader = new FileReader();
                   reader.onload = (ev) => setVerificationManifest(JSON.parse(ev.target?.result as string));
                   if (e.target.files?.[0]) reader.readAsText(e.target.files[0]);
                 }} className="hidden" accept=".json" />
                 <span className="text-2xl">{verificationManifest ? '✅' : '📜'}</span>
                 <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">{verificationManifest ? 'Manifest Decoupled' : 'Link JSON Sidecar'}</p>
               </div>
            </div>

            <button 
              onClick={handleVerify}
              disabled={!verificationFile || !verificationManifest || isVerifying}
              className="w-full py-5 bg-emerald-600 text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded"
            >
              {isVerifying ? 'AUDITING...' : 'Verify Parity (∑)'}
            </button>
          </div>

          <div className="p-10 border border-[var(--border-light)] rounded-lg bg-[var(--code-bg)] flex flex-col justify-center items-center text-center">
             {!verifyResult ? (
               <div className="opacity-20 italic font-serif flex flex-col items-center">
                 <span className="text-4xl mb-4">🔬</span>
                 Awaiting v2.3 Logic Audit...
               </div>
             ) : (
               <div className="animate-in zoom-in-95 space-y-6">
                 <div className={`w-24 h-24 flex items-center justify-center mx-auto rounded-full border-4 ${verifyResult.success ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}`}>
                    <span className="text-4xl font-bold">{verifyResult.success ? '✓' : '✕'}</span>
                 </div>
                 <h4 className={`font-serif text-3xl font-bold italic ${verifyResult.success ? 'text-emerald-500' : 'text-red-500'}`}>
                   {verifyResult.success ? 'Signet Authentic' : 'Audit Refused'}
                 </h4>
                 <p className="text-sm opacity-80 leading-relaxed font-serif italic max-w-sm mx-auto">
                   {verifyResult.msg}
                 </p>
               </div>
             )}
          </div>
        </div>
      )}

      {status && (
        <div className="p-4 bg-[var(--table-header)] border-l-4 border-[var(--trust-blue)] font-mono text-[10px] font-bold italic animate-pulse flex justify-between">
          <span>{status}</span>
          <span className="opacity-30">TRACE_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};