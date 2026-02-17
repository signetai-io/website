import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Admonition } from './Admonition';
import { NutritionLabel } from './NutritionLabel';

export const VerifyView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [showL2, setShowL2] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Robust URL Param Extraction (Search + Hash)
  const getUrlParam = (param: string) => {
    // 1. Check standard query string
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get(param)) return searchParams.get(param);

    // 2. Check Hash string (e.g. #verify?url=...)
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const hashParams = new URLSearchParams(hash.substring(qIndex));
      return hashParams.get(param);
    }
    return null;
  };

  useEffect(() => {
    const deepLinkUrl = getUrlParam('url') || getUrlParam('verify_url');
    
    if (deepLinkUrl) {
      // Decode if encoded
      const decodedUrl = decodeURIComponent(deepLinkUrl);
      setUrlInput(decodedUrl);
      handleUrlFetch(decodedUrl);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setManifest(null);
      setShowL2(false);
      setFetchError(null);
    }
  };

  const handleUrlFetch = async (url: string) => {
    if (!url) return;
    setIsFetching(true);
    setFetchError(null);
    setFile(null);
    setManifest(null);
    setShowL2(false);
    
    try {
      // In a real env, this might need a CORS proxy if the target doesn't allow cross-origin
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      // Try to get filename from url or headers
      const urlFileName = url.split('/').pop()?.split('?')[0] || 'remote_asset.bin';
      const fetchedFile = new File([blob], urlFileName, { type: blob.type });
      
      setFile(fetchedFile);
      // Auto-trigger verify for deep links to streamline UX
      handleVerify(fetchedFile);
    } catch (err: any) {
      console.error("Fetch error:", err);
      let msg = "Failed to fetch asset.";
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        msg = "CORS Error: The hosting server blocked this request. Try downloading the file and dragging it here instead.";
      } else {
        msg = `Fetch Error: ${err.message}`;
      }
      setFetchError(msg);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFetchError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setManifest(null);
      setShowL2(false);
    }
  }, []);

  const handleVerify = (targetFile: File | null = file) => {
    if (!targetFile) return;
    setIsVerifying(true);
    
    // Simulated C2PA v2.3 Verification Loop
    setTimeout(() => {
      // Logic: If it's our specific demo file, show a specific manifest
      const isDemo = targetFile.name.includes('solar-system');
      
      setManifest({
        signature: {
          identity: isDemo ? "signetai.io:ssl" : "Signet Alpha Model",
          anchor: "signetai.io:ssl",
          timestamp: Date.now() - (isDemo ? 1000 * 60 * 60 * 24 : 1000 * 60 * 5), // 24h ago for demo
        },
        assertions: [
          {
            label: "c2pa.actions",
            data: {
              actions: [{ action: "c2pa.created", softwareAgent: "Neural Prism v0.2.7" }]
            }
          },
          {
            label: "org.signetai.vpr",
            data: {
              score: 0.9998,
              logic_hash: isDemo ? "sha256:c17e...907b" : "sha256:dynamic..."
            }
          }
        ],
        isDemo
      });
      setIsVerifying(false);
      setShowL2(true);
    }, 1500);
  };

  const loadDemo = () => {
    const demoUrl = './signed_signetai-solar-system.svg';
    setUrlInput(demoUrl);
    handleUrlFetch(demoUrl);
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
          {/* Universal Ingest Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-96 border-2 border-dashed rounded-2xl bg-[var(--bg-standard)] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${
              dragActive ? 'border-[var(--trust-blue)] bg-blue-50/10' : 'border-[var(--border-light)] hover:border-[var(--trust-blue)]'
            }`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--trust-blue) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {isFetching ? (
               <div className="text-center space-y-4 relative z-10 animate-pulse">
                 <span className="text-6xl">🌐</span>
                 <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--trust-blue)]">Resolving Remote Asset...</p>
                 <p className="text-xs font-mono opacity-50">{urlInput}</p>
               </div>
            ) : file ? (
              <div className="text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-300">
                <span className="text-6xl">🛡️</span>
                <p className="font-mono text-sm font-bold text-[var(--text-header)]">{file.name}</p>
                <div className="flex justify-center gap-2">
                   <p className="text-xs opacity-40 uppercase font-mono tracking-widest">Substrate Ready</p>
                   <span className="text-xs opacity-30 font-mono">|</span>
                   <p className="text-xs opacity-40 uppercase font-mono tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                
                {manifest && (
                  <div className="absolute top-0 right-[-60px]">
                    <div className="cr-badge w-12 h-12 bg-white text-[var(--trust-blue)] shadow-xl animate-bounce">cr</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="text-6xl">⭱</span>
                <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">
                  {dragActive ? 'Release to Ingest' : 'Drop Asset / Paste URL'}
                </p>
              </div>
            )}
            
            {dragActive && (
              <div className="absolute inset-0 bg-[var(--trust-blue)]/10 pointer-events-none flex items-center justify-center">
                 <p className="font-serif text-2xl font-bold italic text-[var(--trust-blue)]">Drop to Audit</p>
              </div>
            )}
          </div>

          {/* URL Input & Controls */}
          <div className="space-y-4">
             <div className="flex gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                    <span className="text-xs">🔗</span>
                  </div>
                  <input 
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://... (Remote Audit)"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch(urlInput)}
                    className="w-full pl-9 pr-4 py-3 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded font-mono text-[11px] outline-none focus:border-[var(--trust-blue)] transition-colors"
                  />
                  {urlInput && (
                    <button 
                      onClick={() => handleUrlFetch(urlInput)}
                      className="absolute inset-y-0 right-0 px-4 text-[9px] font-bold uppercase hover:bg-[var(--bg-sidebar)] transition-colors rounded-r border-l border-[var(--border-light)] text-[var(--trust-blue)]"
                    >
                      Fetch
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => { setFile(null); setManifest(null); setShowL2(false); setUrlInput(''); setFetchError(null); }}
                  className="px-6 border border-[var(--border-light)] rounded hover:bg-neutral-50 transition-colors font-mono text-[10px] uppercase font-bold"
                >
                  Clear
                </button>
             </div>

             <div className="flex justify-between items-center">
                <button 
                  onClick={loadDemo}
                  className="text-[10px] text-[var(--trust-blue)] hover:underline font-mono uppercase font-bold flex items-center gap-2"
                >
                  <span>⚡</span> Load Demo: signed_signetai-solar-system.svg
                </button>
             </div>

             {fetchError && (
               <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-serif italic flex gap-2 items-center">
                 <span>⚠️</span> {fetchError}
               </div>
             )}

             <button 
               onClick={() => handleVerify(file)}
               disabled={!file || isVerifying || isFetching}
               className="w-full py-5 bg-[var(--trust-blue)] text-white font-mono text-xs uppercase font-bold tracking-[0.3em] rounded-lg shadow-2xl transition-all disabled:opacity-30 disabled:shadow-none hover:brightness-110 active:scale-95"
             >
               {isVerifying ? 'PROBING SUBSTRATE...' : 'Execute Audit (∑)'}
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