// server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT and attach user to req.user.
 * If no token is provided or it’s invalid, returns 401.
 */
async function authenticate(req, res, next) {
  try {
    // 1. Read the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    // 2. Extract token from header (“Bearer <token>”)
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // 3. Find the user in the database (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // 4. Attach user info to req.user
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade || null,
      childOf: user.childOf || null
    };

    next();
  } catch (err) {
    console.error('Error in auth middleware:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = authenticate;
