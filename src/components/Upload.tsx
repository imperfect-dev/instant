import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, File, Folder, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useBackup } from '../hooks/useBackup';
import { useStorage } from '../hooks/useStorage';

export function Upload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { addNotification } = useNotifications();
  const { createBackupSession, addFilesToSession, startBackup, currentSession } = useBackup();
  const { updateStorageUsage, formatBytes } = useStorage();

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    // Create or use existing backup session
    let session = currentSession;
    if (!session || session.status === 'completed') {
      session = createBackupSession(
        `Upload ${new Date().toLocaleString()}`,
        'selective'
      );
    }

    // Add files to session
    addFilesToSession(session.id, fileArray);

    // Start backup automatically
    startBackup(session.id);

    // Update storage usage
    const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
    fileArray.forEach(file => {
      updateStorageUsage(file.size, file.type);
    });
  }, [createBackupSession, addFilesToSession, startBackup, currentSession, updateStorageUsage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
      addNotification({
        type: 'success',
        message: `Added ${droppedFiles.length} file(s) to upload queue`,
      });
    }
  }, [addFiles, addNotification]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      addNotification({
        type: 'success',
        message: `Added ${e.target.files.length} file(s) to upload queue`,
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <UploadIcon className={`mx-auto h-12 w-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {isDragOver ? 'Drop files here' : 'Drag and drop files'}
        </h3>
        <p className="mt-2 text-gray-600">or</p>
        <label className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <File className="h-5 w-5 mr-2" />
          Browse Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
        <p className="mt-4 text-sm text-gray-500">
          Supports all file types • Max file size: 10GB per file
        </p>
      </div>

      {/* Folder Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Entire Folders</h3>
        <label className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors">
          <Folder className="h-5 w-5 mr-2" />
          Select Folder
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
        <p className="mt-2 text-sm text-gray-600">
          Upload complete folder structures with all subfolders preserved
        </p>
      </div>

      {/* Upload Queue */}
      {currentSession && currentSession.files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentSession.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{currentSession.completedFiles} / {currentSession.totalFiles} files</span>
                <span>{formatBytes(currentSession.completedSize)} / {formatBytes(currentSession.totalSize)}</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {currentSession.files.map((file) => (
              <div key={file.id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatBytes(file.size)} • {file.path}
                    </p>
                    
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(file.progress)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}