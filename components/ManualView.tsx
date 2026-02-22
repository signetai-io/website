
import React from 'react';

const ManualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-16">
    <h3 className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--trust-blue)] font-bold mb-6 border-b border-[var(--border-light)] pb-2">
      {title}
    </h3>
    <div className="space-y-6">
      {children}
    </div>
  </section>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="p-8 border border-[var(--border-light)] bg-[var(--table-header)] rounded shadow-sm">
    <div className="w-10 h-10 border border-[var(--trust-blue)] text-[var(--trust-blue)] flex items-center justify-center font-bold mb-6 italic">
      {icon}
    </div>
    <h4 className="font-serif text-xl font-bold text-[var(--text-header)] mb-3">{title}</h4>
    <p className="text-[14px] leading-relaxed text-[var(--text-body)] opacity-70 italic">{desc}</p>
  </div>
);

export const ManualView: React.FC = () => {
  return (
    <div className="py-24 max-w-5xl mx-auto">
      <header className="mb-20 space-y-4">
        <h1 className="text-6xl font-bold tracking-tighter italic text-[var(--text-header)]">Operator's Manual</h1>
        <p className="text-xl text-[var(--text-body)] opacity-60 font-serif leading-relaxed italic">
          v0.3.1 — Standardized Guidance for the Signet Accountability Layer.
        </p>
      </header>

      <ManualSection title="01. Identity & Vault Recovery">
        <div className="space-y-4 text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif">
          <p>Signet uses a <strong>Non-Custodial</strong> trust model. This means you alone hold the keys to your curatorial authority.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded">
               <h5 className="font-bold text-red-600 mb-2">If you lose your Seed Manifest:</h5>
               <p className="text-sm opacity-70">Use the <strong>24-Word Mnemonic</strong> in the "Vault Recovery" section to re-derive your signing keys. This resets your local session without changing your Registry Anchor.</p>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded">
               <h5 className="font-bold text-amber-600 mb-2">If you lose both Seed & Mnemonic:</h5>
               <p className="text-sm opacity-70">The identity is <strong>Orphaned</strong>. It remains in the registry for accountability (others can still verify old assets), but no new assets can ever be signed by this ID.</p>
            </div>
          </div>
        </div>
      </ManualSection>

      <ManualSection title="02. Unstructured Text Embedding (C2PA 2.3)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The Dec 2025 C2PA update introduces a specialized method for embedding provenance in text without binary containers.
        </p>
        <div className="p-8 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-xs space-y-4">
           <p className="text-[var(--trust-blue)] font-bold">// C2PATextManifestWrapper (Section A.7)</p>
           <p className="opacity-60 leading-relaxed">
             Signet encodes the JUMBF manifest into a sequence of <strong>Unicode Variation Selectors</strong> (U+FE00-U+FE0F). 
             These characters are invisible to human readers but parsed by Signet-compliant LLMs and editors.
           </p>
           <div className="bg-black/5 p-4 rounded border border-black/10">
             <code className="text-[var(--text-header)]">"The reasoning starts here.[SIGNET_VPR_WRAPPER]"</code>
           </div>
        </div>
      </ManualSection>

      <ManualSection title="03. Live Video Provenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📹" 
            title="Segmented Info" 
            desc="C2PA 2.3 Section 19.4 support. Each frame segment is signed independently using session keys, preventing stream manipulation or replay attacks." 
          />
          <FeatureCard 
            icon="🛡️" 
            title="Actions v2" 
            desc="The protocol has moved exclusively to the v2 Actions schema. This includes fine-grained watermarking and proportional resizing attestation." 
          />
        </div>
      </ManualSection>

      <ManualSection title="04. Vector Attestation (SVG)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          Unlike raster images, Vector Graphics require <strong>XML-DSig Hybrid</strong> attestation to maintain code readability and portability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📐" 
            title="Metadata Injection" 
            desc="Signet injects a JSON-LD manifest into a custom <metadata> block just before the closing tag, ensuring the visual rendering is unaffected." 
          />
          <FeatureCard 
            icon="🔍" 
            title="Visual Hashing" 
            desc="The verification engine separates the 'Code' (Metadata) from the 'Art' (Paths), calculating a SHA-256 hash of the visual data to detect tampering." 
          />
        </div>
      </ManualSection>

      <ManualSection title="05. Document Signing (PDF)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          For PDFs, Signet uses an "Append-Only" strategy. We do not rewrite the PDF structure (which risks breaking internal xref tables). Instead, we append a signed JSON block <strong>after the EOF marker</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon="📄" 
            title="Post-EOF Injection" 
            desc="Signet appends the signature block after the %%EOF tag. Standard PDF readers ignore this data, but the file remains valid and the provenance is readable as plain text." 
          />
          <FeatureCard 
            icon="🔐" 
            title="Content Body Hash" 
            desc="The signature covers the exact byte range of the original file (0 to EOF). Any modification to the content body will invalidate the Post-EOF signature." 
          />
        </div>
      </ManualSection>

      <ManualSection title="06. Headless Operations (CLI)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          For server-side pipelines and batch processing, operators should use the <strong>Signet Node.js CLI</strong>. This tool implements the Universal Tail-Wrap specification in a zero-dependency environment.
        </p>
        <div className="space-y-6">
           <div className="p-6 bg-neutral-900 text-white rounded border border-neutral-700 font-mono text-sm space-y-2">
              <p className="text-neutral-500"># 1. Download from /#cli</p>
              <p className="text-neutral-500"># 2. Run Batch Injection</p>
              <p><span className="text-emerald-500">$</span> node signet-cli.js --dir ./my-assets --identity "operator.id"</p>
           </div>
           <p className="text-sm opacity-70 italic">
             The CLI creates signed copies of assets in-place or can be configured for output directories. It supports parallel execution for high-throughput environments.
           </p>
        </div>
      </ManualSection>

      <ManualSection title="07. Performance Benchmarking">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          To verify infrastructure readiness, use the <strong>Benchmark Suite</strong>. This tool generates detached "Sidecar" manifests to measure pure cryptographic throughput without modifying source files.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
             <h5 className="font-bold text-[var(--text-header)] mb-2">Throughput Metrics</h5>
             <p className="text-sm opacity-70">Measures <strong>Files/Second</strong> and <strong>MB/Second</strong> for both generation and verification cycles.</p>
          </div>
          <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
             <h5 className="font-bold text-[var(--text-header)] mb-2">Latency Analysis</h5>
             <p className="text-sm opacity-70">Reports average time-to-sign per asset, helping operators plan capacity for real-time streams.</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-[var(--code-bg)] border border-[var(--border-light)] rounded font-mono text-xs">
           <code className="text-[var(--trust-blue)]">node signet-benchmark.js --dir ./test-corpus</code>
        </div>
      </ManualSection>

      <ManualSection title="08. API Credential Resolution">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          To maintain separation of concerns, the client now enforces strict API Key isolation. The internal `firebaseConfig` key is restricted to Firestore/Auth and is <strong>never</strong> used for Drive or Gemini calls.
        </p>
        
        <div className="overflow-hidden border border-[var(--border-light)] rounded-lg">
           <table className="w-full text-xs text-left">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                    <th className="p-4 font-bold text-[var(--text-header)]">Source</th>
                    <th className="p-4 font-bold text-[var(--text-header)]">Priority</th>
                    <th className="p-4 font-bold text-[var(--trust-blue)]">Behavior</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">GOOGLE_GEMINI_KEY</td>
                    <td className="p-4 font-bold text-emerald-600">PRIMARY</td>
                    <td className="p-4 opacity-70">
                       Defined in <code>private_keys.ts</code>. This is the <strong>default</strong> key for all Generative AI and Drive API operations.
                    </td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">process.env.API_KEY</td>
                    <td className="p-4 font-bold text-blue-600">OVERRIDE</td>
                    <td className="p-4 opacity-70">
                       Used only if `GOOGLE_GEMINI_KEY` is missing. Allows temporary overrides via CI/CD environment variables.
                    </td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">firebaseConfig.apiKey</td>
                    <td className="p-4 font-bold text-red-500">DISABLED</td>
                    <td className="p-4 opacity-70">
                       Strictly ignored for Drive/Gemini calls to prevent 403 Forbidden errors due to scope mismatch.
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </ManualSection>

      <ManualSection title="09. Cloud Audit Architecture">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The logs you observe demonstrate Signet's <strong>Zero-Copy Cloud Audit</strong> capability. Instead of downloading gigabytes of data to verify a folder, the client uses precision <strong>HTTP Range Requests</strong>.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
              <h5 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-[var(--trust-blue)]">⚡</span> HTTP 206 Partial Content
              </h5>
              <p className="text-sm opacity-70">
                To verify a 2GB video in Google Drive, the client fetches only the <strong>last 20KB</strong> (Tail Bytes).
                <br/><br/>
                <code className="text-xs bg-[var(--code-bg)] p-1 rounded border border-[var(--border-light)]">Range: bytes=FileSize-20480-</code>
              </p>
           </div>
           
           <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
              <h5 className="font-bold text-[var(--text-header)] mb-2 flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Signature Discovery
              </h5>
              <p className="text-sm opacity-70">
                The client scans this tail fragment for the <code>%SIGNET_VPR_START</code> magic bytes. If found, it parses the manifest and confirms the <strong>Identity Binding</strong> without needing the full file payload.
              </p>
           </div>
        </div>

        <div className="mt-6 p-4 border-l-4 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-xs font-mono">
           <strong className="block mb-2 text-[var(--trust-blue)]">Verification Depth Matrix</strong>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <span className="font-bold block opacity-60">Batch Mode (Cloud)</span>
                <span className="text-green-600 font-bold">Presence Audit:</span> Verifies the file IS signed and parses the metadata. Does NOT verify full binary integrity (to save bandwidth).
             </div>
             <div>
                <span className="font-bold block opacity-60">Local Mode (Drop)</span>
                <span className="text-blue-600 font-bold">Deep Audit:</span> Hashes the entire file content (0 to UTW) and compares it against the signed hash. Guarantees bit-perfect integrity.
             </div>
           </div>
        </div>
      </ManualSection>

      <ManualSection title="10. Difference Engine Metrics">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The <strong>Performance Summary</strong> in <code>/verify</code> reports deterministic client-side metrics for each comparison run, including signed keyframe metadata and checker mode.
        </p>

        <div className="overflow-hidden border border-[var(--border-light)] rounded-lg">
           <table className="w-full text-xs text-left">
              <thead className="bg-[var(--table-header)] border-b border-[var(--border-light)]">
                 <tr>
                    <th className="p-4 font-bold text-[var(--text-header)]">Metric</th>
                    <th className="p-4 font-bold text-[var(--trust-blue)]">Definition</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Frames Read</td>
                    <td className="p-4 opacity-70">Total hashed anchors processed in the run (<code>Source A anchors + Source B anchors</code>).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Sign Keyframes</td>
                    <td className="p-4 opacity-70">Count of Source A keyframes generated at signing profile (<code>1 frame/min</code> baseline).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Verify Samples</td>
                    <td className="p-4 opacity-70">Count of Source B samples evaluated by checker mode (<code>Quick=4</code>, <code>Deep≈2/min</code>).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Bytes Processed (Pixel Buffer)</td>
                    <td className="p-4 opacity-70">Client-side pixel bytes consumed by hashing. Current hash canvas is <code>32x32 RGBA</code> = <code>4096 B/frame</code>.</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Compare Time</td>
                    <td className="p-4 opacity-70">Elapsed wall-clock time for one pairwise comparison (milliseconds).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">AI Tokens Used</td>
                    <td className="p-4 opacity-70">Tokens consumed by the core compare path. In thumbnail compare mode this is <strong>0</strong> (no AI model call).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Checker Mode</td>
                    <td className="p-4 opacity-70">Verification mode used for scoring: <strong>Quick</strong> (4 anchors) or <strong>Deep</strong> (2 samples/min matched to signed keyframes).</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Manifest Hash</td>
                    <td className="p-4 opacity-70">Digest of signed Source A keyframe metadata used as the verification reference bundle.</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Final Score</td>
                    <td className="p-4 opacity-70">Normalized Difference Score <code>Δ</code> in range <code>0-1000</code>.</td>
                 </tr>
                 <tr>
                    <td className="p-4 font-mono text-[var(--text-header)]">Score Formula</td>
                    <td className="p-4 opacity-70">
                      <code>score = round(((0.8 * D_visual) + (0.2 * D_temporal)) * 1000)</code><br/>
                      where <code>D_visual</code> is normalized pHash distance and <code>D_temporal</code> is anchor-match penalty.
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>

        <div className="mt-6 p-4 border-l-4 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-xs font-mono">
          <strong className="block mb-2 text-[var(--trust-blue)]">Thumbnail Mode Note</strong>
          <span>
            In YouTube Thumbnail Anchor Mode, labels represent <strong>anchor slots</strong> rather than true decoded video-frame timestamps.
            Sample rows are shown as <code>S1..S4</code> (Quick) or dense sample IDs (Deep), and drift metrics such as median shift are reported as <code>N/A</code>.
          </span>
        </div>
      </ManualSection>

      <ManualSection title="11. Universal Lab (MP4 + YouTube)">
        <p className="text-lg leading-loose text-[var(--text-body)] opacity-80 font-serif mb-8">
          The <strong>Any Size. Zero RAM.</strong> tool in <code>/#universal-lab</code> now supports end-to-end MP4 provenance operations: local signing, automatic verification, and direct YouTube publish.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
            <h5 className="font-bold text-[var(--text-header)] mb-2">Sign + Verify Pipeline</h5>
            <ul className="list-disc pl-5 space-y-1 text-xs opacity-80 font-mono">
              <li>Streaming UTW signature with block-chained SHA-256 (5MB chunks).</li>
              <li>Automatic verification result after signing (no extra click required).</li>
              <li>Adaptive tail scan for large manifests to avoid false "No signature found".</li>
            </ul>
          </div>
          <div className="p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
            <h5 className="font-bold text-[var(--text-header)] mb-2">Frame Metadata Policy</h5>
            <ul className="list-disc pl-5 space-y-1 text-xs opacity-80 font-mono">
              <li>Sampling profile: <code>1_FRAME_PER_MINUTE</code>.</li>
              <li>Sampling offset: <code>+7s</code>.</li>
              <li>Per sample fields: timestamp, frame preview, frame size, pHash64, dHash64, capture status.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-6 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded">
          <h5 className="font-bold text-[var(--text-header)] mb-2">Batch Processor Integration (MP4)</h5>
          <ul className="list-disc pl-5 space-y-1 text-xs opacity-80 font-mono">
            <li>Batch table now includes dedicated MP4 fields: <code>MP4 Audit</code>, <code>Frames</code>, <code>pHash64 Preview</code>, <code>Final Hash</code>, and <code>Audit Detail</code>.</li>
            <li>Each MP4 row can open a full verification view via <strong>Open Report</strong>.</li>
            <li><strong>Open Report</strong> routes to <code>/#universal-lab</code> and renders the same <strong>Universal Integrity Verified</strong> report with the <strong>Frame Samples (1 Frame/Minute)</strong> table.</li>
            <li>This handoff is local (session storage payload), so no backend call is required for report rendering.</li>
          </ul>
        </div>

        <div className="mt-6 p-4 border-l-4 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-xs font-mono">
          <strong className="block mb-2 text-[var(--trust-blue)]">YouTube Publish Notes</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uses OAuth + YouTube resumable upload (API key alone is insufficient).</li>
            <li>Description is auto-generated with human-readable verification summary and embedded <code>SIGNET_VPR_BLOCK</code>.</li>
            <li>Frame metadata block is auto-posted as a top-level comment; pinning remains manual in YouTube Studio.</li>
            <li>Operator can inspect detailed publish diagnostics in <strong>YouTube Debug Trace</strong>.</li>
          </ul>
        </div>
      </ManualSection>

      <div className="mt-20 pt-10 border-t border-[var(--border-light)] flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-[var(--trust-blue)] hover:underline font-mono text-[10px] uppercase tracking-widest font-bold">
          &larr; Return to Dashboard
        </a>
        <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">Certified by signetai.io:ssl | v0.3.1</p>
      </div>
    </div>
  );
};
