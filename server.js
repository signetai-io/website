const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

/**
 * SignetAI Subdomain Router
 * Detects if the request is coming from a subdomain (e.g., verify.signetai.io)
 * and serves the bridge.html file for centralized routing.
 */
app.use((req, res, next) => {
    const host = req.get('host');
    const domainParts = host.split('.');
    
    // Check if there is a subdomain and it's not 'www'
    if (domainParts.length > 2 && domainParts[0] !== 'www') {
        // Serve the bridge for all subdomain requests
        return res.sendFile(path.join(__dirname, 'bridge.html'));
    }
    
    // Otherwise, proceed to main app
    next();
});

// --- 1. STATIC ASSETS (High Priority) ---
// Serve files from 'public' and 'dist' first. 
// This handles standard file serving efficiently for any static asset.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// --- 2. SPECIFIC ASSET FALLBACKS ---
// If static middleware missed them (e.g. deployment path issues where public isn't copied to dist),
// we manually look in all possible directories to ensure availability.

function serveWithFallback(res, filename, contentType) {
    const locations = [
        path.join(__dirname, 'public', filename),
        path.join(__dirname, 'dist', filename),
        path.join(__dirname, filename)
    ];

    // Find the first location that actually exists on disk
    const validPath = locations.find(loc => fs.existsSync(loc));

    if (validPath) {
        res.type(contentType);
        res.sendFile(validPath);
    } else {
        console.error(`Asset Not Found: ${filename}`);
        res.status(404).send('Asset not found');
    }
}

app.get('/signed_signetai-solar-system.svg', (req, res) => {
    serveWithFallback(res, 'signed_signetai-solar-system.svg', 'image/svg+xml');
});

app.get('/signetai-solar-system.svg', (req, res) => {
    serveWithFallback(res, 'signetai-solar-system.svg', 'image/svg+xml');
});

// --- 3. SPA FALLBACK ---
// If no static file or specific route matched, serve index.html for React routing.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SignetAI Gateway running on port ${PORT}`);
});