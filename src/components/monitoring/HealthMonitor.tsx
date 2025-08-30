import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    storage: {
      status: 'healthy' | 'warning' | 'critical';
      usage: number;
      available: number;
      issues?: string[];
    };
    network: {
      status: 'healthy' | 'warning' | 'critical';
      latency: number;
      bandwidth: number;
      issues?: string[];
    };
    backup: {
      status: 'healthy' | 'warning' | 'critical';
      successRate: number;
      lastBackup: Date;
      issues?: string[];
    };
    performance: {
      status: 'healthy' | 'warning' | 'critical';
      cpuUsage: number;
      memoryUsage: number;
      issues?: string[];
    };
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  recommendations: Array<{
    id: string;
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    action?: string;
  }>;
}

export function HealthMonitor() {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock health data
    const mockData: SystemHealth = {
      overall: Math.random() > 0.8 ? 'warning' : 'healthy',
      components: {
        storage: {
          status: Math.random() > 0.9 ? 'warning' : 'healthy',
          usage: Math.random() * 80 + 10,
          available: Math.random() * 500 + 100,
          issues: Math.random() > 0.8 ? ['Storage usage above 80%'] : undefined
        },
        network: {
          status: Math.random() > 0.85 ? 'warning' : 'healthy',
          latency: Math.random() * 100 + 20,
          bandwidth: Math.random() * 100 + 50,
          issues: Math.random() > 0.9 ? ['High network latency detected'] : undefined
        },
        backup: {
          status: Math.random() > 0.95 ? 'critical' : 'healthy',
          successRate: Math.random() * 10 + 90,
          lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          issues: Math.random() > 0.9 ? ['Recent backup failures detected'] : undefined
        },
        performance: {
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
          cpuUsage: Math.random() * 60 + 20,
          memoryUsage: Math.random() * 70 + 15,
          issues: Math.random() > 0.85 ? ['High CPU usage detected'] : undefined
        }
      },
      alerts: [
        {
          id: '1',
          type: 'warning',
          message: 'Storage usage is approaching 80% capacity',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          message: 'Scheduled backup completed successfully',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          resolved: true
        }
      ],
      recommendations: [
        {
          id: '1',
          priority: 'medium',
          title: 'Enable Compression',
          description: 'Reduce storage usage by enabling file compression',
          action: 'Configure compression settings'
        },
        {
          id: '2',
          priority: 'low',
          title: 'Schedule Off-Peak Backups',
          description: 'Improve performance by scheduling backups during off-peak hours',
          action: 'Update backup schedule'
        }
      ]
    };

    setHealthData(mockData);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading || !healthData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600">Monitor system performance and health metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={loadHealthData}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-xl border-2 p-6 ${getStatusColor(healthData.overall)}`}>
        <div className="flex items-center space-x-4">
          {getStatusIcon(healthData.overall)}
          <div>
            <h3 className="text-xl font-semibold">
              System Status: {healthData.overall.charAt(0).toUpperCase() + healthData.overall.slice(1)}
            </h3>
            <p className="text-sm opacity-75">
              {healthData.overall === 'healthy' 
                ? 'All systems are operating normally'
                : healthData.overall === 'warning'
                ? 'Some components require attention'
                : 'Critical issues detected that need immediate attention'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Component Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <HardDrive className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Storage</h4>
                {getStatusIcon(healthData.components.storage.status)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Usage</span>
                <span>{healthData.components.storage.usage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    healthData.components.storage.usage > 80 ? 'bg-red-500' :
                    healthData.components.storage.usage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${healthData.components.storage.usage}%` }}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>{healthData.components.storage.available.toFixed(1)} GB available</p>
            </div>
            
            {healthData.components.storage.issues && (
              <div className="text-xs text-red-600">
                {healthData.components.storage.issues.map((issue, index) => (
                  <p key={index}>• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Wifi className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Network</h4>
                {getStatusIcon(healthData.components.network.status)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Latency</span>
              <span>{healthData.components.network.latency.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bandwidth</span>
              <span>{healthData.components.network.bandwidth.toFixed(1)} Mbps</span>
            </div>
            
            {healthData.components.network.issues && (
              <div className="text-xs text-red-600">
                {healthData.components.network.issues.map((issue, index) => (
                  <p key={index}>• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Backup</h4>
                {getStatusIcon(healthData.components.backup.status)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span>{healthData.components.backup.successRate.toFixed(1)}%</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Last: {healthData.components.backup.lastBackup.toLocaleDateString()}</p>
            </div>
            
            {healthData.components.backup.issues && (
              <div className="text-xs text-red-600">
                {healthData.components.backup.issues.map((issue, index) => (
                  <p key={index}>• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Performance</h4>
                {getStatusIcon(healthData.components.performance.status)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU</span>
                <span>{healthData.components.performance.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${healthData.components.performance.cpuUsage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory</span>
                <span>{healthData.components.performance.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${healthData.components.performance.memoryUsage}%` }}
                />
              </div>
            </div>
            
            {healthData.components.performance.issues && (
              <div className="text-xs text-red-600">
                {healthData.components.performance.issues.map((issue, index) => (
                  <p key={index}>• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {healthData.alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {alert.type === 'error' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`text-sm ${alert.resolved ? 'text-gray-600' : 'text-gray-900'}`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.timestamp.toLocaleString()}
                    </span>
                    {alert.resolved && (
                      <span className="text-xs text-emerald-600 font-medium">Resolved</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Optimization Recommendations</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {healthData.recommendations.map((rec) => (
            <div key={rec.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
                
                {rec.action && (
                  <button className="ml-4 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    {rec.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}