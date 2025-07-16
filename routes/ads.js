const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const metaApi = require('../services/metaApi');

// Reklam listesi
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: ads,
      count: ads.length
    });
  } catch (error) {
    console.error('❌ Reklam listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam listesi alınamadı'
    });
  }
});

// Reklam seti reklamları
router.get('/ad-sets/:adSetId/ads', async (req, res) => {
  try {
    const { adSetId } = req.params;
    const ads = await Ad.find({ adSetId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: ads,
      count: ads.length
    });
  } catch (error) {
    console.error('❌ Reklam seti reklamları hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti reklamları alınamadı'
    });
  }
});

// Reklam detayı
router.get('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findOne({ metaAdId: id });
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Reklam bulunamadı'
      });
    }

    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('❌ Reklam detay hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam detayları alınamadı'
    });
  }
});

// Reklam oluştur
router.post('/ads', async (req, res) => {
  try {
    const { adSetId, title, content, link, mediaUrl } = req.body;

    // Validation
    if (!adSetId || !title || !content || !link) {
      return res.status(400).json({
        success: false,
        error: 'Eksik parametreler: adSetId, title, content, link gerekli'
      });
    }

    console.log('🔄 Reklam oluşturuluyor...', { title, adSetId });

    // Meta API'ye reklam oluşturma isteği
    const metaResult = await metaApi.createAd({
      adSetId,
      title,
      content,
      link,
      mediaUrl
    });

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'ye kaydet
    const ad = new Ad({
      metaAdId: metaResult.adId,
      adSetId,
      title,
      content,
      link,
      mediaUrl,
      status: 'PAUSED',
      metaResponse: metaResult.data
    });

    await ad.save();
    await ad.addLog('CREATE', metaResult.data, true);

    console.log('✅ Reklam başarıyla oluşturuldu:', metaResult.adId);

    res.json({
      success: true,
      message: 'Reklam başarıyla oluşturuldu',
      data: {
        adId: metaResult.adId,
        status: 'PAUSED'
      }
    });

  } catch (error) {
    console.error('❌ Reklam oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam oluşturulamadı',
      details: error.message
    });
  }
});

// Reklam güncelle
router.put('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ad = await Ad.findOne({ metaAdId: id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Reklam bulunamadı'
      });
    }

    console.log('🔄 Reklam güncelleniyor...', { id, updateData });

    // Meta API'ye güncelleme isteği
    const metaResult = await metaApi.updateAd(id, updateData);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    Object.assign(ad, updateData);
    await ad.save();
    await ad.addLog('UPDATE', metaResult.data, true);

    console.log('✅ Reklam başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Reklam başarıyla güncellendi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Reklam güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam güncellenemedi',
      details: error.message
    });
  }
});

// Reklam durdur/başlat
router.patch('/ads/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ad = await Ad.findOne({ metaAdId: id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Reklam bulunamadı'
      });
    }

    console.log('🔄 Reklam durumu güncelleniyor...', { id, status });

    // Meta API'ye durum güncelleme isteği
    const metaResult = await metaApi.updateAdStatus(id, status);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    ad.status = status;
    await ad.save();
    await ad.addLog('STATUS_UPDATE', { status }, true);

    console.log('✅ Reklam durumu başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Reklam durumu başarıyla güncellendi',
      data: { status }
    });

  } catch (error) {
    console.error('❌ Reklam durumu güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam durumu güncellenemedi',
      details: error.message
    });
  }
});

// Reklam sil
router.delete('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findOne({ metaAdId: id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Reklam bulunamadı'
      });
    }

    console.log('🔄 Reklam siliniyor...', { id });

    // Meta API'ye silme isteği
    const metaResult = await metaApi.deleteAd(id);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'den sil
    await ad.remove();
    await ad.addLog('DELETE', {}, true);

    console.log('✅ Reklam başarıyla silindi:', id);

    res.json({
      success: true,
      message: 'Reklam başarıyla silindi'
    });

  } catch (error) {
    console.error('❌ Reklam silme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam silinemedi',
      details: error.message
    });
  }
});

module.exports = router; 