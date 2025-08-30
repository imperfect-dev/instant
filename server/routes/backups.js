const express = require('express');
const BackupSession = require('../models/BackupSession');

const router = express.Router();

// Get all backup sessions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const backups = await BackupSession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BackupSession.countDocuments(query);

    res.json({
      backups,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new backup session
router.post('/', async (req, res) => {
  try {
    const { name, type, files } = req.body;

    const backupSession = new BackupSession({
      name,
      type,
      files: files || [],
      totalFiles: files ? files.length : 0,
      totalSize: files ? files.reduce((sum, file) => sum + file.size, 0) : 0
    });

    await backupSession.save();
    res.status(201).json(backupSession);
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Server error during backup creation' });
  }
});

// Get specific backup session
router.get('/:id', async (req, res) => {
  try {
    const backup = await BackupSession.findById(req.params.id);

    if (!backup) {
      return res.status(404).json({ message: 'Backup session not found' });
    }

    res.json(backup);
  } catch (error) {
    console.error('Get backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update backup session
router.put('/:id', async (req, res) => {
  try {
    const { status, completedFiles, completedSize, endTime, errorMessage } = req.body;

    const backup = await BackupSession.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        completedFiles, 
        completedSize, 
        endTime: endTime ? new Date(endTime) : undefined,
        errorMessage 
      },
      { new: true, runValidators: true }
    );

    if (!backup) {
      return res.status(404).json({ message: 'Backup session not found' });
    }

    res.json(backup);
  } catch (error) {
    console.error('Update backup error:', error);
    res.status(500).json({ message: 'Server error during backup update' });
  }
});

// Delete backup session
router.delete('/:id', async (req, res) => {
  try {
    const backup = await BackupSession.findByIdAndDelete(req.params.id);

    if (!backup) {
      return res.status(404).json({ message: 'Backup session not found' });
    }

    res.json({ message: 'Backup session deleted successfully' });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({ message: 'Server error during backup deletion' });
  }
});

// Get backup statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await BackupSession.aggregate([
      {
        $group: {
          _id: null,
          totalBackups: { $sum: 1 },
          completedBackups: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalSize: { $sum: '$completedSize' },
          avgSize: { $avg: '$completedSize' }
        }
      }
    ]);

    const result = stats[0] || {
      totalBackups: 0,
      completedBackups: 0,
      totalSize: 0,
      avgSize: 0
    };

    result.successRate = result.totalBackups > 0 
      ? (result.completedBackups / result.totalBackups) * 100 
      : 0;

    res.json(result);
  } catch (error) {
    console.error('Get backup stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;