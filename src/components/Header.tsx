import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onMenuClick: () => void;
}

const viewTitles = {
  landing: 'Welcome',
  login: 'Login',
  signup: 'Sign Up',
  dashboard: 'Dashboard',
  upload: 'Data Upload',
  history: 'Backup History',
  'backup-restore': 'Backup History & Restore',
  settings: 'Settings',
  trash: 'Trash Bin',
  scheduler: 'Scheduler',
  subscription: 'Subscription Plans'
};

export function Header({ currentView, onMenuClick }: HeaderProps) {
  return (
    <header className="glass-dark border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-300" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white">
              {viewTitles[currentView as keyof typeof viewTitles]}
            </h1>
            <p className="text-sm text-gray-400">
              {currentView === 'dashboard' && 'Monitor and manage your backups'}
              {currentView === 'upload' && 'Secure file upload and backup'}
              {currentView === 'backup-restore' && 'Browse and restore your data'}
              {currentView === 'settings' && 'Configure your preferences'}
              {currentView === 'scheduler' && 'Automate your backup schedule'}
              {currentView === 'subscription' && 'Choose your perfect plan'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="input-glass pl-10 pr-4 py-2 w-64"
            />
          </div>
          
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}