
/**
 * SIGNET AUDIT ENGINE (v0.3.3)
 * ----------------------------
 * Deterministic scoring logic for verifying media integrity across lossy boundaries.
 * Implements "Multi-Frame Consensus" and "Temporal Structure" fusion.
 */

// --- TYPES & INTERFACES ---

export interface DualHash {
  dHash: string; // Gradient-based (Fast, structure-sensitive)
  pHash: string; // Mean-based (Robust, scale-invariant simulation)
}

export interface FrameCandidate {
  id: string;
  timestamp?: number;
  hashes: DualHash;
}

export interface ReferenceFrame {
  label: string; // e.g., "Start", "Mid", "End", "Cover"
  hashes: DualHash;
  weight: number; // 0.0 - 1.0
  meta?: any; // Payload for visual debugging (e.g., source URL)
}

export interface AuditSignals {
  dVisual: number; // [0-1] Best visual match distance
  dTemporal: number; // [0-1] Structural integrity loss
  dAudio?: number; // [0-1] Audio distance (optional)
}

export interface FrameMatchResult {
  refLabel: string;
  bestCandId: string;
  visualDistance: number;
  isMatch: boolean;
}

export interface AuditResult {
  score: number; // [0-1023] The Signet Difference Score
  band: 'VERIFIED_ORIGINAL' | 'PLATFORM_CONSISTENT' | 'MODIFIED_CONTENT' | 'DIVERGENT_SOURCE';
  signals: AuditSignals;
  bestMatchLabel?: string;
  bestMatchMeta?: any; // The metadata of the best matching reference frame
  confidence: number;
  frameDetails?: FrameMatchResult[];
}

// --- HASHING UTILITIES (Lightweight / Zero-Dep) ---

// Compute Hamming Distance between two hex/binary strings
export const getHammingDistance = (str1: string, str2: string): number => {
  let dist = 0;
  const len = Math.min(str1.length, str2.length);
  for (let i = 0; i < len; i++) {
    if (str1[i] !== str2[i]) dist++;
  }
  return dist;
};

// Generate Dual-Hash from Image URL (Canvas API)
export const generateDualHash = async (imageUrl: string): Promise<DualHash | null> => {
  try {
    // Note: 'cors' mode is essential for canvas readback. 
    // YouTube and Google Drive thumbnails usually support this.
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const imgBitmap = await createImageBitmap(blob);

    // Standardize to 32x32 for calculation (produces 1024 pixels)
    // We utilize 8x8 blocks for final 64-bit hashes
    const width = 32; 
    const height = 32;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(imgBitmap, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Convert to Grayscale
    const grays: number[] = [];
    let totalLum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      grays.push(lum);
      totalLum += lum;
    }
    const mean = totalLum / grays.length;

    // 1. pHash (Simulated Mean-Based)
    // Robust against resizing and compression artifacts
    // Logic: 1 if pixel > global_mean, else 0. (Simplified pHash for JS)
    // We sample center 8x8 grid to reduce noise
    let pHash = '';
    const step = 4; // 32/4 = 8x8 grid
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Sample center pixel of the block
        const idx = (y * step * width) + (x * step);
        pHash += (grays[idx] >= mean) ? '1' : '0';
      }
    }

    // 2. dHash (Gradient-Based)
    // Captures structural gradients. Very fast.
    // Logic: 1 if pixel[i] < pixel[i+1]
    let dHash = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const idx = (y * step * width) + (x * step);
        const rightIdx = idx + 1; // Comparison neighbor
        dHash += (grays[idx] < grays[rightIdx]) ? '1' : '0';
      }
    }

    return { dHash, pHash };
  } catch (e) {
    console.error("Hash Gen Error", e);
    return null;
  }
};

// --- CORE SCORING ENGINE ---

export const computeAuditScore = (
  candidates: FrameCandidate[],
  references: ReferenceFrame[],
  audioScore: number | null = null
): AuditResult => {
  
  // 1. Calculate Visual Signal (D_visual)
  // We look for the BEST matching frame (Minimum Distance) across all candidates
  let minVisualDist = 1.0;
  let bestMatchLabel = "None";
  let bestMatchMeta = null;

  // Thresholds for "Match" counting (Temporal Signal)
  const VISUAL_MATCH_THRESHOLD = 0.25; // 25% Normalized Distance (~16 bits on 64-bit hash)
  let matchedReferenceCount = 0;

  // Track which references have been satisfied
  const satisfiedRefs = new Set<string>();
  const frameDetails: FrameMatchResult[] = [];

  for (const ref of references) {
    let bestRefDist = 1.0;
    let bestCandId = "None";

    for (const cand of candidates) {
      // Normalize Hamming (0-64) to (0-1)
      const normD = getHammingDistance(ref.hashes.dHash, cand.hashes.dHash) / 64.0;
      const normP = getHammingDistance(ref.hashes.pHash, cand.hashes.pHash) / 64.0;

      // Fusion Formula: 0.6 * dHash + 0.4 * pHash
      const fusedDist = (0.6 * normD) + (0.4 * normP);

      if (fusedDist < bestRefDist) {
        bestRefDist = fusedDist;
        bestCandId = cand.id;
      }
    }

    // Update Global Minimum (The best single frame match found)
    if (bestRefDist < minVisualDist) {
      minVisualDist = bestRefDist;
      bestMatchLabel = ref.label;
      bestMatchMeta = ref.meta;
    }

    // Temporal Accounting
    const isMatch = bestRefDist <= VISUAL_MATCH_THRESHOLD;
    if (isMatch) {
      satisfiedRefs.add(ref.label);
    }

    frameDetails.push({
      refLabel: ref.label,
      bestCandId,
      visualDistance: bestRefDist,
      isMatch
    });
  }

  const D_visual = minVisualDist;

  // 2. Calculate Temporal Signal (D_temporal)
  // Penalize missing frames in the structure
  matchedReferenceCount = satisfiedRefs.size;
  const coverageRatio = references.length > 0 ? matchedReferenceCount / references.length : 0;
  const D_temporal = 1.0 - coverageRatio; 

  // 3. Final Fusion
  let D_total = 0;

  if (audioScore === null) {
    // Visual Only Mode
    // D_total = (0.65 * D_visual) + (0.35 * D_temporal)
    D_total = (0.65 * D_visual) + (0.35 * D_temporal);
  } else {
    // Multi-modal Mode
    // D_total = (0.45 * D_visual) + (0.35 * D_audio) + (0.20 * D_temporal)
    D_total = (0.45 * D_visual) + (0.35 * audioScore) + (0.20 * D_temporal);
  }

  // 4. Quantize to [0-1023]
  const finalScore = Math.min(1023, Math.round(D_total * 1023));

  return {
    score: finalScore,
    band: getConfidenceBand(finalScore),
    signals: {
      dVisual: parseFloat(D_visual.toFixed(3)),
      dTemporal: parseFloat(D_temporal.toFixed(3)),
      dAudio: audioScore || undefined
    },
    bestMatchLabel,
    bestMatchMeta,
    confidence: Math.max(0, 1.0 - D_total),
    frameDetails
  };
};

const getConfidenceBand = (score: number): AuditResult['band'] => {
  if (score <= 30) return 'VERIFIED_ORIGINAL';
  if (score <= 120) return 'PLATFORM_CONSISTENT';
  if (score <= 300) return 'MODIFIED_CONTENT';
  return 'DIVERGENT_SOURCE';
};
