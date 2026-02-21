
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
  originalSize?: string; // e.g. "1920x1080"
  byteSize?: number; // Size in bytes
}

export interface FrameCandidate {
  id: string;
  timestamp?: number;
  hashes: DualHash;
  imageUrl?: string; // Base64 Data URL for UI preview
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
  refMeta?: any; // Added for visual rendering
  bestCandId: string;
  candMeta?: any; // Added for robust candidate-frame rendering
  visualDistance: number;
  isMatch: boolean;
}

export interface AuditResult {
  score: number; // [0-1000] The Signet Difference Score
  band: 'VERIFIED_ORIGINAL' | 'PLATFORM_CONSISTENT' | 'MODIFIED_CONTENT' | 'DIVERGENT_SOURCE';
  signals: AuditSignals;
  bestMatchLabel?: string;
  bestMatchMeta?: any; // The metadata of the best matching reference frame
  bestMatchCandId?: string; // ID of the candidate that matched best
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

// Internal: Compute Hash from Canvas Context
const computeHashFromContext = (ctx: CanvasRenderingContext2D, width: number, height: number, originalW: number, originalH: number, byteSize: number = 0): DualHash => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Convert to Grayscale (0..255)
    const grays: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      grays.push(lum);
    }

    // 1) dHash: 9x8 comparison grid over full image
    let dHash = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const xA = Math.floor((x / 8) * (width - 1));
        const xB = Math.floor(((x + 1) / 8) * (width - 1));
        const yPos = Math.floor((y / 7) * (height - 1));
        const idxA = yPos * width + xA;
        const idxB = yPos * width + xB;
        dHash += grays[idxA] < grays[idxB] ? '1' : '0';
      }
    }

    // 2) DCT-based pHash (64-bit)
    // Build NxN grayscale matrix
    const n = width;
    const matrix: number[][] = Array.from({ length: n }, (_, y) =>
      Array.from({ length: n }, (_, x) => grays[(y * width) + x])
    );
    const alpha = (k: number) => (k === 0 ? Math.sqrt(1 / n) : Math.sqrt(2 / n));
    const dct: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let u = 0; u < n; u++) {
      for (let v = 0; v < n; v++) {
        let sum = 0;
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            sum += matrix[y][x]
              * Math.cos(((2 * x + 1) * u * Math.PI) / (2 * n))
              * Math.cos(((2 * y + 1) * v * Math.PI) / (2 * n));
          }
        }
        dct[u][v] = alpha(u) * alpha(v) * sum;
      }
    }

    const lowFreq: number[] = [];
    for (let u = 0; u < 8; u++) {
      for (let v = 0; v < 8; v++) {
        lowFreq.push(dct[u][v]);
      }
    }
    const withoutDc = lowFreq.slice(1).slice().sort((a, b) => a - b);
    const median = withoutDc[Math.floor(withoutDc.length / 2)] || 0;

    let pHash = '';
    for (let i = 0; i < lowFreq.length; i++) {
      pHash += lowFreq[i] > median ? '1' : '0';
    }

    return { 
        dHash, 
        pHash, 
        originalSize: `${originalW}x${originalH}`, 
        byteSize 
    };
};

// Generate Dual-Hash from Image URL (Canvas API)
export const generateDualHash = async (imageUrl: string, logFn?: (msg: string) => void): Promise<DualHash | null> => {
  try {
    const width = 32; 
    const height = 32;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Use Image object for robust loading (handles CORS and formats better than fetch+blob in some envs)
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.referrerPolicy = "no-referrer";
    
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => reject(new Error(`Image load failed`));
        img.src = imageUrl;
    });

    ctx.drawImage(img, 0, 0, width, height);
    
    // Debug: Check if canvas is empty
    const testData = ctx.getImageData(0, 0, 1, 1).data;
    if (testData[3] === 0 && logFn) {
        // Warning: Top-left pixel is transparent. Might be empty.
        // We continue anyway, but it's a hint.
    }
    
    // Bytes processed for hashing (32x32 RGBA pixel buffer)
    const byteSize = width * height * 4;
    
    return computeHashFromContext(ctx, width, height, img.naturalWidth, img.naturalHeight, byteSize);
  } catch (e: any) {
    console.error("Hash Gen Error", e);
    if (logFn) logFn(`Hash Gen Exception: ${e.message}`);
    return null;
  }
};

// Extract and Hash Frames from Video URL
export const extractVideoFrames = async (
    videoUrl: string, 
    timestamps: number[], 
    logFn?: (msg: string) => void
): Promise<FrameCandidate[]> => {
    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const candidates: FrameCandidate[] = [];
    const width = 32;
    const height = 32;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const prevWidth = 160;
    const prevHeight = 90;
    const prevCanvas = document.createElement('canvas');
    prevCanvas.width = prevWidth;
    prevCanvas.height = prevHeight;
    const prevCtx = prevCanvas.getContext('2d');

    if (!ctx || !prevCtx) {
      if (logFn) logFn('Canvas context unavailable for extraction.');
      return [];
    }

    const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string): Promise<T> => {
      let to: ReturnType<typeof setTimeout> | undefined;
      const timeoutPromise = new Promise<T>((_, reject) => {
        to = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      });
      try {
        return await Promise.race([p, timeoutPromise]);
      } finally {
        if (to) clearTimeout(to);
      }
    };

    const waitLoadedMetadata = async (): Promise<void> => {
      if (video.readyState >= 1) return;
      await withTimeout(new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error(video.error?.message || 'Video load error'));
      }), 15000, 'Video metadata load');
    };

    const seekTo = async (time: number): Promise<void> => {
      await withTimeout(new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error(video.error?.message || 'Video seek error'));
        };
        const cleanup = () => {
          video.removeEventListener('seeked', onSeeked);
          video.removeEventListener('error', onError);
        };
        video.addEventListener('seeked', onSeeked, { once: true });
        video.addEventListener('error', onError, { once: true });
        video.currentTime = time;
      }), 10000, `Seek @ ${time}s`);
    };

    const waitFrameReady = async (): Promise<void> => {
      if (typeof video.requestVideoFrameCallback === 'function') {
        await withTimeout(new Promise<void>((resolve) => {
          video.requestVideoFrameCallback(() => resolve());
        }), 3000, 'Video frame decode');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    };

    try {
      await waitLoadedMetadata();
      const maxTime = Math.max(0, (video.duration || 0) - 0.05);
      const uniqueSorted = Array.from(new Set(timestamps)).sort((a, b) => a - b);
      for (const ts of uniqueSorted) {
        const clamped = Math.max(0, Math.min(ts, maxTime));
        try {
          await seekTo(clamped);
          await waitFrameReady();

          ctx.drawImage(video, 0, 0, width, height);
          const hashes = computeHashFromContext(ctx, width, height, video.videoWidth, video.videoHeight, width * height * 4);

          prevCtx.drawImage(video, 0, 0, prevWidth, prevHeight);
          const imageUrl = prevCanvas.toDataURL('image/jpeg', 0.85);

          candidates.push({
            id: `frame_${ts}`,
            timestamp: ts,
            hashes,
            imageUrl
          });
          if (logFn) logFn(`Extracted Frame B at T+${ts}s`);
        } catch (e: any) {
          if (logFn) logFn(`Frame Capture Error T+${ts}s: ${e.message}`);
        }
      }
    } catch (e: any) {
      if (logFn) logFn(`Video Load Error: ${e.message}`);
    }

    return candidates;
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
  let bestMatchCandId = undefined;

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
      bestMatchCandId = bestCandId;
    }

    // Temporal Accounting
    const isMatch = bestRefDist <= VISUAL_MATCH_THRESHOLD;
    if (isMatch) {
      satisfiedRefs.add(ref.label);
    }

    frameDetails.push({
      refLabel: ref.label,
      refMeta: ref.meta,
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
    bestMatchCandId,
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

export const parseIso8601DurationToSeconds = (duration: string): number => {
  if (!duration || !duration.startsWith('PT')) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return (hours * 3600) + (minutes * 60) + seconds;
};

export const buildMinuteSamplingTimestamps = (
  durationSec: number,
  offsetSec: number = 7,
  intervalSec: number = 60
): number[] => {
  if (durationSec <= 0) return [offsetSec];
  const maxTs = Math.max(0, durationSec - 1);
  const out: number[] = [];
  for (let t = offsetSec; t <= maxTs; t += intervalSec) {
    out.push(t);
  }
  return out.length > 0 ? out : [Math.min(offsetSec, maxTs)];
};

export const computePairwiseFrameAuditScore = (
  referenceFrames: ReferenceFrame[],
  candidateFrames: FrameCandidate[],
  expectedTimestamps: number[],
  options?: { matchingWindowSec?: number }
): AuditResult => {
  const frameDetails: FrameMatchResult[] = [];
  const candidateByTimestamp = new Map<number, FrameCandidate>();
  const singleFallbackCandidate = candidateFrames.length === 1 ? candidateFrames[0] : undefined;
  const matchingWindowSec = Math.max(0, options?.matchingWindowSec || 0);
  for (const cand of candidateFrames) {
    if (typeof cand.timestamp === 'number') {
      candidateByTimestamp.set(cand.timestamp, cand);
    }
  }

  let sumDist = 0;
  let matches = 0;
  let minVisualDist = 1;
  let bestMatchLabel = 'None';
  let bestMatchMeta: any = null;
  let bestMatchCandId: string | undefined;
  const threshold = 0.25;

  for (const ts of expectedTimestamps) {
    const ref = referenceFrames.find((r) => r.meta?.timestamp === ts);
    let cand: FrameCandidate | undefined = candidateByTimestamp.get(ts) || singleFallbackCandidate;
    const refLabel = ref?.label || `T+${ts}s`;

    if (ref && !singleFallbackCandidate && matchingWindowSec > 0) {
      const nearby = candidateFrames.filter((c) => typeof c.timestamp === 'number' && Math.abs((c.timestamp as number) - ts) <= matchingWindowSec);
      if (nearby.length > 0) {
        let best = nearby[0];
        let bestDist = 1;
        for (const c of nearby) {
          const d = getHammingDistance(ref.hashes.pHash, c.hashes.pHash) / 64.0;
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        }
        cand = best;
      }
    }

    if (!ref || !cand) {
      frameDetails.push({
        refLabel,
        refMeta: ref?.meta,
        bestCandId: cand?.id || 'MISSING',
        candMeta: cand ? { timestamp: cand.timestamp, imageUrl: cand.imageUrl, hashes: cand.hashes } : undefined,
        visualDistance: 1,
        isMatch: false
      });
      sumDist += 1;
      continue;
    }

    const normP = getHammingDistance(ref.hashes.pHash, cand.hashes.pHash) / 64.0;
    // Pairwise engine policy: pHash-only comparison for lossy/transcoded robustness.
    const fusedDist = normP;
    const isMatch = fusedDist <= threshold;

    if (fusedDist < minVisualDist) {
      minVisualDist = fusedDist;
      bestMatchLabel = ref.label;
      bestMatchMeta = ref.meta;
      bestMatchCandId = cand.id;
    }
    if (isMatch) matches++;
    sumDist += fusedDist;

    frameDetails.push({
      refLabel: ref.label,
      refMeta: ref.meta,
      bestCandId: cand.id,
      candMeta: { timestamp: cand.timestamp, imageUrl: cand.imageUrl, hashes: cand.hashes },
      visualDistance: fusedDist,
      isMatch
    });
  }

  const n = Math.max(1, expectedTimestamps.length);
  const dVisual = sumDist / n;
  const coverage = matches / n;
  const dTemporal = 1 - coverage;
  const dTotal = (0.8 * dVisual) + (0.2 * dTemporal);
  const score = Math.min(1000, Math.round(dTotal * 1000));

  return {
    score,
    band: getConfidenceBand(score),
    signals: {
      dVisual: parseFloat(dVisual.toFixed(3)),
      dTemporal: parseFloat(dTemporal.toFixed(3))
    },
    bestMatchLabel,
    bestMatchMeta,
    bestMatchCandId,
    confidence: Math.max(0, 1 - dTotal),
    frameDetails
  };
};
