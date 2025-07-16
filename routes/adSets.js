const express = require('express');
const router = express.Router();
const AdSet = require('../models/AdSet');
const metaApi = require('../services/metaApi');

// Reklam seti listesi
router.get('/ad-sets', async (req, res) => {
  try {
    const adSets = await AdSet.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: adSets,
      count: adSets.length
    });
  } catch (error) {
    console.error('❌ Reklam seti listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti listesi alınamadı'
    });
  }
});

// Kampanya reklam setleri
router.get('/campaigns/:campaignId/ad-sets', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const adSets = await AdSet.find({ campaignId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: adSets,
      count: adSets.length
    });
  } catch (error) {
    console.error('❌ Kampanya reklam setleri hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya reklam setleri alınamadı'
    });
  }
});

// Reklam seti detayı
router.get('/ad-sets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const adSet = await AdSet.findOne({ metaAdSetId: id });
    
    if (!adSet) {
      return res.status(404).json({
        success: false,
        error: 'Reklam seti bulunamadı'
      });
    }

    res.json({
      success: true,
      data: adSet
    });
  } catch (error) {
    console.error('❌ Reklam seti detay hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti detayları alınamadı'
    });
  }
});

// Reklam seti oluştur
router.post('/ad-sets', async (req, res) => {
  try {
    const { campaignId, name, budget, targeting, optimizationGoal } = req.body;

    // Validation
    if (!campaignId || !name || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Eksik parametreler: campaignId, name, budget gerekli'
      });
    }

    console.log('🔄 Reklam seti oluşturuluyor...', { name, campaignId, budget });

    // Meta API'ye reklam seti oluşturma isteği
    const metaResult = await metaApi.createAdSet({
      campaignId,
      name,
      dailyBudget: budget.amount || budget,
      targeting,
      optimizationGoal
    });

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'ye kaydet
    const adSet = new AdSet({
      metaAdSetId: metaResult.adSetId,
      campaignId,
      name,
      budget,
      targeting,
      optimizationGoal,
      status: 'DRAFT',
      metaResponse: metaResult.data
    });

    await adSet.save();
    await adSet.addLog('CREATE', metaResult.data, true);

    console.log('✅ Reklam seti başarıyla oluşturuldu:', metaResult.adSetId);

    res.json({
      success: true,
      message: 'Reklam seti başarıyla oluşturuldu',
      data: {
        adSetId: metaResult.adSetId,
        status: 'DRAFT'
      }
    });

  } catch (error) {
    console.error('❌ Reklam seti oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti oluşturulamadı',
      details: error.message
    });
  }
});

// Reklam seti güncelle
router.put('/ad-sets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const adSet = await AdSet.findOne({ metaAdSetId: id });
    if (!adSet) {
      return res.status(404).json({
        success: false,
        error: 'Reklam seti bulunamadı'
      });
    }

    console.log('🔄 Reklam seti güncelleniyor...', { id, updateData });

    // Meta API'ye güncelleme isteği
    const metaResult = await metaApi.updateAdSet(id, updateData);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    Object.assign(adSet, updateData);
    await adSet.save();
    await adSet.addLog('UPDATE', metaResult.data, true);

    console.log('✅ Reklam seti başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Reklam seti başarıyla güncellendi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Reklam seti güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti güncellenemedi',
      details: error.message
    });
  }
});

// Reklam seti durdur/başlat
router.patch('/ad-sets/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const adSet = await AdSet.findOne({ metaAdSetId: id });
    if (!adSet) {
      return res.status(404).json({
        success: false,
        error: 'Reklam seti bulunamadı'
      });
    }

    console.log('🔄 Reklam seti durumu güncelleniyor...', { id, status });

    // Meta API'ye durum güncelleme isteği
    const metaResult = await metaApi.updateAdSetStatus(id, status);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    adSet.status = status;
    await adSet.save();
    await adSet.addLog('STATUS_UPDATE', metaResult.data, true);

    console.log('✅ Reklam seti durumu başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Reklam seti durumu başarıyla güncellendi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Reklam seti durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Reklam seti durumu güncellenemedi',
      details: error.message
    });
  }
});

module.exports = router; 