const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register (unchanged)
router.post('/register', async (req, res) => {
  const { first_name, second_name, email, password } = req.body;
  try {
    console.log('Register route hit with:', req.body);
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      firstName: first_name,
      lastName: second_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (unchanged)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const wishlistItems = user.wishlist.length;
    const orderedItems = user.orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
      wishlistItems,
      orderedItems
    });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders.items.bookId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.orders);
  } catch (error) {
    console.error('Orders fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile PUT (Update)
router.put('/profile', authMiddleware, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    await user.save();
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
      wishlistItems: user.wishlist.length,
      orderedItems: user.orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/wishlist', authMiddleware, async (req, res) => {
  const { bookId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
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
    console.error('Wishlist add error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/wishlist/:bookId', authMiddleware, async (req, res) => {
  const { bookId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();
    res.status(200).json({ message: 'Book removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Wishlist remove error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;