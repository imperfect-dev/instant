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
  Zap,
  Play
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
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'running':
        return 'status-progress';
      case 'failed':
        return 'status-failed';
      default:
        return 'bg-gray-500';
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
            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
              isSelected ? 'bg-blue-500/20 border border-blue-400/30' : 'hover:bg-white/5'
            }`}
            onClick={() => toggleFileSelection(item.path)}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-white/10"
            />
            
            {item.type === 'folder' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.path);
                }}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {item.type === 'folder' ? (
                <FolderOpen className="h-5 w-5 text-blue-400 flex-shrink-0" />
              ) : (
                <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">
                  {item.size} • {item.modified}
                </p>
              </div>
            </div>
          </div>

          {item.type === 'folder' && item.children && isExpanded && (
            <div className="ml-8 mt-2 space-y-1">
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="card-glass max-w-lg w-full p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <RotateCcw className="h-10 w-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Restoring Files</h3>
            <p className="text-gray-400">Please wait while we restore your files...</p>
          </div>

          <div className="space-y-6">
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - restoreProgress.progress / 100)}`}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(restoreProgress.progress)}%</span>
              </div>
            </div>

            {/* Progress Details */}
            <div className="space-y-4">
              <div className="progress-bar h-2">
                <div 
                  className="progress-fill transition-all duration-300"
                  style={{ width: `${restoreProgress.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 mb-1">Current File</p>
                  <p className="text-white font-medium truncate">{restoreProgress.currentFile}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 mb-1">Speed</p>
                  <p className="text-white font-medium">{restoreProgress.speed}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 mb-1">Time Remaining</p>
                  <p className="text-white font-medium">{restoreProgress.timeRemaining}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-gray-400 mb-1">Files</p>
                  <p className="text-white font-medium">{restoreProgress.completedFiles} / {restoreProgress.totalFiles}</p>
                </div>
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
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBackup(null)}
            className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to Backup List
          </button>
        </div>

        {/* Backup Details */}
        <div className="card-glass p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <History className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{backup.name}</h2>
                <p className="text-gray-400">
                  {backup.startTime.toLocaleString()} • {formatBytes(backup.totalSize)} • {backup.totalFiles} files
                </p>
              </div>
            </div>
            {getStatusIcon(backup.status)}
          </div>

          {/* Restore Location Options */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold text-white mb-4">Restore Location</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="restoreLocation"
                  value="original"
                  checked={restoreLocation === 'original'}
                  onChange={(e) => setRestoreLocation(e.target.value as 'original' | 'new')}
                  className="text-blue-500 focus:ring-blue-500 bg-white/10 border-gray-600"
                />
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Restore to original location</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="restoreLocation"
                  value="new"
                  checked={restoreLocation === 'new'}
                  onChange={(e) => setRestoreLocation(e.target.value as 'original' | 'new')}
                  className="text-blue-500 focus:ring-blue-500 bg-white/10 border-gray-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <FolderOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Restore to custom location</span>
                  </div>
                  {restoreLocation === 'new' && (
                    <input
                      type="text"
                      placeholder="/Users/username/Restored Files"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      className="input-glass w-full"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Restore Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleRestore(selectedBackup, 'selective')}
              disabled={selectedFiles.size === 0}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFiles.size === 0 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              <Download className="h-5 w-5 mr-2" />
              Restore Selected ({selectedFiles.size})
            </button>
            
            <button
              onClick={() => handleRestore(selectedBackup, 'full')}
              className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold transition-all hover:scale-105"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Restore All
            </button>
          </div>
        </div>

        {/* File Browser */}
        <div className="card-glass">
          <div className="px-8 py-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Browse Files</h3>
            <p className="text-gray-400">Select specific files and folders to restore</p>
          </div>
          
          <div className="p-8 space-y-2">
            {renderFileTree(sampleFiles)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Search and Filter */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search backups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-10 pr-4 py-3 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-glass px-4 py-3"
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
      <div className="card-glass">
        <div className="px-8 py-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Backup History & Restore</h2>
          <p className="text-gray-400">Browse and restore from your backup history</p>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredBackups.map((backup) => (
            <div key={backup.id} className="px-8 py-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(backup.status)}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{backup.name}</h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mt-2">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {backup.startTime.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        {formatBytes(backup.totalSize)}
                      </span>
                      <span className="flex items-center">
                        <File className="h-4 w-4 mr-2" />
                        {backup.totalFiles} files
                      </span>
                      {backup.status === 'running' && (
                        <span className="flex items-center text-blue-400">
                          <Zap className="h-4 w-4 mr-2" />
                          {Math.round((backup.completedFiles / backup.totalFiles) * 100)}% complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(backup.status)}`}>
                    {backup.type === 'full' ? 'Full' : backup.type === 'incremental' ? 'Incremental' : 'Selective'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedBackup(backup.id)}
                    disabled={backup.status === 'running'}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                      backup.status === 'running'
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'btn-secondary hover:scale-105'
                    }`}
                  >
                    <Play className="h-4 w-4 mr-2" />
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