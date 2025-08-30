const express = require('express');
const Schedule = require('../models/Schedule');

const router = express.Router();

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .sort({ createdAt: -1 });
    
    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new schedule
router.post('/', async (req, res) => {
  try {
    const {
      name,
      frequency,
      time,
      dayOfWeek,
      dayOfMonth,
      backupType,
      includePaths,
      excludePaths,
      enabled
    } = req.body;

    const schedule = new Schedule({
      name,
      frequency,
      time,
      dayOfWeek,
      dayOfMonth,
      backupType,
      includePaths,
      excludePaths,
      enabled
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error during schedule creation' });
  }
});

// Update schedule
router.put('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error during schedule update' });
  }
});

// Delete schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error during schedule deletion' });
  }
});

module.exports = router;