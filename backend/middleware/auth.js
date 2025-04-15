const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Check for JWT secret
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  // Get authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  // Validate token exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract user ID from token using various possible field names
    const userId = decoded.id || decoded._id || decoded.userId || 
                  (decoded.user && decoded.user._id);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token structure' });
    }
    
    // Set user ID in request object with both id and _id for compatibility
    req.user = { id: userId, _id: userId };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;