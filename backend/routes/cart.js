const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * Transform cart items by fetching book details
 * @param {Array} cartItems - Array of cart items with slug and quantity
 * @returns {Array} - Transformed cart items with book details
 */
const transformCartItems = async (cartItems) => {
  // Return empty array for invalid input
  if (!cartItems?.length) {
    return [];
  }

  // Extract valid book slugs
  const bookSlugs = cartItems.map(item => item.slug || item.bookSlug).filter(Boolean);
  
  if (!bookSlugs.length) {
    return [];
  }
  
  try {
    // Find books by slug
    const books = await Book.find({ slug: { $in: bookSlugs } })
      .populate('author', 'name bio _id')
      .lean();
    
    // Create a map for O(1) lookups
    const bookMap = new Map();
    
    // Try to find books by ID if they look like MongoDB ObjectIds
    if (books.length < bookSlugs.length) {
      const foundSlugs = new Set(books.map(book => book.slug));
      const possibleIds = bookSlugs
        .filter(slug => !foundSlugs.has(slug))
        .filter(slug => /^[0-9a-fA-F]{24}$/.test(slug));
      
      if (possibleIds.length) {
        const additionalBooks = await Book.find({ _id: { $in: possibleIds } })
          .populate('author', 'name bio _id')
          .lean();
          
        books.push(...additionalBooks);
      }
    }
    
    // Populate the lookup map with both slug and ID keys
    books.forEach(book => {
      if (book.slug) bookMap.set(book.slug, book);
      if (book._id) bookMap.set(book._id.toString(), book);
    });

    // Transform cart items with book details
    return cartItems
      .map(item => {
        const slug = item.slug || item.bookSlug; // <-- FIX: support both
        if (!slug) return null;
        
        const book = bookMap.get(slug);
        
        if (!book) {
          return createPlaceholderItem({ ...item, slug });
        }
        
        return {
          _id: book._id.toString(),
          slug: book.slug,
          title: book.title || 'Unknown Title',
          price: book.price || 0,
          urlPath: book.urlPath || '/placeholder.svg',
          author: extractAuthorInfo(book.author),
          quantity: item.quantity
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error transforming cart items:', error);
    // Return placeholder items on error
    return cartItems.map(item => createPlaceholderItem(item));
  }
};

/**
 * Create a placeholder item when book is not found
 * @param {Object} item - Cart item
 * @returns {Object} - Placeholder item
 */
const createPlaceholderItem = (item) => ({
  _id: item.slug,
  slug: item.slug,
  title: 'Unknown Book',
  price: 0,
  urlPath: '/placeholder.svg',
  author: {
    name: 'Unknown Author',
    _id: '',
    bio: ''
  },
  quantity: item.quantity
});

/**
 * Extract author information from book
 * @param {Object|string} author - Author data
 * @returns {Object} - Formatted author object
 */
const extractAuthorInfo = (author) => {
  if (!author) {
    return { name: 'Unknown Author', _id: '', bio: '' };
  }
  
  if (typeof author === 'string') {
    return { name: author, _id: '', bio: '' };
  }
  
  return {
    name: author.name || 'Unknown Author',
    _id: author._id ? author._id.toString() : '',
    bio: author.bio || ''
  };
};

// Get cart items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validCartItems = await transformCartItems(user.cart);
    res.json({ items: validCartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
});

// Update cart items
router.put(
  '/',
  authMiddleware,
  [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.slug')
      .isString()
      .notEmpty()
      .trim()
      .withMessage('Each item must have a valid non-empty slug'),
    body('items.*.quantity').isInt({ min: 0 }).withMessage('Each item must have a non-negative quantity'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { items } = req.body;

      // Filter valid items
      const validItems = items
        .filter(item => item.slug && typeof item.slug === 'string' && item.slug.trim() !== '')
        .map(item => ({
          bookSlug: item.slug,
          quantity: item.quantity,
        }));

      // Atomically update user's cart
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { cart: validItems },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform and return valid cart items
      const transformedItems = await transformCartItems(validItems);

      res.json({
        items: transformedItems.length ? transformedItems : validItems.map(createPlaceholderItem)
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({
        message: error.message || 'Failed to update cart',
      });
    }
  }
);

module.exports = router;