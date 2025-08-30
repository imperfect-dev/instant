import { useState, useCallback } from 'react';
import { BackupSession, BackupFile } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

export function useBackup() {
  const [sessions, setSessions] = useState<BackupSession[]>([]);
  const [currentSession, setCurrentSession] = useState<BackupSession | null>(null);
  const { addNotification } = useNotifications();

  const createBackupSession = useCallback((name: string, type: BackupSession['type']) => {
    const session: BackupSession = {
      id: Date.now().toString(),
      name,
      type,
      status: 'pending',
      startTime: new Date(),
      totalFiles: 0,
      completedFiles: 0,
      totalSize: 0,
      completedSize: 0,
      files: []
    };

    setSessions(prev => [session, ...prev]);
    setCurrentSession(session);
    return session;
  }, []);

  const addFilesToSession = useCallback((sessionId: string, files: File[]) => {
    const backupFiles: BackupFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      path: file.webkitRelativePath || file.name,
      lastModified: new Date(file.lastModified),
      status: 'pending',
      progress: 0
    }));

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          files: [...session.files, ...backupFiles],
          totalFiles: session.totalFiles + backupFiles.length,
          totalSize: session.totalSize + backupFiles.reduce((sum, f) => sum + f.size, 0)
        };
      }
      return session;
    }));

    return backupFiles;
  }, []);

  const startBackup = useCallback(async (sessionId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, status: 'running' };
      }
      return session;
    }));

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    addNotification({
      type: 'info',
      message: `Backup "${session.name}" started with ${session.totalFiles} files`
    });

    // Simulate backup process
    for (let i = 0; i < session.files.length; i++) {
      const file = session.files[i];
      
      // Update file status to uploading
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            files: s.files.map(f => 
              f.id === file.id ? { ...f, status: 'uploading' } : f
            )
          };
        }
        return s;
      }));

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 20) {
        await new Promise(resolve => setTimeout(resolve, 50));
        
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            return {
              ...s,
              files: s.files.map(f => 
                f.id === file.id ? { ...f, progress: Math.min(progress, 100) } : f
              )
            };
          }
          return s;
        }));
      }

      // Mark file as completed
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            files: s.files.map(f => 
              f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
            ),
            completedFiles: s.completedFiles + 1,
            completedSize: s.completedSize + file.size
          };
        }
        return s;
      }));
    }

    // Mark session as completed
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { 
          ...session, 
          status: 'completed',
          endTime: new Date()
        };
      }
      return session;
    }));

    addNotification({
      type: 'success',
      message: `Backup "${session.name}" completed successfully!`
    });
  }, [sessions, addNotification]);

  const pauseBackup = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, status: 'paused' };
      }
      return session;
    }));
  }, []);

  const resumeBackup = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, status: 'running' };
      }
      return session;
    }));
  }, []);

  const cancelBackup = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, status: 'failed' };
      }
      return session;
    }));
  }, []);

  return {
    sessions,
    currentSession,
    createBackupSession,
    addFilesToSession,
    startBackup,
    pauseBackup,
    resumeBackup,
    cancelBackup
  };
}