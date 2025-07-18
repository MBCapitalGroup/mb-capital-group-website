// Simple server for Railway deployment
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

console.log('Starting MB Capital Group server...');
console.log('Port:', port);

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// Deploy test
app.get('/deploy-test', (req, res) => {
  res.send(`
    <h1>🎉 MB Capital Group - Railway Deployment Success!</h1>
    <p>Server running on port ${port}</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p><a href="/">Go to Main Website</a></p>
  `);
});

// Main route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${port}`);
});
