// server/routes/user.js

const express = require('express');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/user/profile
 * @desc    Return basic profile info for the logged-in user
 * @access  Private (requires a valid JWT)
 */
router.get('/profile', authenticate, (req, res) => {
  // req.user was set by auth middleware
  const { id, name, email, role, grade, childOf } = req.user;
  return res.json({ id, name, email, role, grade, childOf });
});

module.exports = router;
