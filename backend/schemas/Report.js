const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Report identification
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Reporter information (optional for anonymous reports)
  reporterId: {
    type: String,
    index: true
  },

  isAnonymous: {
    type: Boolean,
    default: true
  },

  // Report details
  category: {
    type: String,
    required: true,
    enum: ['Harassment', 'Scam/Fraud', 'Photo Leak', 'Threats', 'Impersonation', 'Spam', 'Other']
  },

  description: {
    type: String,
    required: true,
    maxlength: 2000
  },

  // Incident details
  incidentDate: {
    type: Date,
    default: Date.now
  },

  location: {
    type: String,
    maxlength: 100
  },

  platform: {
    type: String,
    enum: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Other']
  },

  // Evidence (URLs, screenshots would be stored separately)
  evidenceUrls: [{
    type: String,
    maxlength: 500
  }],

  // Contact information (only if not anonymous)
  contactInfo: {
    email: String,
    phone: String
  },

  // Processing information
  status: {
    type: String,
    enum: ['pending', 'under_review', 'investigating', 'resolved', 'closed'],
    default: 'pending'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  assignedTo: {
    type: String // Admin user ID
  },

  // Resolution details
  resolution: {
    type: String,
    maxlength: 1000
  },

  resolvedBy: String,
  resolvedAt: Date,

  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },

  followUpNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Metadata
  ipAddress: String,
  userAgent: String,

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
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ category: 1, createdAt: -1 });
reportSchema.index({ reporterId: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

// Pre-save middleware
reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
reportSchema.methods.assignTo = function(adminId) {
  this.assignedTo = adminId;
  this.status = 'under_review';
  return this.save();
};

reportSchema.methods.resolve = function(resolution, adminId) {
  this.resolution = resolution;
  this.resolvedBy = adminId;
  this.resolvedAt = new Date();
  this.status = 'resolved';
  return this.save();
};

reportSchema.methods.addFollowUpNote = function(note, adminId) {
  this.followUpNotes.push({
    note,
    addedBy: adminId,
    addedAt: new Date()
  });
  return this.save();
};

// Static methods
reportSchema.statics.getPendingReports = function() {
  return this.find({ status: 'pending' }).sort({ priority: -1, createdAt: -1 });
};

reportSchema.statics.getReportsByCategory = function(category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

reportSchema.statics.getReportsByUser = function(userId) {
  return this.find({ reporterId: userId, isAnonymous: false }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Report', reportSchema);