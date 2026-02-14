import React from 'react';

const PipelineStep: React.FC<{ layer: string; title: string; desc: string; tools: string[] }> = ({ layer, title, desc, tools }) => (
  <div className="relative pl-12 pb-16 last:pb-0 border-l border-neutral-800/20">
    <div className="absolute left-[-9px] top-0 w-4 h-4 theme-bg border-2 border-current theme-text flex items-center justify-center">
      <div className="w-1.5 h-1.5 theme-accent-bg"></div>
    </div>
    <span className="font-mono text-[10px] theme-text-secondary uppercase tracking-[0.3em] font-bold">{layer}</span>
    <h3 className="font-serif text-4xl theme-text mt-2 mb-4 italic font-bold tracking-tight">{title}</h3>
    <p className="theme-text-secondary text-lg max-w-lg leading-relaxed mb-8 font-serif">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tools.map(tool => (
        <span key={tool} className="px-4 py-1 border border-neutral-800/10 glass-card font-mono text-[9px] theme-text-secondary uppercase tracking-tighter font-bold">
          {tool}
        </span>
      ))}
    </div>
  </div>
);

export const Architecture: React.FC = () => {
  return (
    <section id="architecture" className="py-40 px-6 max-w-7xl mx-auto border-v">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
        <div>
          <div className="w-12 h-px theme-accent-bg mb-10"></div>
          <span className="font-mono text-[10px] uppercase theme-text-secondary block mb-6 tracking-[0.4em] font-bold">C2PA-Native Pipeline</span>
          <h2 className="font-serif text-7xl md:text-8xl theme-text mb-16 font-bold leading-[0.9] tracking-tighter">
            Manifest<br/>
            <span className="italic font-normal">Hierarchy.</span>
          </h2>
          <div className="mt-24 space-y-4">
            <PipelineStep 
              layer="Layer 1" 
              title="Parent Ingredient" 
              desc="The Cryptographic Ancestor. Every AI asset is bound to a specific 'Ingredient' manifest representing the prompt DNA."
              tools={['C2PA Ingredient', 'Truth Anchor']}
            />
            <PipelineStep 
              layer="Layer 2" 
              title="Cognitive Assertion" 
              desc="The JUMBF Payload. Neural Prism maps the logic DAG into a structured assertion inside the C2PA manifest."
              tools={['JUMBF Box', 'VPR Assertion']}
            />
            <PipelineStep 
              layer="Layer 3" 
              title="Soft-Binding Probe" 
              desc="Asset Validation. Systematically verifies that the generated pixels/text match the claims in the cognitive manifest."
              tools={['Binding Check', 'Drift Audit']}
            />
            <PipelineStep 
              layer="Layer 4" 
              title="Manifest Signing" 
              desc="Final Attribution. The C2PA signature block binds the human identity and hardware key to the entire provenance chain."
              tools={['Ed25519 Signer', 'HSM Cluster']}
            />
          </div>
        </div>
        <div className="space-y-10 lg:pt-48">
          <div className="p-12 glass-card relative overflow-hidden group border-l-4 border-l-emerald-500">
            <div className="absolute top-0 right-0 w-32 h-32 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[11px] theme-text-secondary uppercase mb-8 tracking-[0.3em] font-bold">Interoperability</h4>
            <h2 className="font-serif text-5xl mb-6 italic theme-text font-bold leading-tight">Universal Verification</h2>
            <p className="theme-text-secondary text-xl leading-relaxed font-serif italic">
              By adhering to ISO/TC 290, Signet-verified assets are readable by industry-standard tools like Adobe Content Authenticity and Microsoft Azure Provenance.
            </p>
          </div>
          <div className="p-12 glass-card relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 theme-accent-bg opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            <h4 className="font-mono text-[11px] theme-text-secondary uppercase mb-8 tracking-[0.3em] font-bold">Process Integrity</h4>
            <h2 className="font-serif text-5xl mb-6 italic theme-text font-bold leading-tight">Beyond Attribution</h2>
            <p className="theme-text-secondary text-xl leading-relaxed font-serif italic">
              Standard C2PA provides attribution. Signet provides auditability. We extend the manifest to include the 'Why' behind every AI decision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};