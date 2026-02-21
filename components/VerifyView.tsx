
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Admonition } from './Admonition';
import { NutritionLabel } from './NutritionLabel';
import { GOOGLE_GEMINI_KEY } from '../private_keys';
import { 
  generateDualHash, 
  computePairwiseFrameAuditScore,
  extractVideoFrames,
  buildMinuteSamplingTimestamps,
  parseIso8601DurationToSeconds,
  AuditResult, 
  FrameCandidate, 
  ReferenceFrame 
} from './scoring';

import { FrameAnalysisTable } from './FrameAnalysisTable';

export const VerifyView: React.FC = () => {
  type PerfMetrics = {
    framesRead: number;
    bytesProcessed: number;
    compareMs: number;
    aiTokensUsed: number;
    formula: string;
  };
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [driveId, setDriveId] = useState<string | null>(null);
  
  // Source State
  const [sourceAItems, setSourceAItems] = useState<any[]>([]);
  const [folderContents, setFolderContents] = useState<any[]>([]); // Source B Items
  const [selectedSourceA, setSelectedSourceA] = useState<string | null>(null);
  const [selectedSourceB, setSelectedSourceB] = useState<string | null>(null);

  // Folder State
  const [folderId, setFolderId] = useState<string | null>(null);
  const [showL2, setShowL2] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false); // New View Toggle
  
  // Operation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStage, setVerifyStage] = useState('Preparing...');
  const [isFetching, setIsFetching] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'UNSIGNED' | 'TAMPERED' | 'BATCH_REPORT'>('IDLE');
  
  // Inputs
  const [urlInput, setUrlInput] = useState('https://www.youtube.com/playlist?list=PLjnwycFexttARFrzatvBjzL0BEH-78Bft'); // Default Source B
  const [referenceInput, setReferenceInput] = useState('https://www.youtube.com/playlist?list=PLjnwycFexttARFrzatvBjzL0BEH-78Bft'); // Default Source A
  const [sampleOffsetSec, setSampleOffsetSec] = useState(7);
  const [sampleIntervalSec, setSampleIntervalSec] = useState(60);
  const [autoMode, setAutoMode] = useState(true);
  const [autoBatchMode, setAutoBatchMode] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [capturePermissionEnabled, setCapturePermissionEnabled] = useState(false);
  const [capturePermissionGranted, setCapturePermissionGranted] = useState(false);
  const [useRecordedClips, setUseRecordedClips] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(12);
  const [recordingPlaybackSpeed, setRecordingPlaybackSpeed] = useState(2);
  const [isRecordingA, setIsRecordingA] = useState(false);
  const [isRecordingB, setIsRecordingB] = useState(false);
  const [recordedClipA, setRecordedClipA] = useState<Blob | null>(null);
  const [recordedClipB, setRecordedClipB] = useState<Blob | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Audit Engine State
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditCandidates, setAuditCandidates] = useState<FrameCandidate[]>([]);
  const [perfMetrics, setPerfMetrics] = useState<PerfMetrics | null>(null);
  const [visualEvidence, setVisualEvidence] = useState<{ refUrl: string, candUrl: string, label: string, isFrame: boolean } | null>(null);
  
  // Trace Log for Debugging
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const lastFetchKeyRef = useRef('');
  const lastAutoRunKeyRef = useRef('');
  const batchRunningRef = useRef(false);

  const addLog = (msg: string) => {
    console.log(`[VerifyView] ${msg}`);
    setDebugLog(prev => [...prev, `${new Date().toISOString().split('T')[1].slice(0, -1)} > ${msg}`]);
  };

  const requestClientCapturePermission = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('Display capture is not supported by this browser.');
    }
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });
    // Permission handshake only; stop immediately until recording mode is used.
    stream.getTracks().forEach((t) => t.stop());
    setCapturePermissionGranted(true);
    addLog('Client capture permission granted.');
  };

  const openVideoAutoplay = (videoId: string, source: 'A' | 'B') => {
    const start = Math.max(0, Math.floor(sampleOffsetSec || 0));
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&autoplay=1&mute=1&start=${start}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addLog(`Opened Source ${source} autoplay window (start=${start}s). Playback speed may require manual 2x selection on YouTube.`);
  };

  const getVideoDuration = async (blob: Blob): Promise<number> => {
    return await new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        const d = Number.isFinite(v.duration) ? v.duration : 0;
        URL.revokeObjectURL(url);
        resolve(Math.max(0, d));
      };
      v.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      v.src = url;
    });
  };

  const captureClientClip = async (source: 'A' | 'B') => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setFetchError('Display capture is not supported by this browser.');
      return;
    }
    const seconds = Math.max(3, Math.min(120, Math.floor(recordingSeconds || 12)));
    source === 'A' ? setIsRecordingA(true) : setIsRecordingB(true);
    addLog(`Recording Source ${source} clip for ${seconds}s (target playback ${recordingPlaybackSpeed}x)...`);
    setFetchError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mimeCandidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      const mimeType = mimeCandidates.find((m) => (window as any).MediaRecorder?.isTypeSupported?.(m)) || '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
      const stopped = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });
      recorder.start(250);
      setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      }, seconds * 1000);
      await stopped;
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      const duration = await getVideoDuration(blob);
      if (source === 'A') setRecordedClipA(blob);
      else setRecordedClipB(blob);
      addLog(`Recorded Source ${source} clip: ${(blob.size / (1024 * 1024)).toFixed(2)} MB, duration=${duration.toFixed(2)}s, playback setting=${recordingPlaybackSpeed}x`);
      setCapturePermissionGranted(true);
    } catch (e: any) {
      addLog(`Recording Source ${source} failed: ${e.message}`);
      setFetchError(`Recording Source ${source} failed: ${e.message}`);
    } finally {
      source === 'A' ? setIsRecordingA(false) : setIsRecordingB(false);
    }
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYoutubePlaylistId = (url: string) => {
    if (!url) return null;
    const reg = /[?&]list=([^#\&\?]+)/;
    const match = url.match(reg);
    if (match) return match[1];
    
    // Fallback for path-based playlist links (e.g. Studio)
    const pathReg = /\/playlist\/([a-zA-Z0-9_-]+)/;
    const pathMatch = url.match(pathReg);
    return pathMatch ? pathMatch[1] : null;
  };

  const getGoogleDriveId = (url: string) => {
    const patterns = [
      /file\/d\/([a-zA-Z0-9_-]+)/,
      /folders\/([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/
    ];
    for (const p of patterns) {
      const match = url.match(p);
      if (match) return match[1];
    }
    return null;
  };

  const isFolderUrl = (url: string) => url.includes('/folders/') || url.includes('id=') && !url.includes('/file/');

  const getUrlParam = (param: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get(param)) return searchParams.get(param);
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const hashParams = new URLSearchParams(hash.substring(qIndex));
      return hashParams.get(param);
    }
    return null;
  };

  const getApiKey = () => {
      if (GOOGLE_GEMINI_KEY && GOOGLE_GEMINI_KEY.startsWith("AIza")) {
          return GOOGLE_GEMINI_KEY;
      }
      const envKey = process.env.API_KEY;
      if (envKey && envKey.startsWith("AIza") && !envKey.includes("UNUSED")) {
          return envKey;
      }
      throw new Error("Client Configuration Error: GOOGLE_GEMINI_KEY is missing/invalid.");
  };

  const extractDriveFramesViaServer = async (
      fileId: string,
      timestamps: number[],
      apiKey: string
  ): Promise<{
      frames: Array<{ timestamp: number; imageUrl: string }>;
      diagnostics?: {
          requestedCount?: number;
          extractedCount?: number;
          extractedTimestamps?: number[];
          missingTimestamps?: number[];
          attempts?: Array<{
              urlBase?: string;
              extractedTimestamps?: number[];
              failedTimestamps?: number[];
              sampleError?: string;
          }>;
      };
  }> => {
      const params = new URLSearchParams({
          fileId,
          timestamps: timestamps.join(','),
          key: apiKey
      });
      const controller = new AbortController();
      const extractorTimeoutMs = Math.max(2000, parseInt((process.env.EXTRACTOR_TIMEOUT_MS || '5000'), 10) || 5000);
      const t = setTimeout(() => controller.abort(), extractorTimeoutMs);
      let res: Response;
      try {
          res = await fetch(`/api/extract-drive-frames?${params.toString()}`, { signal: controller.signal });
      } finally {
          clearTimeout(t);
      }
      if (!res.ok) throw new Error(`Server extractor HTTP ${res.status}`);
      const data = await res.json();
      return {
          frames: Array.isArray(data?.frames) ? data.frames : [],
          diagnostics: data?.diagnostics
      };
  };

  // --- SOURCE A HANDLERS (Playlist/Video) ---

  const fetchPlaylistItems = async (playlistId: string) => {
      setIsFetching(true);
      setSourceAItems([]);
      addLog(`Fetching Playlist: ${playlistId}`);
      try {
          const apiKey = getApiKey();
          const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
          const data = await res.json();
          if (data.items) {
              const items = data.items.map((item: any) => ({
                  playlistItemId: item.id, // Unique ID within the playlist
                  id: item.snippet.resourceId.videoId, // Video ID (kept as 'id' for compatibility with rest of code)
                  title: item.snippet.title,
                  thumbnail: item.snippet.thumbnails?.default?.url,
                  channel: item.snippet.videoOwnerChannelTitle,
                  size: 'Stream (N/A)' // YouTube API doesn't provide file size for streams
              }));
              setSourceAItems(items);
              addLog(`Loaded ${items.length} videos from playlist.`);
          }
      } catch (e: any) {
          addLog(`Playlist Error: ${e.message}`);
      } finally {
          setIsFetching(false);
      }
  };

  const handleSourceAInput = (input: string) => {
      setReferenceInput(input);
      const plId = getYoutubePlaylistId(input);
      if (plId) {
          if (sourceAItems.length === 0) fetchPlaylistItems(plId);
      } else {
          // Reset playlist if manual single video entered
          const vId = getYoutubeId(input);
          if (vId) {
              setSourceAItems([]);
              setSelectedSourceA(vId); // Auto-select single video
          }
      }
  };

  // --- SOURCE B HANDLERS (YouTube Playlist) ---

  const fetchSourceBPlaylistItems = async (playlistId: string) => {
      setIsFetching(true);
      setFolderContents([]);
      addLog(`Fetching Source B Playlist: ${playlistId}`);

      try {
          const apiKey = getApiKey();
          const listRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
          const data = await listRes.json();
          const files = data.items || [];
          
          const processedFiles = files.map((f: any) => ({
              id: f.snippet.resourceId.videoId,
              name: f.snippet.title, 
              type: 'youtube/video',
              size: 'Stream (N/A)',
              thumbnailLink: f.snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${f.snippet.resourceId.videoId}/0.jpg`,
              webContentLink: null,
              diffScore: null, // Reset score
              date: 'N/A'
          }));

          setFolderContents(processedFiles);
          addLog(`Source B ready: ${processedFiles.length} playlist videos.`);

      } catch (e: any) {
          addLog(`Source B Playlist Error: ${e.message}`);
          setFetchError(e.message);
      } finally {
          setIsFetching(false);
      }
  };

  // --- AUDIT CORE ---

  const executePairAudit = async (aOverride?: string, bOverride?: string) => {
      const sourceAId = aOverride || selectedSourceA;
      const sourceBId = bOverride || selectedSourceB;
      if (!sourceAId || !sourceBId) {
          setFetchError("Please select one item from Source A and one from Source B.");
          return;
      }
      if (capturePermissionEnabled && !capturePermissionGranted) {
          setFetchError("Please enable client capture permission before running Difference Engine.");
          return;
      }
      if (useRecordedClips && (!recordedClipA || !recordedClipB)) {
          setFetchError("Please record both Source A and Source B clips before running recorded mode.");
          return;
      }

      setIsVerifying(true);
      setVerifyProgress(0);
      setVerifyStage('Initializing audit...');
      setAuditResult(null);
      setPerfMetrics(null);
      setVisualEvidence(null);
      setVerificationStatus('VERIFYING');
      setSelectedSourceA(sourceAId);
      setSelectedSourceB(sourceBId);
      addLog(`Starting Pairwise Audit: A[${sourceAId}] vs B[${sourceBId}]`);
      const compareStartedAt = performance.now();

      try {
          // 1) Build sampling timestamps: start at +7s, then every 60s
          const apiKey = getApiKey();
          let durationSec = 420; // 7 min fallback
          try {
              const vidRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${sourceAId}&key=${apiKey}`);
              const vidData = await vidRes.json();
              if (vidData.items?.[0]?.contentDetails?.duration) {
                  const dur = vidData.items[0].contentDetails.duration;
                  const parsed = parseIso8601DurationToSeconds(dur);
                  if (parsed > 0) durationSec = parsed;
              }
          } catch (_e) { addLog("Duration fetch failed, using 420s fallback."); }

          const safeOffset = Math.max(0, Math.floor(sampleOffsetSec || 0));
          const safeInterval = Math.max(1, Math.floor(sampleIntervalSec || 1));
          const rawTimestamps = buildMinuteSamplingTimestamps(durationSec, safeOffset, safeInterval);
          const MAX_COMPARE_FRAMES = 4;
          const targetTimestamps = rawTimestamps.slice(0, MAX_COMPARE_FRAMES);
          setVerifyProgress(8);
          setVerifyStage('Built timestamp plan');
          addLog(`Sampling plan: offset=${safeOffset}s, interval=${safeInterval}s, frames=${targetTimestamps.length}/${rawTimestamps.length}, duration=${durationSec}s`);
          addLog(`Policy: Compare first ${MAX_COMPARE_FRAMES} frames due to YouTube thumbnail anchor limits.`);

          // 2) Generate Source A frame hashes (recorded-clip mode or thumbnail mode).
          const referenceFrames: ReferenceFrame[] = [];
          if (useRecordedClips && recordedClipA) {
              addLog(`Generating Source A anchors from recorded clip...`);
          } else {
              addLog(`Generating Source A anchors from YouTube thumbnails...`);
              addLog(`Notice: YouTube Source A uses thumbnail anchors (not exact frame decode in browser mode).`);
          }
          setVerifyProgress(12);
          setVerifyStage('Extracting Source A anchors');

          if (useRecordedClips && recordedClipA) {
              const aDuration = await getVideoDuration(recordedClipA);
              const aTimestamps = buildMinuteSamplingTimestamps(Math.max(1, Math.floor(aDuration)), Math.min(safeOffset, Math.max(0, Math.floor(aDuration - 1))), safeInterval).slice(0, targetTimestamps.length);
              const aUrl = URL.createObjectURL(recordedClipA);
              const aFrames = await extractVideoFrames(aUrl, aTimestamps, addLog);
              URL.revokeObjectURL(aUrl);
              for (let i = 0; i < aFrames.length; i++) {
                  const f = aFrames[i];
                  referenceFrames.push({
                      label: `T+${f.timestamp || aTimestamps[i] || 0}s (Recorded)`,
                      hashes: f.hashes,
                      weight: 1.0,
                      meta: {
                          url: f.imageUrl,
                          size: f.hashes.originalSize,
                          bytes: f.hashes.byteSize,
                          videoId: selectedSourceA,
                          timestamp: f.timestamp || aTimestamps[i] || 0
                      }
                  });
                  const p = 12 + Math.round(((i + 1) / Math.max(1, targetTimestamps.length)) * 28);
                  setVerifyProgress(Math.min(40, p));
                  setVerifyStage(`Source A recorded anchors ${i + 1}/${targetTimestamps.length}`);
              }
          } else {
              for (let i = 0; i < targetTimestamps.length; i++) {
                  const cursor = targetTimestamps[i];
                  const ytAssetId = i % 4; // YouTube key thumbnails: 0,1,2,3
              const thumbUrl = `https://img.youtube.com/vi/${sourceAId}/${ytAssetId}.jpg`;
                  const hashes = await generateDualHash(thumbUrl, addLog);
                  if (hashes) {
                      referenceFrames.push({ 
                          label: `Thumb ${ytAssetId} (Sample ${i + 1})`, 
                          hashes, 
                          weight: 1.0, 
                          meta: { 
                              url: thumbUrl, 
                              size: hashes.originalSize, 
                              bytes: hashes.byteSize,
                              videoId: sourceAId,
                              timestamp: cursor,
                              sampleIndex: i + 1,
                              anchorKind: 'YOUTUBE_THUMBNAIL'
                          } 
                      });
                      addLog(`Anchor [Sample ${i + 1} -> Thumb ${ytAssetId}; requested offset T+${cursor}s]: ${hashes.originalSize} (${hashes.byteSize}B) | pHash: ${hashes.pHash.substring(0,8)}...`);
                  } else {
                      addLog(`Anchor [T+${cursor}s]: Failed to hash.`);
                  }
                  const p = 12 + Math.round(((i + 1) / Math.max(1, targetTimestamps.length)) * 28);
                  setVerifyProgress(Math.min(40, p));
                  setVerifyStage(`Source A anchors ${i + 1}/${targetTimestamps.length}`);
              }
          }
          const uniqueRefHashes = new Set(referenceFrames.map((r) => r.hashes.pHash)).size;
          if (uniqueRefHashes <= 1) {
              addLog("Warning: Source A reference hashes are highly repetitive. This can weaken comparison confidence.");
          }

          // 3) Generate Source B hashes (recorded-clip mode or thumbnail mode)
          addLog(`Hashing Source B...`);
          setVerifyProgress(45);
          setVerifyStage(useRecordedClips ? 'Preparing Source B recorded clip' : 'Preparing Source B thumbnails');
          const targetFile = folderContents.find(f => f.id === sourceBId);
          if (!targetFile) throw new Error("Source B selection missing.");

          const candidates: FrameCandidate[] = [];
          if (useRecordedClips && recordedClipB) {
              const bDuration = await getVideoDuration(recordedClipB);
              const bTimestamps = buildMinuteSamplingTimestamps(Math.max(1, Math.floor(bDuration)), Math.min(safeOffset, Math.max(0, Math.floor(bDuration - 1))), safeInterval).slice(0, targetTimestamps.length);
              const bUrl = URL.createObjectURL(recordedClipB);
              const bFrames = await extractVideoFrames(bUrl, bTimestamps, addLog);
              URL.revokeObjectURL(bUrl);
              bFrames.forEach((f, i) => {
                  candidates.push({
                      id: `recorded_${selectedSourceB}_${f.timestamp || bTimestamps[i] || 0}`,
                      timestamp: f.timestamp || bTimestamps[i] || 0,
                      hashes: f.hashes,
                      imageUrl: f.imageUrl
                  });
                  const p = 46 + Math.round(((i + 1) / Math.max(1, targetTimestamps.length)) * 26);
                  setVerifyProgress(Math.min(72, p));
                  setVerifyStage(`Source B recorded anchors ${i + 1}/${targetTimestamps.length}`);
              });
          } else {
              for (let i = 0; i < targetTimestamps.length; i++) {
                  const ts = targetTimestamps[i];
                  const ytAssetId = i % 4;
              const thumbUrl = `https://img.youtube.com/vi/${sourceBId}/${ytAssetId}.jpg`;
                  const bHashes = await generateDualHash(thumbUrl, addLog);
                  if (!bHashes) continue;
                  candidates.push({
                  id: `thumb_${sourceBId}_${ts}`,
                      timestamp: ts,
                      hashes: bHashes,
                      imageUrl: thumbUrl
                  });
                  addLog(`Source B Anchor [Sample ${i + 1} -> Thumb ${ytAssetId}; requested offset T+${ts}s]: ${bHashes.originalSize} (${bHashes.byteSize}B) | pHash: ${bHashes.pHash.substring(0,8)}...`);
                  const p = 46 + Math.round(((i + 1) / Math.max(1, targetTimestamps.length)) * 26);
                  setVerifyProgress(Math.min(72, p));
                  setVerifyStage(`Source B anchors ${i + 1}/${targetTimestamps.length}`);
              }
          }
          if (candidates.length === 0) throw new Error("Failed to hash Source B thumbnails.");
          addLog(useRecordedClips ? `Source B Mode: client-recorded clip comparison.` : `Source B Mode: YouTube thumbnail comparison.`);

          // 4) Strict pairwise scoring at same timestamps
          setVerifyProgress(82);
          setVerifyStage('Computing pairwise score');
          const result = computePairwiseFrameAuditScore(referenceFrames, candidates, targetTimestamps, { matchingWindowSec: 0 });
          
          if (result.frameDetails) {
             result.frameDetails.forEach(fd => {
                 const refInfo = fd.refMeta ? `[${fd.refMeta.size}, ${fd.refMeta.bytes}B]` : '';
                 const candTs = typeof fd.candMeta?.timestamp === 'number' ? fd.candMeta.timestamp : null;
                 const refTs = typeof fd.refMeta?.timestamp === 'number' ? fd.refMeta.timestamp : null;
                 const delta = (candTs !== null && refTs !== null) ? (candTs - refTs) : null;
                 addLog(`Frame [${fd.refLabel}] ${refInfo} vs Candidate [${fd.bestCandId.substring(0,8)}...${candTs !== null ? ` @${candTs}s` : ''}${delta !== null ? ` Δt=${delta >= 0 ? '+' : ''}${delta}s` : ''}]: Dist=${fd.visualDistance.toFixed(4)} (${fd.isMatch ? 'MATCH' : 'MISS'})`);
             });
          }
          addLog(`Scoring: D_visual=${result.signals.dVisual}, D_temporal=${result.signals.dTemporal}`);
          addLog(`Final Score Calculation: (0.8 * ${result.signals.dVisual}) + (0.2 * ${result.signals.dTemporal}) = ${(0.8 * result.signals.dVisual + 0.2 * result.signals.dTemporal).toFixed(4)} -> Scaled(0-1000): ${result.score}`);
          addLog(`Verdict: ${result.score <= 120 ? 'SAME/CONSISTENT' : 'NOT SAME'}`);

          setAuditResult(result);
          setAuditCandidates(candidates);
          const framesRead = referenceFrames.length + candidates.length;
          const bytesProcessed = [...referenceFrames.map((r) => r.hashes.byteSize || 0), ...candidates.map((c) => c.hashes.byteSize || 0)].reduce((a, b) => a + b, 0);
          const compareMs = Math.round(performance.now() - compareStartedAt);
          const formula = `score = round(((0.8 * ${result.signals.dVisual}) + (0.2 * ${result.signals.dTemporal})) * 1000)`;
          setPerfMetrics({
              framesRead,
              bytesProcessed,
              compareMs,
              aiTokensUsed: 0,
              formula
          });
          setVerifyProgress(96);
          setVerifyStage('Rendering report');
          
          // Set Visual Debugging Evidence
          if (result.bestMatchMeta?.url) {
              const bestCand = candidates.find(c => c.id === result.bestMatchCandId);
              const candUrl = bestCand?.imageUrl || targetFile?.thumbnailLink;
              const isFrame = !!bestCand?.imageUrl;

              setVisualEvidence({
                  refUrl: result.bestMatchMeta.url,
                  candUrl: candUrl,
                  label: result.bestMatchLabel || 'Best Match',
                  isFrame
              });
          }
          
          // Update the list view score for B
          setFolderContents(prev => prev.map(f => f.id === sourceBId ? { ...f, diffScore: result.score } : f));
          
          setVerificationStatus('BATCH_REPORT');
          addLog(`Audit Complete: Score ${result.score}`);
          setVerifyProgress(100);
          setVerifyStage('Completed');

      } catch (e: any) {
          addLog(`Audit Failed: ${e.message}`);
          setVerificationStatus('IDLE');
      } finally {
          setIsVerifying(false);
      }
  };

  const executeBatchPlaylistAudit = async () => {
      if (batchRunningRef.current) return;
      if (sourceAItems.length === 0 || folderContents.length === 0) return;
      const count = Math.min(sourceAItems.length, folderContents.length);
      if (count === 0) return;
      batchRunningRef.current = true;
      addLog(`Starting playlist batch compare (pairs=${count})...`);
      try {
          for (let i = 0; i < count; i++) {
              const aId = sourceAItems[i]?.id;
              const bId = folderContents[i]?.id;
              if (!aId || !bId) continue;
              addLog(`Batch pair ${i + 1}/${count}: A[${aId}] vs B[${bId}]`);
              await executePairAudit(aId, bId);
          }
          addLog(`Batch compare completed.`);
      } finally {
          batchRunningRef.current = false;
      }
  };

  // --- INITIALIZATION ---

  const handleUrlFetch = async (url: string, refUrl?: string) => {
    // Check Inputs
    const ref = refUrl || referenceInput;
    const target = url || urlInput;
    const key = `${ref}::${target}`;
    if (lastFetchKeyRef.current === key) return;
    lastFetchKeyRef.current = key;

    // Load Source A
    if (ref) {
        const plId = getYoutubePlaylistId(ref);
        if (plId) fetchPlaylistItems(plId);
        else {
            const vId = getYoutubeId(ref);
            if (vId) {
                setSourceAItems([]); 
                setSelectedSourceA(vId);
            }
        }
    }

    // Load Source B
    const sourceBPlaylistId = getYoutubePlaylistId(target);
    if (sourceBPlaylistId) {
        fetchSourceBPlaylistItems(sourceBPlaylistId);
    } else {
        const vId = getYoutubeId(target);
        if (vId) {
            setFolderContents([{
                id: vId,
                name: `YouTube Video ${vId}`,
                type: 'youtube/video',
                size: 'Stream (N/A)',
                thumbnailLink: `https://img.youtube.com/vi/${vId}/0.jpg`,
                webContentLink: null,
                diffScore: null,
                date: 'N/A'
            }]);
            setSelectedSourceB(vId);
        }
    }
  };

  useEffect(() => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      // Deep Link Handler
      const deepLinkUrl = getUrlParam('url') || getUrlParam('verify_url');
      const refUrlParam = getUrlParam('ref');
      
      const targetToLoad = deepLinkUrl ? decodeURIComponent(deepLinkUrl) : urlInput; // Default to initial state
      const refToLoad = refUrlParam ? decodeURIComponent(refUrlParam) : referenceInput; // Default to initial state

      if (deepLinkUrl && urlInput !== targetToLoad) setUrlInput(targetToLoad);
      if (refUrlParam && referenceInput !== refToLoad) setReferenceInput(refToLoad);
      
      // Trigger load automatically
      handleUrlFetch(targetToLoad, refToLoad);
  }, []);

  useEffect(() => {
      const t = setTimeout(() => {
          handleUrlFetch(urlInput, referenceInput);
      }, 700);
      return () => clearTimeout(t);
  }, [referenceInput, urlInput]);

  useEffect(() => {
      if (!autoMode) return;
      if (isVerifying || batchRunningRef.current) return;
      if (capturePermissionEnabled && !capturePermissionGranted) return;
      if (useRecordedClips && (!recordedClipA || !recordedClipB)) return;

      if (autoBatchMode) {
          if (sourceAItems.length === 0 || folderContents.length === 0) return;
          const count = Math.min(sourceAItems.length, folderContents.length);
          const key = `batch:${count}:${sourceAItems[0]?.id || ''}:${folderContents[0]?.id || ''}:${sampleOffsetSec}:${sampleIntervalSec}`;
          if (lastAutoRunKeyRef.current === key) return;
          lastAutoRunKeyRef.current = key;
          const t = setTimeout(() => { executeBatchPlaylistAudit(); }, 1200);
          return () => clearTimeout(t);
      }

      const autoA = selectedSourceA || sourceAItems[0]?.id;
      const autoB = selectedSourceB || folderContents[0]?.id;
      if (!autoA || !autoB) return;
      const key = `pair:${autoA}:${autoB}:${sampleOffsetSec}:${sampleIntervalSec}:${useRecordedClips ? 'rec' : 'thumb'}`;
      if (lastAutoRunKeyRef.current === key) return;
      lastAutoRunKeyRef.current = key;
      const t = setTimeout(() => { executePairAudit(autoA, autoB); }, 1200);
      return () => clearTimeout(t);
  }, [
      autoMode,
      autoBatchMode,
      selectedSourceA,
      selectedSourceB,
      sourceAItems,
      folderContents,
      sampleOffsetSec,
      sampleIntervalSec,
      isVerifying,
      capturePermissionEnabled,
      capturePermissionGranted,
      useRecordedClips,
      recordedClipA,
      recordedClipB
  ]);

  // --- UI RENDERERS ---

  const renderL2State = () => {
    if (verificationStatus === 'VERIFYING') {
        return (
            <div className="h-[400px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8">
                <div className="w-8 h-8 border-2 border-[var(--trust-blue)] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--trust-blue)]">
                    Calculating Difference... {verifyProgress}%
                </p>
                <p className="font-mono text-[9px] uppercase tracking-wide opacity-60 mt-2">
                    {verifyStage}
                </p>
            </div>
        );
    }

    if (auditResult) {
        const isSame = auditResult.score <= 120;
        const matchedCount = auditResult.frameDetails?.filter((f) => f.isMatch).length || 0;
        const totalCount = auditResult.frameDetails?.length || 0;
        const bandLabels = {
            'VERIFIED_ORIGINAL': 'MINIMAL DIFFERENCE (Match)',
            'PLATFORM_CONSISTENT': 'LOW DIFFERENCE (Consistent)',
            'MODIFIED_CONTENT': 'MODERATE DIFFERENCE (Modified)',
            'DIVERGENT_SOURCE': 'HIGH DIFFERENCE (Distinct)'
        };
        const bandColor = {
            'VERIFIED_ORIGINAL': 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
            'PLATFORM_CONSISTENT': 'text-blue-500 border-blue-500/30 bg-blue-500/10',
            'MODIFIED_CONTENT': 'text-amber-500 border-amber-500/30 bg-amber-500/10',
            'DIVERGENT_SOURCE': 'text-red-500 border-red-500/30 bg-red-500/10'
        }[auditResult.band];

        return (
            <div className="border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col p-8 space-y-6 relative overflow-hidden">
               
               {/* Score Header */}
               <div className="flex items-center gap-8">
                   <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center ${bandColor.replace('bg-', 'border-').split(' ')[1]}`}>
                       <div className="text-center">
                           <span className="block text-2xl font-bold font-serif">{auditResult.score}</span>
                           <span className="text-[8px] opacity-60 uppercase font-mono">Diff Score</span>
                       </div>
                   </div>
                   <div className="space-y-1">
                       <h4 className={`font-serif text-xl font-bold italic ${bandColor.split(' ')[0]}`}>
                           {bandLabels[auditResult.band]}
                       </h4>
                       <p className={`font-mono text-[10px] uppercase tracking-widest font-bold ${isSame ? 'text-emerald-600' : 'text-red-600'}`}>
                           Verdict: {isSame ? 'SAME / CONSISTENT' : 'NOT SAME'}
                       </p>
                       <p className="font-mono text-[10px] opacity-70 uppercase tracking-widest">
                           Anchors Matched: {matchedCount}/{totalCount}
                       </p>
                       <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest">
                           Confidence: {(auditResult.confidence * 100).toFixed(1)}%
                       </p>
                   </div>
               </div>

               {/* Visual Alignment Evidence */}
               {visualEvidence && (
                   <div className="border-t border-[var(--border-light)] pt-6 mt-2">
                       <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-4">Visual Alignment Evidence</h5>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                               <div className="aspect-video bg-black rounded overflow-hidden border border-[var(--border-light)] relative group">
                                   <img src={visualEvidence.refUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                   <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-[8px] font-mono rounded">SOURCE A (Best Match)</div>
                               </div>
                               <p className="font-mono text-[9px] opacity-60 truncate">Frame: {visualEvidence.label}</p>
                           </div>
                           <div className="space-y-2">
                               <div className="aspect-video bg-black rounded overflow-hidden border border-[var(--border-light)] relative group">
                                   <img src={visualEvidence.candUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                   <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-[8px] font-mono rounded">SOURCE B (Candidate)</div>
                               </div>
                               <p className="font-mono text-[9px] opacity-60 truncate">{visualEvidence.isFrame ? 'Extracted Frame (Best Match)' : 'Target Thumbnail'}</p>
                           </div>
                       </div>
                       <p className="text-[10px] mt-4 opacity-60 italic font-serif leading-relaxed">
                           <span className="text-[var(--trust-blue)] font-bold">Analysis:</span> The Difference Score (Δ) is calculated from the perceptual distance between these two images. If they are visually distinct, the high score indicates a correct detection of misalignment (e.g., Cover vs Start Frame).
                       </p>
                   </div>
               )}

               <div className="p-3 border-l-2 border-[var(--trust-blue)] bg-[var(--admonition-bg)] text-[10px] opacity-80 leading-relaxed font-serif italic">
                   Comparison: Source A [{selectedSourceA}] vs Source B [{folderContents.find(f=>f.id===selectedSourceB)?.name.substring(0,15)}...]
               </div>

               {perfMetrics && (
                 <div className="border border-[var(--border-light)] rounded bg-white/60 p-3">
                   <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)] mb-2">Performance Summary</h5>
                   <table className="w-full text-[10px] font-mono">
                     <tbody>
                       <tr className="border-b border-[var(--border-light)]">
                         <td className="py-1 pr-2 opacity-60">Frames Read</td>
                         <td className="py-1 font-bold text-right">{perfMetrics.framesRead}</td>
                       </tr>
                       <tr className="border-b border-[var(--border-light)]">
                         <td className="py-1 pr-2 opacity-60">Bytes Processed (Pixel Buffer)</td>
                         <td className="py-1 font-bold text-right">{perfMetrics.bytesProcessed.toLocaleString()} B</td>
                       </tr>
                       <tr className="border-b border-[var(--border-light)]">
                         <td className="py-1 pr-2 opacity-60">Compare Time</td>
                         <td className="py-1 font-bold text-right">{perfMetrics.compareMs} ms</td>
                       </tr>
                       <tr className="border-b border-[var(--border-light)]">
                         <td className="py-1 pr-2 opacity-60">AI Tokens Used</td>
                         <td className="py-1 font-bold text-right">{perfMetrics.aiTokensUsed}</td>
                       </tr>
                       <tr className="border-b border-[var(--border-light)]">
                         <td className="py-1 pr-2 opacity-60">Final Score</td>
                         <td className="py-1 font-bold text-right">{auditResult.score}</td>
                       </tr>
                       <tr>
                         <td className="pt-2 pr-2 opacity-60 align-top">Score Formula</td>
                         <td className="pt-2 text-right break-all">{perfMetrics.formula}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               )}

               {/* Frame-by-Frame Scoring Table */}
               {auditResult.frameDetails && auditResult.frameDetails.length > 0 && (
                   <div className="mt-4 border-t border-[var(--border-light)] pt-4">
                       <div className="flex items-center justify-between mb-4">
                           <h5 className="font-mono text-[10px] uppercase font-bold text-[var(--text-header)]">Frame Analysis (Visual Chain)</h5>
                           <button 
                               onClick={() => setShowAnalysis(true)}
                               className="text-[10px] font-mono uppercase font-bold text-[var(--trust-blue)] hover:underline"
                           >
                               View Full Analysis →
                           </button>
                       </div>
                       
                       <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                           {auditResult.frameDetails.map((fd, idx) => (
                               <div key={idx} className="flex items-center gap-3 p-2 border border-[var(--border-light)] rounded bg-white/50 hover:bg-white transition-colors">
                                   {/* Reference Frame */}
                                   <div className="relative w-16 h-9 bg-black rounded overflow-hidden flex-shrink-0 border border-[var(--border-light)]">
                                       {fd.refMeta?.url ? (
                                           <img src={fd.refMeta.url} className="w-full h-full object-cover" alt="Ref" />
                                       ) : (
                                           <div className="w-full h-full flex items-center justify-center text-[6px] text-white/50">NO IMG</div>
                                       )}
                                       <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[6px] text-white px-1 truncate">
                                           {fd.refLabel}
                                       </div>
                                   </div>

                                   {/* VS Indicator */}
                                   <div className="flex flex-col items-center gap-0.5">
                                       <span className="text-[8px] font-mono opacity-30">VS</span>
                                       <div className={`h-px w-4 ${fd.isMatch ? 'bg-emerald-500' : 'bg-red-500/30'}`}></div>
                                   </div>

                                   {/* Candidate Frame (Source B) */}
                                   <div className="relative w-16 h-9 bg-black rounded overflow-hidden flex-shrink-0 border border-[var(--border-light)]">
                                       {(() => {
                                            const cand = auditCandidates.find(c => c.id === fd.bestCandId);
                                            const url = cand?.imageUrl || visualEvidence?.candUrl;
                                            return url ? (
                                                <img src={url} className="w-full h-full object-cover" alt="Cand" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[6px] text-white/50">NO IMG</div>
                                            );
                                       })()}
                                       <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[6px] text-white px-1 truncate">
                                           {(() => {
                                                const cand = auditCandidates.find(c => c.id === fd.bestCandId);
                                                return cand?.imageUrl ? 'Extracted' : 'Target';
                                           })()}
                                       </div>
                                   </div>

                                   {/* Metrics */}
                                   <div className="flex-1 text-right min-w-0">
                                       <div className={`font-bold font-mono text-[10px] ${fd.isMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                                           {fd.isMatch ? 'MATCH' : 'MISS'}
                                       </div>
                                       <div className="text-[8px] font-mono opacity-50">
                                           Δ: {fd.visualDistance.toFixed(3)}
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* Feature Request Placeholder */}
               <div className="flex items-center gap-2 pt-2 opacity-40 hover:opacity-100 transition-opacity cursor-not-allowed">
                   <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                   <span className="font-mono text-[9px] uppercase font-bold decoration-dotted underline">Audio Comparison (Audio-to-Text Seed) - Coming Soon</span>
               </div>
            </div>
        );
    }

    return (
        <div className="h-[400px] border border-[var(--border-light)] rounded-xl bg-[var(--code-bg)] flex flex-col items-center justify-center text-center p-8 opacity-30 italic font-serif">
           <span className="text-4xl mb-4">🔬</span>
           <p>Select a pair to calculate difference.</p>
        </div>
    );
  };

  const renderPreview = () => {
      // Split view if Playlist + Folder
      if (sourceAItems.length > 0 || folderContents.length > 0) {
          return (
            <div className="w-full h-full bg-[#F8F9FA] flex gap-px overflow-hidden cursor-default text-[10px]" onClick={(e) => e.stopPropagation()}>
               
               {/* Source A List */}
               <div className="flex-1 flex flex-col min-w-0 bg-white">
                   <div className="p-3 bg-[var(--table-header)] border-b border-[var(--border-light)] font-bold text-[var(--trust-blue)] uppercase tracking-widest flex justify-between">
                       <span>Source A (Ref)</span>
                       <span className="opacity-50">{sourceAItems.length || (selectedSourceA ? 1 : 0)} items</span>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                       {sourceAItems.length > 0 ? sourceAItems.map((item) => (
                           <div 
                             key={item.playlistItemId || item.id} 
                             onClick={() => setSelectedSourceA(item.id)}
                             className={`p-2 border rounded cursor-pointer transition-all flex gap-2 items-center ${selectedSourceA === item.id ? 'border-[var(--trust-blue)] bg-blue-50' : 'border-transparent hover:bg-neutral-50'}`}
                           >
                               <img src={item.thumbnail} className="w-8 h-8 object-cover rounded bg-neutral-200" />
                               <div className="min-w-0 flex-1">
                                   <p className="font-bold truncate">{item.title}</p>
                                   <div className="flex justify-between text-[9px] opacity-50">
                                     <span className="truncate max-w-[60%]">{item.channel}</span>
                                     <span>{item.size}</span>
                                   </div>
                               </div>
                           </div>
                       )) : selectedSourceA ? (
                           <div className="p-2 border border-[var(--trust-blue)] bg-blue-50 rounded">
                               <p className="font-bold">Single Video ID</p>
                               <p className="opacity-50">{selectedSourceA}</p>
                           </div>
                       ) : <p className="p-4 opacity-30 italic text-center">Load Reference...</p>}
                   </div>
               </div>

               <div className="w-px bg-[var(--border-light)]"></div>

               {/* Source B List */}
               <div className="flex-1 flex flex-col min-w-0 bg-white">
                   <div className="p-3 bg-[var(--table-header)] border-b border-[var(--border-light)] font-bold text-neutral-600 uppercase tracking-widest flex justify-between">
                       <span>Source B (Target Playlist)</span>
                       <span className="opacity-50">{folderContents.length} items</span>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-1">
                       {folderContents.length > 0 ? folderContents.map((item) => (
                           <div 
                             key={item.id} 
                             onClick={() => setSelectedSourceB(item.id)}
                             className={`p-2 border rounded cursor-pointer transition-all flex gap-2 items-center ${selectedSourceB === item.id ? 'border-[var(--trust-blue)] bg-blue-50' : 'border-transparent hover:bg-neutral-50'}`}
                           >
                               <img src={item.thumbnailLink} className="w-8 h-8 object-cover rounded bg-neutral-200" />
                               <div className="flex-1 min-w-0">
                                   <p className="font-bold truncate">{item.name}</p>
                                   <div className="flex justify-between">
                                      <p className="opacity-50">{item.size}</p>
                                      {item.diffScore !== null && (
                                        <span className={`font-bold ${item.diffScore < 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            Δ: {item.diffScore}
                                        </span>
                                      )}
                                   </div>
                               </div>
                           </div>
                       )) : <p className="p-4 opacity-30 italic text-center">Load Target...</p>}
                   </div>
               </div>
            </div>
          );
      }
      return null;
  };

  const handleManualFetch = () => {
      lastFetchKeyRef.current = '';
      const plId = getYoutubePlaylistId(referenceInput);
      if (plId) fetchPlaylistItems(plId);
      else if (referenceInput) {
          const vId = getYoutubeId(referenceInput);
          if (vId) { setSourceAItems([]); setSelectedSourceA(vId); }
      }

      const bPlId = getYoutubePlaylistId(urlInput);
      if (bPlId) fetchSourceBPlaylistItems(bPlId);
      else {
          const bId = getYoutubeId(urlInput);
          if (bId) {
              setFolderContents([{
                  id: bId,
                  name: `YouTube Video ${bId}`,
                  type: 'youtube/video',
                  size: 'Stream (N/A)',
                  thumbnailLink: `https://img.youtube.com/vi/${bId}/0.jpg`,
                  webContentLink: null,
                  diffScore: null,
                  date: 'N/A'
              }]);
              setSelectedSourceB(bId);
          }
      }
  };

  if (showAnalysis && auditResult) {
      return (
          <FrameAnalysisTable 
              auditResult={auditResult} 
              candidates={auditCandidates} 
              onBack={() => setShowAnalysis(false)} 
          />
      );
  }

  return (
    <div className="py-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
           <div>
             <span className="font-mono text-[10px] text-[var(--trust-blue)] tracking-[0.4em] uppercase font-bold">Public Verification Tool (v0.3.3)</span>
             <h2 className="text-5xl font-bold italic tracking-tighter text-[var(--text-header)]">The Difference Engine.</h2>
           </div>
           <button 
             onClick={() => window.location.hash = '#batch'}
             className="px-6 py-3 border border-[var(--trust-blue)] text-[var(--trust-blue)] font-mono text-[10px] uppercase font-bold rounded hover:bg-blue-500/10 transition-all"
           >
             Switch to Batch Mode →
           </button>
        </div>
        <p className="text-xl opacity-60 max-w-2xl font-serif italic">
          Compare two selected videos from YouTube playlists using four thumbnail anchors and perceptual hash distance.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Dropzone / Visualizer */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`h-96 border-2 border-dashed rounded-2xl bg-[var(--bg-standard)] flex flex-col items-center justify-center cursor-default transition-all group relative overflow-hidden ${
              dragActive ? 'border-[var(--trust-blue)] bg-blue-500/10' : 'border-[var(--border-light)]'
            }`}
          >
            <input type="file" ref={fileInputRef} className="hidden" />
            
            {isFetching ? (
               <div className="text-center space-y-4 relative z-10 animate-pulse">
                 <span className="text-6xl">🌐</span>
                 <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--trust-blue)]">Resolving Sources...</p>
               </div>
            ) : (sourceAItems.length > 0 || folderContents.length > 0) ? (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-0 animate-in zoom-in-95 duration-300">
                {renderPreview()}
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-30">
                <span className="text-6xl">⭱</span>
                <p className="font-mono text-[10px] uppercase font-bold tracking-[0.3em]">
                  Awaiting Source Inputs
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
             {/* Reference Source Input */}
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                  <span className="text-xs">A</span>
                </div>
                <input 
                  type="text"
                  value={referenceInput}
                  onChange={(e) => handleSourceAInput(e.target.value)}
                  placeholder="Source A (Reference) - YouTube Playlist or Video URL..."
                  className="w-full pl-9 pr-4 py-3 bg-[var(--code-bg)] border border-[var(--border-light)] rounded-t font-mono text-[10px] outline-none focus:border-[var(--trust-blue)] transition-colors text-[var(--text-body)]"
                />
             </div>

             {/* Target Candidate Input */}
             <div className="relative group -mt-2">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                 <span className="text-xs">B</span>
               </div>
               <input 
                 type="text"
                 value={urlInput}
                 onChange={(e) => setUrlInput(e.target.value)}
                 placeholder="Source B (Target) - YouTube Playlist or Video URL..."
                 onKeyDown={(e) => e.key === 'Enter' && handleManualFetch()}
                 className="w-full pl-9 pr-4 py-3 bg-[var(--bg-standard)] border border-[var(--border-light)] rounded-b font-mono text-[11px] outline-none focus:border-[var(--trust-blue)] transition-colors text-[var(--text-body)] shadow-sm"
               />
             </div>

             <div className="border border-[var(--border-light)] rounded p-3 bg-[var(--code-bg)] space-y-2">
               <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide opacity-80 cursor-pointer">
                 <input
                   type="checkbox"
                   checked={autoMode}
                   onChange={(e) => setAutoMode(e.target.checked)}
                 />
                 Auto Mode
               </label>
               <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide opacity-80 cursor-pointer">
                 <input
                   type="checkbox"
                   checked={autoBatchMode}
                   onChange={(e) => setAutoBatchMode(e.target.checked)}
                   disabled={!autoMode}
                 />
                 Batch Playlist Mode (LA vs LB)
               </label>
               <div className="text-[9px] font-mono opacity-60">
                 0) Enable permission (optional) 1) Paste links A/B 2) Report auto-generates in a few seconds.
               </div>
             </div>

             {fetchError && (
               <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-xs font-serif italic flex gap-2 items-center break-words">
                 <span>⚠️</span> {fetchError}
               </div>
             )}

             <div className="border border-[var(--border-light)] rounded p-3 bg-[var(--code-bg)] space-y-2">
               <div className="flex items-center justify-between gap-3">
                 <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide opacity-80 cursor-pointer">
                   <input
                     type="checkbox"
                     checked={capturePermissionEnabled}
                     onChange={(e) => setCapturePermissionEnabled(e.target.checked)}
                   />
                   Require Client Capture Permission
                 </label>
                 <button
                   onClick={requestClientCapturePermission}
                   className="px-3 py-1 border border-[var(--border-light)] rounded text-[9px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)]"
                 >
                   Enable Permission
                 </button>
               </div>
               <div className="text-[9px] font-mono opacity-60">
                 Status: {capturePermissionGranted ? 'Granted' : 'Not Granted'} (client-only, no backend)
               </div>
             </div>

             <button
               onClick={() => setShowAdvancedControls((v) => !v)}
               className="w-full py-2 border border-[var(--border-light)] rounded text-[10px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)]"
             >
               {showAdvancedControls ? 'Hide Advanced Controls' : 'Show Advanced Controls'}
             </button>

             {showAdvancedControls && (
               <div className="space-y-3 border border-[var(--border-light)] rounded p-3 bg-[var(--code-bg)]">
                 <div className="flex items-center justify-between gap-3">
                   <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide opacity-80 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={useRecordedClips}
                       onChange={(e) => setUseRecordedClips(e.target.checked)}
                     />
                     Use Recorded Clips (Client)
                   </label>
                   <div className="flex items-center gap-2">
                     <select
                       value={recordingPlaybackSpeed}
                       onChange={(e) => setRecordingPlaybackSpeed(parseFloat(e.target.value))}
                       className="px-2 py-1 bg-white border border-[var(--border-light)] rounded text-[10px] font-mono"
                     >
                       <option value={1}>1x</option>
                       <option value={1.5}>1.5x</option>
                       <option value={2}>2x</option>
                       <option value={3}>3x</option>
                       <option value={4}>4x</option>
                     </select>
                     <input
                       type="number"
                       min={3}
                       max={120}
                       step={1}
                       value={recordingSeconds}
                       onChange={(e) => setRecordingSeconds(parseInt(e.target.value || '12', 10))}
                       className="w-20 px-2 py-1 bg-white border border-[var(--border-light)] rounded text-[10px] font-mono"
                     />
                   </div>
                 </div>
                 {useRecordedClips && (
                   <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => selectedSourceA ? openVideoAutoplay(selectedSourceA, 'A') : setFetchError('Select Source A first.')} className="px-3 py-2 border border-[var(--border-light)] rounded text-[9px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)]">Auto-Open Source A</button>
                     <button onClick={() => selectedSourceB ? openVideoAutoplay(selectedSourceB, 'B') : setFetchError('Select Source B first.')} className="px-3 py-2 border border-[var(--border-light)] rounded text-[9px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)]">Auto-Open Source B</button>
                     <button onClick={() => captureClientClip('A')} disabled={isRecordingA} className="px-3 py-2 border border-[var(--border-light)] rounded text-[9px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)] disabled:opacity-40">{isRecordingA ? 'Recording A...' : `Record Source A (${recordingSeconds}s)`}</button>
                     <button onClick={() => captureClientClip('B')} disabled={isRecordingB} className="px-3 py-2 border border-[var(--border-light)] rounded text-[9px] font-mono uppercase font-bold hover:bg-[var(--bg-sidebar)] disabled:opacity-40">{isRecordingB ? 'Recording B...' : `Record Source B (${recordingSeconds}s)`}</button>
                   </div>
                 )}
                 <div className="text-[9px] font-mono opacity-60">Clips: A={recordedClipA ? 'Ready' : 'Missing'} | B={recordedClipB ? 'Ready' : 'Missing'}</div>
                 <div className="grid grid-cols-2 gap-2">
                   <label className="text-[10px] font-mono uppercase tracking-wide opacity-70">Offset (s)<input type="number" min={0} step={1} value={sampleOffsetSec} onChange={(e) => setSampleOffsetSec(parseInt(e.target.value || '0', 10))} className="mt-1 w-full px-2 py-1 bg-white border border-[var(--border-light)] rounded text-[11px]" /></label>
                   <label className="text-[10px] font-mono uppercase tracking-wide opacity-70">Interval (s)<input type="number" min={1} step={1} value={sampleIntervalSec} onChange={(e) => setSampleIntervalSec(parseInt(e.target.value || '60', 10))} className="mt-1 w-full px-2 py-1 bg-white border border-[var(--border-light)] rounded text-[11px]" /></label>
                 </div>
                 <button
                   onClick={() => executePairAudit()}
                   disabled={!selectedSourceA || !selectedSourceB || isVerifying}
                   className="w-full py-3 font-mono text-[10px] uppercase font-bold rounded border border-[var(--trust-blue)] text-[var(--trust-blue)] hover:bg-blue-500/10 disabled:opacity-30"
                 >
                   Run Manual Compare
                 </button>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-mono text-[11px] uppercase opacity-40 font-bold tracking-[0.3em]">Analysis Report</h3>
          {renderL2State()}
          
          {debugLog.length > 0 && (
            <div className="bg-[var(--code-bg)] border border-[var(--border-light)] rounded-lg p-4 max-h-48 overflow-y-auto">
               <h4 className="font-mono text-[9px] uppercase font-bold opacity-40 mb-2">Debug Trace</h4>
               <div className="font-mono text-[9px] space-y-1 opacity-70">
                  {debugLog.map((log, i) => (
                     <div key={i} className="break-all">{log}</div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
