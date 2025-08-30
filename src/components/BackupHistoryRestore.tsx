import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  HardDrive,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  File,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  MapPin,
  Zap
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useBackup } from '../hooks/useBackup';
import { useStorage } from '../hooks/useStorage';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  path: string;
  children?: FileItem[];
}

interface RestoreProgress {
  isActive: boolean;
  currentFile: string;
  progress: number;
  speed: string;
  timeRemaining: string;
  totalFiles: number;
  completedFiles: number;
}

export function BackupHistoryRestore() {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [restoreLocation, setRestoreLocation] = useState<'original' | 'new'>('original');
  const [customPath, setCustomPath] = useState('');
  const [restoreProgress, setRestoreProgress] = useState<RestoreProgress>({
    isActive: false,
    currentFile: '',
    progress: 0,
    speed: '',
    timeRemaining: '',
    totalFiles: 0,
    completedFiles: 0
  });
  const { addNotification } = useNotifications();
  const { sessions } = useBackup();
  const { formatBytes } = useStorage();

  // Sample backup data with more realistic names
  const sampleBackups = [
    {
      id: '1',
      name: 'Full Device Backup',
      type: 'full' as const,
      status: 'completed' as const,
      startTime: new Date('2024-01-15T10:15:00'),
      endTime: new Date('2024-01-15T11:45:00'),
      totalSize: 15728640000, // 14.6 GB
      totalFiles: 2847,
      completedFiles: 2847,
      completedSize: 15728640000
    },
    {
      id: '2',
      name: 'Photos 2024',
      type: 'selective' as const,
      status: 'completed' as const,
      startTime: new Date('2024-01-14T16:30:00'),
      endTime: new Date('2024-01-14T17:15:00'),
      totalSize: 8589934592, // 8 GB
      totalFiles: 1256,
      completedFiles: 1256,
      completedSize: 8589934592
    },
    {
      id: '3',
      name: 'Project X Folder',
      type: 'selective' as const,
      status: 'completed' as const,
      startTime: new Date('2024-01-13T14:20:00'),
      endTime: new Date('2024-01-13T14:35:00'),
      totalSize: 524288000, // 500 MB
      totalFiles: 89,
      completedFiles: 89,
      completedSize: 524288000
    },
    {
      id: '4',
      name: 'Documents Backup',
      type: 'incremental' as const,
      status: 'running' as const,
      startTime: new Date('2024-01-15T15:00:00'),
      totalSize: 2147483648, // 2 GB
      totalFiles: 456,
      completedFiles: 234,
      completedSize: 1073741824 // 1 GB
    }
  ];

  const sampleFiles: FileItem[] = [
    {
      name: 'Documents',
      type: 'folder',
      size: '2.3 GB',
      modified: '2024-01-15 10:15',
      path: '/Documents',
      children: [
        { 
          name: 'Projects', 
          type: 'folder', 
          size: '856 MB', 
          modified: '2024-01-14 16:30',
          path: '/Documents/Projects',
          children: [
            { name: 'Project_Alpha.docx', type: 'file', size: '12.5 MB', modified: '2024-01-14 16:30', path: '/Documents/Projects/Project_Alpha.docx' },
            { name: 'Presentation.pptx', type: 'file', size: '45.2 MB', modified: '2024-01-14 15:20', path: '/Documents/Projects/Presentation.pptx' }
          ]
        },
        { name: 'Reports.pdf', type: 'file', size: '12.5 MB', modified: '2024-01-15 09:45', path: '/Documents/Reports.pdf' },
        { name: 'Spreadsheets', type: 'folder', size: '234 MB', modified: '2024-01-13 14:20', path: '/Documents/Spreadsheets' }
      ]
    },
    {
      name: 'Photos',
      type: 'folder',
      size: '8.7 GB',
      modified: '2024-01-15 08:30',
      path: '/Photos',
      children: [
        { name: '2024', type: 'folder', size: '3.2 GB', modified: '2024-01-15 08:30', path: '/Photos/2024' },
        { name: '2023', type: 'folder', size: '5.5 GB', modified: '2023-12-31 23:59', path: '/Photos/2023' }
      ]
    },
    { name: 'System Files', type: 'folder', size: '15.8 GB', modified: '2024-01-15 14:30', path: '/System Files' }
  ];

  const filteredBackups = sampleBackups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || backup.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleRestore = async (backupId: string, type: 'full' | 'selective') => {
    if (type === 'selective' && selectedFiles.size === 0) {
      addNotification({
        type: 'warning',
        message: 'Please select files to restore',
      });
      return;
    }

    const backup = sampleBackups.find(b => b.id === backupId);
    if (!backup) return;

    const filesToRestore = type === 'full' ? backup.totalFiles : selectedFiles.size;
    
    setRestoreProgress({
      isActive: true,
      currentFile: '',
      progress: 0,
      speed: '0 MB/s',
      timeRemaining: 'Calculating...',
      totalFiles: filesToRestore,
      completedFiles: 0
    });

    addNotification({
      type: 'info',
      message: type === 'full' 
        ? `Full restore initiated for "${backup.name}"` 
        : `Restoring ${selectedFiles.size} selected items from "${backup.name}"`,
    });

    // Simulate restore process
    const files = type === 'full' ? 
      ['Documents/Project_Alpha.docx', 'Photos/2024/vacation.jpg', 'System/config.ini'] :
      Array.from(selectedFiles);

    for (let i = 0; i < filesToRestore; i++) {
      const currentFile = files[i % files.length] || `file_${i + 1}`;
      const progress = ((i + 1) / filesToRestore) * 100;
      const speed = `${(Math.random() * 50 + 10).toFixed(1)} MB/s`;
      const remaining = Math.max(0, filesToRestore - i - 1);
      const timeRemaining = remaining > 0 ? `${Math.ceil(remaining / 10)} minutes` : 'Almost done...';

      setRestoreProgress(prev => ({
        ...prev,
        currentFile,
        progress,
        speed,
        timeRemaining,
        completedFiles: i + 1
      }));

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setRestoreProgress(prev => ({ ...prev, isActive: false }));
    setSelectedFiles(new Set());

    addNotification({
      type: 'success',
      message: `Restore completed successfully! ${filesToRestore} files restored.`,
    });
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleFileSelection = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const renderFileTree = (files: FileItem[], parentPath = '') => {
    return files.map((item) => {
      const isExpanded = expandedFolders.has(item.path);
      const isSelected = selectedFiles.has(item.path);

      return (
        <div key={item.path} className="select-none">
          <div 
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
              isSelected ? 'bg-blue-50 border border-blue-200' : ''
            }`}
            onClick={() => toggleFileSelection(item.path)}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            {item.type === 'folder' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.path);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {item.type === 'folder' ? (
                <FolderOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
              ) : (
                <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.size} • {item.modified}
                </p>
              </div>
            </div>
          </div>

          {item.type === 'folder' && item.children && isExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {renderFileTree(item.children, item.path)}
            </div>
          )}
        </div>
      );
    });
  };

  // Restore Progress Modal
  if (restoreProgress.isActive) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Restoring Files</h3>
            <p className="text-gray-600">Please wait while we restore your files...</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(restoreProgress.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${restoreProgress.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current File:</span>
                <span className="font-medium truncate ml-2">{restoreProgress.currentFile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed:</span>
                <span className="font-medium">{restoreProgress.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Remaining:</span>
                <span className="font-medium">{restoreProgress.timeRemaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Files:</span>
                <span className="font-medium">{restoreProgress.completedFiles} / {restoreProgress.totalFiles}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedBackup) {
    const backup = sampleBackups.find(b => b.id === selectedBackup);
    if (!backup) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedBackup(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Back to Backup List
            </button>
          </div>
        </div>

        {/* Backup Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{backup.name}</h2>
              <p className="text-gray-600">
                {backup.startTime.toLocaleString()} • {formatBytes(backup.totalSize)} • {backup.totalFiles} files
              </p>
            </div>
            {getStatusIcon(backup.status)}
          </div>

          {/* Restore Location Options */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Restore Location</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="restoreLocation"
                  value="original"
                  checked={restoreLocation === 'original'}
                  onChange={(e) => setRestoreLocation(e.target.value as 'original' | 'new')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Restore to original location</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="restoreLocation"
                  value="new"
                  checked={restoreLocation === 'new'}
                  onChange={(e) => setRestoreLocation(e.target.value as 'original' | 'new')}
                  className="text-blue-600 focus:ring-blue-500 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FolderOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Restore to custom location</span>
                  </div>
                  {restoreLocation === 'new' && (
                    <input
                      type="text"
                      placeholder="/Users/username/Restored Files"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Restore Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleRestore(selectedBackup, 'selective')}
              disabled={selectedFiles.size === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFiles.size === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              Restore Selected ({selectedFiles.size})
            </button>
            
            <button
              onClick={() => handleRestore(selectedBackup, 'full')}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore All
            </button>
          </div>
        </div>

        {/* File Browser */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Browse Files</h3>
            <p className="text-sm text-gray-600">Select specific files and folders to restore</p>
          </div>
          
          <div className="p-6 space-y-2">
            {renderFileTree(sampleFiles)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search backups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">In Progress</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Backup History & Restore</h2>
          <p className="text-sm text-gray-600">Browse and restore from your backup history</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredBackups.map((backup) => (
            <div key={backup.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(backup.status)}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{backup.name}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {backup.startTime.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        {formatBytes(backup.totalSize)}
                      </span>
                      <span className="flex items-center">
                        <File className="h-3 w-3 mr-1" />
                        {backup.totalFiles} files
                      </span>
                      {backup.status === 'running' && (
                        <span className="flex items-center text-blue-600">
                          <Zap className="h-3 w-3 mr-1" />
                          {Math.round((backup.completedFiles / backup.totalFiles) * 100)}% complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    backup.type === 'full' ? 'bg-blue-100 text-blue-800' :
                    backup.type === 'incremental' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {backup.type === 'full' ? 'Full' : backup.type === 'incremental' ? 'Incremental' : 'Selective'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedBackup(backup.id)}
                    disabled={backup.status === 'running'}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      backup.status === 'running'
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Browse & Restore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}