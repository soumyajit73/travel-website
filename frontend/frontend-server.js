const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle other static files
app.get('/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, req.params.filename));
});

app.listen(PORT, () => {
    console.log(`Frontend server is running on http://localhost:${PORT}`);
});