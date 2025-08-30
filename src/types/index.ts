export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLogin: Date;
}

export interface BackupFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  lastModified: Date;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  checksum?: string;
}

export interface BackupSession {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'selective';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  totalFiles: number;
  completedFiles: number;
  totalSize: number;
  completedSize: number;
  files: BackupFile[];
}

export interface StorageStats {
  used: number;
  total: number;
  percentage: number;
  breakdown: {
    documents: number;
    images: number;
    videos: number;
    audio: number;
    other: number;
  };
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  lastSeen: Date;
  status: 'online' | 'offline';
  autoBackup: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: Date;
  permissions: string[];
}

export interface SharedSpace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: TeamMember[];
  size: number;
  fileCount: number;
  lastModified: Date;
  permissions: 'read' | 'write' | 'admin';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'backup' | 'restore' | 'share' | 'delete' | 'security';
  severity: 'low' | 'medium' | 'high';
}

export interface UserSettings {
  autoBackup: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly';
  wifiOnly: boolean;
  batteryThreshold: number;
  notifications: {
    backupComplete: boolean;
    syncPaused: boolean;
    storageWarning: boolean;
    securityAlerts: boolean;
  };
  encryption: boolean;
  twoFactorAuth: boolean;
}