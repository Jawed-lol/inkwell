const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// POST route (your modified solution)
router.post(
  '/',
  authMiddleware,
  [
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*._id').notEmpty().withMessage('Each item must have a book ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item must have a quantity of at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Each item must have a non-negative price'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { items } = req.body;
      const bookIds = items.map((item) => item._id);
      const books = await Book.find({ _id: { $in: bookIds } });
      const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

      const validatedItems = items.map((item) => {
        if (!mongoose.Types.ObjectId.isValid(item._id)) {
          throw new Error(`Invalid book ID: ${item._id}`);
        }
        const book = bookMap.get(item._id);
        if (!book) {
          throw new Error(`Book with ID ${item._id} not found`);
        }
        if (book.price !== item.price) {
          throw new Error(`Price mismatch for book ${item._id}`);
        }
        return {
          bookSlug: book.slug,  // Using bookSlug instead of bookId
          quantity: item.quantity,
          price: item.price,
        };
      });

      const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = {
        orderId: `ORD-${uuidv4()}`,
        items: validatedItems,
        total,
        createdAt: new Date(),
      };

      user.orders.push(order);
      user.cart = [];
      await user.save();

      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error('Order creation error:', error.message, error.stack);
      res.status(error.message.includes('not found') || error.message.includes('mismatch') ? 400 : 500).json({
        message: error.message || 'Failed to create order',
      });
    }
  }
);

// GET route for fetching user orders - FIXED to use bookSlug instead of bookId
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all unique book slugs from all orders
    const bookSlugs = new Set();
    user.orders.forEach(order => {
      order.items.forEach(item => {
        bookSlugs.add(item.bookSlug);
      });
    });

    // Fetch all books referenced in orders
    const books = await Book.find({ slug: { $in: Array.from(bookSlugs) } });
    const bookMap = new Map(books.map(book => [book.slug, book]));

    // Manually "populate" the book details in the response
    const ordersWithDetails = user.orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.map(item => {
        const book = bookMap.get(item.bookSlug);
        return {
          ...item,
          book: book ? {
            _id: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            slug: book.slug,
            // Add any other book fields you need
          } : null
        };
      });
      return orderObj;
    });

    res.json({ orders: ordersWithDetails });
    
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;