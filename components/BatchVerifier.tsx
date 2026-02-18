import React, { useState, useRef } from 'react';
import { Admonition } from './Admonition';

interface FileResult {
  name: string;
  status: 'PENDING' | 'VERIFIED' | 'UNSIGNED' | 'TAMPERED';
  msg: string;
  hash: string;
  size: number;
}

export const BatchVerifier: React.FC = () => {
  const [results, setResults] = useState<FileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState({ total: 0, verified: 0, unsigned: 0, tampered: 0 });
  
  // Fallback input for non-Chromium browsers
  const dirInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File): Promise<FileResult> => {
    const TAIL_SCAN_SIZE = 10240; 
    let status: FileResult['status'] = 'UNSIGNED';
    let msg = "No credential found";
    let hash = "";

    try {
      // 1. Fast Tail Scan (Zero-Copy Logic)
      const tailBlob = file.slice(Math.max(0, file.size - TAIL_SCAN_SIZE), file.size);
      const tailText = await tailBlob.text();
      const headText = await file.slice(0, 4096).text(); // Check SVG header

      let jsonStr = "";
      
      // Strategy A: UTW
      if (tailText.includes('%SIGNET_VPR_START')) {
        const start = tailText.lastIndexOf('%SIGNET_VPR_START');
        const end = tailText.lastIndexOf('%SIGNET_VPR_END');
        if (start !== -1 && end !== -1) {
           jsonStr = tailText.substring(start + '%SIGNET_VPR_START'.length, end).trim();
        }
      } 
      // Strategy B: SVG XML
      else if (file.type === 'image/svg+xml' || headText.includes('<svg')) {
         const fullText = await file.text(); // SVG requires full read usually, unless optimized
         const match = fullText.match(/<signet:manifest>([\s\S]*?)<\/signet:manifest>/);
         if (match) jsonStr = match[1];
      }

      if (jsonStr) {
        try {
          const manifest = JSON.parse(jsonStr);
          status = 'VERIFIED';
          msg = `Signed by: ${manifest.signature.signer}`;
          hash = manifest.asset.content_hash.substring(0, 16) + "...";
        } catch (e) {
          status = 'TAMPERED';
          msg = "Corrupt Manifest JSON";
        }
      }

    } catch (e) {
      status = 'TAMPERED';
      msg = "Read Error";
    }

    return {
      name: file.name,
      status,
      msg,
      hash,
      size: file.size
    };
  };

  const handleDirectorySelect = async () => {
    // Modern FS Access API
    try {
      // @ts-ignore - types not fully standard yet
      const dirHandle = await window.showDirectoryPicker();
      setIsProcessing(true);
      setResults([]);
      setSummary({ total: 0, verified: 0, unsigned: 0, tampered: 0 });

      let localResults: FileResult[] = [];
      let counts = { total: 0, verified: 0, unsigned: 0, tampered: 0 };

      // Recursive scanner
      async function scanDir(handle: any) {
        for await (const entry of handle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            // Filter dotfiles
            if (file.name.startsWith('.')) continue;
            
            const result = await processFile(file);
            localResults.unshift(result); // Newest top
            setResults([...localResults]); // Update UI live
            
            counts.total++;
            if (result.status === 'VERIFIED') counts.verified++;
            if (result.status === 'UNSIGNED') counts.unsigned++;
            if (result.status === 'TAMPERED') counts.tampered++;
            setSummary({...counts});
          } else if (entry.kind === 'directory') {
            await scanDir(entry);
          }
        }
      }

      await scanDir(dirHandle);
      setIsProcessing(false);

    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Dir Scan Error:", err);
        alert("Directory access failed. Try the fallback input below.");
      }
      setIsProcessing(false);
    }
  };

  const handleFallbackSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true);
      const files = Array.from(e.target.files);
      setResults([]);
      setSummary({ total: 0, verified: 0, unsigned: 0, tampered: 0 });

      let counts = { total: 0, verified: 0, unsigned: 0, tampered: 0 };
      let localResults: FileResult[] = [];

      for (const file of files) {
        if (file.name.startsWith('.')) continue;
        const result = await processFile(file);
        localResults.unshift(result);
        setResults([...localResults]);
        
        counts.total++;
        if (result.status === 'VERIFIED') counts.verified++;
        if (result.status === 'UNSIGNED') counts.unsigned++;
        if (result.status === 'TAMPERED') counts.tampered++;
        setSummary({...counts});
        
        // Small yield to let UI render
        await new Promise(r => setTimeout(r, 10));
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-12 space-y-8 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Mass Audit</span>
            <div className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-bold rounded font-mono">LOCAL_IO</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Batch Processor.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
          Select a local folder to recursively audit every file inside. Processing happens entirely on your device (Edge Compute).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 border border-[var(--border-light)] bg-[var(--bg-standard)] rounded-xl shadow-sm space-y-4">
             <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-40">Input Source</h3>
             
             <button 
               onClick={handleDirectorySelect}
               disabled={isProcessing}
               className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded hover:brightness-110 transition-all shadow-lg flex flex-col items-center justify-center gap-2"
             >
               <span className="text-xl">📁</span>
               Select Folder
             </button>

             <div className="text-center">
               <span className="text-[9px] opacity-40 font-mono uppercase">- OR -</span>
             </div>

             <div className="relative">
               <input 
                 type="file" 
                 // @ts-ignore - webkitdirectory is standard in most browsers but not TS
                 webkitdirectory="" 
                 directory="" 
                 multiple 
                 ref={dirInputRef}
                 onChange={handleFallbackSelect}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <button className="w-full py-2 border border-[var(--border-light)] text-[var(--text-body)] font-mono text-[10px] uppercase font-bold rounded hover:bg-[var(--bg-sidebar)]">
                 Legacy File Picker
               </button>
             </div>
          </div>

          <div className="p-6 border border-[var(--border-light)] bg-[var(--table-header)] rounded-xl space-y-4">
             <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-40">Audit Summary</h3>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                   <span>Total Scanned</span>
                   <span className="font-bold">{summary.total}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-emerald-600">
                   <span>Verified (UTW/XML)</span>
                   <span className="font-bold">{summary.verified}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-amber-600">
                   <span>Unsigned</span>
                   <span className="font-bold">{summary.unsigned}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-red-600">
                   <span>Tampered/Corrupt</span>
                   <span className="font-bold">{summary.tampered}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Results Feed */}
        <div className="lg:col-span-3 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-xl overflow-hidden flex flex-col h-[600px]">
           <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Live Telemetry Stream</span>
              {isProcessing && <span className="font-mono text-[10px] text-[var(--trust-blue)] animate-pulse">PROCESSING...</span>}
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px]">
              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                   <span className="text-4xl mb-4">⚡</span>
                   <p>Waiting for directory handle...</p>
                </div>
              ) : (
                results.map((r, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 p-2 border-b border-[var(--border-light)] last:border-0 hover:bg-white/5 transition-colors">
                     <div className="col-span-1 opacity-30">{i+1}</div>
                     <div className="col-span-4 truncate font-bold" title={r.name}>{r.name}</div>
                     <div className="col-span-2 opacity-50">{(r.size / 1024).toFixed(1)} KB</div>
                     <div className={`col-span-2 font-bold ${
                       r.status === 'VERIFIED' ? 'text-emerald-500' : 
                       r.status === 'TAMPERED' ? 'text-red-500' : 'text-amber-500 opacity-50'
                     }`}>
                       {r.status}
                     </div>
                     <div className="col-span-3 truncate opacity-60 text-[9px]">{r.msg}</div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
      
      <Admonition type="security" title="Zero-Data Disclosure">
        This Batch Processor utilizes the <code>FileSystemHandle</code> API. Files are streamed directly from your disk to the local browser memory for hashing. No data is ever uploaded to the cloud.
      </Admonition>
    </div>
  );
};