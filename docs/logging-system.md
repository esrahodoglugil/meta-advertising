# 📝 Logging Sistemi Dokümantasyonu

Bu dokümanda Meta Reklam API'sinin logging sistemi detaylı olarak açıklanmıştır.

## 🎯 Logging Amacı

- API çağrılarının takibi
- Hata ayıklama ve debugging
- Performans monitoring
- Güvenlik audit'i
- Meta API entegrasyonu kontrolü

## 📁 Log Dosyası Yapısı

### Konum
```
logs/
├── 2025-01-01.log
├── 2025-01-02.log
├── 2025-01-03.log
└── ...
```

### Format
```json
{
  "timestamp": "2025-01-01T10:30:45.123Z",
  "message": "Meta API Request: POST /act_xxx/ads",
  "data": {
    "method": "POST",
    "endpoint": "/act_xxx/ads",
    "requestData": {...},
    "responseData": {...}
  }
}
```

## 🔧 Logging Konfigürasyonu

### Environment Variables
```env
LOG_LEVEL=info          # Log seviyesi
LOG_DIR=logs           # Log klasörü
```

### Log Seviyeleri
- **error**: Kritik hatalar
- **warn**: Uyarılar
- **info**: Genel bilgiler
- **debug**: Detaylı debug bilgileri

## 📊 Log Türleri

### 1. Meta API Çağrıları

#### Request Log
```json
{
  "timestamp": "2025-01-01T10:30:45.123Z",
  "message": "🌐 Meta API Request: POST /act_xxx/ads",
  "data": {
    "method": "POST",
    "endpoint": "/act_xxx/ads",
    "requestData": {
      "name": "Test Reklamı",
      "adset_id": "987654321",
      "creative": {
        "creative_id": "xxx"
      }
    }
  }
}
```

#### Response Log
```json
{
  "timestamp": "2025-01-01T10:30:46.456Z",
  "message": "✅ Meta API Response: POST /act_xxx/ads",
  "data": {
    "method": "POST",
    "endpoint": "/act_xxx/ads",
    "responseData": {
      "id": "act_xxx_xxx",
      "status": "PAUSED"
    }
  }
}
```

#### Error Log
```json
{
  "timestamp": "2025-01-01T10:30:45.789Z",
  "message": "❌ Meta API Error: POST /act_xxx/ads",
  "data": {
    "method": "POST",
    "endpoint": "/act_xxx/ads",
    "error": {
      "error": {
        "message": "Invalid access token",
        "type": "OAuthException",
        "code": 190
      },
      "status": 401
    }
  }
}
```

### 2. Database İşlemleri

#### Create Log
```json
{
  "timestamp": "2025-01-01T10:30:47.123Z",
  "message": "📝 Database: Ad created",
  "data": {
    "metaAdId": "act_xxx_xxx",
    "title": "Test Reklamı",
    "status": "PAUSED"
  }
}
```

#### Update Log
```json
{
  "timestamp": "2025-01-01T10:31:00.456Z",
  "message": "📝 Database: Ad updated",
  "data": {
    "metaAdId": "act_xxx_xxx",
    "changes": {
      "title": "Güncellenmiş Başlık",
      "status": "ACTIVE"
    }
  }
}
```

### 3. Server Logları

#### Startup Log
```json
{
  "timestamp": "2025-01-01T10:00:00.000Z",
  "message": "🚀 Server 5000 portunda çalışıyor",
  "data": {
    "port": 5000,
    "environment": "development",
    "mongoStatus": "connected"
  }
}
```

#### Health Check Log
```json
{
  "timestamp": "2025-01-01T10:30:45.123Z",
  "message": "🔍 Health Check: OK",
  "data": {
    "status": "OK",
    "uptime": "30 minutes",
    "memory": "45.2 MB"
  }
}
```

## 🔧 Logging Implementasyonu

### Meta API Service Logging

```javascript
// services/metaApi.js
class MetaApiService {
  logToFile(message, data = null) {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(config.logDir, `${today}.log`);
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      message,
      data
    };
    
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    console.log(`📝 [${timestamp}] ${message}`);
  }
}
```

### Database Logging

```javascript
// models/Ad.js
adSchema.methods.addLog = function(action, response, success) {
  this.apiLogs.push({
    action,
    response,
    success,
    timestamp: new Date()
  });
  return this.save();
};
```

### Server Logging

```javascript
// server.js
app.use((err, req, res, next) => {
  console.error('❌ Server hatası:', err);
  
  // Log dosyasına yaz
  const logEntry = {
    timestamp: new Date().toISOString(),
    message: 'Server Error',
    data: {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method
    }
  };
  
  const logFile = path.join(config.logDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  
  res.status(500).json({ 
    error: 'Sunucu hatası',
    message: err.message 
  });
});
```

## 📊 Log Analizi

### Log Dosyasını Okuma

```bash
# Günlük log dosyasını görüntüle
cat logs/$(date +%Y-%m-%d).log

# Son 10 satırı görüntüle
tail -10 logs/$(date +%Y-%m-%d).log

# Canlı log takibi
tail -f logs/$(date +%Y-%m-%d).log
```

### Log Filtreleme

```bash
# Sadece hataları görüntüle
grep "❌" logs/$(date +%Y-%m-%d).log

# Sadece Meta API çağrılarını görüntüle
grep "🌐" logs/$(date +%Y-%m-%d).log

# Başarılı API çağrılarını görüntüle
grep "✅" logs/$(date +%Y-%m-%d).log
```

### Log İstatistikleri

```bash
# Günlük log sayısı
wc -l logs/$(date +%Y-%m-%d).log

# Hata sayısı
grep -c "❌" logs/$(date +%Y-%m-%d).log

# Başarılı API çağrı sayısı
grep -c "✅" logs/$(date +%Y-%m-%d).log
```

## 🔍 Log Monitoring

### Performance Monitoring

```javascript
// API response time logging
const startTime = Date.now();
const response = await metaApi.createAd(adData);
const endTime = Date.now();

this.logToFile(`⏱️ API Response Time: ${endTime - startTime}ms`, {
  endpoint: '/create-ad',
  duration: endTime - startTime,
  success: response.success
});
```

### Error Tracking

```javascript
// Hata oranı hesaplama
const totalCalls = logs.filter(log => log.message.includes('Meta API')).length;
const errorCalls = logs.filter(log => log.message.includes('❌')).length;
const errorRate = (errorCalls / totalCalls) * 100;
```

### Rate Limiting Monitoring

```javascript
// API limit kontrolü
const hourlyCalls = logs.filter(log => {
  const logTime = new Date(log.timestamp);
  const now = new Date();
  return (now - logTime) < 3600000; // Son 1 saat
}).length;

if (hourlyCalls > 200) {
  console.warn('⚠️ API rate limit yaklaşıyor');
}
```

## 🛠️ Log Yönetimi

### Log Rotation

```javascript
// Günlük log rotation
const cron = require('node-cron');

cron.schedule('0 0 * * *', () => {
  // Eski log dosyalarını temizle (30 günden eski)
  const fs = require('fs');
  const path = require('path');
  
  const logDir = config.logDir;
  const files = fs.readdirSync(logDir);
  
  files.forEach(file => {
    const filePath = path.join(logDir, file);
    const stats = fs.statSync(filePath);
    const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysOld > 30) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Eski log dosyası silindi: ${file}`);
    }
  });
});
```

### Log Compression

```javascript
// Log sıkıştırma
const zlib = require('zlib');

function compressOldLogs() {
  const fs = require('fs');
  const path = require('path');
  
  const logDir = config.logDir;
  const files = fs.readdirSync(logDir);
  
  files.forEach(file => {
    if (file.endsWith('.log') && !file.endsWith('.gz')) {
      const filePath = path.join(logDir, file);
      const compressedPath = filePath + '.gz';
      
      const content = fs.readFileSync(filePath);
      const compressed = zlib.gzipSync(content);
      
      fs.writeFileSync(compressedPath, compressed);
      fs.unlinkSync(filePath);
      
      console.log(`🗜️ Log sıkıştırıldı: ${file}`);
    }
  });
}
```

## 🔒 Güvenlik

### Hassas Veri Gizleme

```javascript
// Access token'ları log'larda gizle
function sanitizeLogData(data) {
  if (typeof data === 'object') {
    const sanitized = { ...data };
    
    if (sanitized.access_token) {
      sanitized.access_token = '***HIDDEN***';
    }
    
    if (sanitized.app_secret) {
      sanitized.app_secret = '***HIDDEN***';
    }
    
    return sanitized;
  }
  
  return data;
}
```

### Log Encryption

```javascript
// Hassas log'ları şifrele
const crypto = require('crypto');

function encryptLog(logEntry) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.LOG_ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(JSON.stringify(logEntry), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    encrypted: encrypted
  };
}
```

## 📈 Log Analytics

### Log Dashboard

```javascript
// Log istatistikleri endpoint'i
app.get('/api/logs/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(config.logDir, `${today}.log`);
    
    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        data: {
          totalLogs: 0,
          errors: 0,
          apiCalls: 0,
          successRate: 100
        }
      });
    }
    
    const logs = fs.readFileSync(logFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    const totalLogs = logs.length;
    const errors = logs.filter(log => log.message.includes('❌')).length;
    const apiCalls = logs.filter(log => log.message.includes('🌐')).length;
    const successRate = apiCalls > 0 ? ((apiCalls - errors) / apiCalls) * 100 : 100;
    
    res.json({
      success: true,
      data: {
        totalLogs,
        errors,
        apiCalls,
        successRate: Math.round(successRate * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Log istatistikleri alınamadı'
    });
  }
});
```

## 🔄 Log Export

### JSON Export

```javascript
// Log'ları JSON formatında export et
app.get('/api/logs/export/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const logFile = path.join(config.logDir, `${date}.log`);
    
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        error: 'Log dosyası bulunamadı'
      });
    }
    
    const logs = fs.readFileSync(logFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Log export hatası'
    });
  }
});
```

## 📚 Faydalı Komutlar

### Log Temizleme
```bash
# 30 günden eski log'ları sil
find logs/ -name "*.log" -mtime +30 -delete

# Sıkıştırılmış log'ları sil
find logs/ -name "*.log.gz" -mtime +90 -delete
```

### Log Analizi
```bash
# En çok hata veren endpoint'ler
grep "❌" logs/*.log | grep -o "POST [^ ]*" | sort | uniq -c | sort -nr

# API response time analizi
grep "⏱️" logs/*.log | grep -o "[0-9]*ms" | sort -n | tail -10
```

### Log Backup
```bash
# Günlük log backup'ı
cp logs/$(date +%Y-%m-%d).log backup/logs/
``` 