// server/middleware/roles.js

/**
 * roleMiddleware(requiredRoles)
 *   - requiredRoles: an array of roles allowed (e.g., ['teacher', 'admin'])
 * Usage: router.post('/some-route', authenticate, roleMiddleware(['teacher','admin']), handler)
 */
function roleMiddleware(requiredRoles) {
    return (req, res, next) => {
      if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
      }
      next();
    };
  }
  
  module.exports = roleMiddleware;
  