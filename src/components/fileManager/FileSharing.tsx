import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  Eye, 
  Download, 
  Lock,
  Globe,
  Users,
  X
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface FileSharingProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
  };
  onClose: () => void;
}

interface ShareLink {
  id: string;
  url: string;
  permissions: 'view' | 'download';
  expiresAt: Date | null;
  password?: string;
  accessCount: number;
  maxAccess?: number;
  createdAt: Date;
}

export function FileSharing({ file, onClose }: FileSharingProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    permissions: 'view' as 'view' | 'download',
    expiresIn: '7' as '1' | '7' | '30' | 'never',
    requirePassword: false,
    password: '',
    maxAccess: '',
  });
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const generateShareLink = () => {
    const linkId = Math.random().toString(36).substr(2, 9);
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/shared/${linkId}`;
    
    let expiresAt: Date | null = null;
    if (formData.expiresIn !== 'never') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresIn));
    }

    const newLink: ShareLink = {
      id: linkId,
      url: shareUrl,
      permissions: formData.permissions,
      expiresAt,
      password: formData.requirePassword ? formData.password : undefined,
      accessCount: 0,
      maxAccess: formData.maxAccess ? parseInt(formData.maxAccess) : undefined,
      createdAt: new Date(),
    };

    setShareLinks([...shareLinks, newLink]);
    setShowCreateForm(false);
    setFormData({
      permissions: 'view',
      expiresIn: '7',
      requirePassword: false,
      password: '',
      maxAccess: '',
    });

    addNotification({
      type: 'success',
      message: 'Share link created successfully'
    });
  };

  const copyToClipboard = async (link: ShareLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLinkId(link.id);
      setTimeout(() => setCopiedLinkId(null), 2000);
      
      addNotification({
        type: 'success',
        message: 'Link copied to clipboard'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to copy link'
      });
    }
  };

  const revokeLink = (linkId: string) => {
    setShareLinks(shareLinks.filter(link => link.id !== linkId));
    addNotification({
      type: 'info',
      message: 'Share link revoked'
    });
  };

  const isLinkExpired = (link: ShareLink) => {
    if (!link.expiresAt) return false;
    return new Date() > link.expiresAt;
  };

  const isLinkMaxedOut = (link: ShareLink) => {
    if (!link.maxAccess) return false;
    return link.accessCount >= link.maxAccess;
  };

  const getLinkStatus = (link: ShareLink) => {
    if (isLinkExpired(link)) return { status: 'expired', color: 'text-red-600 bg-red-50' };
    if (isLinkMaxedOut(link)) return { status: 'maxed', color: 'text-red-600 bg-red-50' };
    return { status: 'active', color: 'text-emerald-600 bg-emerald-50' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Share2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Share File</h3>
                <p className="text-sm text-gray-500">{file.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Create New Link */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Share Links</h4>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Create Link
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <select
                      value={formData.permissions}
                      onChange={(e) => setFormData({ ...formData, permissions: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="view">View Only</option>
                      <option value="download">View & Download</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires In
                    </label>
                    <select
                      value={formData.expiresIn}
                      onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 Day</option>
                      <option value="7">7 Days</option>
                      <option value="30">30 Days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requirePassword}
                      onChange={(e) => setFormData({ ...formData, requirePassword: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require password</span>
                  </label>
                  
                  {formData.requirePassword && (
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Access Count (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={formData.maxAccess}
                    onChange={(e) => setFormData({ ...formData, maxAccess: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateShareLink}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Links */}
          <div className="space-y-4">
            {shareLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No share links created yet</p>
              </div>
            ) : (
              shareLinks.map((link) => {
                const linkStatus = getLinkStatus(link);
                return (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {link.permissions === 'view' ? (
                            <Eye className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Download className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {link.permissions === 'view' ? 'View Only' : 'View & Download'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${linkStatus.color}`}>
                              {linkStatus.status === 'active' ? 'Active' : 
                               linkStatus.status === 'expired' ? 'Expired' : 'Max Access Reached'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Created {link.createdAt.toLocaleDateString()}</span>
                            {link.expiresAt && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Expires {link.expiresAt.toLocaleDateString()}
                              </span>
                            )}
                            {link.password && (
                              <span className="flex items-center">
                                <Lock className="h-3 w-3 mr-1" />
                                Password protected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => revokeLink(link.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={link.url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(link)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copiedLinkId === link.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                      <span>
                        {link.accessCount} access{link.accessCount !== 1 ? 'es' : ''}
                        {link.maxAccess && ` of ${link.maxAccess}`}
                      </span>
                      {link.maxAccess && (
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((link.accessCount / link.maxAccess) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}