const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');
const router = express.Router();

// Helper function for validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  return null;
};

// Request password reset
router.post(
  '/forgot-password',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email format'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { email } = req.body;
    
    // Generic response for security (don't reveal if email exists)
    const genericResponse = { 
      success: true, 
      message: 'If your email is registered, you will receive password reset instructions shortly' 
    };

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal that the email doesn't exist
        return res.status(200).json(genericResponse);
      }
      
      // Generate a reset token
      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // Save the reset token and expiry to the user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
      
      // Send the password reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (!emailSent) {
        console.error(`Failed to send password reset email to ${email}`);
        // Don't reveal the email sending failure to the user
      }
      
      // Return the generic success response
      res.status(200).json(genericResponse);
    } catch (error) {
      console.error('Forgot password error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to process password reset request' });
    }
  }
);

// Reset password with token
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { token, newPassword } = req.body;
    try {
      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      
      // Find the user with the token and check if token is expired
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update the user's password and clear the reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      // Return success response
      res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
  }
);

module.exports = router;