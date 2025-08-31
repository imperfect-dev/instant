import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Clock,
  Shield,
  Save,
  Plus,
  Monitor,
  Edit,
  Trash2,
  Bell,
  User,
  Lock,
  Globe
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSeen: string;
  status: 'online' | 'offline';
}

interface SettingsProps {
  onNavigate?: (view: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('backup');
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [wifiOnly, setWifiOnly] = useState(true);
  const [batteryLimit, setBatteryLimit] = useState(20);
  const [notifications, setNotifications] = useState({
    backupComplete: true,
    syncPaused: true,
    storageWarning: true,
    securityAlerts: true
  });
  const { addNotification } = useNotifications();

  const devices: Device[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastSeen: '2 minutes ago',
      status: 'online'
    },
    {
      id: '2',
      name: 'iPhone 15',
      type: 'mobile',
      lastSeen: '1 hour ago',
      status: 'offline'
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      lastSeen: '1 day ago',
      status: 'offline'
    }
  ];

  const handleSaveSettings = () => {
    addNotification({
      type: 'success',
      message: 'Settings saved successfully!',
    });
  };

  const handleUnlinkDevice = (deviceId: string) => {
    addNotification({
      type: 'info',
      message: 'Device unlinked successfully',
    });
  };

  const getDeviceIcon = (type: string) => {
    return <Monitor className="h-5 w-5" />;
  };

  const tabs = [
    { id: 'backup', label: 'Backup Preferences', icon: Clock },
    { id: 'devices', label: 'Device Management', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderBackupTab = () => (
    <div className="space-y-8">
      <div className="card-glass p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Automatic Backup</h3>
              <p className="text-gray-400">Automatically backup your files</p>
            </div>
          </div>
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoSync ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSync ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {autoSync && (
        <div className="space-y-6">
          <div className="card-glass p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Backup Frequency
            </label>
            <select
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
              className="input-glass w-full max-w-xs"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Wi-Fi Only</h4>
                  <p className="text-gray-400">Only backup when connected to Wi-Fi</p>
                </div>
              </div>
              <button
                onClick={() => setWifiOnly(!wifiOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  wifiOnly ? 'bg-emerald-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    wifiOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="card-glass p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Battery className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <label className="font-semibold text-white">
                  Pause backup when battery is below {batteryLimit}%
                </label>
                <p className="text-gray-400">Preserve battery life on mobile devices</p>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={batteryLimit}
              onChange={(e) => setBatteryLimit(Number(e.target.value))}
              className="w-full max-w-xs accent-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderDevicesTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Connected Devices</h3>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </button>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className="card-glass p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${device.status === 'online' ? 'bg-emerald-500/20' : 'bg-gray-600/20'}`}>
                  {getDeviceIcon(device.type)}
                </div>
                
                <div>
                  <h4 className="font-semibold text-white">{device.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                    <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                    <span>Last seen: {device.lastSeen}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleUnlinkDevice(device.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="card-glass p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {key === 'backupComplete' && 'Backup Complete'}
                    {key === 'syncPaused' && 'Sync Paused'}
                    {key === 'storageWarning' && 'Storage Warning'}
                    {key === 'securityAlerts' && 'Security Alerts'}
                  </h4>
                  <p className="text-gray-400">
                    {key === 'backupComplete' && 'Get notified when backups are completed'}
                    {key === 'syncPaused' && 'Alerts when sync is paused or interrupted'}
                    {key === 'storageWarning' && 'Warnings when storage is running low'}
                    {key === 'securityAlerts' && 'Important security notifications'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      <div className="card-glass p-6 border border-emerald-500/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Security Status</h3>
            <p className="text-emerald-400">
              Your data is encrypted end-to-end and stored securely across decentralized nodes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Lock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Data Encryption</h4>
                <p className="text-gray-400">All files are encrypted before upload</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full">
              Enabled
            </span>
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Secure Connections</h4>
                <p className="text-gray-400">All data transfers use HTTPS encryption</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full">
              Active
            </span>
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Data Export</h4>
                <p className="text-gray-400">Download a copy of your data</p>
              </div>
            </div>
            <button className="btn-secondary">
              Request Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Tab Navigation */}
      <div className="card-glass">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'backup' && renderBackupTab()}
          {activeTab === 'devices' && renderDevicesTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="btn-primary px-8 py-3 font-semibold"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}