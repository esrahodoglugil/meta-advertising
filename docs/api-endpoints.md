# 🔌 API Endpoints Dokümantasyonu

Bu dokümanda Meta Reklam API'sinin tüm endpoint'leri detaylı olarak açıklanmıştır.

## 📋 Genel Bilgiler

- **Base URL:** `http://localhost:5000`
- **API Prefix:** `/api`
- **Content-Type:** `application/json`
- **Authentication:** Meta Access Token (backend'de)

## 🏥 Health Check

### GET `/health`
Sunucunun durumunu kontrol eder.

**Request:**
```bash
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Meta Reklam API çalışıyor",
  "timestamp": "2025-01-XX..."
}
```

## 📊 Meta API Bilgileri

### GET `/api/meta-info`
Meta hesap bilgilerini ve kampanyaları getirir.

**Request:**
```bash
GET http://localhost:5000/api/meta-info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "act_xxx",
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

## 📝 Reklam Yönetimi

### GET `/api/ads`
Tüm reklamları listeler.

**Request:**
```bash
GET http://localhost:5000/api/ads
```

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

### GET `/api/ads/active`
Aktif reklamları listeler.

**Request:**
```bash
GET http://localhost:5000/api/ads/active
```

### GET `/api/ads/:adId`
Belirli bir reklamın detaylarını getirir.

**Request:**
```bash
GET http://localhost:5000/api/ads/act_xxx_xxx
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "metaAdId": "act_xxx_xxx",
    "campaignId": "123456789",
    "adSetId": "987654321",
    "title": "Reklam Başlığı",
    "content": "Reklam içeriği",
    "link": "https://example.com",
    "mediaUrl": "https://example.com/image.jpg",
    "status": "ACTIVE",
    "targeting": {
      "ageMin": 18,
      "ageMax": 65,
      "genders": ["1", "2"],
      "locations": ["TR"]
    },
    "apiLogs": [...],
    "createdAt": "2025-01-XX..."
  }
}
```

## ➕ Reklam Oluşturma

### POST `/api/create-ad`
Yeni reklam oluşturur.

**Request:**
```bash
POST http://localhost:5000/api/create-ad
Content-Type: application/json

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

**Validation:**
- `campaignId`: Zorunlu
- `adSetId`: Zorunlu
- `title`: Zorunlu, max 40 karakter
- `content`: Zorunlu, max 125 karakter
- `link`: Zorunlu, geçerli URL
- `mediaUrl`: Opsiyonel

## ✏️ Reklam Güncelleme

### POST `/api/update-ad`
Mevcut reklamı günceller.

**Request:**
```bash
POST http://localhost:5000/api/update-ad
Content-Type: application/json

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

**Validation:**
- `adId`: Zorunlu
- Diğer alanlar opsiyonel

## ⏸️ Reklam Durdurma

### POST `/api/pause-ad`
Reklamı durdurur.

**Request:**
```bash
POST http://localhost:5000/api/pause-ad
Content-Type: application/json

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

## 🗑️ Reklam Silme

### POST `/api/delete-ad`
Reklamı siler.

**Request:**
```bash
POST http://localhost:5000/api/delete-ad
Content-Type: application/json

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

## ⚠️ Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 400 | Geçersiz istek (validation hatası) |
| 404 | Reklam bulunamadı |
| 500 | Sunucu hatası |

## 📝 Örnek Kullanım

### cURL Örnekleri

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Reklam Oluştur:**
```bash
curl -X POST http://localhost:5000/api/create-ad \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "123456789",
    "adSetId": "987654321",
    "title": "Test Reklamı",
    "content": "Bu bir test reklamıdır",
    "link": "https://tarvina.com"
  }'
```

**Reklamları Listele:**
```bash
curl http://localhost:5000/api/ads
```

## 🔍 Postman Collection

Postman için hazır collection dosyası: `docs/postman-collection.json`

## 📊 Response Format

Tüm API response'ları şu formatı takip eder:

```json
{
  "success": true/false,
  "message": "İnsan okunabilir mesaj",
  "data": {...},
  "error": "Hata detayı (opsiyonel)"
}
``` 