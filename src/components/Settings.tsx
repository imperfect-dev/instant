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
  Bell
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
    switch (type) {
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'mobile':
        return <Monitor className="h-5 w-5" />;
      case 'tablet':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'backup', label: 'Backup Preferences', icon: Clock },
    { id: 'devices', label: 'Device Management', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">Automatic Backup</h3>
            <p className="text-sm text-gray-600">Automatically backup your files</p>
          </div>
        </div>
        <button
          onClick={() => setAutoSync(!autoSync)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoSync ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoSync ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {autoSync && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Wi-Fi Only</h4>
                <p className="text-sm text-gray-600">Only backup when connected to Wi-Fi</p>
              </div>
            </div>
            <button
              onClick={() => setWifiOnly(!wifiOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                wifiOnly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  wifiOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Battery className="h-5 w-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Pause backup when battery is below {batteryLimit}%
              </label>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={batteryLimit}
              onChange={(e) => setBatteryLimit(Number(e.target.value))}
              className="w-full max-w-xs"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderDevicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Connected Devices</h3>
        <button className="flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          <Plus className="h-4 w-4 mr-1" />
          Add Device
        </button>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                {getDeviceIcon(device.type)}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">{device.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  <span>Last seen: {device.lastSeen}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleUnlinkDevice(device.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                {key === 'backupComplete' && 'Backup Complete'}
                {key === 'syncPaused' && 'Sync Paused'}
                {key === 'storageWarning' && 'Storage Warning'}
                {key === 'securityAlerts' && 'Security Alerts'}
              </h4>
              <p className="text-sm text-gray-600">
                {key === 'backupComplete' && 'Get notified when backups are completed'}
                {key === 'syncPaused' && 'Alerts when sync is paused or interrupted'}
                {key === 'storageWarning' && 'Warnings when storage is running low'}
                {key === 'securityAlerts' && 'Important security notifications'}
              </p>
            </div>
            
            <button
              onClick={() => setNotifications({ ...notifications, [key]: !value })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-amber-600" />
          <h3 className="font-medium text-amber-900">Security Settings</h3>
        </div>
        <p className="text-sm text-amber-700 mt-2">
          Your data is encrypted end-to-end and stored securely across decentralized nodes.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Data Encryption</h4>
            <p className="text-sm text-gray-600">All files are encrypted before upload</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
            Enabled
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Secure Connections</h4>
            <p className="text-sm text-gray-600">All data transfers use HTTPS encryption</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Data Export</h4>
            <p className="text-sm text-gray-600">Download a copy of your data</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Request Export
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
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
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}