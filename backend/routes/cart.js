const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('GET /cart hit for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItems = await Promise.all(
      user.cart.map(async (item) => {
        const book = await Book.findOne({ slug: item.slug });
        if (!book) {
          console.log('Book not found for slug:', item.slug);
          return null;
        }
        return {
          slug: book.slug,
          title: book.title || 'Unknown Title',
          price: book.price || 0,
          urlPath: book.urlPath || '/placeholder.svg',
          author: book.author || 'Unknown Author',
          quantity: item.quantity,
        };
      })
    );
    const validCartItems = cartItems.filter((item) => item !== null);
    res.json({ items: validCartItems });
  } catch (error) {
    console.error('Get cart error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { items } = req.body;
  try {
    console.log('PUT /cart hit with items:', JSON.stringify(items, null, 2));
    if (!Array.isArray(items)) {
      console.log('Invalid items format:', items);
      return res.status(400).json({ message: 'Items must be an array' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.slug || typeof item.quantity !== 'number') {
          console.log('Invalid item format:', item);
          throw new Error('Each item must have a valid slug and numeric quantity');
        }
        const book = await Book.findOne({ slug: item.slug });
        if (!book) {
          console.log('Book not found for slug:', item.slug);
          throw new Error(`Book with slug ${item.slug} not found`);
        }
        return {
          slug: item.slug,
          quantity: item.quantity,
        };
      })
    );
    user.cart = validatedItems;
    await user.save();
    console.log('Cart saved successfully for user:', req.user.id);
    const cartItems = await Promise.all(
      validatedItems.map(async (item) => {
        const book = await Book.findOne({ slug: item.slug });
        if (!book) {
          console.log('Book not found for slug:', item.slug);
          return null;
        }
        return {
          slug: book.slug,
          title: book.title || 'Unknown Title',
          price: book.price || 0,
          urlPath: book.urlPath || '/placeholder.svg',
          author: book.author || 'Unknown Author',
          quantity: item.quantity,
        };
      })
    );
    const validCartItems = cartItems.filter((item) => item !== null);
    res.json({ items: validCartItems });
  } catch (error) {
    console.error('Update cart error:', error.message, error.stack);
    res.status(400).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;