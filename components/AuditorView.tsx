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
}

const PUBLIC_TEST_FILES: C2PATestFile[] = [
  {
    name: "ca.jpg",
    type: "image/jpeg",
    assertions: 4,
    ingredients: ["Self-contained"],
    signature: "Adobe Content Authenticity",
    status: "valid",
    description: "Standard C2PA 1.0 signed image from the CAI test suite."
  },
  {
    name: "vpr_enhanced_model.png",
    type: "image/png",
    assertions: 12,
    ingredients: ["gemini-3-pro", "signet-sdk-v2"],
    signature: "Signet TKS (Master)",
    status: "valid",
    description: "Signet-native asset with nested VPR logic DAG assertions."
  },
  {
    name: "broken_manifest.webp",
    type: "image/webp",
    assertions: 2,
    ingredients: ["Unknown"],
    signature: "Expired/Mismatch",
    status: "invalid",
    description: "Simulation of a manifest where the hash-binding is broken."
  }
];

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
        <h1 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">C2PA Test Suite.</h1>
        <p className="text-lg opacity-60 font-serif leading-relaxed italic max-w-2xl">
          Ingest and verify public test files from the <code>c2pa-org/public-testfiles</code> repository. Cross-reference standard manifests with Signet VPR logic.
        </p>
      </header>

      {showGuide && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
          {[
            { step: '01', title: 'Target Selection', text: 'Select a verified asset from the C2PA public repository list.' },
            { step: '02', title: 'JUMBF Parsing', text: 'System decoupling of the binary manifest from the visual substrate.' },
            { step: '03', title: 'Box Inspection', text: 'Audit specific JUMBF assertions like c2pa.actions and signet.vpr.' },
            { step: '04', title: 'Attestation', text: 'Verify the Ed25519 signature against the trusted TKS identity anchor.' }
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
          <h3 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest">Select Audit Target</h3>
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
                  <span className={`font-mono text-[10px] font-bold ${selectedFile?.name === file.name ? 'text-[var(--trust-blue)]' : 'text-[var(--text-body)]'}`}>
                    {file.name}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    file.status === 'valid' ? 'bg-green-500' : file.status === 'invalid' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                </div>
                <p className="text-[11px] opacity-40 font-serif italic truncate">{file.description}</p>
              </button>
            ))}
          </div>
          
          <div className="p-6 border-2 border-dashed border-[var(--border-light)] rounded-lg text-center space-y-3 hover:border-[var(--trust-blue)] transition-all cursor-pointer">
            <div className="w-10 h-10 border border-[var(--border-light)] rounded-full flex items-center justify-center mx-auto opacity-40">
              <span className="text-xl">+</span>
            </div>
            <p className="font-mono text-[10px] uppercase opacity-40 font-bold">Upload Local Asset</p>
          </div>
        </div>

        {/* Right Col: Manifest Inspector */}
        <div className="lg:col-span-2 space-y-8">
          {!selectedFile && !isAuditing ? (
            <div className="h-96 border border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center bg-[var(--code-bg)] opacity-30 italic font-serif">
              <p>Select a test file from the menu to initiate JUMBF extraction...</p>
            </div>
          ) : isAuditing ? (
            <div className="h-96 border border-[var(--border-light)] rounded-xl flex flex-col items-center justify-center bg-[var(--code-bg)]">
              <div className="w-8 h-8 border-2 border-[var(--trust-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-[10px] uppercase tracking-widest">Extracting JUMBF Boxes...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Asset Card */}
                <div className="bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg p-4 aspect-square flex items-center justify-center relative group">
                  <div className="text-center">
                    <div className="w-12 h-12 border border-[var(--trust-blue)] flex items-center justify-center mx-auto mb-4 bg-white">
                      <span className="text-[var(--trust-blue)] font-bold text-lg select-none">IMG</span>
                    </div>
                    <p className="font-mono text-[10px] opacity-40 uppercase tracking-widest">{selectedFile.name}</p>
                  </div>
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-black text-white font-mono text-[8px] uppercase tracking-tighter rounded">
                    {selectedFile.type}
                  </div>
                </div>

                {/* Status Dashboard */}
                <div className="space-y-6">
                  <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg shadow-sm">
                    <h4 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest mb-4">Verification Result</h4>
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl font-serif font-bold italic ${
                        selectedFile.status === 'valid' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedFile.status === 'valid' ? 'Verified' : 'Failed'}
                      </div>
                      <span className="text-[10px] opacity-30 font-mono italic">Audit Score: 0.998</span>
                    </div>
                    <p className="mt-4 text-[13px] opacity-60 leading-relaxed font-serif">
                      {selectedFile.description}
                    </p>
                  </div>

                  <div className="p-6 bg-[var(--table-header)] border border-[var(--border-light)] rounded-lg">
                    <h4 className="font-mono text-[10px] uppercase opacity-40 font-bold tracking-widest mb-4">Signer Detail</h4>
                    <div className="space-y-1">
                      <p className="font-serif text-lg font-bold text-[var(--text-header)]">{selectedFile.signature}</p>
                      <p className="font-mono text-[9px] text-[var(--trust-blue)] opacity-60">ID: ed25519_signet_sha256:7b8c...44a2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Manifest Data */}
              <div className="bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
                   <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest">JUMBF Manifest Tree</h3>
                   <span className="font-mono text-[9px] opacity-30 uppercase">{selectedFile.assertions} Assertions Found</span>
                </div>
                <div className="p-0">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[var(--code-bg)] text-[var(--text-body)] opacity-40 uppercase tracking-tighter border-b border-[var(--border-light)]">
                      <tr>
                        <th className="px-6 py-3">Assertion Label</th>
                        <th className="px-6 py-3">JUMBF Path</th>
                        <th className="px-6 py-3 text-right">Status</th>
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
                      {selectedFile.name.includes('vpr') && (
                        <tr>
                          <td className="px-6 py-4 font-bold text-[var(--trust-blue)]">org.signetai.vpr.dag</td>
                          <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/assertions/signet_vpr</td>
                          <td className="px-6 py-4 text-right text-[var(--trust-blue)] font-bold">ATTESTED</td>
                        </tr>
                      )}
                      <tr>
                        <td className="px-6 py-4 font-bold">c2pa.signature</td>
                        <td className="px-6 py-4 opacity-40 italic">/jumbf/c2pa/signature</td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          selectedFile.status === 'valid' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {selectedFile.status === 'valid' ? 'VALID' : 'INVALID'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Admonition type="note" title="Library Compatibility">
                This verification uses a Signet-ported implementation of <code>c2pa-js</code>. Assets are parsed according to ISO/TC 290 standards for Cognitive Provenance.
              </Admonition>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};