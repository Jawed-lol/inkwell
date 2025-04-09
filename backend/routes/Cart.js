const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('GET /api/cart hit for user:', req.user.id);
    const user = await User.findById(req.user.id).populate('cart._id');
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItems = user.cart.map(item => {
      const book = item._id;
      return {
        _id: book._id,
        title: book.title || 'Unknown Title',
        price: book.price || 0,
        urlPath: book.urlPath || '/placeholder.svg',
        author: book.author || 'Unknown Author',
        quantity: item.quantity,
      };
    });
    res.json({ items: cartItems });
  } catch (error) {
    console.error('Get cart error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { items } = req.body;
  try {
    console.log('PUT /api/cart hit with items:', JSON.stringify(items, null, 2));
    if (!Array.isArray(items)) {
      console.log('Invalid items format:', items);
      return res.status(400).json({ message: 'Items must be an array' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    // Validate items
    const validatedItems = items.map(item => {
      if (!item._id || typeof item.quantity !== 'number') {
        console.log('Invalid item format:', item);
        throw new Error('Each item must have a valid _id and numeric quantity');
      }
      return {
        _id: item._id,
        quantity: item.quantity,
      };
    });
    user.cart = validatedItems;
    await user.save();
    console.log('Cart saved successfully for user:', req.user.id);
    const updatedUser = await User.findById(req.user.id).populate('cart._id');
    if (!updatedUser) throw new Error('Failed to fetch updated user');
    const cartItems = updatedUser.cart.map(item => {
      if (!item._id) {
        console.log('Population failed for item:', item);
        throw new Error('Book population failed');
      }
      const book = item._id;
      return {
        _id: book._id,
        title: book.title || 'Unknown Title',
        price: book.price || 0,
        urlPath: book.urlPath || '/placeholder.svg',
        author: book.author || 'Unknown Author',
        quantity: item.quantity,
      };
    });
    res.json({ items: cartItems });
  } catch (error) {
    console.error('Update cart error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;