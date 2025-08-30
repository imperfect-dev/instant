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
  ChevronRight
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useBackup } from '../hooks/useBackup';
import { useStorage } from '../hooks/useStorage';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  children?: FileItem[];
}

export function BackupHistory() {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { addNotification } = useNotifications();

  const { sessions } = useBackup();
  const { formatBytes } = useStorage();

  const sampleFiles: FileItem[] = [
    {
      name: 'Documents',
      type: 'folder',
      size: '2.3 GB',
      modified: '2024-01-15 10:15',
      children: [
        { name: 'Projects', type: 'folder', size: '856 MB', modified: '2024-01-14 16:30' },
        { name: 'Reports.pdf', type: 'file', size: '12.5 MB', modified: '2024-01-15 09:45' },
        { name: 'Spreadsheets', type: 'folder', size: '234 MB', modified: '2024-01-13 14:20' }
      ]
    },
    {
      name: 'Photos',
      type: 'folder',
      size: '8.7 GB',
      modified: '2024-01-15 08:30',
      children: [
        { name: '2024', type: 'folder', size: '3.2 GB', modified: '2024-01-15 08:30' },
        { name: '2023', type: 'folder', size: '5.5 GB', modified: '2023-12-31 23:59' }
      ]
    },
    { name: 'System Files', type: 'folder', size: '15.8 GB', modified: '2024-01-15 14:30' }
  ];

  const filteredBackups = sessions.filter(backup => {
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

  const handleRestore = (backupId: string, type: 'full' | 'selective') => {
    if (type === 'selective' && selectedFiles.size === 0) {
      addNotification({
        type: 'warning',
        message: 'Please select files to restore',
      });
      return;
    }

    addNotification({
      type: 'info',
      message: type === 'full' ? 'Full restore initiated...' : `Restoring ${selectedFiles.size} selected items...`,
    });

    // Simulate restore process
    setTimeout(() => {
      addNotification({
        type: 'success',
        message: 'Restore completed successfully!',
      });
    }, 3000);
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
      const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isExpanded = expandedFolders.has(fullPath);
      const isSelected = selectedFiles.has(fullPath);

      return (
        <div key={fullPath} className="select-none">
          <div 
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
              isSelected ? 'bg-blue-50 border border-blue-200' : ''
            }`}
            onClick={() => toggleFileSelection(fullPath)}
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
                  toggleFolder(fullPath);
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
              {renderFileTree(item.children, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  if (selectedBackup) {
    const backup = sessions.find(b => b.id === selectedBackup);
    if (!backup) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedBackup(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to History
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleRestore(selectedBackup, 'selective')}
              disabled={selectedFiles.size === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFiles.size === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Restore Selected ({selectedFiles.size})
            </button>
            
            <button
              onClick={() => handleRestore(selectedBackup, 'full')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
            >
              Restore All
            </button>
          </div>
        </div>

        {/* Backup Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{backup.name}</h2>
              <p className="text-gray-600">
                {backup.startTime.toLocaleString()} • {formatBytes(backup.totalSize)} • {backup.totalFiles} files
              </p>
            </div>
            {getStatusIcon(backup.status)}
          </div>
        </div>

        {/* File Browser */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Browse Files</h3>
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
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Backup History</h2>
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
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Browse
                  </button>
                  
                  <button
                    onClick={() => handleRestore(backup.id, 'full')}
                    disabled={backup.status !== 'completed'}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      backup.status === 'completed'
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Download className="h-4 w-4" />
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