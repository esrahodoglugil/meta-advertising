# 🗄️ Database Schema Dokümantasyonu

Bu dokümanda MongoDB veritabanı yapısı ve Ad modeli detaylı olarak açıklanmıştır.

## 📊 Veritabanı Yapısı

### Database: `meta-reklam`
- **Bağlantı:** `mongodb://localhost:27017/meta-reklam`
- **Collection:** `ads`

## 📋 Ad Model Schema

### Ana Alanlar

```javascript
{
  // Meta API'den gelen veriler
  metaAdId: String,        // Meta'dan gelen reklam ID'si
  campaignId: String,       // Kampanya ID'si
  adSetId: String,         // Ad Set ID'si
  
  // Reklam içeriği
  title: String,           // Reklam başlığı (max 40 karakter)
  content: String,         // Reklam içeriği (max 125 karakter)
  link: String,            // Hedef URL
  mediaUrl: String,        // Medya URL'si (opsiyonel)
  
  // Reklam durumu
  status: String,          // ACTIVE, PAUSED, DELETED, PENDING
  
  // Hedef kitle ayarları
  targeting: {
    ageMin: Number,        // Minimum yaş (default: 18)
    ageMax: Number,        // Maksimum yaş (default: 65)
    genders: [String],     // Cinsiyet (1: Erkek, 2: Kadın)
    locations: [String],   // Lokasyonlar (TR: Türkiye)
    interests: [String]    // İlgi alanları
  },
  
  // API çağrı logları
  apiLogs: [{
    action: String,        // CREATE, UPDATE, PAUSE, DELETE
    timestamp: Date,       // İşlem zamanı
    response: Mixed,       // API response'u
    success: Boolean       // İşlem başarısı
  }],
  
  // Meta API response
  metaResponse: Mixed,     // Meta'dan gelen tam response
  
  // Timestamps
  createdAt: Date,         // Oluşturulma zamanı
  updatedAt: Date          // Güncellenme zamanı
}
```

## 🔍 Index'ler

### Performans İyileştirmeleri

```javascript
// Meta Ad ID index'i (unique)
adSchema.index({ metaAdId: 1 });

// Status index'i (sorgu optimizasyonu)
adSchema.index({ status: 1 });

// Tarih index'i (sıralama için)
adSchema.index({ createdAt: -1 });

// Compound index (status + date)
adSchema.index({ status: 1, createdAt: -1 });
```

## 📊 Veri Tipleri

### String Alanlar
- `metaAdId`: Meta'dan gelen benzersiz ID
- `campaignId`: Kampanya referansı
- `adSetId`: Ad Set referansı
- `title`: Reklam başlığı (max 40 karakter)
- `content`: Reklam metni (max 125 karakter)
- `link`: Hedef URL
- `mediaUrl`: Medya dosyası URL'si

### Number Alanlar
- `targeting.ageMin`: Minimum yaş (18-65)
- `targeting.ageMax`: Maksimum yaş (18-65)

### Array Alanlar
- `targeting.genders`: Cinsiyet kodları ["1", "2"]
- `targeting.locations`: Ülke kodları ["TR"]
- `targeting.interests`: İlgi alanları
- `apiLogs`: API çağrı geçmişi

### Enum Değerler
```javascript
status: {
  type: String,
  enum: ['ACTIVE', 'PAUSED', 'DELETED', 'PENDING'],
  default: 'PENDING'
}
```

## 🔧 Model Metodları

### Instance Methods

#### addLog(action, response, success)
API çağrısı logunu ekler.

```javascript
await ad.addLog('CREATE', metaResult.data, true);
```

### Static Methods

#### getActiveAds()
Aktif reklamları getirir.

```javascript
const activeAds = await Ad.getActiveAds();
```

#### getPausedAds()
Durdurulmuş reklamları getirir.

```javascript
const pausedAds = await Ad.getPausedAds();
```

### Virtual Fields

#### age
Reklamın yaşını gün cinsinden hesaplar.

```javascript
adSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});
```

## 📈 Örnek Veri Yapısı

### Yeni Reklam Oluşturma

```javascript
const newAd = new Ad({
  metaAdId: "act_123456789_987654321",
  campaignId: "123456789",
  adSetId: "987654321",
  title: "Test Reklamı",
  content: "Bu bir test reklamıdır",
  link: "https://tarvina.com",
  mediaUrl: "https://example.com/image.jpg",
  status: "PAUSED",
  targeting: {
    ageMin: 18,
    ageMax: 65,
    genders: ["1", "2"],
    locations: ["TR"],
    interests: []
  },
  metaResponse: {
    id: "act_123456789_987654321",
    status: "PAUSED"
  }
});
```

### API Log Örneği

```javascript
{
  action: "CREATE",
  timestamp: "2025-01-XX...",
  response: {
    id: "act_123456789_987654321",
    status: "PAUSED"
  },
  success: true
}
```

## 🔍 Sorgu Örnekleri

### Tüm Reklamları Getir
```javascript
const ads = await Ad.find().sort({ createdAt: -1 });
```

### Aktif Reklamları Getir
```javascript
const activeAds = await Ad.find({ status: 'ACTIVE' });
```

### Belirli Kampanyadaki Reklamlar
```javascript
const campaignAds = await Ad.find({ campaignId: '123456789' });
```

### Son 7 Günün Reklamları
```javascript
const recentAds = await Ad.find({
  createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});
```

### Başarısız API Çağrıları
```javascript
const failedCalls = await Ad.find({
  'apiLogs.success': false
});
```

## 🛠️ Database İşlemleri

### Bağlantı Kontrolü
```javascript
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB bağlantısı başarılı');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB bağlantı hatası:', err);
});
```

### Veri Doğrulama
```javascript
// Title uzunluğu kontrolü
adSchema.path('title').validate(function(value) {
  return value.length <= 40;
}, 'Başlık 40 karakterden uzun olamaz');

// Link formatı kontrolü
adSchema.path('link').validate(function(value) {
  return /^https?:\/\/.+/.test(value);
}, 'Geçerli bir URL giriniz');
```

## 📊 Performans Optimizasyonları

### Index Stratejisi
1. **Primary Index:** `metaAdId` (unique)
2. **Query Index:** `status` (sık sorgulanan)
3. **Sort Index:** `createdAt` (tarih sıralaması)
4. **Compound Index:** `status + createdAt` (filtreleme + sıralama)

### Aggregation Pipeline
```javascript
// Reklam istatistikleri
const stats = await Ad.aggregate([
  { $group: {
    _id: '$status',
    count: { $sum: 1 },
    totalAge: { $sum: '$age' }
  }},
  { $project: {
    status: '$_id',
    count: 1,
    avgAge: { $divide: ['$totalAge', '$count'] }
  }}
]);
```

## 🔒 Güvenlik

### Veri Doğrulama
- Input validation (Mongoose schema)
- XSS koruması (content sanitization)
- SQL injection koruması (MongoDB ODM)

### Erişim Kontrolü
- Environment variables kullanımı
- Log dosyalarında hassas veri gizleme
- API rate limiting

## 📈 Monitoring

### Log Sistemi
```javascript
// API çağrı logları
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

### Health Check
```javascript
// Database bağlantı kontrolü
mongoose.connection.readyState === 1
```

## 🔄 Migration

### Schema Güncellemeleri
```javascript
// Yeni alan ekleme
adSchema.add({
  newField: { type: String, default: '' }
});
```

### Veri Migrasyonu
```javascript
// Toplu güncelleme
await Ad.updateMany(
  { status: 'OLD_STATUS' },
  { $set: { status: 'NEW_STATUS' } }
);
``` 