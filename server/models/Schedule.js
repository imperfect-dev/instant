const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  frequency: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true
  },
  time: {
    type: String, // HH:MM format
    validate: {
      validator: function(v) {
        return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time must be in HH:MM format'
    }
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6
  },
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31
  },
  backupType: {
    type: String,
    enum: ['full', 'incremental'],
    required: true
  },
  includePaths: [{
    type: String,
    required: true
  }],
  excludePaths: [{
    type: String
  }],
  lastRun: {
    type: Date
  },
  nextRun: {
    type: Date
  },
  runCount: {
    type: Number,
    default: 0
  },
  successCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
scheduleSchema.index({ enabled: 1 });
scheduleSchema.index({ nextRun: 1, enabled: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);