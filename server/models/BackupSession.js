const mongoose = require('mongoose');

const backupFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
  checksum: { type: String },
  encrypted: { type: Boolean, default: false },
  compressed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'uploading', 'completed', 'error'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  cloudPath: { type: String },
  lastModified: { type: Date, required: true }
});

const backupSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full', 'incremental', 'selective'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'paused'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  totalFiles: {
    type: Number,
    default: 0
  },
  completedFiles: {
    type: Number,
    default: 0
  },
  totalSize: {
    type: Number,
    default: 0
  },
  completedSize: {
    type: Number,
    default: 0
  },
  files: [backupFileSchema],
  metadata: {
    deviceInfo: {
      name: String,
      os: String,
      browser: String
    },
    compressionRatio: Number,
    encryptionEnabled: Boolean
  },
  errorMessage: String
}, {
  timestamps: true
});

// Index for efficient queries
backupSessionSchema.index({ createdAt: -1 });
backupSessionSchema.index({ status: 1 });

module.exports = mongoose.model('BackupSession', backupSessionSchema);