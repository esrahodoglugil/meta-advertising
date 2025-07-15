# 🛠️ Troubleshooting Rehberi

Bu dokümanda Meta Reklam API'si ile ilgili yaygın sorunlar ve çözümleri açıklanmıştır.

## 🚨 Yaygın Hatalar ve Çözümleri

### 1. Meta API Hataları

#### ❌ "Invalid Access Token"
**Belirtiler:**
- 401 Unauthorized hatası
- "Invalid access token" mesajı

**Çözümler:**
1. **Token'ı yenile:**
   ```bash
   # Graph API Explorer'da yeni token al
   # Tools → Graph API Explorer → Generate Access Token
   ```

2. **Token süresini kontrol et:**
   - User Access Token: 60 gün
   - Page Access Token: Uzun süreli

3. **İzinleri kontrol et:**
   ```bash
   # Token'ın izinlerini kontrol et
   curl "https://graph.facebook.com/me?access_token=YOUR_TOKEN"
   ```

#### ❌ "Ad Account Not Found"
**Belirtiler:**
- 404 Not Found hatası
- "Ad account not found" mesajı

**Çözümler:**
1. **Ad Account ID'yi doğrula:**
   ```bash
   # Ad Account'ları listele
   curl "https://graph.facebook.com/me/adaccounts?access_token=YOUR_TOKEN"
   ```

2. **Hesabın aktif olduğunu kontrol et:**
   ```bash
   # Ad Account bilgilerini al
   curl "https://graph.facebook.com/act_YOUR_AD_ACCOUNT_ID?access_token=YOUR_TOKEN"
   ```

#### ❌ "Page Not Found"
**Belirtiler:**
- 404 Not Found hatası
- "Page not found" mesajı

**Çözümler:**
1. **Page ID'yi doğrula:**
   ```bash
   # Sayfaları listele
   curl "https://graph.facebook.com/me/accounts?access_token=YOUR_TOKEN"
   ```

2. **Sayfanın public olduğunu kontrol et:**
   - Facebook sayfasının public olduğundan emin ol
   - Sayfa ayarlarını kontrol et

### 2. Database Hataları

#### ❌ "MongoDB Connection Error"
**Belirtiler:**
- "MongoDB bağlantı hatası" mesajı
- Database işlemlerinde hata

**Çözümler:**
1. **MongoDB servisini kontrol et:**
   ```bash
   # MongoDB durumunu kontrol et
   sudo systemctl status mongod
   
   # MongoDB'yi başlat
   sudo systemctl start mongod
   ```

2. **Bağlantı string'ini kontrol et:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/meta-reklam
   ```

3. **Port'u kontrol et:**
   ```bash
   # MongoDB port'unu kontrol et
   netstat -tlnp | grep 27017
   ```

#### ❌ "Validation Error"
**Belirtiler:**
- Mongoose validation hatası
- "Path `title` is required" mesajı

**Çözümler:**
1. **Zorunlu alanları kontrol et:**
   - `title`: Maksimum 40 karakter
   - `content`: Maksimum 125 karakter
   - `link`: Geçerli URL formatı

2. **Veri formatını kontrol et:**
   ```javascript
   // Doğru format
   {
     "title": "Test Reklamı",
     "content": "Bu bir test reklamıdır",
     "link": "https://tarvina.com"
   }
   ```

### 3. Server Hataları

#### ❌ "Port Already in Use"
**Belirtiler:**
- "EADDRINUSE" hatası
- Port 5000 kullanımda

**Çözümler:**
1. **Port'u değiştir:**
   ```env
   PORT=5001
   ```

2. **Kullanılan port'u bul ve kapat:**
   ```bash
   # Port 5000'i kullanan process'i bul
   lsof -i :5000
   
   # Process'i sonlandır
   kill -9 PID
   ```

#### ❌ "Module Not Found"
**Belirtiler:**
- "Cannot find module" hatası
- Dependencies eksik

**Çözümler:**
1. **Dependencies'leri yükle:**
   ```bash
   npm install
   ```

2. **node_modules'ü temizle ve yeniden yükle:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 4. Environment Variables Hataları

#### ❌ "Environment Variable Not Set"
**Belirtiler:**
- "process.env.META_APP_ID is undefined" hatası
- Konfigürasyon eksik

**Çözümler:**
1. **.env dosyasını kontrol et:**
   ```bash
   # .env dosyasının varlığını kontrol et
   ls -la .env
   ```

2. **Environment variables'ları kontrol et:**
   ```bash
   # .env dosyasını oku
   cat .env
   ```

3. **dotenv'yi kontrol et:**
   ```javascript
   // server.js'de dotenv.config() çağrıldığından emin ol
   require('dotenv').config();
   ```

## 🔍 Debug Komutları

### API Test Komutları

```bash
# Health check
curl http://localhost:5000/health

# Meta info
curl http://localhost:5000/api/meta-info

# Reklam listesi
curl http://localhost:5000/api/ads

# Token doğrulama
curl "https://graph.facebook.com/me?access_token=YOUR_TOKEN"

# Ad Account kontrolü
curl "https://graph.facebook.com/act_YOUR_AD_ACCOUNT_ID?access_token=YOUR_TOKEN"

# Page kontrolü
curl "https://graph.facebook.com/YOUR_PAGE_ID?access_token=YOUR_TOKEN"
```

### Log Analizi

```bash
# Günlük log'ları görüntüle
cat logs/$(date +%Y-%m-%d).log

# Hataları filtrele
grep "❌" logs/$(date +%Y-%m-%d).log

# API çağrılarını filtrele
grep "🌐" logs/$(date +%Y-%m-%d).log

# Başarılı çağrıları filtrele
grep "✅" logs/$(date +%Y-%m-%d).log
```

### Database Kontrolü

```bash
# MongoDB'ye bağlan
mongo meta-reklam

# Koleksiyonları listele
show collections

# Reklamları listele
db.ads.find()

# Son 10 reklamı listele
db.ads.find().sort({createdAt: -1}).limit(10)
```

## 📊 Performance Sorunları

### Yavaş API Çağrıları

**Belirtiler:**
- API çağrıları uzun sürüyor
- Timeout hataları

**Çözümler:**
1. **Network bağlantısını kontrol et:**
   ```bash
   ping graph.facebook.com
   ```

2. **Rate limit'i kontrol et:**
   ```bash
   # Son 1 saatin log'larını kontrol et
   grep "$(date -d '1 hour ago' +%Y-%m-%d)" logs/*.log | wc -l
   ```

3. **Meta API status'ünü kontrol et:**
   - [Meta Platform Status](https://developers.facebook.com/status/)

### Yüksek Memory Kullanımı

**Belirtiler:**
- Server yavaş çalışıyor
- Memory kullanımı yüksek

**Çözümler:**
1. **Memory kullanımını kontrol et:**
   ```bash
   # Process memory kullanımı
   ps aux | grep node
   ```

2. **Log dosyalarını temizle:**
   ```bash
   # Eski log'ları sil
   find logs/ -name "*.log" -mtime +7 -delete
   ```

3. **Database index'lerini kontrol et:**
   ```javascript
   // Index'leri kontrol et
   db.ads.getIndexes()
   ```

## 🔧 Konfigürasyon Sorunları

### Meta API Konfigürasyonu

#### App Review Gerekli
**Belirtiler:**
- "Permission denied" hatası
- İzinler çalışmıyor

**Çözümler:**
1. **Development modunda test et:**
   - App'in Development modunda olduğundan emin ol
   - Test kullanıcıları ekle

2. **App Review başvurusu yap:**
   - [App Review](https://developers.facebook.com/docs/app-review) sayfasına git
   - Gerekli izinler için başvuru yap

#### Live Mode Sorunları
**Belirtiler:**
- Production'da çalışmıyor
- "App not in live mode" hatası

**Çözümler:**
1. **App Review'ı tamamla:**
   - Tüm gerekli izinler için review başvurusu yap
   - Onay bekleyin

2. **Live mode'a geç:**
   - App settings → Basic → App Mode
   - "Live" moduna geç

### Environment Variables

#### .env Dosyası Sorunları
**Belirtiler:**
- Environment variables undefined
- Konfigürasyon çalışmıyor

**Çözümler:**
1. **.env dosyasını kontrol et:**
   ```bash
   # Dosya varlığını kontrol et
   ls -la .env
   
   # İçeriğini kontrol et (hassas verileri gizle)
   cat .env | grep -v "TOKEN\|SECRET"
   ```

2. **Dosya formatını kontrol et:**
   ```env
   # Doğru format
   META_APP_ID=1881023722744172
   META_APP_SECRET=your_secret_here
   META_ACCESS_TOKEN=your_token_here
   ```

3. **Dosya encoding'ini kontrol et:**
   ```bash
   # UTF-8 encoding kontrol et
   file .env
   ```

## 🚀 Recovery Prosedürleri

### Server Restart

```bash
# Server'ı durdur
Ctrl + C

# Process'i zorla sonlandır
pkill -f "node server.js"

# Yeniden başlat
npm run dev
```

### Database Reset

```bash
# MongoDB'ye bağlan
mongo meta-reklam

# Koleksiyonu temizle
db.ads.drop()

# Yeniden oluştur
# Server'ı yeniden başlat
```

### Log Temizleme

```bash
# Log dosyalarını temizle
rm -rf logs/*.log

# Log klasörünü yeniden oluştur
mkdir -p logs
```

## 📞 Destek

### Meta Developer Support
- [Meta Developer Support](https://developers.facebook.com/support/)
- [Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Marketing API Documentation](https://developers.facebook.com/docs/marketing-api)

### Proje İçi Destek
- Log dosyalarını kontrol et: `logs/$(date +%Y-%m-%d).log`
- Health check: `http://localhost:5000/health`
- API status: `http://localhost:5000/api/meta-info`

### Debug Modu

```javascript
// Debug modunu aktifleştir
const DEBUG = true;

if (DEBUG) {
  console.log('🔍 Debug mode aktif');
  console.log('📊 Environment variables:', {
    appId: process.env.META_APP_ID,
    adAccountId: process.env.META_AD_ACCOUNT_ID,
    pageId: process.env.META_PAGE_ID
  });
}
```

## 📋 Checklist

### Kurulum Kontrolü
- [ ] MongoDB çalışıyor
- [ ] .env dosyası mevcut
- [ ] Tüm dependencies yüklü
- [ ] Meta API credentials doğru
- [ ] Server başarıyla başlatıldı

### API Test Kontrolü
- [ ] Health check çalışıyor
- [ ] Meta info endpoint çalışıyor
- [ ] Token geçerli
- [ ] Ad Account erişimi var
- [ ] Page erişimi var

### Database Kontrolü
- [ ] MongoDB bağlantısı var
- [ ] Collection oluşturuldu
- [ ] Index'ler oluşturuldu
- [ ] Test verisi eklenebiliyor

### Logging Kontrolü
- [ ] Log klasörü oluşturuldu
- [ ] Günlük log dosyası oluşuyor
- [ ] API çağrıları loglanıyor
- [ ] Hatalar loglanıyor 