import React from 'react';

interface NutritionLabelProps {
  manifest: any;
  onClose: () => void;
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({ manifest, onClose }) => {
  return (
    <div className="absolute top-12 left-0 z-50 w-72 bg-white border border-[var(--border-light)] shadow-2xl rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 bg-[var(--table-header)] border-b border-[var(--border-light)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="cr-badge scale-75 text-[var(--trust-blue)]">cr</div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Content Credentials</span>
        </div>
        <button onClick={onClose} className="opacity-40 hover:opacity-100 p-1">✕</button>
      </div>

      <div className="p-5 space-y-6">
        {/* Author info */}
        <div className="space-y-1">
          <h4 className="font-mono text-[9px] uppercase opacity-40 font-bold">Captured/Produced By</h4>
          <p className="font-serif text-sm font-bold text-[var(--text-header)] italic">{manifest.signature?.identity || 'Verified AI Model'}</p>
          <p className="text-[10px] opacity-60 font-serif">Via {manifest.assertions?.[0]?.data?.actions?.[0]?.softwareAgent || 'Signet Core'}</p>
        </div>

        {/* Action summary */}
        <div className="space-y-1">
          <h4 className="font-mono text-[9px] uppercase opacity-40 font-bold">Process Highlights</h4>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-sm text-[9px] font-bold uppercase tracking-tighter">AI-Generated</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm text-[9px] font-bold uppercase tracking-tighter">VPR_TRUSTED</span>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <h4 className="font-mono text-[9px] uppercase opacity-40 font-bold">Attestation Timestamp</h4>
          <p className="font-mono text-[10px] opacity-70">{new Date(manifest.signature?.timestamp).toLocaleString()}</p>
        </div>

        <div className="pt-4 border-t border-[var(--border-light)]">
           <a 
             href="#auditor" 
             onClick={onClose}
             className="flex items-center justify-between group"
           >
              <span className="font-mono text-[9px] font-bold text-[var(--trust-blue)] uppercase tracking-widest">L3_FULL_VERIFICATION</span>
              <span className="text-[var(--trust-blue)] group-hover:translate-x-1 transition-transform">→</span>
           </a>
        </div>
      </div>
      
      <div className="px-5 py-2 bg-neutral-50 border-t border-[var(--border-light)]">
        <p className="text-[8px] font-mono opacity-40 text-center uppercase tracking-tighter">Anchor: {manifest.signature?.anchor || 'signetai.io:ssl'}</p>
      </div>
    </div>
  );
};