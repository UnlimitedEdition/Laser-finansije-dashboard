require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const REPO_NAME = process.env.REPO_NAME;
const DATA_FILE = process.env.DATA_FILE || 'data.json';

app.post('/api/upisi', async (req, res) => {
    try {
        const data = req.body;
        // Prvo dohvati SHA trenutnog fajla
        const fileRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${DATA_FILE}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const fileData = await fileRes.json();
        const sha = fileData.sha;
        // Sada upiši nove podatke
        const putRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${DATA_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Auto update podataka',
                content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
                sha: sha
            })
        });
        if (!putRes.ok) {
            const err = await putRes.text();
            return res.status(500).json({ error: 'GitHub error', details: err });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/podaci', async (req, res) => {
    try {
        const fileRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${DATA_FILE}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!fileRes.ok) {
            return res.status(500).json({ error: 'Ne mogu da pročitam podatke sa GitHub-a.' });
        }
        const fileData = await fileRes.json();
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        res.json(JSON.parse(content));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SPA fallback: uvek na samom kraju!
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
});
