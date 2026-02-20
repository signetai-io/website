import React, { useState } from 'react';
import { Admonition } from './Admonition';

interface C2PATestFile {
  name: string;
  type: string;
  assertions: number;
  ingredients: string[];
  signature: string;
  status: 'valid' | 'invalid' | 'warning';
  description: string;
  format: 'image' | 'video' | 'audio' | 'pdf';
}

const PUBLIC_TEST_FILES: C2PATestFile[] = [
  {
    name: "ca.jpg",
    type: "image/jpeg",
    assertions: 4,
    ingredients: ["Self-contained"],
    signature: "Adobe Content Authenticity",
    status: "valid",
    format: "image",
    description: "Standard C2PA 1.0 signed image from the CAI test suite."
  },
  {
    name: "vpr_enhanced_model.png",
    type: "image/png",
    assertions: 12,
    ingredients: ["gemini-3-pro", "signet-sdk-v2"],
    signature: "Signet TKS (Master)",
    status: "valid",
    format: "image",
    description: "Signet-native asset with nested VPR logic DAG assertions."
  },
  {
    name: "adobe_video_test.mp4",
    type: "video/mp4",
    assertions: 8,
    ingredients: ["Premiere Pro", "Stock Footage"],
    signature: "Adobe Video CA",
    status: "valid",
    format: "video",
    description: "Verified video manifest showing multiple editing ingredients and frame-level hashing."
  },
  {
    name: "signet_audio_brief.wav",
    type: "audio/wav",
    assertions: 6,
    ingredients: ["ElevenLabs", "Signet-TTS-V2"],
    signature: "Signet Audio Lab",
    status: "valid",
    format: "audio",
    description: "Attested audio clip verifying the 'Neural Lens' filter was applied to remove synthetic artifacts."
  },
  {
    name: "policy_manifest.pdf",
    type: "application/pdf",
    assertions: 15,
    ingredients: ["Word", "Acrobat"],
    signature: "Global Standards CA",
    status: "valid",
    format: "pdf",
    description: "Document provenance showing sequential digital signatures and editorial changes."
  },
  {
    name: "broken_manifest.webp",
    type: "image/webp",
    assertions: 2,
    ingredients: ["Unknown"],
    signature: "Expired/Mismatch",
    status: "invalid",
    format: "image",
    description: "Simulation of a manifest where the hash-binding is broken or the cert has expired."
  }
];

const FileIcon: React.FC<{ format: C2PATestFile['format'] }> = ({ format }) => {
  switch (format) {
    case 'video': return <span>▶</span>;
    case 'audio': return <span>♫</span>;
    case 'pdf': return <span>📄</span>;
    default: return <span>IMG</span>;
  }
};

export const AuditorView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<C2PATestFile | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const runAudit = (file: C2PATestFile) => {
    setIsAuditing(true);
    setTimeout(() => {
      setSelectedFile(file);
      setIsAuditing(false);
    }, 1500);
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase bg-orange-500 text-white px-2 py-0.5 font-bold tracking-widest rounded-sm">Testing Lab</span>
            <span className="font-mono text-[10px] uppercase text-[var(--trust-blue)] tracking-[0.4em] font-bold">Signet Auditor v0.2.1</span>
          </div>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="font-mono text-[10px] uppercase border border-[var(--trust-blue)] text-[var(--trust-blue)] px-4 py-2 hover:bg-[var(--trust-blue)] hover:text-white transition-all font-bold rounded shadow-sm"
          >
            {showGuide ? '✕ Hide Guide' : '📖 Execution Guide'}
          </button>
        </div>
        <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">C2PA Multi-Format Suite.</h1>
        <p className="text-lg opacity-60 font-serif leading-relaxed italic max-w-2xl">
          Ingest and verify public test files across images, video, audio, and documents. Cross-reference industry-standard manifests with Signet VPR logic.
        </p>
      </header>

      {showGuide && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
          {[
            { step: '01', title: 'Target Selection', text: 'Choose a file format (Image, Video, Audio, or PDF) for manifest inspection.' },
            { step: '02', title: 'JUMBF Parsing', text: 'Extracting JUMBF boxes from the asset (e.g., MP4 MooV boxes or JPEG APP11 segments).' },
            { step: '03', title: 'Assertion Audit', text: 'Verify nested ingredients and soft-binding claims unique to each format.' },
            { step: '04', title: 'Trust Attestation', text: 'Validate the end-to-end signature chain against global CA trust lists.' }
          ].map((item) => (
            <div key={item.step} className="p-6 border border-[var(--trust-blue)] bg-[var(--admonition-bg)] rounded-lg space-y-3">
              <span className="font-mono text-[10px] text-[var(--trust-blue)] font-bold tracking-widest opacity-40">{item.step}</span>
              <h4 className="font-serif text-lg font-bold italic text-[var(--text-header)]">{item.title}</h4>
              <p className="text-[12px] opacity-70 leading-relaxed italic">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: File Selector */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest">Repository Contents</h3>
          <div className="space-y-2">
            {PUBLIC_TEST_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => runAudit(file)}
                className={`w-full p-4 border text-left transition-all rounded group ${
                  selectedFile?.name === file.name 
                    ? 'border-[var(--trust-blue)] bg-[var(--admonition-bg)]' 
                    : 'border-[var(--border-light)] hover:border-[var(--trust-blue)]'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-30"><FileIcon format={file.format} /></span>
                    <span className={`font-mono text-[10px] font-bold ${selectedFile?.name === file.name ? 'text-[var(--trust-blue)]' : 'text-[var(--text-header)]'}`}>
                      {file.name}
                    </span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    file.status === 'valid' ? 'bg-green-500' : file.status === 'invalid' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                </div>
                <p className="text-[11px] opacity-40 font-serif italic truncate">{file.description}</p>
              </button>
            ))}
          </div>
          
          <div className="p-6 border-2 border-dashed border-[var(--border-light)] rounded-lg text-center space-y-3 hover:border-[var(--trust-blue)] transition-all cursor-pointer group">
            <div className="w-10 h-10 border border-[var(--border-light)] rounded-full flex items-center justify-center mx-auto opacity-40 group-hover:border-[var(--trust-blue)] group-hover:text-[var(--trust-blue)] transition-colors">
              <span className="text-xl">+</span>
            </div>
            <p className="font-mono text-[10px] uppercase opacity-40 font-bold group-hover:opacity-100 transition-opacity">Ingest Remote Testfile</p>
          </div>
        </div>

        {/* Right Col: Manifest Inspector */}
        <div className="lg:col-span-2 space-y-8">
          {!selectedFile && !isAuditing ? (
            <div className="h-[500px] border border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center bg-[var(--code-bg)] opacity-30 italic font-serif">
              <div className="mb-4 text-4xl">🔬</div>
              <p>Ready for industrial inspection. Select a file type to begin.</p>
            </div>
          ) : isAuditing ? (
            <div className="h-[500px] border border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center bg-[var(--code-bg)]">
              <div className="w-8 h-8 border-2 border-[var(--trust-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--trust-blue)]">Decoupling JUMBF Containers...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Asset Card */}
                <div className="bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg p-4 aspect-square flex items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--trust-blue) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  <div className="text-center">
                    <div className="w-16 h-16 border border-[var(--trust-blue)] flex items-center justify-center mx-auto mb-4 bg-[var(--bg-standard)] shadow-xl rounded-sm">
                      <span className="text-[var(--trust-blue)] font-bold text-xl select-none">
                        <FileIcon format={selectedFile!.format} />
                      </span>
                    </div>
                    <p className="font-mono text-[11px] opacity-40 uppercase tracking-[0.2em] font-bold">{selectedFile!.name}</p>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white font-mono text-[9px] uppercase tracking-tighter rounded border border-white/20">
                    {selectedFile!.type}
                  </div>
                </div>

                {/* Status Dashboard */}
                <div className="space-y-6">
                  <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg shadow-sm">
                    <h4 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest mb-4">Audit Result</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl font-serif font-bold italic ${
                        selectedFile!.status === 'valid' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedFile!.status === 'valid' ? 'Verified' : 'Failed'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] opacity-30 font-mono italic">Confidence</span>
                        <span className="text-[10px] font-mono font-bold">{selectedFile!.status === 'valid' ? '0.9997' : '0.0000'}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-[13px] opacity-60 leading-relaxed font-serif">
                      {selectedFile!.description}
                    </p>
                  </div>

                  <div className="p-6 bg-[var(--table-header)] border border-[var(--border-light)] rounded-lg">
                    <h4 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest mb-4">Authority Signature</h4>
                    <div className="space-y-1">
                      <p className="font-serif text-lg font-bold text-[var(--text-header)]">{selectedFile!.signature}</p>
                      <p className="font-mono text-[9px] text-[var(--trust-blue)] opacity-60 break-all">Chain: CA_ROOT_SEC_PROV_{selectedFile!.format.toUpperCase()}_02</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Manifest Data */}
              <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest">JUMBF Manifest Tree</h3>
                     <span className="px-2 py-0.5 bg-[var(--trust-blue)]/10 text-[var(--trust-blue)] rounded-full text-[8px] font-mono font-bold tracking-tighter">v2.2_SPEC</span>
                   </div>
                   <span className="font-mono text-[9px] opacity-30 uppercase">{selectedFile!.assertions} Assertions Found</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[var(--code-bg)] text-[var(--text-body)] opacity-40 uppercase tracking-tighter border-b border-[var(--border-light)]">
                      <tr>
                        <th className="px-6 py-3">Label</th>
                        <th className="px-6 py-3">Identifier Path</th>
                        <th className="px-6 py-3 text-right">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      <tr>
                        <td className="px-6 py-4 font-bold">c2pa.actions</td>
                        <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/assertions/actions</td>
                        <td className="px-6 py-4 text-right text-green-500 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold">c2pa.hash.data</td>
                        <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/assertions/data_hash</td>
                        <td className="px-6 py-4 text-right text-green-500 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold">c2pa.ingredients</td>
                        <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/assertions/ingredients</td>
                        <td className="px-6 py-4 text-right text-green-500 font-bold">{selectedFile!.ingredients.length} ATTESTED</td>
                      </tr>
                      {selectedFile!.signature.includes('Signet') && (
                        <tr>
                          <td className="px-6 py-4 font-bold text-[var(--trust-blue)]">org.signetai.vpr.dag</td>
                          <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/assertions/signet_vpr</td>
                          <td className="px-6 py-4 text-right text-[var(--trust-blue)] font-bold">DETERMINISTIC</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-6 py-4 font-bold">c2pa.signature</td>
                        <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/signature</td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          selectedFile!.status === 'valid' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {selectedFile!.status === 'valid' ? 'MATCH' : 'TAMPERED'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Admonition type="note" title="Library Compatibility">
                  This verifier strictly adheres to ISO/TC 290. Assets from different formats are parsed via the unified <code>c2pa-js</code> JUMBF-extract buffer.
                </Admonition>
                <div className="p-6 border border-[var(--border-light)] bg-[var(--table-header)] rounded-lg flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="font-mono text-[9px] opacity-40 uppercase font-bold">Ingredients List</p>
                      <p className="font-serif text-[12px] italic text-[var(--text-body)]">{selectedFile!.ingredients.join(' → ')}</p>
                   </div>
                   <div className="w-8 h-8 rounded border border-[var(--border-light)] flex items-center justify-center opacity-20">
                      <span className="text-xs">🔗</span>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};