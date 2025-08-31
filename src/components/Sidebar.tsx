import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Settings, 
  Trash2, 
  Shield,
  Clock,
  RotateCcw,
  X,
  ChevronRight,
  LogOut,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'history', label: 'Backup History', icon: History },
    { id: 'backup-restore', label: 'Backup & Restore', icon: RotateCcw },
    { id: 'scheduler', label: 'Scheduler', icon: Clock },
    { id: 'trash', label: 'Trash Bin', icon: Trash2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (viewId: string) => {
    onViewChange(viewId);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onViewChange('landing');
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 sidebar-glass
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">SecureBackup</span>
                <p className="text-xs text-gray-400">Professional</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                </button>
              );
            })}
          </nav>

          {/* Upgrade Section */}
          <div className="p-6 border-t border-white/10">
            <div className="card-glass p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Free Plan</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Upgrade for unlimited storage and advanced features
              </p>
              <button
                onClick={() => handleItemClick('subscription')}
                className="w-full btn-primary text-sm py-2"
              >
                Upgrade Now
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}