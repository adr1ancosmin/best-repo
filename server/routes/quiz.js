// server/routes/quiz.js

const express = require('express');
const authenticate = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const Quiz = require('../models/Quiz');

const router = express.Router();

/**
 * @route   POST /api/quiz
 * @desc    Create a new quiz (teacher/admin only)
 * @access  Private (teacher/admin)
 */
router.post(
  '/',
  authenticate,
  roleMiddleware(['teacher', 'admin']),
  async (req, res) => {
    try {
      const { grade, title, questions } = req.body;

      if (!grade || !title || !Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ message: 'Grade, title, and at least one question are required.' });
      }

      const newQuiz = new Quiz({
        grade,
        title,
        questions,
        createdBy: req.user.id
      });

      const savedQuiz = await newQuiz.save();
      return res.status(201).json(savedQuiz);
    } catch (err) {
      console.error('Error creating quiz:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  }
);

/**
 * @route   GET /api/quiz/:grade
 * @desc    Get all quizzes for a specific grade (authenticated users)
 * @access  Private
 */
router.get('/:grade', authenticate, async (req, res) => {
  try {
    const grade = parseInt(req.params.grade, 10);
    const quizzes = await Quiz.find({ grade }).populate('createdBy', 'name email');
    return res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;