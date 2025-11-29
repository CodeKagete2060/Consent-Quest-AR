const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  // Threat identification
  threatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Threat details
  type: {
    type: String,
    required: true,
    enum: ['romance_fraud', 'job_scam', 'momo_reversal', 'harassment', 'identity_theft', 'phishing', 'other']
  },

  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  description: {
    type: String,
    required: true,
    maxlength: 1000
  },

  risk: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },

  // Location and scope
  location: {
    type: String,
    required: true,
    maxlength: 100
  },

  country: {
    type: String,
    enum: ['Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Uganda', 'Tanzania', 'Zimbabwe', 'Botswana']
  },

  // AI analysis
  aiAnalysis: {
    type: String,
    maxlength: 500
  },

  // Impact metrics
  affectedUsers: {
    type: Number,
    default: 0,
    min: 0
  },

  reportedCases: {
    type: Number,
    default: 0,
    min: 0
  },

  // Status and lifecycle
  status: {
    type: String,
    enum: ['active', 'monitoring', 'resolved', 'archived'],
    default: 'active'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // Source information
  source: {
    type: String,
    enum: ['user_report', 'ai_detection', 'official_report', 'crowdsourced'],
    default: 'user_report'
  },

  // User interactions
  viewedBy: [{
    userId: String,
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],

  reportedBy: [{
    userId: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    anonymous: {
      type: Boolean,
      default: true
    }
  }],

  // Timestamps
  firstReported: {
    type: Date,
    default: Date.now
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  resolvedAt: Date
});

// Indexes
threatSchema.index({ type: 1, risk: 1 });
threatSchema.index({ country: 1, status: 1 });
threatSchema.index({ firstReported: -1 });
threatSchema.index({ risk: 1, status: 1 });

// Pre-save middleware to update lastUpdated
threatSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance methods
threatSchema.methods.markAsRead = function(userId) {
  const existingView = this.viewedBy.find(view => view.userId === userId);
  if (!existingView) {
    this.viewedBy.push({ userId, viewedAt: new Date() });
  }
  return this.save();
};

threatSchema.methods.addReport = function(userId, anonymous = true) {
  this.reportedBy.push({
    userId: anonymous ? null : userId,
    reportedAt: new Date(),
    anonymous
  });
  this.reportedCases += 1;
  return this.save();
};

// Static methods
threatSchema.statics.getActiveThreats = function(country = null) {
  const query = { status: 'active' };
  if (country) query.country = country;
  return this.find(query).sort({ risk: -1, firstReported: -1 });
};

threatSchema.statics.getThreatsByRisk = function(riskLevel) {
  return this.find({ risk: riskLevel, status: 'active' }).sort({ firstReported: -1 });
};

module.exports = mongoose.model('Threat', threatSchema);