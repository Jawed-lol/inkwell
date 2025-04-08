const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get Cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ items: user.cart || [] });
  } catch (error) {
    console.error('Cart fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Cart
router.put('/', authMiddleware, async (req, res) => {
  const { items } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.cart = items;
    await user.save();
    res.json({ items: user.cart });
  } catch (error) {
    console.error('Cart update error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;