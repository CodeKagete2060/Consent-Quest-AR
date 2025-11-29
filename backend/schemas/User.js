const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  // Basic user identification
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Profile information
  ageRange: {
    type: String,
    enum: ['13-17', '18-24', '25-34', '35+'],
    required: true
  },

  interests: [{
    type: String,
    enum: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Mobile Money', 'Online Dating', 'Job Search', 'Social Media']
  }],

  country: {
    type: String,
    enum: ['Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Uganda', 'Tanzania', 'Zimbabwe', 'Botswana'],
    required: true
  },

  // Safety metrics
  safetyScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },

  // Progress tracking
  completedQuests: [{
    questId: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],

  badges: [{
    badgeId: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],

  totalXP: {
    type: Number,
    default: 0
  },

  // Threat interactions
  reportedThreats: [{
    threatId: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    category: String,
    description: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending'
    }
  }],

  // AI interactions
  aiScans: [{
    scanId: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    analysis: String
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  lastActive: {
    type: Date,
    default: Date.now
  },

  // Privacy settings
  anonymousReporting: {
    type: Boolean,
    default: true
  },

  dataSharing: {
    type: Boolean,
    default: false
  }
});

// Indexes for performance
userProfileSchema.index({ country: 1, ageRange: 1 });
userProfileSchema.index({ lastActive: -1 });
userProfileSchema.index({ safetyScore: -1 });

// Virtual for level calculation
userProfileSchema.virtual('level').get(function() {
  return Math.floor(this.totalXP / 100) + 1;
});

// Instance method to update safety score
userProfileSchema.methods.updateSafetyScore = function(newScore) {
  this.safetyScore = Math.max(0, Math.min(100, newScore));
  return this.save();
};

// Static method to get users by country
userProfileSchema.statics.getUsersByCountry = function(country) {
  return this.find({ country }).sort({ safetyScore: -1 });
};

module.exports = mongoose.model('UserProfile', userProfileSchema);