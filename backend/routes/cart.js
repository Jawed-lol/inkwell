const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Helper function to transform cart items
const transformCartItems = async (cartItems) => {
  const bookSlugs = cartItems.map((item) => item.slug);
  const books = await Book.find({ slug: { $in: bookSlugs } }).populate('author', 'name');
  const bookMap = new Map(books.map((book) => [book.slug, book]));

  return cartItems
    .map((item) => {
      const book = bookMap.get(item.slug);
      if (!book) {
        console.warn('Book not found for slug:', item.slug);
        return null;
      }
      return {
        slug: book.slug,
        title: book.title || 'Unknown Title',
        price: book.price || 0,
        urlPath: book.urlPath || '/placeholder.svg',
        author: book.author.name || 'Unknown Author',
        quantity: item.quantity,
      };
    })
    .filter((item) => item !== null);
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validCartItems = await transformCartItems(user.cart);
    res.json({ items: validCartItems });
  } catch (error) {
    console.error('Get cart error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
});

router.put(
  '/',
  authMiddleware,
  [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.slug').notEmpty().withMessage('Each item must have a slug'),
    body('items.*.quantity').isInt({ min: 0 }).withMessage('Each item must have a non-negative quantity'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { items } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const validatedItems = await Promise.all(
        items.map(async (item) => {
          const book = await Book.findOne({ slug: item.slug });
          if (!book) {
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

      const validCartItems = await transformCartItems(validatedItems);
      res.json({ items: validCartItems });
    } catch (error) {
      console.error('Update cart error:', error.message, error.stack);
      res.status(error.message.includes('not found') ? 400 : 400).json({
        message: error.message || 'Failed to update cart',
      });
    }
  }
);

module.exports = router;