const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    // Meta API'den gelen veriler
    metaAdId: {
        type: String,
        required: true,
        unique: true
    },
    campaignId: {
        type: String,
        required: true
    },
    adSetId: {
        type: String,
        required: true
    },
    
    // Reklam içeriği
    title: {
        type: String,
        required: true,
        maxlength: 40
    },
    content: {
        type: String,
        required: true,
        maxlength: 125
    },
    link: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        required: false
    },
    
    // Reklam durumu
    status: {
        type: String,
        enum: ['ACTIVE', 'PAUSED', 'DELETED', 'PENDING'],
        default: 'PENDING'
    },
    
    // Hedef kitle ayarları (sabit değerler)
    targeting: {
        ageMin: { type: Number, default: 18 },
        ageMax: { type: Number, default: 65 },
        genders: { type: [String], default: ['1', '2'] }, // 1: Erkek, 2: Kadın
        locations: { type: [String], default: ['TR'] }, // Türkiye
        interests: { type: [String], default: [] }
    },
    
    // API çağrı logları
    apiLogs: [{
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        response: { type: mongoose.Schema.Types.Mixed },
        success: { type: Boolean, default: false }
    }],
    
    // Meta API response
    metaResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index'ler
adSchema.index({ status: 1 });
adSchema.index({ createdAt: -1 });

// Virtual field - reklam yaşı
adSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Instance method - log ekleme
adSchema.methods.addLog = function(action, response, success = true) {
    this.apiLogs.push({
        action,
        response,
        success,
        timestamp: new Date()
    });
    return this.save();
};

// Static method - aktif reklamları getir
adSchema.statics.getActiveAds = function() {
    return this.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
};

// Static method - durdurulmuş reklamları getir
adSchema.statics.getPausedAds = function() {
    return this.find({ status: 'PAUSED' }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Ad', adSchema); 