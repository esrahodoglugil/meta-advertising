const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  // Meta API'den gelen veriler
  metaCampaignId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Kampanya bilgileri
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  objective: {
    type: String,
    enum: ['OUTCOME_AWARENESS', 'OUTCOME_TRAFFIC', 'OUTCOME_ENGAGEMENT', 'OUTCOME_LEADS', 'OUTCOME_SALES', 'OUTCOME_APP_PROMOTION'],
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'DRAFT'
  },
  
  // Bütçe ayarları
  budget: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'TRY' },
    type: { type: String, enum: ['DAILY', 'LIFETIME'], default: 'DAILY' }
  },
  
  // Tarih ayarları
  startDate: { type: Date },
  endDate: { type: Date },
  
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
campaignSchema.methods.addLog = function(action, response, success) {
  this.logs.push({ action, response, success });
  return this.save();
};

module.exports = mongoose.model('Campaign', campaignSchema); 