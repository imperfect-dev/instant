import React, { useState } from 'react';
import {
  Trash2,
  Search,
  Filter,
  RotateCcw,
  X,
  File,
  Folder,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Image,
  Video,
  Music
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface TrashedFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType: string;
  size: string;
  deletedDate: string;
  expiryDate: string;
  daysLeft: number;
  originalPath: string;
}

export function TrashBin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { addNotification } = useNotifications();

  const trashedFiles: TrashedFile[] = [
    {
      id: '1',
      name: 'Project_Proposal.pdf',
      type: 'file',
      fileType: 'application/pdf',
      size: '2.4 MB',
      deletedDate: '2024-01-14 15:30',
      expiryDate: '2024-02-13 15:30',
      daysLeft: 23,
      originalPath: '/Documents/Work/'
    },
    {
      id: '2',
      name: 'Vacation Photos',
      type: 'folder',
      fileType: 'folder',
      size: '156 MB',
      deletedDate: '2024-01-13 09:15',
      expiryDate: '2024-02-12 09:15',
      daysLeft: 22,
      originalPath: '/Photos/'
    },
    {
      id: '3',
      name: 'meeting_recording.mp4',
      type: 'file',
      fileType: 'video/mp4',
      size: '45.2 MB',
      deletedDate: '2024-01-12 14:22',
      expiryDate: '2024-02-11 14:22',
      daysLeft: 21,
      originalPath: '/Documents/Meetings/'
    },
    {
      id: '4',
      name: 'Old Spreadsheet.xlsx',
      type: 'file',
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: '890 KB',
      deletedDate: '2024-01-10 11:45',
      expiryDate: '2024-02-09 11:45',
      daysLeft: 19,
      originalPath: '/Documents/Archive/'
    },
    {
      id: '5',
      name: 'playlist.mp3',
      type: 'file',
      fileType: 'audio/mp3',
      size: '4.1 MB',
      deletedDate: '2024-01-05 16:30',
      expiryDate: '2024-02-04 16:30',
      daysLeft: 14,
      originalPath: '/Music/'
    }
  ];

  const getFileIcon = (type: string, fileType: string) => {
    if (type === 'folder') return <Folder className="h-5 w-5 text-blue-500" />;
    
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5 text-orange-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getExpiryStatus = (daysLeft: number) => {
    if (daysLeft <= 7) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (daysLeft <= 14) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  };

  const filteredFiles = trashedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'documents' && (file.fileType.includes('pdf') || file.fileType.includes('document') || file.fileType.includes('spreadsheet'))) ||
      (filterType === 'images' && file.fileType.startsWith('image/')) ||
      (filterType === 'videos' && file.fileType.startsWith('video/')) ||
      (filterType === 'audio' && file.fileType.startsWith('audio/')) ||
      (filterType === 'folders' && file.type === 'folder');
    
    return matchesSearch && matchesFilter;
  });

  const handleRestore = (fileIds: string[]) => {
    const count = fileIds.length;
    addNotification({
      type: 'success',
      message: `${count} item${count > 1 ? 's' : ''} restored successfully!`,
    });
    setSelectedFiles(new Set());
  };

  const handlePermanentDelete = (fileIds: string[]) => {
    const count = fileIds.length;
    addNotification({
      type: 'info',
      message: `${count} item${count > 1 ? 's' : ''} permanently deleted`,
    });
    setSelectedFiles(new Set());
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Trash Bin</h3>
            <p className="text-sm text-amber-700 mt-1">
              Files in Trash are kept for 30 days. After that, they'll be permanently deleted and cannot be recovered.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deleted files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Files</option>
                <option value="documents">Documents</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
                <option value="audio">Audio</option>
                <option value="folders">Folders</option>
              </select>
            </div>

            {selectedFiles.size > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRestore(Array.from(selectedFiles))}
                  className="flex items-center px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restore ({selectedFiles.size})
                </button>
                
                <button
                  onClick={() => handlePermanentDelete(Array.from(selectedFiles))}
                  className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Forever
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Deleted Files ({filteredFiles.length})
            </h2>
            
            {filteredFiles.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedFiles.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
        
        {filteredFiles.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Trash2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
            <p className="text-gray-600">No deleted files to display</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => {
              const expiryStatus = getExpiryStatus(file.daysLeft);
              const isSelected = selectedFiles.has(file.id);
              
              return (
                <div key={file.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFileSelection(file.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type, file.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${expiryStatus.bg} ${expiryStatus.color} ${expiryStatus.border}`}>
                          {file.daysLeft} days left
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Deleted {file.deletedDate}
                        </span>
                        <span>{file.size}</span>
                        <span className="truncate">
                          Original: {file.originalPath}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestore([file.id])}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Restore file"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handlePermanentDelete([file.id])}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete permanently"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Storage Recovery Info */}
      {filteredFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Storage Recovery</h3>
              <p className="text-sm text-blue-700">
                Permanently deleting these files will free up{' '}
                <span className="font-medium">
                  {trashedFiles.reduce((total, file) => {
                    const size = parseFloat(file.size);
                    const unit = file.size.split(' ')[1];
                    return total + (unit === 'GB' ? size * 1024 : size);
                  }, 0).toFixed(1)} MB
                </span>{' '}
                of storage space.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}