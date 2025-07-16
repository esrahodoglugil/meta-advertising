const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  // Meta API ID'leri
  metaAdId: {
    type: String,
    required: true,
    unique: true
  },
  metaCreativeId: {
    type: String,
    required: false
  },
  
  // İlişkiler
  adSetId: {
    type: String,
    required: true
  },
  campaignId: {
    type: String,
    required: false
  },
  
  // Reklam içeriği
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    required: false
  },
  
  // Durum
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'DELETED', 'DRAFT'],
    default: 'PAUSED'
  },
  
  // Meta API yanıtı
  metaResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Loglar
  logs: [{
    action: {
      type: String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    success: {
      type: Boolean,
      default: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Log ekleme metodu
adSchema.methods.addLog = function(action, data, success = true) {
  this.logs.push({
    action,
    data,
    success,
    timestamp: new Date()
  });
  
  // Son 50 logu tut
  if (this.logs.length > 50) {
    this.logs = this.logs.slice(-50);
  }
  
  return this.save();
};

// Update hook
adSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
adSchema.index({ adSetId: 1 });
adSchema.index({ status: 1 });
adSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ad', adSchema); 