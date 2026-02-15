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

// Serve static assets for the main app
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SignetAI Gateway running on port ${PORT}`);
});