const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper function to generate a JWT
function generateToken(user) {
  // Payload: user id and role
  const payload = {
    id: user._id,
    role: user.role
  };

  // Sign the token with your JWT_SECRET (from .env) and a short expiry
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student, parent, teacher, or admin)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, grade, childOf } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user object
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    // 5. Add grade or childOf if appropriate
    if (role === 'student') {
      if (typeof grade !== 'number') {
        return res.status(400).json({ message: 'Grade (number) is required for student role.' });
      }
      newUserData.grade = grade;
    } else if (role === 'parent') {
      if (!childOf) {
        return res.status(400).json({ message: 'childOf (student ID) is required for parent role.' });
      }
      newUserData.childOf = childOf;
    }

    // 6. Save the new user to MongoDB
    const user = await User.create(newUserData);

    // 7. Generate JWT
    const token = generateToken(user);

    // 8. Return the token (and some user info if you like)
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade || null,
        childOf: user.childOf || null
      }
    });
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Log in an existing user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Generate JWT
    const token = generateToken(user);

    // 5. Return the token and user info
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade || null,
        childOf: user.childOf || null
      }
    });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
