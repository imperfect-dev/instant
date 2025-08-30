import { useState, useEffect } from 'react';
import { StorageStats } from '../types';

export function useStorage() {
  const [stats, setStats] = useState<StorageStats>({
    used: 0,
    total: 107374182400, // 100GB in bytes
    percentage: 0,
    breakdown: {
      documents: 0,
      images: 0,
      videos: 0,
      audio: 0,
      other: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading storage stats
    const loadStats = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate stats from localStorage or simulate
      const savedStats = localStorage.getItem('storage_stats');
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          setStats(parsedStats);
        } catch (error) {
          // Use default stats
        }
      }
      
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const updateStorageUsage = (additionalBytes: number, fileType: string) => {
    setStats(prev => {
      const newUsed = prev.used + additionalBytes;
      const newPercentage = (newUsed / prev.total) * 100;
      
      // Determine file category
      let category: keyof typeof prev.breakdown = 'other';
      if (fileType.startsWith('image/')) category = 'images';
      else if (fileType.startsWith('video/')) category = 'videos';
      else if (fileType.startsWith('audio/')) category = 'audio';
      else if (fileType.includes('document') || fileType.includes('pdf') || fileType.includes('text')) {
        category = 'documents';
      }

      const newStats = {
        ...prev,
        used: newUsed,
        percentage: newPercentage,
        breakdown: {
          ...prev.breakdown,
          [category]: prev.breakdown[category] + additionalBytes
        }
      };

      // Save to localStorage
      localStorage.setItem('storage_stats', JSON.stringify(newStats));
      
      return newStats;
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    stats,
    isLoading,
    updateStorageUsage,
    formatBytes
  };
}