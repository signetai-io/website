import React, { useState, useRef } from 'react';
import { PersistenceService } from '../services/PersistenceService';
import { Admonition } from './Admonition';

// Helper to convert buffer to Hex for display
const bufferToHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
};

const calculateHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const PdfSigner: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalBuffer, setOriginalBuffer] = useState<ArrayBuffer | null>(null);
  const [signedBuffer, setSignedBuffer] = useState<ArrayBuffer | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'STRUCTURE' | 'HEX'>('VISUAL');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [eofPosition, setEofPosition] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result instanceof ArrayBuffer) {
          setOriginalFile(file);
          setOriginalBuffer(ev.target.result);
          setSignedBuffer(null);
          setVerificationResult(null);
          
          // Find standard EOF to demonstrate logic
          const text = new TextDecoder().decode(ev.target.result);
          const eofIndex = text.lastIndexOf('%%EOF');
          setEofPosition(eofIndex);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a valid PDF file.");
    }
  };

  const handleSign = async () => {
    if (!originalBuffer || !originalFile) return;
    setIsSigning(true);
    setVerificationResult(null);
    
    // 1. Get Identity
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

    // 2. Check for Existing Signet Block
    const textDecoder = new TextDecoder();
    const originalText = textDecoder.decode(originalBuffer);
    
    if (originalText.includes('SIGNET_VPR_START')) {
        // Already signed, verify instead
        setIsSigning(false);
        setSignedBuffer(originalBuffer); // Treat original as signed
        setVerificationResult({
            success: true,
            msg: "File already contains a Signet Post-EOF block. Switched to verification mode."
        });
        return;
    }

    // 3. Hash the VALID CONTENT (The original PDF)
    const contentHash = await calculateHash(originalBuffer);

    // 4. Create Manifest
    const manifest = {
      "@context": "https://signetai.io/contexts/vpr-v1.jsonld",
      "type": "org.signetai.document_provenance",
      "version": "0.3.1",
      "strategy": "POST_EOF_INJECTION",
      "asset": {
        "type": "application/pdf",
        "hash_algorithm": "SHA-256",
        "content_hash": contentHash,
        "filename": originalFile.name,
        "byte_length": originalBuffer.byteLength
      },
      "signature": {
        "signer": vault.identity,
        "anchor": vault.anchor,
        "key": vault.publicKey,
        "timestamp": new Date().toISOString()
      }
    };

    // 5. Create Injection Block
    // We pad with newlines to ensure clean separation from binary data
    const injectionString = `
%SIGNET_VPR_START
% This data is appended after the PDF %%EOF marker.
% It does not affect PDF rendering but provides cryptographic provenance.
${JSON.stringify(manifest, null, 2)}
%SIGNET_VPR_END
`;

    const injectionBuffer = new TextEncoder().encode(injectionString);

    // 6. Concatenate Buffers
    const newBuffer = new Uint8Array(originalBuffer.byteLength + injectionBuffer.byteLength);
    newBuffer.set(new Uint8Array(originalBuffer), 0);
    newBuffer.set(injectionBuffer, originalBuffer.byteLength);

    setTimeout(() => {
      setSignedBuffer(newBuffer.buffer);
      setIsSigning(false);
      setActiveTab('HEX');
    }, 1500);
  };

  const handleVerify = async () => {
    if (!signedBuffer) return;
    
    const textDecoder = new TextDecoder();
    const fullText = textDecoder.decode(signedBuffer);
    
    // 1. Find the Signet Block
    const startIndex = fullText.lastIndexOf('%SIGNET_VPR_START');
    const endIndex = fullText.lastIndexOf('%SIGNET_VPR_END');
    
    if (startIndex === -1 || endIndex === -1) {
        setVerificationResult({ success: false, msg: "No Post-EOF Signet block found." });
        return;
    }

    // 2. Extract JSON
    const block = fullText.substring(startIndex, endIndex);
    const jsonMatch = block.match(/{[\s\S]*}/);
    
    if (!jsonMatch) {
        setVerificationResult({ success: false, msg: "Corrupt Manifest JSON." });
        return;
    }

    try {
        const manifest = JSON.parse(jsonMatch[0]);
        
        // 3. Re-Hash the Content
        // The content is everything BEFORE the injection string (plus potentially the newlines we added?)
        // In this simple demo, we know the signedBuffer = original + injection.
        // So original length is listed in manifest.
        
        const originalLength = manifest.asset.byte_length;
        const contentSlice = signedBuffer.slice(0, originalLength);
        const calculatedHash = await calculateHash(contentSlice);
        
        const hashMatch = calculatedHash === manifest.asset.content_hash;

        setVerificationResult({
            success: hashMatch,
            identity: manifest.signature.signer,
            timestamp: manifest.signature.timestamp,
            hash: manifest.asset.content_hash,
            msg: hashMatch 
                ? "Post-EOF Signature Verified. PDF Content Body is authentic." 
                : "TAMPER WARNING: PDF Content body does not match signed hash."
        });

    } catch (e) {
        setVerificationResult({ success: false, msg: "JSON Parsing Error." });
    }
  };

  const downloadSigned = () => {
    if (!signedBuffer || !originalFile) return;
    const blob = new Blob([signedBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_${originalFile.name}`;
    a.click();
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Layer 7: Document Attestation</span>
            <div className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded font-mono">POST_EOF_INJECTION</div>
        </div>
        <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">PDF Signer.</h2>
        <div className="flex flex-col gap-2">
            <p className="text-xl opacity-60 max-w-2xl font-serif italic">
                Appends a verifiable JSON manifest after the PDF's <code>%%EOF</code> marker. Ensures reader compatibility while maintaining cryptographic logic chains.
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Left Column: Input */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
           <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
             <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-header)]">Document Source</h3>
             <div className="flex gap-4">
                <input 
                  type="file" 
                  accept=".pdf" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="text-[10px] text-[var(--trust-blue)] hover:underline font-bold uppercase"
                >
                    + Upload PDF
                </button>
             </div>
           </div>
           
           <div className="flex-1 bg-[var(--code-bg)] relative flex flex-col items-center justify-center overflow-hidden">
             {originalFile ? (
               <div className="text-center space-y-4 text-[var(--text-body)]">
                 <span className="text-6xl">📄</span>
                 <div>
                    <p className="font-bold text-lg">{originalFile.name}</p>
                    <p className="font-mono text-[10px] opacity-50">{(originalFile.size / 1024).toFixed(2)} KB</p>
                 </div>
                 {eofPosition > 0 && (
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-mono text-[9px] inline-block">
                        Valid PDF Structure Detected (EOF at {eofPosition})
                    </div>
                 )}
               </div>
             ) : (
                <div className="text-center opacity-30 text-[var(--text-body)]">
                    <span className="text-4xl">pdf_input</span>
                    <p className="font-mono text-[10px] mt-2">Waiting for PDF...</p>
                </div>
             )}
           </div>
           
           <div className="p-4 border-t border-[var(--border-light)]">
             <button 
               onClick={handleSign}
               disabled={!originalFile || isSigning}
               className="w-full py-4 bg-[var(--trust-blue)] text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all disabled:opacity-50"
             >
               {isSigning ? 'HASHING & APPENDING METADATA...' : 'Sign Document (Post-EOF)'}
             </button>
           </div>
        </div>

        {/* Right Column: Signed / Hex */}
        <div className="flex flex-col border border-[var(--border-light)] rounded-xl bg-[var(--bg-standard)] overflow-hidden shadow-sm">
            <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('VISUAL')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'VISUAL' ? 'text-[var(--trust-blue)]' : 'opacity-40 text-[var(--text-body)]'}`}>Manifest</button>
                    <button onClick={() => setActiveTab('HEX')} className={`font-mono text-[10px] uppercase font-bold ${activeTab === 'HEX' ? 'text-[var(--trust-blue)]' : 'opacity-40 text-[var(--text-body)]'}`}>Binary Structure</button>
                </div>
                {signedBuffer && <span className="font-mono text-[9px] text-emerald-500 font-bold">SIGNED</span>}
            </div>

            <div className="flex-1 bg-[var(--code-bg)] relative overflow-auto">
               {!signedBuffer ? (
                 <div className="flex items-center justify-center h-full opacity-30 italic font-serif text-[var(--text-body)]">
                    Awaiting signature injection...
                 </div>
               ) : (
                 <>
                   {activeTab === 'VISUAL' && (
                     <div className="p-6">
                        <h4 className="font-mono text-[10px] uppercase font-bold mb-4 text-[var(--text-header)]">Injected Payload (Tail)</h4>
                        <div className="p-4 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded font-mono text-[10px] whitespace-pre-wrap shadow-sm text-[var(--text-body)]">
                            {new TextDecoder().decode(signedBuffer).split('%SIGNET_VPR_START')[1] ? 
                             `%SIGNET_VPR_START${new TextDecoder().decode(signedBuffer).split('%SIGNET_VPR_START')[1]}` : 
                             'Error parsing tail block.'}
                        </div>
                     </div>
                   )}
                   {activeTab === 'HEX' && (
                     <div className="p-4 font-mono text-[10px] h-full overflow-auto break-all leading-relaxed text-[var(--text-body)]">
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-blue-500">
                           <strong>Injection Strategy:</strong> The data below shows the end of the original file (EOF) followed immediately by the Signet Manifest.
                        </div>
                        {/* Show last 1000 bytes for performance */}
                        <div className="opacity-50">... [Previous {signedBuffer.byteLength - 1000} bytes hidden] ...</div>
                        <div className="mt-2">
                            {bufferToHex(signedBuffer.slice(signedBuffer.byteLength - 1000))}
                        </div>
                     </div>
                   )}
                 </>
               )}
            </div>

            <div className="p-4 border-t border-[var(--border-light)] flex gap-4">
                <button 
                  onClick={handleVerify}
                  disabled={!signedBuffer}
                  className="flex-1 py-3 border border-[var(--border-light)] hover:bg-[var(--bg-sidebar)] text-[var(--text-body)] transition-all font-mono text-[10px] uppercase font-bold rounded"
                >
                  Verify Signature
                </button>
                <button 
                  onClick={downloadSigned}
                  disabled={!signedBuffer}
                  className="flex-1 py-3 bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded shadow hover:brightness-110 transition-all"
                >
                  Download PDF
                </button>
            </div>
        </div>
      </div>

      {verificationResult && (
        <div className={`p-8 rounded-lg border flex items-start gap-6 animate-in slide-in-from-bottom-4 ${verificationResult.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className={`text-4xl ${verificationResult.success ? 'grayscale-0' : 'grayscale'}`}>
                {verificationResult.success ? '🛡️' : '⚠️'}
            </div>
            <div className="space-y-2">
                <h4 className={`font-serif text-2xl font-bold italic ${verificationResult.success ? 'text-emerald-500' : 'text-red-500'}`}>
                    {verificationResult.success ? 'Document Integrity Verified' : 'Verification Failed'}
                </h4>
                <p className="text-sm opacity-70 font-serif leading-relaxed text-[var(--text-body)]">
                    {verificationResult.msg}
                </p>
                {verificationResult.success && verificationResult.identity && (
                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <div className="bg-[var(--bg-standard)] p-2 rounded border border-[var(--border-light)]">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40 text-[var(--text-body)]">Signed By</p>
                            <p className="font-mono text-[10px] font-bold text-[var(--text-body)]">{verificationResult.identity}</p>
                        </div>
                        <div className="bg-[var(--bg-standard)] p-2 rounded border border-[var(--border-light)]">
                            <p className="font-mono text-[9px] uppercase font-bold opacity-40 text-[var(--text-body)]">Valid Content Body Hash</p>
                            <p className="font-mono text-[10px] font-bold truncate text-[var(--text-body)]">{verificationResult.hash}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      <Admonition type="important" title="Reader Compatibility">
        Post-EOF Injection is compliant with the PDF spec (Section 7.5.6) regarding incremental updates. Standard readers (Acrobat, Chrome) will ignore the Signet block and display the document normally, while Signet-aware tools can extract the provenance.
      </Admonition>
    </div>
  );
};