import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { BackupHistory } from './components/BackupHistory';
import { BackupHistoryRestore } from './components/BackupHistoryRestore';
import { Settings } from './components/Settings';
import { TrashBin } from './components/TrashBin';
import { BackupSchedulerComponent } from './components/scheduler/BackupScheduler';
import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { SubscriptionModels } from './components/SubscriptionModels';
import { NotificationProvider } from './contexts/NotificationContext';
import { Notifications } from './components/Notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'upload' | 'history' | 'backup-restore' | 'settings' | 'trash' | 'scheduler' | 'subscription';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentView} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentView} />;
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <Upload />;
      case 'history':
        return <BackupHistory />;
      case 'backup-restore':
        return <BackupHistoryRestore />;
      case 'settings':
        return <Settings />;
      case 'trash':
        return <TrashBin />;
      case 'scheduler':
        return <BackupSchedulerComponent />;
      case 'subscription':
        return <SubscriptionModels onNavigate={setCurrentView} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  // Show auth pages if not authenticated
  if (!isAuthenticated && !['landing', 'login', 'signup'].includes(currentView)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderCurrentView()}
        <Notifications />
      </div>
    );
  }

  // Show auth pages
  if (['landing', 'login', 'signup'].includes(currentView)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderCurrentView()}
        <Notifications />
      </div>
    );
  }

  return (
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
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;