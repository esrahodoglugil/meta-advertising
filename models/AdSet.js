const mongoose = require('mongoose');

const adSetSchema = new mongoose.Schema({
  // Meta API'den gelen veriler
  metaAdSetId: {
    type: String,
    required: true,
    unique: true
  },
  campaignId: {
    type: String,
    required: true
  },
  
  // Reklam seti bilgileri
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'DRAFT'
  },
  
  // Bütçe ve teklif
  budget: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'TRY' },
    type: { type: String, enum: ['DAILY', 'LIFETIME'], default: 'DAILY' }
  },
  bidStrategy: {
    type: String,
    enum: ['LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'COST_CAP'],
    default: 'LOWEST_COST_WITHOUT_CAP'
  },
  
  // Hedef kitle
  targeting: {
    ageMin: { type: Number, default: 18 },
    ageMax: { type: Number, default: 65 },
    genders: [{ type: String, enum: ['1', '2'] }], // 1: Erkek, 2: Kadın
    locations: [{ type: String, default: 'TR' }],
    interests: [{ type: String }],
    behaviors: [{ type: String }]
  },
  
  // Optimizasyon
  optimizationGoal: {
    type: String,
    enum: ['REACH', 'LINK_CLICKS', 'CONVERSIONS', 'ENGAGEMENT'],
    required: true
  },
  
  // Meta API response
  metaResponse: { type: mongoose.Schema.Types.Mixed },
  
  // Log'lar
  logs: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    response: { type: mongoose.Schema.Types.Mixed },
    success: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Instance method - log ekleme
adSetSchema.methods.addLog = function(action, response, success) {
  this.logs.push({ action, response, success });
  return this.save();
};

module.exports = mongoose.model('AdSet', adSetSchema); 