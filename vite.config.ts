import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'signet-drive-frame-extractor',
        configureServer(server) {
          server.middlewares.use('/api/extract-drive-frames', async (req, res) => {
            try {
              const u = new URL(req.url || '', 'http://localhost');
              const fileId = u.searchParams.get('fileId') || '';
              const key = u.searchParams.get('key') || '';
              const tsRaw = u.searchParams.get('timestamps') || '';
              const timestamps = tsRaw
                .split(',')
                .map((s) => parseInt(s.trim(), 10))
                .filter((n) => Number.isFinite(n) && n >= 0)
                .slice(0, 120);

              if (!fileId || !key || timestamps.length === 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing fileId/key/timestamps' }));
                return;
              }

              const inputUrls = [
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${key}`,
                `https://drive.google.com/uc?export=download&id=${fileId}`
              ];

              const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'signet-drive-frames-'));
              const results: Array<{ timestamp: number; imageUrl: string }> = [];
              const diagnostics: any = {
                requestedCount: timestamps.length,
                extractedCount: 0,
                attempts: [] as Array<{
                  urlBase: string;
                  extractedTimestamps: number[];
                  failedTimestamps: number[];
                  sampleError?: string;
                }>
              };

              const tryUrl = async (inputUrl: string) => {
                const current: Array<{ timestamp: number; imageUrl: string }> = [];
                const failed: number[] = [];
                let sampleError = '';
                const startedAt = Date.now();
                const OVERALL_DEADLINE_MS = 20000;
                for (const ts of timestamps) {
                  if (Date.now() - startedAt > OVERALL_DEADLINE_MS) {
                    failed.push(ts);
                    if (!sampleError) sampleError = 'server_deadline_exceeded';
                    continue;
                  }
                  const out = path.join(tmpRoot, `frame_${ts}.jpg`);
                  const cmd = spawnSync(
                    'ffmpeg',
                    ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-ss', String(ts), '-i', inputUrl, '-frames:v', '1', '-q:v', '3', out],
                    { encoding: 'utf8', timeout: 3500, maxBuffer: 1024 * 1024 * 2 }
                  );
                  if (cmd.status !== 0) {
                    failed.push(ts);
                    if (!sampleError) {
                      const timeoutErr = (cmd.error && (cmd.error as any).code === 'ETIMEDOUT') ? 'ffmpeg_timeout' : '';
                      sampleError = timeoutErr || String(cmd.stderr || cmd.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean)[0] || 'ffmpeg_error';
                    }
                    continue;
                  }
                  try {
                    const bin = await fs.readFile(out);
                    current.push({ timestamp: ts, imageUrl: `data:image/jpeg;base64,${bin.toString('base64')}` });
                  } catch {
                    // Ignore failed frame reads and keep trying other timestamps.
                    failed.push(ts);
                  }
                }
                diagnostics.attempts.push({
                  urlBase: inputUrl.split('?')[0],
                  extractedTimestamps: current.map((f) => f.timestamp),
                  failedTimestamps: failed,
                  sampleError: sampleError || undefined
                });
                return current;
              };

              for (const inputUrl of inputUrls) {
                const frames = await tryUrl(inputUrl);
                if (frames.length > 0) {
                  results.push(...frames);
                  break;
                }
              }

              await fs.rm(tmpRoot, { recursive: true, force: true });
              diagnostics.extractedCount = results.length;
              diagnostics.extractedTimestamps = results.map((f) => f.timestamp);
              diagnostics.missingTimestamps = timestamps.filter((ts) => !results.some((r) => r.timestamp === ts));

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ frames: results, diagnostics }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e?.message || 'extractor_error' }));
            }
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.EXTRACTOR_TIMEOUT_MS': JSON.stringify(env.EXTRACTOR_TIMEOUT_MS || '5000'),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID || ''),
      'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(env.FIREBASE_MEASUREMENT_ID || '')
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
