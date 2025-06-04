// server/routes/content.js

const express = require('express');
const authenticate = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const Content = require('../models/Content');

const multer = require('multer');

// Configure Multer storage:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save files into the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer middleware:
const upload = multer({ storage });

const router = express.Router();

/**
 * @route   POST /api/content
 * @desc    Create a new content entry (PDF/video upload).
 *          Only accessible to teachers and admins.
 * @access  Private (teacher/admin)
 */
router.post(
  '/',
  authenticate,
  roleMiddleware(['teacher', 'admin']),
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, description, grade } = req.body;

      // Multer will have placed the uploaded file info on req.file
      if (!req.file) {
        return res.status(400).json({ message: 'A file upload is required.' });
      }

      if (!title || !grade) {
        return res.status(400).json({ message: 'Title and grade are required.' });
      }

      // Build the file URL/path from req.file.path
      const fileUrl = req.file.path; // e.g., 'uploads/1616161616-filename.pdf'

      const newContent = new Content({
        title,
        description: description || '',
        grade,
        fileUrl,
        uploadedBy: req.user.id
      });

      const savedContent = await newContent.save();
      return res.status(201).json(savedContent);
    } catch (err) {
      console.error('Error creating content:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  }
);

/**
 * @route   GET /api/content/:grade
 * @desc    Get all content entries for a specific grade.
 *          Accessible to any authenticated user.
 * @access  Private
 */
router.get('/:grade', authenticate, async (req, res) => {
  try {
    const grade = parseInt(req.params.grade, 10);
    const contents = await Content.find({ grade }).populate('uploadedBy', 'name email');
    return res.json(contents);
  } catch (err) {
    console.error('Error fetching content:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
