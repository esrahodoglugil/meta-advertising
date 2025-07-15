const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // MongoDB Configuration
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-reklam',
    
    // Meta API Configuration
    metaAppId: process.env.META_APP_ID,
    metaAppSecret: process.env.META_APP_SECRET,
    metaAccessToken: process.env.META_ACCESS_TOKEN,
    metaAdAccountId: process.env.META_AD_ACCOUNT_ID,
    metaPageId: process.env.META_PAGE_ID,
    
    // Logging Configuration
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || 'logs',
    
    // API Configuration
    apiVersion: 'v18.0',
    baseUrl: 'https://graph.facebook.com/v18.0',
    
    // Validation
    validateConfig() {
        const required = ['metaAccessToken', 'metaAdAccountId'];
        const missing = required.filter(key => !this[key]);
        
        if (missing.length > 0) {
            console.warn(`⚠️ Eksik konfigürasyon: ${missing.join(', ')}`);
            console.warn('📝 .env dosyasını kontrol edin');
            return false;
        }
        
        return true;
    }
}; 