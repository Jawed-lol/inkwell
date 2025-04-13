const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await user.save();
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (error) {
      console.error('Register error:', error.message, error.stack);
      res.status(500).json({ message: 'Failed to register user' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error.message, error.stack);
      res.status(500).json({ message: 'Failed to login' });
    }
  }
);

// Profile GET
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const wishlistItems = user.wishlist.length;
    const orderedItems = user.orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
      wishlistItems,
      orderedItems,
    });
  } catch (error) {
    console.error('Profile error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Orders GET
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders.items.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.orders);
  } catch (error) {
    console.error('Orders fetch error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Profile PUT (Update)
router.put(
  '/profile',
  authMiddleware,
  [
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { firstName, lastName, email } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
      await user.save();
      const wishlistItems = user.wishlist.length;
      const orderedItems = user.orders.reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
      );
      res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        createdAt: user.createdAt,
        wishlistItems,
        orderedItems,
      });
    } catch (error) {
      console.error('Profile update error:', error.message, error.stack);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }
);

// Wishlist POST
router.post('/wishlist', authMiddleware, async (req, res) => {
  const { bookId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }
    user.wishlist.push(bookId);
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({ message: 'Book added to wishlist', wishlist: populatedUser.wishlist });
  } catch (error) {
    console.error('Wishlist add error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

// Wishlist GET
router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// Wishlist DELETE
router.delete('/wishlist/:bookId', authMiddleware, async (req, res) => {
  const { bookId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    if (user.wishlist.length === initialLength) {
      return res.status(400).json({ message: 'Book not found in wishlist' });
    }
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({ message: 'Book removed from wishlist', wishlist: populatedUser.wishlist });
  } catch (error) {
    console.error('Wishlist remove error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

module.exports = router;