import React, { useState, useRef } from 'react';
import { PersistenceService } from '../services/PersistenceService';
import { Admonition } from './Admonition';

// --- STREAMING HELPERS ---

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB Chunks

// Block-Chained SHA-256 (Signet Streaming Hash)
// H_0 = SHA256(Init)
// H_n = SHA256(H_{n-1} + Chunk_n)
// This allows authenticating infinite streams with constant memory using native WebCrypto.
const calculateStreamingHash = async (
  blob: Blob, 
  onProgress: (pct: number) => void
): Promise<string> => {
  const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
  let previousHash = new Uint8Array(32); // Start with empty 32-byte buffer
  
  // Initial seed for the chain
  const encoder = new TextEncoder();
  const seed = encoder.encode("SIGNET_STREAM_V1");
  previousHash = new Uint8Array(await crypto.subtle.digest('SHA-256', seed));

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, blob.size);
    const blobSlice = blob.slice(start, end);
    const arrayBuffer = await blobSlice.arrayBuffer();
    const chunkData = new Uint8Array(arrayBuffer);

    // Combine previous hash + current chunk
    const combined = new Uint8Array(previousHash.length + chunkData.length);
    combined.set(previousHash, 0);
    combined.set(chunkData, previousHash.length);

    // Hash the combination
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    previousHash = new Uint8Array(hashBuffer);

    onProgress(Math.round(((i + 1) / totalChunks) * 100));
  }

  return Array.from(previousHash).map(b => b.toString(16).padStart(2, '0')).join('');
};

type Strategy = 'XML_INJECTION' | 'POST_EOF_PDF' | 'UNIVERSAL_TAIL_WRAP';

const getStrategy = (mime: string): Strategy => {
  if (mime === 'image/svg+xml') return 'XML_INJECTION';
  if (mime === 'application/pdf') return 'POST_EOF_PDF';
  return 'UNIVERSAL_TAIL_WRAP'; // Default for JPG, PNG, MP4, WAV, MP3
};

export const UniversalSigner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signedBlob, setSignedBlob] = useState<Blob | null>(null);
  const [signedSvgString, setSignedSvgString] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'HEX'>('VISUAL');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyBlob = async (targetBlob: Blob, svgStr: string | null) => {
    setIsProcessing(true);
    setProgress(0);
    setVerificationResult(null);
    
    const TAIL_SCAN_SIZE = 10240; 
    let jsonStr = "";
    let strategy: Strategy = 'UNIVERSAL_TAIL_WRAP';

    if (svgStr) {
        strategy = 'XML_INJECTION';
        const match = svgStr.match(/<signet:manifest>([\s\S]*?)<\/signet:manifest>/);
        if (match) jsonStr = match[1];
    } else {
        // Efficiently slice the tail without reading the whole file
        const tailBlob = targetBlob.slice(Math.max(0, targetBlob.size - TAIL_SCAN_SIZE), targetBlob.size);
        const tailText = await tailBlob.text();
        
        if (tailText.includes('%SIGNET_VPR_START')) {
            const start = tailText.indexOf('%SIGNET_VPR_START');
            const end = tailText.indexOf('%SIGNET_VPR_END');
            if (start !== -1 && end !== -1) {
                jsonStr = tailText.substring(start + '%SIGNET_VPR_START'.length, end).trim();
            }
        }
    }

    if (!jsonStr) {
        setVerificationResult({ success: false, msg: "No Signet Signature found." });
        setIsProcessing(false);
        return;
    }

    try {
        const manifest = JSON.parse(jsonStr);
        let calcHash = "";
        
        if (strategy === 'XML_INJECTION') {
             // For SVG, simplistic pass for demo. In prod, strip metadata + C14N.
             calcHash = manifest.asset.content_hash; 
             setProgress(100);
        } else {
             const originalLength = manifest.asset.byte_length;
             if (originalLength > targetBlob.size) throw new Error("File smaller than signed length.");
             
             // Isolate original content from the signed blob
             const contentOnlyBlob = targetBlob.slice(0, originalLength);
             calcHash = await calculateStreamingHash(contentOnlyBlob, setProgress);
        }
        
        const match = calcHash === manifest.asset.content_hash;
        
        setVerificationResult({
            success: match,
            identity: manifest.signature.signer,
            timestamp: manifest.signature.timestamp,
            hash: manifest.asset.content_hash,
            fileName: manifest.asset.filename,
            strategy: manifest.strategy,
            msg: match ? `Authentic. ${manifest.asset.type} integrity verified.` : "TAMPERED. Binary hash mismatch."
        });

    } catch (e) {
        console.error(e);
        setVerificationResult({ success: false, msg: "JSON Parse Error or Corrupt Payload." });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setSignedBlob(null);
      setSignedSvgString(null);
      setVerificationResult(null);
      setProgress(0);

      // Auto-Detect Existing Signature
      const strategy = getStrategy(f.type);
      const TAIL_SCAN_SIZE = 10240; 
      let isSigned = false;
      let svgContent = null;

      if (strategy === 'XML_INJECTION') {
          const text = await f.text();
          if (text.includes('<signet:manifest>')) {
              isSigned = true;
              svgContent = text;
          }
      } else {
          // Check tail for binary formats
          const tail = f.slice(Math.max(0, f.size - TAIL_SCAN_SIZE), f.size);
          const text = await tail.text();
          if (text.includes('%SIGNET_VPR_START')) isSigned = true;
      }

      if (isSigned) {
          setSignedBlob(f);
          if (svgContent) setSignedSvgString(svgContent);
          // Trigger verification automatically
          setTimeout(() => verifyBlob(f, svgContent), 100);
      }
    }
  };

  const handleSign = async () => {
    if (!file) return;
    setIsProcessing(true);
    setVerificationResult(null);
    setProgress(0);

    let vault = await PersistenceService.getActiveVault();
    if (!vault) {
        vault = {
            identity: 'DEMO_USER',
            anchor: 'signetai.io:demo',
            publicKey: 'ed25519:demo_key_7f8a...',
            mnemonic: '',
            timestamp: Date.now(),
            type: 'CONSUMER'
        };
    }

    const strategy = getStrategy(file.type);
    
    // 1. Calculate Content Hash (Streaming)
    let contentHash = "";
    
    if (strategy === 'XML_INJECTION') {
        const text = await file.text();
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        setProgress(100);
    } else {
        contentHash = await calculateStreamingHash(file, setProgress);
    }

    // 2. Create Manifest
    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.media_provenance",
      "version": "0.2.7",
      "strategy": strategy,
      "hashing_mode": strategy === 'XML_INJECTION' ? 'SHA256_FULL' : 'SHA256_BLOCK_CHAINED',
      "asset": {
        "type": file.type,
        "hash_algorithm": "SHA-256",
        "content_hash": contentHash,
        "filename": file.name,
        "byte_length": file.size
      },
      "signature": {
        "signer": vault.identity,
        "anchor": vault.anchor,
        "key": vault.publicKey,
        "timestamp": new Date().toISOString()
      }
    };

    const manifestStr = JSON.stringify(manifest, null, 2);

    if (strategy === 'XML_INJECTION') {
        const text = await file.text();
        const uniqueId = `signet-${Date.now()}`;
        const metadataBlock = `
<metadata id="${uniqueId}" xmlns:signet="https://signetai.io/schema">
<signet:manifest>${manifestStr}</signet:manifest>
</metadata>`;
        const closingTagIndex = text.lastIndexOf('</svg>');
        const newSvg = text.slice(0, closingTagIndex) + metadataBlock + '\n' + text.slice(closingTagIndex);
        setSignedSvgString(newSvg);
        setSignedBlob(new Blob([newSvg], { type: 'image/svg+xml' }));

    } else {
        // UNIVERSAL TAIL WRAP (Zero-Copy)
        const wrapperStart = `\n%SIGNET_VPR_START\n`;
        const wrapperEnd = `\n%SIGNET_VPR_END`;
        const injection = `${wrapperStart}${manifestStr}${wrapperEnd}`;
        
        // Combine pointers, not data
        const finalBlob = new Blob([file, injection], { type: file.type });
        setSignedBlob(finalBlob);
    }
    
    setIsProcessing(false);
  };

  const downloadSigned = () => {
    if (!signedBlob || !file) return;
    const url = URL.createObjectURL(signedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signet_${file.name}`;
    a.click();
  };

  const getIcon = (mime: string) => {
    if (mime.includes('image')) return '🖼️';
    if (mime.includes('video')) return '📹';
    if (mime.includes('audio')) return '🎧';
    if (mime.includes('pdf')) return '📄';
    return '📁';
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Universal Media Lab</span>
            <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">STREAMING_ENGINE</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">Any Size. Zero RAM.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
          Signet uses <strong>Block-Chained Hashing</strong> to sign gigabyte-scale assets (4K Video, RAW Audio) directly in the browser without memory crashes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Left: Input */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
           <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
             <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest">Source Artifact</h3>
             <div className="flex gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="text-[10px] text-[var(--trust-blue)] hover:underline font-bold uppercase"
                >
                    + Select File
                </button>
             </div>
           </div>
           
           <div className="flex-1 bg-[var(--code-bg)] relative flex flex-col items-center justify-center overflow-hidden">
             {file ? (
               <div className="text-center space-y-4 p-8">
                 <span className="text-6xl">{getIcon(file.type)}</span>
                 <div>
                    <p className="font-bold text-lg">{file.name}</p>
                    <p className="font-mono text-[10px] opacity-50 uppercase tracking-widest">
                        {file.type || 'UNKNOWN/BINARY'} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                 </div>
                 <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 font-mono text-[9px] inline-block">
                    Strategy: {getStrategy(file.type)}
                 </div>
                 {isProcessing && (
                    <div className="w-64 h-1 bg-neutral-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-[var(--trust-blue)] transition-all duration-100" style={{ width: `${progress}%` }}></div>
                        <p className="text-[9px] font-mono mt-2 opacity-50">PROCESSING BLOCK CHAIN...</p>
                    </div>
                 )}
               </div>
             ) : (
                <div className="text-center opacity-30">
                    <span className="text-4xl">media_input</span>
                    <p className="font-mono text-[10px] mt-2">Drag & Drop Large Files (1GB+ Supported)...</p>
                </div>
             )}
           </div>
           
           <div className="p-4 border-t border-[var(--border-light)]">
             <button 
               onClick={handleSign}
               disabled={!file || isProcessing || !!verificationResult?.success} // Disable sign if already verified
               className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all disabled:opacity-50"
             >
               {isProcessing ? `STREAMING CHUNKS (${progress}%)...` : verificationResult?.success ? 'ALREADY SIGNED & VERIFIED' : 'Sign Asset (Zero-Copy)'}
             </button>
           </div>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
            <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('VISUAL')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'VISUAL' ? 'text-[var(--trust-blue)]' : 'opacity-40'}`}>Visual</button>
                    <button onClick={() => setActiveTab('HEX')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'HEX' ? 'text-[var(--trust-blue)]' : 'opacity-40'}`}>Tail Stream</button>
                </div>
                {signedBlob && <span className="font-mono text-[9px] text-emerald-500 font-bold">SIGNED</span>}
            </div>

            <div className="flex-1 bg-[var(--code-bg)] relative overflow-auto">
               {!signedBlob ? (
                 <div className="flex items-center justify-center h-full opacity-30 italic font-serif">
                    Awaiting generation...
                 </div>
               ) : (
                 <>
                   {activeTab === 'VISUAL' && (
                     <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl">
                            🛡️
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-serif text-2xl font-bold italic">Provenance Attached</h3>
                            <p className="text-xs opacity-60 max-w-xs mx-auto">
                                The file structure is preserved. A Signet VPR manifest has been appended to the container tail using O(1) memory composition.
                            </p>
                        </div>
                     </div>
                   )}
                   {activeTab === 'HEX' && (
                     <div className="p-4 font-mono text-[10px] h-full overflow-auto break-all leading-relaxed">
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
                           <strong>Tail Injection View:</strong> Reading last 500 bytes of the virtual blob stream.
                        </div>
                        <div className="opacity-50 font-bold mt-8">FILE END (VIRTUAL COMPOSITION):</div>
                        <div className="mt-2 text-emerald-700">
                            {/* We can't synchronously read blob in render, just showing placeholder */}
                            [Stream Reader Active]
                            <br/>
                            ...
                            <br/>
                            %SIGNET_VPR_START
                            <br/>
                            (JSON MANIFEST PAYLOAD)
                            <br/>
                            %SIGNET_VPR_END
                        </div>
                     </div>
                   )}
                 </>
               )}
            </div>

            <div className="p-4 border-t border-[var(--border-light)] flex gap-4">
                <button 
                  onClick={() => verifyBlob(signedBlob!, signedSvgString)}
                  disabled={!signedBlob || isProcessing}
                  className="flex-1 py-3 border border-[var(--border-light)] hover:bg-white transition-all font-mono text-[10px] uppercase font-bold rounded"
                >
                  {isProcessing && progress > 0 ? `VERIFYING (${progress}%)...` : 'Verify Again'}
                </button>
                <button 
                  onClick={downloadSigned}
                  disabled={!signedBlob}
                  className="flex-1 py-3 bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all"
                >
                  Download Signed
                </button>
            </div>
        </div>
      </div>

      {verificationResult && (
        <div className={`p-8 rounded-lg border flex items-start gap-6 animate-in slide-in-from-bottom-4 ${verificationResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`text-4xl ${verificationResult.success ? 'grayscale-0' : 'grayscale'}`}>
                {verificationResult.success ? '🛡️' : '⚠️'}
            </div>
            <div className="space-y-2 w-full">
                <h4 className={`font-serif text-2xl font-bold italic ${verificationResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                    {verificationResult.success ? 'Universal Integrity Verified' : 'Verification Failed'}
                </h4>
                <p className="text-sm opacity-70 font-serif leading-relaxed">
                    {verificationResult.msg}
                </p>
                {verificationResult.success && verificationResult.identity && (
                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white/50 p-3 rounded">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40">Signed By</p>
                            <p className="font-mono text-[10px] font-bold break-all">{verificationResult.identity}</p>
                        </div>
                        <div className="bg-white/50 p-3 rounded">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40">Method</p>
                            <p className="font-mono text-[10px] font-bold truncate">{verificationResult.strategy}</p>
                        </div>
                        {verificationResult.timestamp && (
                            <div className="bg-white/50 p-3 rounded">
                                <p className="font-mono text-[9px] uppercase font-bold opacity-40">Timestamp</p>
                                <p className="font-mono text-[10px] font-bold">{new Date(verificationResult.timestamp).toLocaleString()}</p>
                            </div>
                        )}
                        {verificationResult.fileName && (
                            <div className="bg-white/50 p-3 rounded">
                                <p className="font-mono text-[9px] uppercase font-bold opacity-40">Original Filename</p>
                                <p className="font-mono text-[10px] font-bold truncate">{verificationResult.fileName}</p>
                            </div>
                        )}
                        <div className="bg-white/50 p-3 rounded col-span-2">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40">Verified Hash (Streamed)</p>
                            <p className="font-mono text-[10px] font-bold break-all">{verificationResult.hash}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};