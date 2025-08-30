import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  HardDrive, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  storageUsage: {
    labels: string[];
    data: number[];
  };
  backupTrends: {
    labels: string[];
    successful: number[];
    failed: number[];
  };
  performanceMetrics: {
    uploadSpeed: number[];
    downloadSpeed: number[];
    labels: string[];
  };
  costAnalysis: {
    storage: number;
    bandwidth: number;
    operations: number;
    total: number;
  };
  successRate: number;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data based on time range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString();
    });

    const mockData: AnalyticsData = {
      storageUsage: {
        labels,
        data: labels.map((_, i) => Math.random() * 100 + i * 2)
      },
      backupTrends: {
        labels,
        successful: labels.map(() => Math.floor(Math.random() * 50) + 10),
        failed: labels.map(() => Math.floor(Math.random() * 5))
      },
      performanceMetrics: {
        labels,
        uploadSpeed: labels.map(() => Math.random() * 100 + 50),
        downloadSpeed: labels.map(() => Math.random() * 150 + 75)
      },
      costAnalysis: {
        storage: 45.67,
        bandwidth: 12.34,
        operations: 8.90,
        total: 66.91
      },
      successRate: 98.5
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const storageChartData = {
    labels: analyticsData.storageUsage.labels,
    datasets: [
      {
        label: 'Storage Usage (GB)',
        data: analyticsData.storageUsage.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const backupTrendsData = {
    labels: analyticsData.backupTrends.labels,
    datasets: [
      {
        label: 'Successful Backups',
        data: analyticsData.backupTrends.successful,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Failed Backups',
        data: analyticsData.backupTrends.failed,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const performanceData = {
    labels: analyticsData.performanceMetrics.labels,
    datasets: [
      {
        label: 'Upload Speed (Mbps)',
        data: analyticsData.performanceMetrics.uploadSpeed,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Download Speed (Mbps)',
        data: analyticsData.performanceMetrics.downloadSpeed,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const costBreakdownData = {
    labels: ['Storage', 'Bandwidth', 'Operations'],
    datasets: [
      {
        data: [
          analyticsData.costAnalysis.storage,
          analyticsData.costAnalysis.bandwidth,
          analyticsData.costAnalysis.operations,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-emerald-600">{analyticsData.successRate}%</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+2.1%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Upload Speed</p>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(analyticsData.performanceMetrics.uploadSpeed.reduce((a, b) => a + b, 0) / analyticsData.performanceMetrics.uploadSpeed.length)} Mbps
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+5.2%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-3xl font-bold text-purple-600">${analyticsData.costAnalysis.total}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">-3.1%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Backups</p>
              <p className="text-3xl font-bold text-orange-600">
                {analyticsData.backupTrends.successful[analyticsData.backupTrends.successful.length - 1]}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Usage Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage Trend</h3>
          <div className="h-64">
            <Line data={storageChartData} options={chartOptions} />
          </div>
        </div>

        {/* Backup Success/Failure */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Success Rate</h3>
          <div className="h-64">
            <Bar data={backupTrendsData} options={chartOptions} />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="h-64">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="h-64">
            <Doughnut 
              data={costBreakdownData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Suggestions</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <HardDrive className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Storage Optimization</h4>
              <p className="text-sm text-blue-700">
                Enable compression to reduce storage costs by up to 40%. Current compression ratio: 65%.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg">
            <div className="p-2 bg-emerald-100 rounded-full">
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-emerald-900">Backup Scheduling</h4>
              <p className="text-sm text-emerald-700">
                Consider scheduling backups during off-peak hours (2-6 AM) for better performance and lower costs.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">Redundant Files Detected</h4>
              <p className="text-sm text-amber-700">
                Found 156 duplicate files consuming 2.3 GB. Enable deduplication to save storage space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}