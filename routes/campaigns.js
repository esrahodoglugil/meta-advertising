const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const metaApi = require('../services/metaApi');

// Kampanya listesi
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: campaigns,
      count: campaigns.length
    });
  } catch (error) {
    console.error('❌ Kampanya listesi hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya listesi alınamadı'
    });
  }
});

// Kampanya detayı
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({ metaCampaignId: id });
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Kampanya bulunamadı'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('❌ Kampanya detay hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya detayları alınamadı'
    });
  }
});

// Kampanya oluştur
router.post('/campaigns', async (req, res) => {
  try {
    const { name, objective, budget, startDate, endDate } = req.body;

    // Validation
    if (!name || !objective || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Eksik parametreler: name, objective, budget gerekli'
      });
    }

    console.log('🔄 Kampanya oluşturuluyor...', { name, objective, budget });

    // Meta API'ye kampanya oluşturma isteği
    const metaResult = await metaApi.createCampaign({
      name,
      objective,
      budget,
      startDate,
      endDate
    });

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'ye kaydet
    const campaign = new Campaign({
      metaCampaignId: metaResult.campaignId,
      name,
      objective,
      budget,
      startDate,
      endDate,
      status: 'DRAFT',
      metaResponse: metaResult.data
    });

    await campaign.save();
    await campaign.addLog('CREATE', metaResult.data, true);

    console.log('✅ Kampanya başarıyla oluşturuldu:', metaResult.campaignId);

    res.json({
      success: true,
      message: 'Kampanya başarıyla oluşturuldu',
      data: {
        campaignId: metaResult.campaignId,
        status: 'DRAFT'
      }
    });

  } catch (error) {
    console.error('❌ Kampanya oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya oluşturulamadı',
      details: error.message
    });
  }
});

// Kampanya güncelle
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const campaign = await Campaign.findOne({ metaCampaignId: id });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Kampanya bulunamadı'
      });
    }

    console.log('🔄 Kampanya güncelleniyor...', { id, updateData });

    // Meta API'ye güncelleme isteği
    const metaResult = await metaApi.updateCampaign(id, updateData);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    Object.assign(campaign, updateData);
    await campaign.save();
    await campaign.addLog('UPDATE', metaResult.data, true);

    console.log('✅ Kampanya başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Kampanya başarıyla güncellendi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Kampanya güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya güncellenemedi',
      details: error.message
    });
  }
});

// Kampanya durdur/başlat
router.patch('/campaigns/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const campaign = await Campaign.findOne({ metaCampaignId: id });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Kampanya bulunamadı'
      });
    }

    console.log('🔄 Kampanya durumu güncelleniyor...', { id, status });

    // Meta API'ye durum güncelleme isteği
    const metaResult = await metaApi.updateCampaignStatus(id, status);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    campaign.status = status;
    await campaign.save();
    await campaign.addLog('STATUS_UPDATE', metaResult.data, true);

    console.log('✅ Kampanya durumu başarıyla güncellendi:', id);

    res.json({
      success: true,
      message: 'Kampanya durumu başarıyla güncellendi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Kampanya durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya durumu güncellenemedi',
      details: error.message
    });
  }
});

// Kampanya sil
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findOne({ metaCampaignId: id });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Kampanya bulunamadı'
      });
    }

    console.log('🔄 Kampanya siliniyor...', { id });

    // Meta API'ye silme isteği
    const metaResult = await metaApi.deleteCampaign(id);

    if (!metaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Meta API hatası',
        details: metaResult.error
      });
    }

    // MongoDB'yi güncelle
    campaign.status = 'DELETED';
    await campaign.save();
    await campaign.addLog('DELETE', metaResult.data, true);

    console.log('✅ Kampanya başarıyla silindi:', id);

    res.json({
      success: true,
      message: 'Kampanya başarıyla silindi',
      data: metaResult.data
    });

  } catch (error) {
    console.error('❌ Kampanya silme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Kampanya silinemedi',
      details: error.message
    });
  }
});

module.exports = router; 