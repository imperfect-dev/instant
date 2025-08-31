import React from 'react';
import { 
  Cloud, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUp, 
  Download,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  HardDrive,
  Calendar
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useStorage } from '../hooks/useStorage';
import { useBackup } from '../hooks/useBackup';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { addNotification } = useNotifications();
  const { stats, formatBytes } = useStorage();
  const { createBackupSession, startBackup, sessions } = useBackup();

  const handleBackupNow = () => {
    const session = createBackupSession(
      `Manual Backup ${new Date().toLocaleString()}`,
      'full'
    );
    startBackup(session.id);
  };

  const handleRestore = () => {
    addNotification({
      type: 'info',
      message: 'Restore initiated...',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="card-glass p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
            <p className="text-gray-400">Here's what's happening with your backups today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-glass card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Cloud className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{formatBytes(stats.used)}</p>
              <p className="text-xs text-gray-400">of {formatBytes(stats.total)}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-300 mb-2">Storage Used</p>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="card-glass card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {sessions.length > 0 && sessions[0].endTime 
                  ? new Date(sessions[0].endTime).toLocaleDateString()
                  : 'Never'
                }
              </p>
              <p className="text-xs text-emerald-400">
                {sessions.length > 0 && sessions[0].status === 'completed' 
                  ? 'Successful' 
                  : 'No backups'
                }
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-300">Last Backup</p>
        </div>

        <div className="card-glass card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {sessions.reduce((total, session) => total + session.completedFiles, 0)}
              </p>
              <p className="text-xs text-purple-400">Total files</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-300">Files Backed Up</p>
        </div>

        <div className="card-glass card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {sessions.some(s => s.status === 'running') ? 'Active' : 'Idle'}
              </p>
              <p className="text-xs text-orange-400">
                {sessions.some(s => s.status === 'running') ? 'In progress' : 'Ready'}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-300">Sync Status</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-glass p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={handleBackupNow}
            className="group p-6 card-glass card-hover border border-blue-500/30 hover:border-blue-400/50 transition-all"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Start Backup</h3>
            <p className="text-gray-400 text-sm">Create a new backup of your files</p>
          </button>
          
          <button
            onClick={() => onNavigate?.('backup-restore')}
            className="group p-6 card-glass card-hover border border-emerald-500/30 hover:border-emerald-400/50 transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">View History</h3>
            <p className="text-gray-400 text-sm">Browse and restore your backups</p>
          </button>
          
          <button
            onClick={() => onNavigate?.('subscription')}
            className="group p-6 card-glass card-hover border border-purple-500/30 hover:border-purple-400/50 transition-all"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upgrade Plan</h3>
            <p className="text-gray-400 text-sm">Unlock premium features</p>
          </button>
        </div>
      </div>

      {/* Recent Activity & Storage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-glass p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              ...sessions.slice(0, 5).map(session => ({
                action: `${session.name} ${session.status === 'completed' ? 'completed' : session.status}`,
                time: session.endTime ? new Date(session.endTime).toLocaleString() : 'In progress',
                status: session.status === 'completed' ? 'success' : 
                        session.status === 'failed' ? 'warning' : 'info'
              }))
            ].slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  item.status === 'success' ? 'bg-emerald-400' :
                  item.status === 'warning' ? 'bg-orange-400' :
                  'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.action}</p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-glass p-6">
          <h3 className="text-xl font-bold text-white mb-6">Storage Breakdown</h3>
          <div className="space-y-4">
            {[
              { 
                type: 'Documents', 
                size: formatBytes(stats.breakdown.documents), 
                percentage: stats.used > 0 ? (stats.breakdown.documents / stats.used) * 100 : 0, 
                color: 'from-blue-500 to-blue-600',
                icon: HardDrive
              },
              { 
                type: 'Images', 
                size: formatBytes(stats.breakdown.images), 
                percentage: stats.used > 0 ? (stats.breakdown.images / stats.used) * 100 : 0, 
                color: 'from-emerald-500 to-emerald-600',
                icon: Calendar
              },
              { 
                type: 'Videos', 
                size: formatBytes(stats.breakdown.videos), 
                percentage: stats.used > 0 ? (stats.breakdown.videos / stats.used) * 100 : 0, 
                color: 'from-orange-500 to-orange-600',
                icon: Zap
              },
              { 
                type: 'Audio', 
                size: formatBytes(stats.breakdown.audio), 
                percentage: stats.used > 0 ? (stats.breakdown.audio / stats.used) * 100 : 0, 
                color: 'from-purple-500 to-purple-600',
                icon: Activity
              },
              { 
                type: 'Other', 
                size: formatBytes(stats.breakdown.other), 
                percentage: stats.used > 0 ? (stats.breakdown.other / stats.used) * 100 : 0, 
                color: 'from-gray-500 to-gray-600',
                icon: Shield
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium text-white">{item.type}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{item.size}</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className={`h-2 rounded-xl bg-gradient-to-r ${item.color} transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Backup Service</p>
              <p className="text-sm text-emerald-400">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Cloud Storage</p>
              <p className="text-sm text-emerald-400">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Encryption</p>
              <p className="text-sm text-emerald-400">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}