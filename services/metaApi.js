const axios = require('axios');
const fs = require('fs');
const path = require('path');

const config = require('../config/app');

class MetaApiService {
    constructor() {
        this.baseUrl = config.baseUrl;
        this.appId = config.metaAppId;
        this.appSecret = config.metaAppSecret;
        this.accessToken = config.metaAccessToken;
        this.adAccountId = config.metaAdAccountId;
        this.pageId = config.metaPageId;
        
        if (!this.accessToken || !this.adAccountId) {
            console.warn('⚠️ Meta API credentials eksik! .env dosyasını kontrol edin.');
        }
    }

    // Log dosyasına yazma
    logToFile(message, data = null) {
        const today = new Date().toISOString().split('T')[0];
        const logFile = path.join(config.logDir, `${today}.log`);
        const timestamp = new Date().toISOString();
        
        const logEntry = {
            timestamp,
            message,
            data
        };
        
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        console.log(`📝 [${timestamp}] ${message}`);
    }

    // Meta API'ye istek gönderme
    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const params = {
                access_token: this.accessToken
            };

            const config = {
                method,
                url,
                params,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && method !== 'GET') {
                config.data = data;
            }

            this.logToFile(`🌐 Meta API Request: ${method} ${endpoint}`, data);
            
            const response = await axios(config);
            
            this.logToFile(`✅ Meta API Response: ${method} ${endpoint}`, response.data);
            
            return response.data;
        } catch (error) {
            this.logToFile(`❌ Meta API Error: ${method} ${endpoint}`, {
                error: error.response?.data || error.message,
                status: error.response?.status
            });
            throw error;
        }
    }

    // Reklam oluşturma
    async createAd(adData) {
        const {
            campaignId,
            adSetId,
            title,
            content,
            link,
            mediaUrl
        } = adData;

        // Ad Creative oluştur
        const creativeData = {
            name: `Creative_${Date.now()}`,
            object_story_spec: {
                page_id: this.pageId, // Page ID kullan
                link_data: {
                    message: content,
                    link: link,
                    name: title,
                    ...(mediaUrl && { picture: mediaUrl })
                }
            }
        };

        try {
            // 1. Creative oluştur
            const creative = await this.makeRequest(
                `/${this.adAccountId}/adcreatives`,
                'POST',
                creativeData
            );

            // 2. Ad oluştur
            const adData = {
                name: title,
                adset_id: adSetId,
                creative: {
                    creative_id: creative.id
                },
                status: 'PAUSED' // Başlangıçta durdurulmuş
            };

            const ad = await this.makeRequest(
                `/${this.adAccountId}/ads`,
                'POST',
                adData
            );

            return {
                success: true,
                adId: ad.id,
                creativeId: creative.id,
                data: ad
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Reklam güncelleme
    async updateAd(adId, updateData) {
        try {
            const response = await this.makeRequest(
                `/${adId}`,
                'POST',
                updateData
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Reklam durdurma
    async pauseAd(adId) {
        try {
            const response = await this.makeRequest(
                `/${adId}`,
                'POST',
                { status: 'PAUSED' }
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Reklam silme
    async deleteAd(adId) {
        try {
            const response = await this.makeRequest(
                `/${adId}`,
                'DELETE'
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Reklam bilgilerini getirme
    async getAdInfo(adId) {
        try {
            const response = await this.makeRequest(
                `/${adId}`,
                'GET'
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Ad Account bilgilerini getirme
    async getAdAccountInfo() {
        try {
            const response = await this.makeRequest(
                `/${this.adAccountId}`,
                'GET'
            );

            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Campaign listesi getirme
    async getCampaigns() {
        try {
            const response = await this.makeRequest(
                `/${this.adAccountId}/campaigns`,
                'GET'
            );

            return {
                success: true,
                data: response.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Ad Set listesi getirme
    async getAdSets(campaignId) {
        try {
            const response = await this.makeRequest(
                `/${campaignId}/adsets`,
                'GET'
            );

            return {
                success: true,
                data: response.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
}

module.exports = new MetaApiService(); 