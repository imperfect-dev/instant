import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, File, Folder, X, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : 'border-white/20 hover:border-white/40 card-glass'
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="relative z-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all ${
            isDragOver ? 'bg-blue-500/20 scale-110' : 'bg-white/10'
          }`}>
            <UploadIcon className={`h-8 w-8 ${isDragOver ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {isDragOver ? 'Drop files here' : 'Drag and drop files'}
          </h3>
          <p className="text-gray-400 mb-6">or</p>
          
          <label className="inline-flex items-center btn-primary cursor-pointer">
            <File className="h-5 w-5 mr-2" />
            Browse Files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
          
          <p className="mt-6 text-sm text-gray-400">
            Supports all file types • Max file size: 10GB per file • Encrypted automatically
          </p>
        </div>
      </div>

      {/* Folder Upload */}
      <div className="card-glass p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Folder className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Upload Entire Folders</h3>
            <p className="text-gray-400">Preserve complete folder structures with all subfolders</p>
          </div>
        </div>
        
        <label className="btn-secondary cursor-pointer inline-flex items-center">
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
      </div>

      {/* Upload Queue */}
      {currentSession && currentSession.files.length > 0 && (
        <div className="card-glass">
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentSession.name}</h3>
                  <p className="text-gray-400">
                    {currentSession.completedFiles} / {currentSession.totalFiles} files • 
                    {formatBytes(currentSession.completedSize)} / {formatBytes(currentSession.totalSize)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {Math.round((currentSession.completedFiles / currentSession.totalFiles) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-white/10">
            {currentSession.files.map((file) => (
              <div key={file.id} className="px-8 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getFileIcon(file.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatBytes(file.size)} • {file.path}
                    </p>
                    
                    {file.status === 'uploading' && (
                      <div className="mt-3">
                        <div className="progress-bar h-2">
                          <div 
                            className="progress-fill transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {Math.round(file.progress)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    )}
                    {file.status === 'uploading' && (
                      <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
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