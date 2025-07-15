# 🔧 Meta API Kurulum Rehberi

Bu dokümanda Meta Graph API entegrasyonu için gerekli tüm adımlar detaylı olarak açıklanmıştır.

## 📋 Gereksinimler

- Meta Developer hesabı
- Facebook Business hesabı
- Ad Account erişimi
- Facebook Page (reklamlar için)

## 🚀 Adım Adım Kurulum

### 1. Meta Developer Portal'a Erişim

1. [developers.facebook.com](https://developers.facebook.com) adresine git
2. Facebook hesabınla giriş yap
3. Mevcut app'ini seç veya yeni app oluştur

### 2. App Bilgilerini Alma

#### App ID
- **Konum:** App Dashboard → Basic Settings
- **Değer:** `1881023722741111` (mevcut app'in)

#### App Secret
1. **Konum:** App Dashboard → App Settings → Basic
2. **Adım:** "App Secret" yanındaki "Show" butonuna tıkla
3. **Güvenlik:** Kopyaladıktan sonra "Reset" ile yeni secret oluştur

### 3. Marketing API Ekleme

1. **Konum:** Sol menü → Products
2. **Adım:** "Add Product" tıkla
3. **Seçim:** "Marketing API" veya "Facebook Login for Business" ara
4. **Kurulum:** "Set Up" butonuna tıkla

#### Gerekli İzinler
```
ads_management     - Reklam yönetimi
ads_read          - Reklam okuma
business_management - İş hesabı yönetimi
pages_read_engagement - Sayfa etkileşimi okuma
```

### 4. Access Token Alma

#### Graph API Explorer Kullanımı
1. **Konum:** Meta Developer Portal → Tools → Graph API Explorer
2. **Adım:** Sağ üstte "Generate Access Token" tıkla
3. **İzinler:** Gerekli izinleri seç
4. **Oluştur:** "Generate Access Token" tıkla
5. **Kopyala:** Token'ı güvenli yere kaydet

#### Token Türleri
- **User Access Token:** Kullanıcı bazlı (kısa süreli)
- **Page Access Token:** Sayfa bazlı
- **App Access Token:** Uygulama bazlı

### 5. Ad Account ID Alma

#### Graph API Explorer ile
1. **Endpoint:** `/me/adaccounts`
2. **Method:** GET
3. **Execute:** "Submit" butonuna tıkla
4. **Response:** `act_` ile başlayan ID'yi al

#### Response Örneği
```json
{
  "data": [
    {
      "account_id": "308845109701111",
      "id": "act_308845109701111",
      "name": "Ad Account Name"
    }
  ]
}
```

### 6. Page ID Alma

#### Graph API Explorer ile
1. **Endpoint:** `/me/accounts`
2. **Method:** GET
3. **Execute:** "Submit" butonuna tıkla
4. **Response:** `id` değerini al

#### Response Örneği
```json
{
  "data": [
    {
      "access_token": "...",
      "category": "Pazarlama Ajansı",
      "name": "Tarvina",
      "id": "482045731647111"
    }
  ]
}
```

## 🔧 Environment Variables

### .env Dosyası Oluşturma

```env
# Meta API Configuration
META_APP_ID=1881023722744172
META_APP_SECRET=your_app_secret_here
META_ACCESS_TOKEN=your_access_token_here
META_AD_ACCOUNT_ID=act_308845109701739
META_PAGE_ID=482045731647959
```

### Değerleri Doldurma

1. **App Secret:** App Settings → Basic → Show
2. **Access Token:** Graph API Explorer → Generate Access Token
3. **Ad Account ID:** `/me/adaccounts` sorgusu
4. **Page ID:** `/me/accounts` sorgusu

## 🔍 Test ve Doğrulama

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Meta Info Test
```bash
curl http://localhost:5000/api/meta-info
```

### 3. Ad Account Test
```bash
curl http://localhost:5000/api/meta-info
```

## ⚠️ Güvenlik Önlemleri

### Access Token Güvenliği
- Token'ları asla public repo'ya commit etme
- Token'ları düzenli olarak yenile
- Production'da environment variables kullan

### App Secret Güvenliği
- App Secret'ı sadece backend'de kullan
- Düzenli olarak reset et
- Log dosyalarında gizle

## 🔄 Token Yenileme

### User Access Token
- **Süre:** 60 gün
- **Yenileme:** Graph API Explorer'dan yeni token al

### Page Access Token
- **Süre:** Uzun süreli
- **Yenileme:** `/me/accounts` ile yeni token al

## 📊 API Limitleri

### Rate Limits
- **User Level:** 200 calls/hour
- **App Level:** 100 calls/hour
- **Ad Account Level:** 1000 calls/hour

### Monitoring
```bash
# Log dosyalarını kontrol et
tail -f logs/$(date +%Y-%m-%d).log
```

## 🛠️ Troubleshooting

### Yaygın Hatalar

#### 1. "Invalid Access Token"
- Token'ın geçerli olduğunu kontrol et
- Gerekli izinlerin verildiğini doğrula

#### 2. "Ad Account Not Found"
- Ad Account ID'nin doğru olduğunu kontrol et
- Hesabın aktif olduğunu doğrula

#### 3. "Page Not Found"
- Page ID'nin doğru olduğunu kontrol et
- Sayfanın public olduğunu doğrula

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
- [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens)
- [App Review](https://developers.facebook.com/docs/app-review)
- [Business Manager](https://business.facebook.com)

## 🔄 Güncelleme Süreci

### App Review
- Production'a geçmeden önce App Review gerekli
- Gerekli izinler için review başvurusu yap

### Live Mode
- Development modundan Live moda geç
- App Review onayından sonra

### Webhook Setup
- Production için webhook kurulumu gerekli
- SSL sertifikası zorunlu 