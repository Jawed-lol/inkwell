const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// POST route to create a new order
router.post(
  '/',
  authMiddleware,
  [
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.bookSlug').notEmpty().withMessage('Each item must have a book slug'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item must have a quantity of at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Each item must have a non-negative price'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const { items } = req.body;
      const bookSlugs = items.map(item => item.bookSlug);

      // Fetch all books in one query
      const books = await Book.find({ slug: { $in: bookSlugs } }).lean();
      const bookMap = new Map(books.map(book => [book.slug, book]));

      // Validate all items before making any changes
      const validatedItems = items.map(item => {
        const book = bookMap.get(item.bookSlug);
        if (!book) throw new Error(`Book with slug ${item.bookSlug} not found`);
        if (book.price !== item.price) throw new Error(`Price mismatch for book ${item.bookSlug}`);
        if (book.stock < item.quantity) throw new Error(`Insufficient stock for book ${item.bookSlug}`);
        return {
          bookSlug: item.bookSlug,
          quantity: item.quantity,
          price: item.price,
        };
      });

      // Update stock for all books in bulk
      const bulkOps = validatedItems.map(item => ({
        updateOne: {
          filter: { slug: item.bookSlug },
          update: { $inc: { stock: -item.quantity } }
        }
      }));
      await Book.bulkWrite(bulkOps);

      // Calculate total and create order
      const total = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = {
        orderId: `ORD-${uuidv4()}`,
        items: validatedItems,
        total,
        createdAt: new Date(),
      };

      // Clear only ordered items from cart
      const orderedSlugs = new Set(validatedItems.map(item => item.bookSlug));
      user.cart = user.cart.filter(cartItem => !orderedSlugs.has(cartItem.bookSlug));
      user.orders.push(order);
      await user.save();

      res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
    } catch (error) {
      console.error('Order creation error:', error.message, error.stack);
      const statusCode =
        error.message.includes('not found') ? 404 :
        error.message.includes('mismatch') || error.message.includes('stock') ? 400 : 
        500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create order',
      });
    }
  }
);

// GET route to fetch user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Support pagination with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get unique book slugs from orders for the current page only
    const bookSlugs = new Set();
    const paginatedOrders = user.orders.slice(startIndex, endIndex);

    paginatedOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.bookSlug) {
          bookSlugs.add(item.bookSlug);
        }
      });
    });

    // Fetch only the books needed for this page
    const books = await Book.find({ 
      slug: { $in: Array.from(bookSlugs) } 
    }).populate('author', 'name').lean();

    const bookMap = new Map(books.map(book => [book.slug, book]));

    // Enrich orders with book details
    const ordersWithDetails = paginatedOrders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.map(item => {
        const book = item.bookSlug && bookMap.get(item.bookSlug);
        return {
          ...item,
          book: book
            ? {
                _id: book._id.toString(),
                title: book.title,
                author: book.author?.name || 'Unknown Author',
                price: book.price,
                slug: book.slug,
                urlPath: book.urlPath || '/images/placeholder.jpg',
              }
            : {
                _id: null,
                title: 'Book unavailable',
                author: 'N/A',
                price: item.price,
                slug: item.bookSlug || 'unknown',
                urlPath: '/images/placeholder.jpg',
              },
        };
      });
      return orderObj;
    });

    res.json({
      success: true,
      orders: ordersWithDetails,
      totalPages: Math.ceil(user.orders.length / limit),
      currentPage: page,
      totalOrders: user.orders.length
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch orders' 
    });
  }
});

module.exports = router;