const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Database connection
require('./config/database');

const config = require('./config/app');

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create logs directory if it doesn't exist
const logsDir = config.logDir;
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Import routes
const adRoutes = require('./routes/ads');
const campaignRoutes = require('./routes/campaigns');
const adSetRoutes = require('./routes/adsets');

// Routes
app.use('/api', adRoutes);
app.use('/api', campaignRoutes);
app.use('/api', adSetRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Meta Reklam API çalışıyor',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server hatası:', err);
    res.status(500).json({ 
        error: 'Sunucu hatası',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint bulunamadı',
        path: req.path 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📱 Meta Reklam API: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    
    // Config validation
    if (!config.validateConfig()) {
        console.warn('⚠️ Bazı konfigürasyon eksiklikleri var. Meta API özellikleri çalışmayabilir.');
    }
});
