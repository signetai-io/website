import React from 'react';

const PipelineStep: React.FC<{ layer: string; storyTitle: string; techTitle: string; desc: string; tools: string[] }> = ({ layer, storyTitle, techTitle, desc, tools }) => (
  <div className="relative pl-12 pb-20 last:pb-0 border-l border-neutral-800/20 group">
    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[var(--bg-standard)] border-2 border-[var(--border-light)] group-hover:border-[var(--trust-blue)] rounded-full flex items-center justify-center transition-colors">
      <div className="w-1.5 h-1.5 bg-[var(--trust-blue)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    
    <div className="flex items-center gap-3 mb-2">
       <span className="font-mono text-[10px] text-[var(--trust-blue)] uppercase tracking-[0.3em] font-bold">{layer}</span>
       <span className="h-px w-8 bg-[var(--border-light)]"></span>
       <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest">{techTitle}</span>
    </div>
    
    <h3 className="font-serif text-4xl text-[var(--text-header)] mt-2 mb-4 italic font-bold tracking-tight">{storyTitle}</h3>
    <p className="text-[var(--text-body)] text-lg max-w-lg leading-relaxed mb-8 font-serif opacity-80">{desc}</p>
    
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => (
        <span key={tool} className="px-3 py-1 border border-[var(--border-light)] bg-[var(--code-bg)] font-mono text-[9px] text-[var(--text-body)] opacity-60 uppercase tracking-tighter font-bold rounded">
          {tool}
        </span>
      ))}
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section id="developers" className="py-40 px-6 max-w-7xl mx-auto border-v">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
        <div>
          <div className="w-12 h-px bg-[var(--trust-blue)] mb-10"></div>
          <span className="font-mono text-[10px] uppercase text-[var(--text-body)] opacity-50 block mb-6 tracking-[0.4em] font-bold">The Neural Pipeline</span>
          <h2 className="font-serif text-7xl md:text-8xl text-[var(--text-header)] mb-16 font-bold leading-[0.9] tracking-tighter">
            Mapping <br/>
            <span className="italic font-normal text-[var(--trust-blue)]">the Mind.</span>
          </h2>
          <div className="mt-24 space-y-4">
            <PipelineStep 
              layer="Layer 1" 
              storyTitle="The DNA Trace"
              techTitle="Parent Ingredient" 
              desc="The process begins before the output exists. We cryptographically bind the initial prompt—the seed of intent—as the immutable ancestor of the asset."
              tools={['C2PA Ingredient', 'Truth Anchor']}
            />
            <PipelineStep 
              layer="Layer 2" 
              storyTitle="The Logic Map"
              techTitle="Cognitive Assertion" 
              desc="Neural Prism intercepts the AI's internal monologue. It maps the chain of reasoning (The DAG) into a structured JUMBF box, freezing the thought process in time."
              tools={['JUMBF Box', 'VPR Assertion']}
            />
            <PipelineStep 
              layer="Layer 3" 
              storyTitle="The Reality Check"
              techTitle="Soft-Binding Probe" 
              desc="A deterministic probe verifies that the final pixels or text actually match the claimed reasoning, detecting subtle logic drift or hallucinations."
              tools={['Binding Check', 'Drift Audit']}
            />
            <PipelineStep 
              layer="Layer 4" 
              storyTitle="The Human Seal"
              techTitle="Manifest Signing" 
              desc="Finally, a human curator reviews the chain. Using their private Ed25519 key, they stamp the manifest, taking ultimate responsibility for its existence."
              tools={['Ed25519 Signer', 'HSM Cluster']}
            />
          </div>
        </div>
        <div className="space-y-10 lg:pt-48">
          <div className="p-12 border border-[var(--border-light)] bg-[var(--bg-standard)] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.03] blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            <h4 className="font-mono text-[11px] text-[var(--text-body)] opacity-40 uppercase mb-8 tracking-[0.3em] font-bold">Interoperability</h4>
            <h2 className="font-serif text-5xl mb-6 italic text-[var(--text-header)] font-bold leading-tight">Universal Verification</h2>
            <p className="text-[var(--text-body)] opacity-80 text-xl leading-relaxed font-serif italic">
              "A standard is only useful if everyone speaks it. Signet assets are natively readable by Adobe, Microsoft, and the ISO/TC 290 ecosystem."
            </p>
          </div>
          <div className="p-12 border border-[var(--border-light)] bg-[var(--bg-standard)] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-xl">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--trust-blue)] opacity-[0.03] blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            <h4 className="font-mono text-[11px] text-[var(--text-body)] opacity-40 uppercase mb-8 tracking-[0.3em] font-bold">Process Integrity</h4>
            <h2 className="font-serif text-5xl mb-6 italic text-[var(--text-header)] font-bold leading-tight">Beyond Attribution</h2>
            <p className="text-[var(--text-body)] opacity-80 text-xl leading-relaxed font-serif italic">
              "Standard C2PA answers 'Who?'. Signet answers 'Why?'. We extend the manifest to include the reasoning path behind every decision."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};