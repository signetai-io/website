const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

/**
 * SignetAI Subdomain Router
 */
app.use((req, res, next) => {
    const host = req.get('host');
    const domainParts = host.split('.');
    if (domainParts.length > 2 && domainParts[0] !== 'www') {
        return res.sendFile(path.join(__dirname, 'bridge.html'));
    }
    next();
});

// --- 1. DUAL STATIC MOUNT STRATEGY ---

// A. Serve 'public' folder at '/public' URL 
app.use('/public', express.static(path.join(__dirname, 'public')));

// SECURITY: Explicitly forbid directory listing on /public root
app.get('/public', (req, res) => {
    res.status(403).send('Signet Protocol: Directory Listing Prohibited');
});

// B. Serve 'public' & 'dist' at Root URL 
// This allows files in 'public' (like 192.png) to be accessed at root (signetai.io/192.png)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));


// --- 2. ROBUST FALLBACK FOR CRITICAL ASSETS ---
function serveWithFallback(res, filename, contentType) {
    const locations = [
        path.join(__dirname, 'public', filename), 
        path.join(__dirname, 'dist', filename),
        path.join(__dirname, 'dist', 'public', filename), // Add nested build path support
        path.join(__dirname, filename)            
    ];

    const validPath = locations.find(loc => fs.existsSync(loc));

    if (validPath) {
        console.log(`[Signet Gateway] Serving ${filename} from: ${validPath}`);
        res.type(contentType);
        res.set('Cache-Control', 'public, max-age=3600');
        res.sendFile(validPath);
    } else {
        console.error(`[Signet Gateway] Asset Not Found: ${filename} in checked paths.`);
        res.status(404).send('Asset not found');
    }
}

const criticalAssets = [
    'signed_signetai-solar-system.svg',
    'signetai-solar-system.svg',
    '192.png',
    '512.png',
    'signet_192.png',
    'signet_512.png'
];

criticalAssets.forEach(file => {
    app.get(`/${file}`, (req, res) => serveWithFallback(res, file, file.endsWith('svg') ? 'image/svg+xml' : 'image/png'));
    app.get(`/public/${file}`, (req, res) => serveWithFallback(res, file, file.endsWith('svg') ? 'image/svg+xml' : 'image/png'));
});


// --- 3. SPA FALLBACK ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SignetAI Gateway running on port ${PORT}`);
});