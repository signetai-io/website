import React, { useState, useRef } from 'react';
import { Admonition } from './Admonition';
import { NutritionLabel } from './NutritionLabel';

export const VerifyView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [showL2, setShowL2] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManifest(null);
      setShowL2(false);
    }
  };

  const handleVerify = () => {
    if (!file) return;
    setIsVerifying(true);
    
    // Simulated C2PA v2.3 Verification Loop
    setTimeout(() => {
      setManifest({
        signature: {
          identity: "Signet Alpha Model",
          anchor: "signetai.io:ssl",
          timestamp: Date.now() - 1000 * 60 * 5,
        },
        assertions: [{
          data: {
            actions: [{ softwareAgent: "Signet AI Neural Prism v0.2.7" }]
          }
        }]
      });
      setIsVerifying(false);
      setShowL2(true);
    }, 1500);
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Public Verification Tool</span>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Audit Content History.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
          Drag and drop any asset to inspect its Content Credentials. Verified by the global Signet Registry.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-96 border-2 border-dashed border-[var(--border-light)] rounded-2xl bg-[var(--bg-standard)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--trust-blue)] transition-all group relative overflow-hidden"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--trust-blue) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {file ? (
              <div className="text-center space-y-4 relative z-10">
                <span className="text-6xl">🛡️</span>
                <p className="font-mono text-sm font-bold text-[var(--text-header)]">{file.name}</p>
                <p className="text-xs opacity-40 uppercase font-mono tracking-widest">Substrate Ready for Audit</p>
                
                {manifest && (
                  <div className="absolute top-0 right-[-60px]">
                    <div className="cr-badge w-12 h-12 bg-white text-[var(--trust-blue)] shadow-xl animate-bounce">cr</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="text-6xl">⭱</span>
                <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">Drop Asset to Verify</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleVerify}
              disabled={!file || isVerifying}
              className="flex-1 py-5 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded-lg shadow-2xl transition-all disabled:opacity-30"
            >
              {isVerifying ? 'PROBING SUBSTRATE...' : 'Execute Audit (∑)'}
            </button>
            <button 
              onClick={() => { setFile(null); setManifest(null); setShowL2(false); }}
              className="px-8 border border-[var(--border-light)] rounded-lg hover:bg-neutral-50 transition-colors font-mono text-[10px] uppercase font-bold"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">L2_Disclosure</h3>
          {manifest ? (
            <div className="relative h-[400px]">
               <NutritionLabel manifest={manifest} onClose={() => setShowL2(false)} />
            </div>
          ) : (
            <div className="h-[400px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8 opacity-30 italic font-serif">
               <span className="text-4xl mb-4">🔬</span>
               <p>Awaiting asset ingestion for progressive disclosure.</p>
            </div>
          )}
        </div>
      </div>

      <Admonition type="note" title="Durable Credentials">
        If an image is uploaded without metadata, our <strong>Soft Binding</strong> engine will use perceptual hashing (pHash) to recover its credentials from the Signet cloud repository.
      </Admonition>
    </div>
  );
};