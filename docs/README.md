# 📱 Meta Reklam API Entegrasyonu

Bu proje, Meta Business (Facebook & Instagram) reklamlarını yönetmek için geliştirilmiş bir backend API sistemidir.

## 🎯 Proje Amacı

- Meta Graph API ile reklam yönetimi
- Reklam oluşturma, güncelleme, durdurma ve silme
- MongoDB ile reklam verilerinin saklanması
- Günlük log sistemi
- Product Manager için test paneli

## 🏗️ Teknoloji Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **API:** Meta Graph API v18.0
- **Logging:** Winston + File System
- **Frontend:** HTML/JavaScript (Basit Panel)

## 📁 Proje Yapısı

```
meta-reklam/
├── config/
│   ├── app.js          # Uygulama konfigürasyonu
│   └── database.js     # MongoDB bağlantısı
├── models/
│   └── Ad.js          # Reklam MongoDB modeli
├── routes/
│   └── ads.js         # API endpoint'leri
├── services/
│   └── metaApi.js     # Meta Graph API servisi
├── docs/              # Dokümantasyon
├── logs/              # Günlük log dosyaları
├── public/            # Frontend dosyaları
├── server.js          # Ana server dosyası
└── package.json
```

## 🚀 Hızlı Başlangıç

### 1. Kurulum
```bash
npm install
```

### 2. Environment Variables
`.env` dosyası oluşturun:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/meta-reklam
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_ACCESS_TOKEN=your_access_token
META_AD_ACCOUNT_ID=act_your_ad_account_id
META_PAGE_ID=your_page_id
LOG_LEVEL=info
LOG_DIR=logs
```

### 3. Çalıştırma
```bash
npm run dev
```

### 4. Test
```bash
curl http://localhost:5000/health
```

## 📚 Dokümantasyon İndeks

- [API Endpoints](./api-endpoints.md)
- [Meta API Kurulumu](./meta-api-setup.md)
- [Database Schema](./database-schema.md)
- [Logging Sistemi](./logging-system.md)
- [Frontend Kullanımı](./frontend-usage.md)
- [Troubleshooting](./troubleshooting.md)

## 🔗 Faydalı Linkler

- [Meta Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Marketing API](https://developers.facebook.com/docs/marketing-api)
- [Facebook Ads Manager](https://business.facebook.com/adsmanager) 