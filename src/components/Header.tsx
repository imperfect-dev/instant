import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

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
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-900">
            {viewTitles[currentView as keyof typeof viewTitles]}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}