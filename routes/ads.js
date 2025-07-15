const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const metaApi = require('../services/metaApi');

// Tüm reklamları getir
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

// Aktif reklamları getir
router.get('/ads/active', async (req, res) => {
    try {
        const ads = await Ad.getActiveAds();
        res.json({
            success: true,
            data: ads,
            count: ads.length
        });
    } catch (error) {
        console.error('❌ Aktif reklam listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Aktif reklam listesi alınamadı'
        });
    }
});

// Reklam oluştur
router.post('/create-ad', async (req, res) => {
    try {
        const {
            campaignId,
            adSetId,
            title,
            content,
            link,
            mediaUrl
        } = req.body;

        // Validation
        if (!campaignId || !adSetId || !title || !content || !link) {
            return res.status(400).json({
                success: false,
                error: 'Eksik parametreler: campaignId, adSetId, title, content, link gerekli'
            });
        }

        console.log('🔄 Reklam oluşturuluyor...', { title, campaignId, adSetId });

        // Meta API'ye reklam oluşturma isteği
        const metaResult = await metaApi.createAd({
            campaignId,
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
            campaignId,
            adSetId,
            title,
            content,
            link,
            mediaUrl,
            status: 'PAUSED', // Başlangıçta durdurulmuş
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
                creativeId: metaResult.creativeId,
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
router.post('/update-ad', async (req, res) => {
    try {
        const { adId, title, content, link, mediaUrl } = req.body;

        if (!adId) {
            return res.status(400).json({
                success: false,
                error: 'adId gerekli'
            });
        }

        // MongoDB'den reklamı bul
        const ad = await Ad.findOne({ metaAdId: adId });
        if (!ad) {
            return res.status(404).json({
                success: false,
                error: 'Reklam bulunamadı'
            });
        }

        console.log('🔄 Reklam güncelleniyor...', { adId, title });

        // Meta API'ye güncelleme isteği
        const updateData = {};
        if (title) updateData.name = title;
        if (content) updateData.message = content;
        if (link) updateData.link = link;

        const metaResult = await metaApi.updateAd(adId, updateData);

        if (!metaResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Meta API hatası',
                details: metaResult.error
            });
        }

        // MongoDB'yi güncelle
        if (title) ad.title = title;
        if (content) ad.content = content;
        if (link) ad.link = link;
        if (mediaUrl) ad.mediaUrl = mediaUrl;

        await ad.save();
        await ad.addLog('UPDATE', metaResult.data, true);

        console.log('✅ Reklam başarıyla güncellendi:', adId);

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

// Reklam durdur
router.post('/pause-ad', async (req, res) => {
    try {
        const { adId } = req.body;

        if (!adId) {
            return res.status(400).json({
                success: false,
                error: 'adId gerekli'
            });
        }

        // MongoDB'den reklamı bul
        const ad = await Ad.findOne({ metaAdId: adId });
        if (!ad) {
            return res.status(404).json({
                success: false,
                error: 'Reklam bulunamadı'
            });
        }

        console.log('🔄 Reklam durduruluyor...', { adId });

        // Meta API'ye durdurma isteği
        const metaResult = await metaApi.pauseAd(adId);

        if (!metaResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Meta API hatası',
                details: metaResult.error
            });
        }

        // MongoDB'yi güncelle
        ad.status = 'PAUSED';
        await ad.save();
        await ad.addLog('PAUSE', metaResult.data, true);

        console.log('✅ Reklam başarıyla durduruldu:', adId);

        res.json({
            success: true,
            message: 'Reklam başarıyla durduruldu',
            data: metaResult.data
        });

    } catch (error) {
        console.error('❌ Reklam durdurma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Reklam durdurulamadı',
            details: error.message
        });
    }
});

// Reklam sil
router.post('/delete-ad', async (req, res) => {
    try {
        const { adId } = req.body;

        if (!adId) {
            return res.status(400).json({
                success: false,
                error: 'adId gerekli'
            });
        }

        // MongoDB'den reklamı bul
        const ad = await Ad.findOne({ metaAdId: adId });
        if (!ad) {
            return res.status(404).json({
                success: false,
                error: 'Reklam bulunamadı'
            });
        }

        console.log('🔄 Reklam siliniyor...', { adId });

        // Meta API'ye silme isteği
        const metaResult = await metaApi.deleteAd(adId);

        if (!metaResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Meta API hatası',
                details: metaResult.error
            });
        }

        // MongoDB'yi güncelle
        ad.status = 'DELETED';
        await ad.save();
        await ad.addLog('DELETE', metaResult.data, true);

        console.log('✅ Reklam başarıyla silindi:', adId);

        res.json({
            success: true,
            message: 'Reklam başarıyla silindi',
            data: metaResult.data
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

// Reklam detayları getir
router.get('/ads/:adId', async (req, res) => {
    try {
        const { adId } = req.params;

        const ad = await Ad.findOne({ metaAdId: adId });
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

// Meta API bilgileri
router.get('/meta-info', async (req, res) => {
    try {
        const accountInfo = await metaApi.getAdAccountInfo();
        const campaigns = await metaApi.getCampaigns();

        res.json({
            success: true,
            data: {
                account: accountInfo.success ? accountInfo.data : null,
                campaigns: campaigns.success ? campaigns.data : []
            }
        });

    } catch (error) {
        console.error('❌ Meta bilgi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Meta bilgileri alınamadı'
        });
    }
});

module.exports = router; 