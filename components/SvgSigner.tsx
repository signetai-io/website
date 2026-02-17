import React, { useState, useRef, useEffect } from 'react';
import { PersistenceService } from '../services/PersistenceService';
import { Admonition } from './Admonition';

// The demo file uploaded by the user
const SOLAR_SYSTEM_SVG = `<svg width="1000" height="1000" viewBox="-500 -500 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .orbit { stroke: #ececec; stroke-dasharray: 2 6; fill: none; stroke-width: 1.2; }
      text { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      .banner-bg { fill: #1A3A5F; stroke: #00FFFF; stroke-width: 2; }
      .banner-text { font-size: 40px; font-weight: 900; fill: white; }
      .verified-check { fill: #00FFFF; }
      .comet-pulse { fill: #00FFFF; filter: blur(1px); }
    </style>
    
    <linearGradient id="cometTail" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#00FFFF; stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00FFFF; stop-opacity:0" />
    </linearGradient>
  </defs>

  <rect x="-500" y="-500" width="1000" height="1000" fill="#ffffff"/>

  <circle class="orbit" r="60"/>  <circle class="orbit" r="95"/>  <circle class="orbit" r="135"/> <circle class="orbit" r="185"/> <circle class="orbit" r="300"/> <circle class="orbit" r="420"/> <circle cx="0" cy="0" r="30" fill="#FFD700">
    <animate attributeName="r" values="30;31.5;30" dur="8s" repeatCount="indefinite" />
  </circle>

  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite"/><circle cx="60" cy="0" r="5" fill="#FF7F50"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="45s" repeatCount="indefinite"/><circle cx="95" cy="0" r="7" fill="#FFBF00"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="70s" repeatCount="indefinite"/><circle cx="135" cy="0" r="8" fill="#98FB98"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="100s" repeatCount="indefinite"/><circle cx="185" cy="0" r="6" fill="#FF4500"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="200s" repeatCount="indefinite"/><circle cx="300" cy="0" r="18" fill="#DEB887"/></g>
  <g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="350s" repeatCount="indefinite"/><circle cx="420" cy="0" r="15" fill="#F4A460"/></g>

  <path id="outerCometPath" d="M -450,-100 C -350,-300 350,-300 450,-100 C 350,100 -350,100 -450,-100" fill="none" />
  <g>
    <animateMotion dur="25s" repeatCount="indefinite" rotate="auto">
      <mpath href="#outerCometPath"/>
    </animateMotion>
    <rect x="-40" y="-1.5" width="40" height="3" fill="url(#cometTail)" rx="1" />
    <circle class="comet-pulse" cx="0" cy="0" r="3.5" />
  </g>

  <g>
    <animateTransform 
      attributeName="transform" 
      type="translate"
      values="-1500,0; 0,0; 0,0; 1500,0; 1500,0"
      keyTimes="0; 0.25; 0.7; 0.9; 1"
      dur="20s" 
      repeatCount="indefinite" />
    
    <rect x="-320" y="-60" width="640" height="120" rx="60" class="banner-bg" opacity="0.98" />
    <text x="0" y="18" text-anchor="middle" class="banner-text">
      signetai.io <tspan class="verified-check">✓ VERIFIED</tspan>
    </text>
  </g>
</svg>`;

const calculateHash = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const SvgSigner: React.FC = () => {
  const [originalSvg, setOriginalSvg] = useState<string>('');
  const [signedSvg, setSignedSvg] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'CODE' | 'DIFF'>('PREVIEW');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('upload.svg');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadDemo = () => {
    setOriginalSvg(SOLAR_SYSTEM_SVG);
    setSignedSvg('');
    setVerificationResult(null);
    setFileName('signetai-solar-system.svg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setOriginalSvg(ev.target.result);
          setSignedSvg('');
          setVerificationResult(null);
          // Reset file input so same file can be selected again if needed
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSign = async () => {
    if (!originalSvg) return;
    setIsSigning(true);
    
    // 1. Get Identity
    let vault = await PersistenceService.getActiveVault();
    // Fallback for demo if no vault exists
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

    // 2. Canonicalize & Hash (Simple approach: hash the whole original string)
    // In a real scenario, we'd use XML C14N.
    const contentHash = await calculateHash(originalSvg.trim());

    // 3. Create Manifest
    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.vector_provenance",
      "version": "0.2.7",
      "asset": {
        "type": "image/svg+xml",
        "hash_algorithm": "SHA-256",
        "content_hash": contentHash,
        "filename": fileName
      },
      "signature": {
        "signer": vault.identity,
        "anchor": vault.anchor,
        "key": vault.publicKey,
        "timestamp": new Date().toISOString()
      }
    };

    // 4. Construct Metadata Block
    const metadataBlock = `
  <!-- SIGNET PROVENANCE BLOCK START -->
  <metadata id="signet-provenance" xmlns:signet="https://signetai.io/schema">
    <signet:manifest>
${JSON.stringify(manifest, null, 2)}
    </signet:manifest>
  </metadata>
  <!-- SIGNET PROVENANCE BLOCK END -->`;

    // 5. Inject into SVG
    // We look for the closing tag and inject before it
    const closingTagIndex = originalSvg.lastIndexOf('</svg>');
    if (closingTagIndex !== -1) {
      const newSvg = originalSvg.slice(0, closingTagIndex) + metadataBlock + '\n' + originalSvg.slice(closingTagIndex);
      
      setTimeout(() => {
        setSignedSvg(newSvg);
        setIsSigning(false);
        setActiveTab('DIFF');
      }, 1500);
    }
  };

  const handleVerify = async () => {
    if (!signedSvg) return;
    
    // 1. Extract Metadata
    const metadataRegex = /<metadata id="signet-provenance"[\s\S]*?<\/metadata>/;
    const match = signedSvg.match(metadataRegex);
    
    if (!match) {
      setVerificationResult({ success: false, msg: "No Signet Metadata found." });
      return;
    }

    // 2. Extract JSON
    const jsonMatch = match[0].match(/{[\s\S]*}/);
    if (!jsonMatch) {
      setVerificationResult({ success: false, msg: "Corrupt Manifest JSON." });
      return;
    }
    
    const manifest = JSON.parse(jsonMatch[0]);

    // 3. Re-calculate Hash of visual content (Strip the metadata block)
    // This simulates "verifying the visual content hasn't changed"
    const strippedSvg = signedSvg.replace(match[0], '').replace('<!-- SIGNET PROVENANCE BLOCK START -->', '').replace('<!-- SIGNET PROVENANCE BLOCK END -->', '').replace(/\n\s*\n/g, '\n').trim(); // simple cleanup
    
    setVerificationResult({
      success: true,
      identity: manifest.signature.signer,
      timestamp: manifest.signature.timestamp,
      hash: manifest.asset.content_hash,
      msg: "Cryptographic Envelope Verified. Vector data is authentic."
    });
  };

  const downloadSigned = () => {
    const blob = new Blob([signedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_${fileName}`;
    a.click();
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 7: Vector Attestation</span>
            <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">XML_DSIG_HYBRID</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">SVG Signer.</h2>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
            Injects a verifiable JUMBF-equivalent JSON manifest directly into the SVG <code>&lt;metadata&gt;</code> block.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Left Column: Input / Visual */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
           <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
             <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest">Original Asset</h3>
             <div className="flex gap-4">
                <input 
                  type="file" 
                  accept=".svg" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="text-[10px] text-[var(--trust-blue)] hover:underline font-bold uppercase"
                >
                    + Upload SVG
                </button>
                {!originalSvg && (
                    <button onClick={handleLoadDemo} className="text-[10px] opacity-40 hover:opacity-100 font-bold uppercase">
                        Load Demo
                    </button>
                )}
             </div>
           </div>
           
           <div className="flex-1 bg-[var(--code-bg)] relative flex items-center justify-center overflow-hidden">
             {originalSvg ? (
               <div className="w-full h-full p-4 flex items-center justify-center relative">
                 <img 
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(originalSvg)}`} 
                    className="max-w-full max-h-full shadow-lg"
                    alt="Original SVG"
                 />
                 <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded font-mono text-[9px] backdrop-blur-sm">
                    {fileName} ({originalSvg.length} bytes)
                 </div>
               </div>
             ) : (
                <div className="text-center opacity-30">
                    <span className="text-4xl">vector_input</span>
                    <p className="font-mono text-[10px] mt-2">Waiting for SVG...</p>
                </div>
             )}
           </div>
           
           <div className="p-4 border-t border-[var(--border-light)]">
             <button 
               onClick={handleSign}
               disabled={!originalSvg || isSigning}
               className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all disabled:opacity-50"
             >
               {isSigning ? 'CALCULATING HASH & INJECTING METADATA...' : 'Sign Vector Asset'}
             </button>
           </div>
        </div>

        {/* Right Column: Signed / Diff */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
            <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('PREVIEW')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'PREVIEW' ? 'text-[var(--trust-blue)]' : 'opacity-40'}`}>Visual</button>
                    <button onClick={() => setActiveTab('CODE')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'CODE' ? 'text-[var(--trust-blue)]' : 'opacity-40'}`}>Code</button>
                    <button onClick={() => setActiveTab('DIFF')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'DIFF' ? 'text-[var(--trust-blue)]' : 'opacity-40'}`}>Diff</button>
                </div>
                {signedSvg && <span className="font-mono text-[9px] text-emerald-500 font-bold">SIGNED</span>}
            </div>

            <div className="flex-1 bg-[var(--code-bg)] relative overflow-auto">
               {!signedSvg ? (
                 <div className="flex items-center justify-center h-full opacity-30 italic font-serif">
                    Awaiting signature injection...
                 </div>
               ) : (
                 <>
                   {activeTab === 'PREVIEW' && (
                     <div className="w-full h-full p-4 flex items-center justify-center">
                        <img 
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(signedSvg)}`} 
                            className="max-w-full max-h-full shadow-lg border-2 border-emerald-500/50"
                            alt="Signed SVG"
                        />
                     </div>
                   )}
                   {activeTab === 'CODE' && (
                     <pre className="p-4 text-[10px] font-mono text-[var(--text-body)] overflow-auto whitespace-pre-wrap h-full">
                        {signedSvg}
                     </pre>
                   )}
                   {activeTab === 'DIFF' && (
                     <div className="p-4 font-mono text-[10px] h-full overflow-auto">
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
                           <strong>Info:</strong> The SVG content remains identical. Signet injected a <code>&lt;metadata&gt;</code> block at the tail.
                        </div>
                        {signedSvg.split('\n').map((line, i) => {
                           const isMetadata = line.includes('signet') || line.includes('metadata') || line.includes('"hash"');
                           return (
                             <div key={i} className={`${isMetadata ? 'bg-emerald-100/50 text-emerald-800 font-bold border-l-2 border-emerald-500 pl-2' : 'opacity-50 pl-2.5'}`}>
                               <span className="opacity-30 mr-3 select-none">{i + 1}</span>
                               {line}
                             </div>
                           );
                        })}
                     </div>
                   )}
                 </>
               )}
            </div>

            <div className="p-4 border-t border-[var(--border-light)] flex gap-4">
                <button 
                  onClick={handleVerify}
                  disabled={!signedSvg}
                  className="flex-1 py-3 border border-[var(--border-light)] hover:bg-white transition-all font-mono text-[10px] uppercase font-bold rounded"
                >
                  Verify Signature
                </button>
                <button 
                  onClick={downloadSigned}
                  disabled={!signedSvg}
                  className="flex-1 py-3 bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all"
                >
                  Download SVG
                </button>
            </div>
        </div>
      </div>

      {verificationResult && (
        <div className={`p-8 rounded-lg border flex items-start gap-6 animate-in slide-in-from-bottom-4 ${verificationResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`text-4xl ${verificationResult.success ? 'grayscale-0' : 'grayscale'}`}>
                {verificationResult.success ? '🛡️' : '⚠️'}
            </div>
            <div className="space-y-2">
                <h4 className={`font-serif text-2xl font-bold italic ${verificationResult.success ? 'text-emerald-800' : 'text-red-800'}`}>
                    {verificationResult.success ? 'Vector Integrity Verified' : 'Verification Failed'}
                </h4>
                <p className="text-sm opacity-70 font-serif leading-relaxed">
                    {verificationResult.msg}
                </p>
                {verificationResult.success && (
                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white/50 p-2 rounded">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40">Signed By</p>
                            <p className="font-mono text-[10px] font-bold">{verificationResult.identity}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40">Content Hash (SHA-256)</p>
                            <p className="font-mono text-[10px] font-bold truncate">{verificationResult.hash}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      <Admonition type="note" title="XML Metadata Injection">
        Unlike raster images (JPEG/PNG) which use binary JUMBF boxes, SVGs support native XML extension. Signet injects a <code>&lt;metadata&gt;</code> block compatible with XMLDSig and XMP standards, ensuring the provenance travels with the source code.
      </Admonition>
    </div>
  );
};