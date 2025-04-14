const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const transformCartItems = async (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return [];
  }

  const bookSlugs = cartItems.map((item) => item.slug).filter(slug => slug);
  
  if (bookSlugs.length === 0) {
    return [];
  }
  
  try {
    // Try to find books by slug
    let books = await Book.find({ slug: { $in: bookSlugs } }).populate('author', 'name');
    console.log('Found books by slug:', books.length, 'for slugs:', bookSlugs);
    
    // If we didn't find all books, try to find the remaining ones by _id
    if (books.length < bookSlugs.length) {
      const foundSlugs = books.map(book => book.slug);
      const missingSlugs = bookSlugs.filter(slug => !foundSlugs.includes(slug));
      
      // Filter out slugs that don't look like ObjectIds
      const possibleIds = missingSlugs.filter(slug => /^[0-9a-fA-F]{24}$/.test(slug));
      
      if (possibleIds.length > 0) {
        const additionalBooks = await Book.find({ _id: { $in: possibleIds } }).populate('author', 'name');
        console.log('Found additional books by _id:', additionalBooks.length);
        books = [...books, ...additionalBooks];
      }
    }
    
    // Create a map of books by both slug and _id for easier lookup
    const bookMap = new Map();
    books.forEach(book => {
      if (book.slug) bookMap.set(book.slug, book);
      if (book._id) bookMap.set(book._id.toString(), book);
    });

    const transformedItems = cartItems.map((item) => {
      if (!item.slug) {
        console.warn('Item has no slug:', item);
        return null;
      }
      
      // Try to find the book by slug or _id
      const book = bookMap.get(item.slug);
      
      if (!book) {
        console.warn('Book not found for slug:', item.slug);
        // Return a placeholder item
        return {
          _id: item.slug,
          slug: item.slug,
          title: 'Unknown Book',
          price: 0,
          urlPath: '/placeholder.svg',
          author: 'Unknown Author',
          quantity: item.quantity
        };
      }
      
      // Extract author name correctly
      let authorName = 'Unknown Author';
      if (typeof book.author === 'string') {
        authorName = book.author;
      } else if (book.author && typeof book.author === 'object') {
        authorName = book.author.name || 'Unknown Author';
      }
      
      return {
        _id: book._id.toString(),
        slug: book.slug,
        title: book.title || 'Unknown Title',
        price: book.price || 0,
        urlPath: book.urlPath || '/placeholder.svg',
        author: authorName,
        quantity: item.quantity
      };
    }).filter(item => item !== null);
    
    console.log('Transformed items:', transformedItems);
    return transformedItems;
  } catch (error) {
    console.error('Error transforming cart items:', error);
    // Return the original items with placeholder data
    return cartItems.map(item => ({
      _id: item.slug,
      slug: item.slug,
      quantity: item.quantity,
      title: "Unknown Book",
      price: 0,
      urlPath: "/placeholder.svg",
      author: "Unknown Author"
    }));
  }
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
          const user = await User.findById(req.user.id);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Log incoming items for debugging
          console.log('Received cart items:', items);

          // Modified validation to handle errors gracefully
          const validItems = [];
          for (const item of items) {
              try {
                  if (!item.slug || typeof item.slug !== 'string' || item.slug.trim() === '') {
                      console.warn(`Invalid slug: ${item.slug}`);
                      continue;
                  }
                  
                  validItems.push({
                      slug: item.slug,
                      quantity: item.quantity,
                  });
              } catch (err) {
                  console.error(`Error processing item ${JSON.stringify(item)}:`, err);
              }
          }

          // Update user's cart with valid items
          user.cart = validItems;
          await user.save();

          // Transform and return valid cart items
          const validCartItems = await transformCartItems(validItems);
          
          // If transformation returned empty but we had valid items, return the original items
          if (validCartItems.length === 0 && validItems.length > 0) {
              return res.json({ 
                  items: validItems.map(item => ({
                      slug: item.slug,
                      quantity: item.quantity,
                      title: "Unknown Book", // Placeholder
                      price: 0,
                      urlPath: "/placeholder.svg",
                      author: "Unknown Author",
                      _id: item.slug // Include _id to match frontend expectations
                  }))
              });
          }
          
          res.json({ items: validCartItems });
      } catch (error) {
          console.error('Update cart error:', error.message, error.stack);
          res.status(500).json({
              message: error.message || 'Failed to update cart',
          });
      }
  }
);

module.exports = router;