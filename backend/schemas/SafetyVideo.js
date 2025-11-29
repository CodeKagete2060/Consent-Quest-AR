const mongoose = require('mongoose');

const safetyVideoSchema = new mongoose.Schema({
  // Video identification
  videoId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Video details
  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  scenario: {
    type: String,
    required: true,
    maxlength: 500
  },

  script: {
    type: String,
    required: true,
    maxlength: 5000
  },

  duration: {
    type: Number, // in seconds
    required: true,
    min: 1,
    max: 300 // 5 minutes max
  },

  // AI generation details
  generatedBy: {
    type: String,
    enum: ['gemini', 'manual', 'other'],
    default: 'gemini'
  },

  prompt: {
    type: String,
    maxlength: 1000
  },

  // Content metadata
  category: {
    type: String,
    enum: ['romance_fraud', 'job_scams', 'online_harassment', 'identity_theft', 'general_safety', 'other']
  },

  targetAudience: {
    ageRange: {
      type: String,
      enum: ['13-17', '18-24', '25-34', '35+']
    },
    interests: [String]
  },

  // Usage statistics
  views: {
    type: Number,
    default: 0,
    min: 0
  },

  likes: {
    type: Number,
    default: 0,
    min: 0
  },

  shares: {
    type: Number,
    default: 0,
    min: 0
  },

  // User interactions
  viewedBy: [{
    userId: String,
    viewedAt: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],

  // Content moderation
  isApproved: {
    type: Boolean,
    default: true
  },

  approvedBy: String,
  approvedAt: Date,

  // Video file storage (if using actual video files)
  videoUrl: String,
  thumbnailUrl: String,

  // Tags and keywords
  tags: [String],

  // Language support
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'sw', 'fr', 'pt', 'other']
  },

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

// Indexes
safetyVideoSchema.index({ category: 1, createdAt: -1 });
safetyVideoSchema.index({ 'targetAudience.ageRange': 1 });
safetyVideoSchema.index({ views: -1 });
safetyVideoSchema.index({ createdAt: -1 });

// Pre-save middleware
safetyVideoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
safetyVideoSchema.methods.recordView = function(userId, completed = false) {
  const existingView = this.viewedBy.find(view => view.userId === userId);
  if (!existingView) {
    this.viewedBy.push({ userId, viewedAt: new Date(), completed });
    this.views += 1;
  } else if (completed && !existingView.completed) {
    existingView.completed = true;
  }
  return this.save();
};

safetyVideoSchema.methods.addLike = function(userId) {
  // In a real implementation, you'd track who liked it
  this.likes += 1;
  return this.save();
};

// Static methods
safetyVideoSchema.statics.getPopularVideos = function(limit = 10) {
  return this.find({ isApproved: true }).sort({ views: -1 }).limit(limit);
};

safetyVideoSchema.statics.getVideosByCategory = function(category, limit = 20) {
  return this.find({ category, isApproved: true }).sort({ createdAt: -1 }).limit(limit);
};

safetyVideoSchema.statics.getPersonalizedVideos = function(ageRange, interests, limit = 10) {
  const query = { isApproved: true };

  if (ageRange) {
    query['targetAudience.ageRange'] = ageRange;
  }

  if (interests && interests.length > 0) {
    query.$or = [
      { 'targetAudience.interests': { $in: interests } },
      { tags: { $in: interests } }
    ];
  }

  return this.find(query).sort({ views: -1, createdAt: -1 }).limit(limit);
};

module.exports = mongoose.model('SafetyVideo', safetyVideoSchema);