import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { BackupHistory } from './components/BackupHistory';
import { Settings } from './components/Settings';
import { TrashBin } from './components/TrashBin';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { BackupSchedulerComponent } from './components/scheduler/BackupScheduler';
import { HealthMonitor } from './components/monitoring/HealthMonitor';
import { NotificationProvider } from './contexts/NotificationContext';
import { Notifications } from './components/Notifications';

type View = 'dashboard' | 'upload' | 'history' | 'settings' | 'trash' | 'analytics' | 'scheduler' | 'monitoring';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <Upload />;
      case 'history':
        return <BackupHistory />;
      case 'settings':
        return <Settings />;
      case 'trash':
        return <TrashBin />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'scheduler':
        return <BackupSchedulerComponent />;
      case 'monitoring':
        return <HealthMonitor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentView={currentView}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {renderCurrentView()}
          </main>
        </div>
        
        <Notifications />
      </div>
    </NotificationProvider>
  );
}

export default App;