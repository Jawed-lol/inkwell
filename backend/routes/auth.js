const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Add this import
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, second_name, email, password } = req.body;
  try {
    console.log('Register route hit with:', req.body);
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated:', salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');
    user = new User({
      firstName: first_name,
      lastName: second_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log('User saved successfully:', user);
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);
    res.status(201).json({ token });
    console.log('Response sent');
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login route hit with:', { email });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login token generated:', token);
    res.status(200).json({ token });
    console.log('Login response sent');
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/wishlist', authMiddleware, async (req, res) => {
  const { bookId } = req.body;
  try {
    console.log('Adding to wishlist, user ID:', req.user.id, 'bookId:', bookId);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }
    user.wishlist.push(bookId);
    await user.save();
    res.status(200).json({ message: 'Book added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Wishlist add error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching wishlist for user ID:', req.user.id);
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from Wishlist
router.delete('/wishlist/:bookId', authMiddleware, async (req, res) => {
  const { bookId } = req.params;
  try {
    console.log('Removing from wishlist, user ID:', req.user.id, 'bookId:', bookId);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();
    res.status(200).json({ message: 'Book removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Wishlist remove error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;