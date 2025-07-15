# 📱 Meta Reklam API Entegrasyonu

Bu proje, Meta Business (Facebook & Instagram) reklamlarını yönetmek için geliştirilmiş kapsamlı bir backend API sistemidir.

## 🎯 Proje Amacı

- **Meta Graph API** ile reklam yönetimi
- Reklam oluşturma, güncelleme, durdurma ve silme
- **MongoDB** ile reklam verilerinin saklanması
- Günlük **log sistemi** ile API çağrılarının takibi
- Product Manager için **test paneli**
- Gerçek Meta Business hesabında canlı test imkanı

## 🏗️ Teknoloji Stack

| Bileşen | Teknoloji | Açıklama |
|---------|-----------|----------|
| **Backend** | Node.js + Express | RESTful API |
| **Database** | MongoDB + Mongoose | NoSQL veritabanı |
| **API** | Meta Graph API v18.0 | Facebook/Instagram API |
| **Logging** | Winston + File System | Günlük log sistemi |
| **Frontend** | HTML/JavaScript | Basit test paneli |

## 📁 Proje Yapısı

```
meta-reklam/
├── 📁 config/
│   ├── app.js          # Uygulama konfigürasyonu
│   └── database.js     # MongoDB bağlantısı
├── 📁 models/
│   └── Ad.js          # Reklam MongoDB modeli
├── 📁 routes/
│   └── ads.js         # API endpoint'leri
├── 📁 services/
│   └── metaApi.js     # Meta Graph API servisi
├── 📁 docs/           # Detaylı dokümantasyon
├── 📁 logs/           # Günlük log dosyaları
├── 📁 public/         # Frontend dosyaları
├── server.js          # Ana server dosyası
└── package.json
```

## 🚀 Hızlı Başlangıç

### 1. Kurulum

```bash
# Repository'yi klonla
git clone <repository-url>
cd meta-reklam

# Dependencies'leri yükle
npm install
```

### 2. Environment Variables

`.env` dosyası oluşturun:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/meta-reklam

# Meta API Configuration
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_ACCESS_TOKEN=your_meta_access_token
META_AD_ACCOUNT_ID=act_your_ad_account_id
META_PAGE_ID=your_page_id

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=logs
```

### 3. Meta API Kurulumu

Detaylı kurulum rehberi için: [docs/meta-api-setup.md](./docs/meta-api-setup.md)

### 4. Çalıştırma

```bash
# Development modunda başlat
npm run dev

# Production modunda başlat
npm start
```

### 5. Test

```bash
# Health check
curl http://localhost:5000/health

# API test
curl http://localhost:5000/api/meta-info
```

## 🔌 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/health` | Sunucu durumu |
| `GET` | `/api/meta-info` | Meta hesap bilgileri |
| `GET` | `/api/ads` | Tüm reklamları listele |
| `GET` | `/api/ads/active` | Aktif reklamları listele |
| `POST` | `/api/create-ad` | Yeni reklam oluştur |
| `POST` | `/api/update-ad` | Reklam güncelle |
| `POST` | `/api/pause-ad` | Reklam durdur |
| `POST` | `/api/delete-ad` | Reklam sil |

Detaylı API dokümantasyonu: [docs/api-endpoints.md](./docs/api-endpoints.md)

## 📊 Özellikler

### ✅ Tamamlanan Özellikler

- [x] **Meta Graph API Entegrasyonu**
- [x] **Reklam CRUD İşlemleri** (Create, Read, Update, Delete)
- [x] **MongoDB Veritabanı Entegrasyonu**
- [x] **Günlük Log Sistemi**
- [x] **Modüler Kod Yapısı**
- [x] **Environment Variables Konfigürasyonu**
- [x] **Error Handling**
- [x] **API Validation**
- [x] **Health Check Endpoint**
- [x] **Kapsamlı Dokümantasyon**

### 🔄 Geliştirilecek Özellikler

- [ ] **Frontend Test Paneli**
- [ ] **Webhook Entegrasyonu**
- [ ] **Rate Limiting**
- [ ] **Authentication/Authorization**
- [ ] **Dashboard UI**
- [ ] **Real-time Notifications**

## 📚 Dokümantasyon

| Doküman | Açıklama |
|---------|----------|
| [📖 Ana Dokümantasyon](./docs/README.md) | Proje genel bakış |
| [🔌 API Endpoints](./docs/api-endpoints.md) | Tüm API endpoint'leri |
| [🔧 Meta API Kurulumu](./docs/meta-api-setup.md) | Meta API kurulum rehberi |
| [🗄️ Database Schema](./docs/database-schema.md) | MongoDB model yapısı |
| [📝 Logging Sistemi](./docs/logging-system.md) | Log sistemi detayları |
| [🛠️ Troubleshooting](./docs/troubleshooting.md) | Sorun giderme rehberi |

## 🧪 Test

### Postman Collection

Postman için hazır collection: [docs/postman-collection.json](./docs/postman-collection.json)

### cURL Örnekleri

```bash
# Health check
curl http://localhost:5000/health

# Reklam oluştur
curl -X POST http://localhost:5000/api/create-ad \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "123456789",
    "adSetId": "987654321",
    "title": "Test Reklamı",
    "content": "Bu bir test reklamıdır",
    "link": "https://tarvina.com"
  }'

# Reklamları listele
curl http://localhost:5000/api/ads
```

## 📊 Monitoring

### Log Dosyaları

```bash
# Günlük log'ları görüntüle
cat logs/$(date +%Y-%m-%d).log

# Canlı log takibi
tail -f logs/$(date +%Y-%m-%d).log

# Hataları filtrele
grep "❌" logs/$(date +%Y-%m-%d).log
```

### Health Check

```bash
# Sunucu durumu
curl http://localhost:5000/health

# Meta API durumu
curl http://localhost:5000/api/meta-info
```

## 🔒 Güvenlik

- **Environment Variables** kullanımı
- **Hassas verilerin log'larda gizlenmesi**
- **Input validation**
- **Error handling**
- **Rate limiting** (gelecek özellik)

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Gelecek)

```bash
docker build -t meta-reklam .
docker run -p 5000:5000 meta-reklam
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

### Meta Developer Support
- [Meta Developer Support](https://developers.facebook.com/support/)
- [Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Marketing API Documentation](https://developers.facebook.com/docs/marketing-api)

### Proje İçi Destek
- Log dosyaları: `logs/$(date +%Y-%m-%d).log`
- Health check: `http://localhost:5000/health`
- API status: `http://localhost:5000/api/meta-info`

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- **Meta Developer Platform** - API sağlayıcısı
- **MongoDB** - Veritabanı çözümü
- **Express.js** - Web framework
- **Node.js** - Runtime environment

---

**Geliştirici:** Tarvina Yazılım Teknoloji  
**Versiyon:** 1.0.0  
**Son Güncelleme:** 2025-01-XX 