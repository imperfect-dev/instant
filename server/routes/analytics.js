const express = require('express');
const BackupSession = require('../models/BackupSession');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get backup statistics
    const backupStats = await BackupSession.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          successful: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          totalSize: { $sum: '$completedSize' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get storage usage over time
    const storageUsage = await BackupSession.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          totalSize: { $sum: '$completedSize' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate success rate
    const totalBackups = await BackupSession.countDocuments({
      createdAt: { $gte: startDate }
    });

    const successfulBackups = await BackupSession.countDocuments({
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const successRate = totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : 0;

    res.json({
      backupTrends: {
        labels: backupStats.map(stat => stat._id),
        successful: backupStats.map(stat => stat.successful),
        failed: backupStats.map(stat => stat.failed)
      },
      storageUsage: {
        labels: storageUsage.map(usage => usage._id),
        data: storageUsage.map(usage => usage.totalSize / (1024 * 1024 * 1024)) // Convert to GB
      },
      successRate,
      totalBackups,
      successfulBackups
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

// Get performance metrics
router.get('/performance', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Mock performance data (in a real app, this would come from monitoring)
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const performanceData = {
      labels,
      uploadSpeed: labels.map(() => Math.random() * 100 + 50),
      downloadSpeed: labels.map(() => Math.random() * 150 + 75)
    };

    res.json(performanceData);
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});

module.exports = router;