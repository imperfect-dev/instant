import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Trash2, 
  FileText, 
  Image, 
  Video, 
  Music,
  File,
  Eye,
  ExternalLink
} from 'lucide-react';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
    lastModified: Date;
  };
  onClose: () => void;
  onDownload?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export function FilePreview({ file, onClose, onDownload, onShare, onDelete }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreview();
  }, [file]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (file.url) {
        setPreviewUrl(file.url);
      } else {
        // Generate mock preview URL based on file type
        if (file.type.startsWith('image/')) {
          setPreviewUrl(`https://picsum.photos/800/600?random=${file.id}`);
        } else if (file.type.startsWith('video/')) {
          setPreviewUrl(`https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`);
        } else {
          setPreviewUrl(null);
        }
      }
    } catch (err) {
      setError('Failed to load preview');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (file.type.startsWith('audio/')) return <Music className="h-8 w-8 text-orange-500" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <Eye className="h-12 w-12 mb-4" />
          <p>{error}</p>
        </div>
      );
    }

    if (file.type.startsWith('image/') && previewUrl) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain"
            onError={() => setError('Failed to load image')}
          />
        </div>
      );
    }

    if (file.type.startsWith('video/') && previewUrl) {
      return (
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <video 
            src={previewUrl}
            controls
            className="w-full max-h-96"
            onError={() => setError('Failed to load video')}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (file.type.startsWith('audio/') && previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
          <Music className="h-16 w-16 text-orange-500 mb-4" />
          <audio 
            src={previewUrl}
            controls
            className="w-full max-w-md"
            onError={() => setError('Failed to load audio')}
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (file.type.includes('pdf')) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
          <FileText className="h-16 w-16 text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">PDF Preview</p>
          <button
            onClick={() => window.open(previewUrl || '#', '_blank')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </button>
        </div>
      );
    }

    // Default preview for unsupported file types
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
        {getFileIcon()}
        <p className="text-gray-600 mt-4">Preview not available</p>
        <p className="text-sm text-gray-500">File type: {file.type}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • Modified {file.lastModified.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={() => onDownload(file.id)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
            )}
            
            {onShare && (
              <button
                onClick={() => onShare(file.id)}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {renderPreview()}
        </div>

        {/* File Details */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">File Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium">{file.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <p className="font-medium">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <span className="text-gray-500">Modified:</span>
                <p className="font-medium">{file.lastModified.toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>
                <p className="font-medium font-mono text-xs">{file.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}