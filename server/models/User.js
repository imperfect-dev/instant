const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'viewer'],
    default: 'member'
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  storageUsed: {
    type: Number,
    default: 0
  },
  storageLimit: {
    type: Number,
    default: 5368709120 // 5GB in bytes
  },
  settings: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    wifiOnly: {
      type: Boolean,
      default: true
    },
    notifications: {
      backupComplete: { type: Boolean, default: true },
      syncPaused: { type: Boolean, default: true },
      storageWarning: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true }
    },
    encryption: {
      type: Boolean,
      default: true
    },
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, default: null },
      backupCodes: [{ type: String }]
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update storage usage
userSchema.methods.updateStorageUsage = function(bytes) {
  this.storageUsed += bytes;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);