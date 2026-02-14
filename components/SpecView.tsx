
import React from 'react';

export const SpecView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 font-mono text-sm leading-relaxed pt-32 pb-20 px-6 max-w-4xl mx-auto selection:bg-white selection:text-black">
      <div className="border border-neutral-800 p-8 md:p-16 bg-black shadow-2xl relative overflow-hidden">
        {/* Draft Metadata */}
        <div className="flex flex-col md:flex-row justify-between mb-16 border-b border-neutral-800 pb-8 text-[11px] uppercase tracking-widest text-neutral-500">
          <div className="space-y-1">
            <p>Network Working Group</p>
            <p>Internet-Draft</p>
            <p>Intended status: Informational</p>
            <p>Expires: August 15, 2026</p>
          </div>
          <div className="text-right space-y-1 mt-4 md:mt-0">
            <p>Sheng-Liang Song</p>
            <p>Signet AI Labs</p>
            <p>February 13, 2026</p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-16 text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-4 tracking-tight">
            Signet Protocol: Deterministic Telemetry and Verifiable Proof of Reasoning (VPR) for AI Assets
          </h1>
          <p className="text-neutral-500 italic">draft-song-signet-neural-lens-02</p>
        </div>

        {/* Abstract */}
        <div className="mb-12">
          <h2 className="text-white font-bold mb-4 border-b border-neutral-900 pb-2">Abstract</h2>
          <p className="indent-8">
            The Signet Protocol defines a framework for the cryptographic attestation of AI-generated reasoning paths. 
            It utilizes the Neural Lens engine to transform non-deterministic LLM outputs into formally verified "Signets." 
            This ensures a verifiable chain of custody from Model to Tool to Human, enabling high-fidelity knowledge sharing 
            at 100x lower marginal costs for the global population.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-white font-bold mb-4">1. Introduction</h2>
            <p className="indent-8">
              As AI moves from "Chat" to "Reasoning," current watermarking standards (C2PA) are insufficient because 
              they only sign the final result, not the process. Signet Protocol introduces "Process Provenance" via 
              Verifiable Proof of Reasoning (VPR).
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4">2. Core Components</h2>
            <div className="space-y-4 pl-8">
              <p><strong>2.1. TrustKeyService (TKS):</strong> A registry of public keys bound to verifiable identities (Google, Government ID, or SignetAI).</p>
              <p><strong>2.2. Neural Lens Engine:</strong> A deterministic verifier that probes AI telemetry for logic drift and symbolic parity.</p>
              <p><strong>2.3. The Signet:</strong> A nested cryptographic object containing:
                <ul className="list-disc pl-8 mt-2 space-y-1 text-neutral-400">
                  <li>The VPR Payload (Reasoning Hash, Scores, Metadata).</li>
                  <li>Multi-layer signatures (Agent, Tool, Human).</li>
                </ul>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4">3. The 4-Layer Execution Pipeline</h2>
            <p className="mb-4">Every AI asset produced under the Signet standard MUST pass:</p>
            <div className="space-y-6 pl-8 border-l border-neutral-900">
              <div>
                <h4 className="text-white uppercase text-xs tracking-widest mb-2">Layer 1: Vision Substrate (Immutable Thesis)</h4>
                <p className="text-neutral-400">The "DNA" of the content. Any drift from this substrate in subsequent layers is a protocol violation.</p>
              </div>
              <div>
                <h4 className="text-white uppercase text-xs tracking-widest mb-2">Layer 2: Neural Lens Compilation</h4>
                <p className="text-neutral-400">The engine maps reasoning steps into a Directed Acyclic Graph (DAG). Nodes = Claims. Edges = Dependencies.</p>
              </div>
              <div>
                <h4 className="text-white uppercase text-xs tracking-widest mb-2">Layer 3: Adversarial Probing</h4>
                <p className="text-neutral-400">The "Logic Stress Test." The verifier decomposes every node into atomic prerequisites to ensure no circular logic exists.</p>
              </div>
              <div>
                <h4 className="text-white uppercase text-xs tracking-widest mb-2">Layer 4: Human-in-the-Loop Signet</h4>
                <p className="text-neutral-400">The final curator signs the verified DAG with their private key, attesting to the high-fidelity nature of the asset.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4">4. 100x Cost-Sharing (Signet Pool)</h2>
            <p className="indent-8">
              The protocol allows for "Joint Signets." When 100 users authorize a high-cost reasoning task, 
              the resulting Signet is co-signed by the group, effectively fractioning the compute cost.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4">5. Formal IANA/Header Registration</h2>
            <p className="mb-4">The protocol utilizes the following custom HTTP header for inter-agent communication:</p>
            <div className="bg-neutral-950 p-4 border border-neutral-900 font-mono text-emerald-500">
              X-Signet-VPR: &lt;version&gt;; &lt;vpr-score&gt;; &lt;signature-hash&gt;
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold mb-4">6. Security Considerations</h2>
            <p className="indent-8">
              Signet Protocol addresses "Agreeability Bias" and "Hallucination Masking" by ensuring that 
              the Verifier (Neural Lens) is architecturally independent from the Generator (AI Model).
            </p>
          </section>
        </div>

        {/* Navigation back */}
        <div className="mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center">
          <a href="#" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
            <span>←</span> BACK_TO_HOME
          </a>
          <span className="text-neutral-700 font-mono text-[10px]">SIGNET_DRAFT_2026_SONG</span>
        </div>
      </div>
    </div>
  );
};
