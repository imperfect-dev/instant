import React from 'react';
import { 
  Cloud, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUp, 
  Download,
  TrendingUp,
  Clock
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Storage</p>
              <p className="text-2xl font-bold text-gray-900">{formatBytes(stats.used)}</p>
              <p className="text-xs text-gray-500">of {formatBytes(stats.total)} used</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Backup</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.length > 0 && sessions[0].endTime 
                  ? new Date(sessions[0].endTime).toLocaleString()
                  : 'Never'
                }
              </p>
              <p className="text-xs text-emerald-600">
                {sessions.length > 0 && sessions[0].status === 'completed' 
                  ? 'All files secured' 
                  : 'No recent backups'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Files Backed Up</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.reduce((total, session) => total + session.completedFiles, 0)}
              </p>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {sessions.filter(s => s.endTime && 
                  new Date(s.endTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).reduce((total, session) => total + session.completedFiles, 0)} this week
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sync Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.some(s => s.status === 'running') ? 'Active' : 'Idle'}
              </p>
              <p className="text-xs text-amber-600">
                {sessions.some(s => s.status === 'running') ? 'Backup in progress' : 'Ready for backup'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleBackupNow}
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <ArrowUp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Backup Now
          </button>
          
          <button
            onClick={handleRestore}
            className="flex items-center justify-center px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group"
          >
            <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            One-Click Restore
          </button>
          
          <button className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all group">
            <TrendingUp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Recent Activity & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              ...sessions.slice(0, 5).map(session => ({
                action: `${session.name} ${session.status === 'completed' ? 'completed' : session.status}`,
                time: session.endTime ? new Date(session.endTime).toLocaleString() : 'In progress',
                status: session.status === 'completed' ? 'success' : 
                        session.status === 'failed' ? 'warning' : 'info'
              }))
            ].slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-emerald-500' :
                  item.status === 'warning' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Breakdown</h3>
          <div className="space-y-4">
            {[
              { 
                type: 'Documents', 
                size: formatBytes(stats.breakdown.documents), 
                percentage: stats.used > 0 ? (stats.breakdown.documents / stats.used) * 100 : 0, 
                color: 'bg-blue-500' 
              },
              { 
                type: 'Images', 
                size: formatBytes(stats.breakdown.images), 
                percentage: stats.used > 0 ? (stats.breakdown.images / stats.used) * 100 : 0, 
                color: 'bg-emerald-500' 
              },
              { 
                type: 'Videos', 
                size: formatBytes(stats.breakdown.videos), 
                percentage: stats.used > 0 ? (stats.breakdown.videos / stats.used) * 100 : 0, 
                color: 'bg-orange-500' 
              },
              { 
                type: 'Audio', 
                size: formatBytes(stats.breakdown.audio), 
                percentage: stats.used > 0 ? (stats.breakdown.audio / stats.used) * 100 : 0, 
                color: 'bg-purple-500' 
              },
              { 
                type: 'Other', 
                size: formatBytes(stats.breakdown.other), 
                percentage: stats.used > 0 ? (stats.breakdown.other / stats.used) * 100 : 0, 
                color: 'bg-gray-400' 
              },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{item.type}</span>
                  <span className="text-gray-600">{item.size}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${Math.max(item.percentage, 0)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}