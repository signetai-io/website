const express = require('express');
const path = require('path');
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

// --- CRITICAL STATIC ASSETS ---
// Explicitly handle these SVGs before any other middleware to ensure they are served 
// with the correct MIME type and are not caught by the SPA fallback.

app.get('/signed_signetai-solar-system.svg', (req, res) => {
    res.type('image/svg+xml');
    const publicPath = path.join(__dirname, 'public/signed_signetai-solar-system.svg');
    const rootPath = path.join(__dirname, 'signed_signetai-solar-system.svg');

    res.sendFile(publicPath, (err) => {
        if (err) {
            // Fallback to root if not in public
            res.sendFile(rootPath, (err2) => {
                if (err2) {
                    console.error('SVG Asset Not Found:', err2);
                    res.status(404).send('Asset not found');
                }
            });
        }
    });
});

app.get('/signetai-solar-system.svg', (req, res) => {
    res.type('image/svg+xml');
    const publicPath = path.join(__dirname, 'public/signetai-solar-system.svg');
    const rootPath = path.join(__dirname, 'signetai-solar-system.svg');

    res.sendFile(publicPath, (err) => {
        if (err) {
            res.sendFile(rootPath, (err2) => {
                if (err2) {
                    console.error('SVG Asset Not Found:', err2);
                    res.status(404).send('Asset not found');
                }
            });
        }
    });
});

// Serve static assets from 'public' (Standard for source assets)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static assets from 'dist' (Production build artifacts)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SignetAI Gateway running on port ${PORT}`);
});