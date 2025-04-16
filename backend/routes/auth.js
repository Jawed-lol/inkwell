const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { Book } = require('../models/Books');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Helper functions
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  return null;
};

const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      
      await user.save();
      const token = generateToken(user._id);
      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error('Register error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to register user' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      
      const token = generateToken(user._id);
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error('Login error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to login' });
    }
  }
);

// Profile GET
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'wishlist',
        select: '_id title author urlPath slug price',
        populate: {
          path: 'author',
          select: 'name bio'
        }
      })
      .lean();
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const response = {
      success: true,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
      wishlistItems: user.wishlist?.length || 0,
      orderedItems: user.orders?.length || 0,
      wishlist: user.wishlist
    };

    res.json(response);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Profile PUT (Update)
router.put(
  '/profile',
  authMiddleware,
  [
    body('email').optional().trim().isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { firstName, lastName, email } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        user.email = email;
      }
      
      await user.save();
      
      res.json({
        success: true,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        createdAt: user.createdAt,
        wishlistItems: user.wishlist.length || 0,
        orderedItems: user.orders?.length || 0
      });
    } catch (error) {
      console.error('Profile update error:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  }
);

// Wishlist routes
router.post('/wishlist', authMiddleware, async (req, res) => {
  const { bookSlug } = req.body;
  
  if (!bookSlug) {
    return res.status(400).json({ success: false, message: 'Book slug is required' });
  }
  
  try {
    const book = await Book.findOne({ slug: bookSlug });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.wishlist.includes(book._id)) {
      return res.status(400).json({ success: false, message: 'Book already in wishlist' });
    }
    
    user.wishlist.push(book._id);
    await user.save();
    
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: {
        path: 'author',
        select: 'name bio'
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Book added to wishlist', 
      wishlist: populatedUser.wishlist 
    });
  } catch (error) {
    console.error('Wishlist add error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
});

router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: '_id title author urlPath slug price',
      populate: {
        path: 'author',
        select: 'name bio'
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json(user.wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

router.delete('/wishlist/:bookSlug', authMiddleware, async (req, res) => {
  const { bookSlug } = req.params;
  
  if (!bookSlug) {
    return res.status(400).json({ success: false, message: 'Book slug is required' });
  }
  
  try {
    const book = await Book.findOne({ slug: bookSlug });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== book._id.toString());
    
    if (user.wishlist.length === initialLength) {
      return res.status(400).json({ success: false, message: 'Book not found in wishlist' });
    }
    
    await user.save();
    
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: '_id title author urlPath slug price',
      populate: {
        path: 'author',
        select: 'name bio'
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Book removed from wishlist', 
      wishlist: populatedUser.wishlist 
    });
  } catch (error) {
    console.error('Wishlist remove error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
});

// Orders GET
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (!user.orders || user.orders.length === 0) {
      return res.json({ success: true, orders: [] });
    }
    
    // Fetch book details for orders
    const bookSlugs = new Set();
    user.orders.forEach((order) => {
      order.items.forEach((item) => bookSlugs.add(item.bookSlug));
    });
    
    const books = await Book.find({ slug: { $in: Array.from(bookSlugs) } })
      .populate('author', 'name')
      .lean();
      
    const bookMap = new Map(books.map((book) => [book.slug, book]));

    const ordersWithDetails = user.orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.map((item) => {
        const book = bookMap.get(item.bookSlug);
        return {
          ...item,
          book: book
            ? {
                _id: book._id,
                title: book.title,
                author: book.author,
                price: book.price,
                slug: book.slug,
                urlPath: book.urlPath,
              }
            : {
                slug: item.bookSlug,
                title: 'Book unavailable',
                author: 'N/A',
                price: item.price,
                _id: null,
                urlPath: '/placeholder.svg',
              },
        };
      });
      return orderObj;
    });

    res.json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    console.error('Orders fetch error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

module.exports = router;