const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || '/tmp/uploads';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600 // 100MB default
  },
  fileFilter: (req, file, cb) => {
    // Add file type restrictions if needed
    cb(null, true);
  }
});

// Upload files
router.post('/upload', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Download file
router.get('/download/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const uploadPath = process.env.UPLOAD_PATH || '/tmp/uploads';
    const filePath = path.join(uploadPath, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'File download failed' });
  }
});

// Delete file
router.delete('/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const uploadPath = process.env.UPLOAD_PATH || '/tmp/uploads';
    const filePath = path.join(uploadPath, filename);

    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'File deletion failed' });
  }
});

module.exports = router;