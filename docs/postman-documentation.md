# 📱 Meta Reklam API - Postman Dokümantasyonu

Bu dokümantasyon, Meta Reklam API'sinin Postman üzerinden test edilmesi için hazırlanmıştır.

## 🎯 API Genel Bakış

**Meta Reklam API**, Facebook ve Instagram reklamlarını programatik olarak yönetmek için geliştirilmiş bir RESTful API'dir. Bu API, reklam oluşturma, güncelleme, durdurma ve silme işlemlerini Meta Graph API üzerinden gerçekleştirir.

### 🏗️ Teknoloji Stack
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **External API:** Meta Graph API v18.0
- **Authentication:** Meta Access Token

### 📊 API Özellikleri
- ✅ **CRUD Operations** - Reklam yönetimi
- ✅ **Real-time Logging** - API çağrı takibi
- ✅ **Error Handling** - Kapsamlı hata yönetimi
- ✅ **Validation** - Input doğrulama
- ✅ **Health Monitoring** - Sistem durumu kontrolü

## 🚀 Başlangıç Rehberi

### 1. Environment Setup

Postman'de yeni bir environment oluşturun:

**Environment Variables:**
```
BASE_URL: http://localhost:5000
API_VERSION: v1
META_APP_ID: 1881023722741111
META_AD_ACCOUNT_ID: act_308845109701111
META_PAGE_ID: 482045731647111
```

### 2. Authentication

Bu API, Meta Access Token kullanır. Token'ı backend'de konfigüre edin:

```env
META_ACCESS_TOKEN=your_meta_access_token_here
```

### 3. Base URL

Tüm API çağrıları için base URL:
```
{{BASE_URL}}
```

## 🔌 API Endpoints

### Health Check

**Endpoint:** `GET {{BASE_URL}}/health`

**Açıklama:** Sunucunun durumunu kontrol eder.

**Response:**
```json
{
  "status": "OK",
  "message": "Meta Reklam API çalışıyor",
  "timestamp": "2025-01-XX..."
}
```

### Meta API Bilgileri

**Endpoint:** `GET {{BASE_URL}}/api/meta-info`

**Açıklama:** Meta hesap bilgilerini ve kampanyaları getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "act_308845109701111",
      "name": "Ad Account Name",
      "account_status": 1
    },
    "campaigns": [
      {
        "id": "123456789",
        "name": "Campaign Name",
        "status": "ACTIVE"
      }
    ]
  }
}
```

### Reklam Listesi

**Endpoint:** `GET {{BASE_URL}}/api/ads`

**Açıklama:** Tüm reklamları listeler.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "metaAdId": "act_xxx_xxx",
      "title": "Reklam Başlığı",
      "content": "Reklam içeriği",
      "status": "ACTIVE",
      "createdAt": "2025-01-XX..."
    }
  ],
  "count": 1
}
```

### Aktif Reklamlar

**Endpoint:** `GET {{BASE_URL}}/api/ads/active`

**Açıklama:** Sadece aktif reklamları listeler.

### Reklam Detayları

**Endpoint:** `GET {{BASE_URL}}/api/ads/{{adId}}`

**Açıklama:** Belirli bir reklamın detaylarını getirir.

**Parameters:**
- `adId`: Meta reklam ID'si

## ➕ Reklam Yönetimi

### Reklam Oluşturma

**Endpoint:** `POST {{BASE_URL}}/api/create-ad`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "campaignId": "123456789",
  "adSetId": "987654321",
  "title": "Test Reklamı",
  "content": "Bu bir test reklamıdır",
  "link": "https://tarvina.com",
  "mediaUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reklam başarıyla oluşturuldu",
  "data": {
    "adId": "act_xxx_xxx",
    "creativeId": "xxx",
    "status": "PAUSED"
  }
}
```

**Validation Rules:**
- `campaignId`: Zorunlu
- `adSetId`: Zorunlu
- `title`: Zorunlu, max 40 karakter
- `content`: Zorunlu, max 125 karakter
- `link`: Zorunlu, geçerli URL
- `mediaUrl`: Opsiyonel

### Reklam Güncelleme

**Endpoint:** `POST {{BASE_URL}}/api/update-ad`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "adId": "act_xxx_xxx",
  "title": "Güncellenmiş Başlık",
  "content": "Güncellenmiş içerik",
  "link": "https://yeni-link.com",
  "mediaUrl": "https://yeni-resim.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reklam başarıyla güncellendi",
  "data": {
    "success": true
  }
}
```

### Reklam Durdurma

**Endpoint:** `POST {{BASE_URL}}/api/pause-ad`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "adId": "act_xxx_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reklam başarıyla durduruldu",
  "data": {
    "success": true
  }
}
```

### Reklam Silme

**Endpoint:** `POST {{BASE_URL}}/api/delete-ad`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "adId": "act_xxx_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reklam başarıyla silindi",
  "data": {
    "success": true
  }
}
```

## 📊 Response Formatları

### Başarılı Response
```json
{
  "success": true,
  "message": "İşlem başarılı",
  "data": {
    // Response data
  }
}
```

### Hata Response
```json
{
  "success": false,
  "error": "Hata mesajı",
  "details": "Detaylı hata bilgisi"
}
```

## ⚠️ HTTP Status Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 400 | Geçersiz istek (validation hatası) |
| 404 | Reklam bulunamadı |
| 500 | Sunucu hatası |

## 🧪 Test Senaryoları

### 1. Temel API Testi

**Adım 1:** Health Check
```
GET {{BASE_URL}}/health
```

**Adım 2:** Meta Info
```
GET {{BASE_URL}}/api/meta-info
```

**Adım 3:** Reklam Listesi
```
GET {{BASE_URL}}/api/ads
```

### 2. Reklam Yaşam Döngüsü Testi

**Adım 1:** Reklam Oluştur
```json
POST {{BASE_URL}}/api/create-ad
{
  "campaignId": "123456789",
  "adSetId": "987654321",
  "title": "Test Reklamı",
  "content": "Bu bir test reklamıdır",
  "link": "https://tarvina.com"
}
```

**Adım 2:** Reklamı Listele
```
GET {{BASE_URL}}/api/ads
```

**Adım 3:** Reklamı Güncelle
```json
POST {{BASE_URL}}/api/update-ad
{
  "adId": "{{createdAdId}}",
  "title": "Güncellenmiş Test Reklamı"
}
```

**Adım 4:** Reklamı Durdur
```json
POST {{BASE_URL}}/api/pause-ad
{
  "adId": "{{createdAdId}}"
}
```

**Adım 5:** Reklamı Sil
```json
POST {{BASE_URL}}/api/delete-ad
{
  "adId": "{{createdAdId}}"
}
```

## 🔍 Debug ve Monitoring

### Log Dosyaları

API çağrıları günlük log dosyalarında saklanır:
```
logs/2025-01-XX.log
```

### Log Analizi

```bash
# Günlük log'ları görüntüle
cat logs/$(date +%Y-%m-%d).log

# Hataları filtrele
grep "❌" logs/$(date +%Y-%m-%d).log

# API çağrılarını filtrele
grep "🌐" logs/$(date +%Y-%m-%d).log
```

### Health Monitoring

```bash
# Sunucu durumu
curl {{BASE_URL}}/health

# Meta API durumu
curl {{BASE_URL}}/api/meta-info
```

## 🛠️ Troubleshooting

### Yaygın Hatalar

#### 1. "Invalid Access Token"
- **Çözüm:** Meta Graph API Explorer'dan yeni token al
- **Kontrol:** Token'ın geçerli olduğunu doğrula

#### 2. "Ad Account Not Found"
- **Çözüm:** Ad Account ID'yi kontrol et
- **Kontrol:** Hesabın aktif olduğunu doğrula

#### 3. "Validation Error"
- **Çözüm:** Request body'deki zorunlu alanları kontrol et
- **Kontrol:** URL formatının geçerli olduğunu doğrula

### Debug Komutları

```bash
# Token doğrulama
curl "https://graph.facebook.com/me?access_token=YOUR_TOKEN"

# Ad Account kontrolü
curl "https://graph.facebook.com/act_YOUR_AD_ACCOUNT_ID?access_token=YOUR_TOKEN"

# Page kontrolü
curl "https://graph.facebook.com/YOUR_PAGE_ID?access_token=YOUR_TOKEN"
```

## 📚 Faydalı Linkler

- [Meta Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Marketing API](https://developers.facebook.com/docs/marketing-api)
- [Facebook Ads Manager](https://business.facebook.com/adsmanager)
- [Meta Developer Support](https://developers.facebook.com/support/)

## 🔒 Güvenlik

### Best Practices

1. **Environment Variables** kullanın
2. **Access Token'ları** güvenli saklayın
3. **Log dosyalarında** hassas verileri gizleyin
4. **Rate limiting** uygulayın
5. **Input validation** yapın

### Production Checklist

- [ ] Meta App Review tamamlandı
- [ ] Live mode aktif
- [ ] SSL sertifikası kurulu
- [ ] Environment variables güvenli
- [ ] Log monitoring aktif
- [ ] Error handling kapsamlı

---

**API Versiyonu:** v1.0.0  
**Son Güncelleme:** 2025-01-XX  
**Geliştirici:** Tarvina Yazılım Teknoloji 