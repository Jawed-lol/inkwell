const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { Book, Author } = require('../models/Books');
const slugify = require('slugify');

// Joi Validation Schemas
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.alternatives().try(
    Joi.string().hex().length(24), // Author ID
    Joi.object({
      name: Joi.string().required(),
      bio: Joi.string().required(),
    })
  ).required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  pages_number: Joi.number().integer().min(1).required(),
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  price: Joi.number().min(0).required(),
  urlPath: Joi.string().required(),
  isbn: Joi.string().required(),
  language: Joi.string().required(),
  publisher: Joi.string().required(),
  synopsis: Joi.string().required(),
  slug: Joi.string().optional(),
});

const reviewSchema = Joi.object({
  user_id: Joi.string().hex().length(24).required(), // Validate as ObjectId
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
});

// Helper functions
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  return Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length * 10) / 10;
};

const formatBookResponse = (book) => {
  return {
    ...book,
    author: {
      name: book.author.name,
      _id: book.author._id,
      bio: book.author.about || book.author.bio || ''
    },
    slug: book.slug,
    rating: calculateAverageRating(book.reviews),
  };
};

// GET search books
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }
    
    const authors = await Author.find({ name: { $regex: q, $options: 'i' } }).lean();
    const authorIds = authors.map((author) => author._id);
    
    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
        { author: { $in: authorIds } },
      ],
    })
      .populate('author', 'name about _id')
      .lean();

    const formattedBooks = books.map(formatBookResponse);

    res.status(200).json({ success: true, data: formattedBooks });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ success: false, message: 'Failed to search books' });
  }
});

// GET 4 random books
router.get('/random', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 4;
    const randomBooks = await Book.aggregate([
      { $sample: { size: count } },
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData'
        },
      },
      { $unwind: '$authorData' },
      {
        $project: {
          slug: 1,
          title: 1,
          author: {
            name: '$authorData.name',
            _id: '$authorData._id',
            bio: { $ifNull: ['$authorData.about', ''] }
          },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $round: [{ $avg: '$reviews.rating' }, 1] },
              else: 0,
            },
          },
          urlPath: 1,
          price: 1,
        },
      },
    ]);
    
    res.json(randomBooks);
  } catch (error) {
    console.error('Random books error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch random books' });
  }
});

// GET all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [books, totalBooks] = await Promise.all([
      Book.find()
        .skip(skip)
        .limit(limit)
        .populate('author', 'name about _id')
        .lean(),
      Book.countDocuments()
    ]);

    const formattedBooks = books.map(formatBookResponse);

    res.status(200).json({
      success: true,
      data: formattedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
      totalBooks
    });
  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
});

// GET a single book by slug
router.get('/:slug', async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug })
      .populate('author', 'name bio about _id')
      .lean();

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Fetch user information for each review
    if (book.reviews?.length > 0) {
      try {
        const User = mongoose.model('User');
        const userIds = book.reviews.map(review => review.user_id);
        
        const users = await User.find({ 
          _id: { $in: userIds } 
        }).select('firstName lastName email').lean();
        
        // Create a map of user IDs to user names for O(1) lookups
        const userMap = new Map(users.map(user => [user._id.toString(), user]));
        
        // Add user information to each review
        book.reviews = book.reviews.map(review => {
          const user = userMap.get(review.user_id.toString());
          return {
            ...review,
            userName: user ? 
              `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'User'
              : 'User'
          };
        });
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Continue even if user fetch fails
      }
    }

    // Format the book response
    const formattedBook = formatBookResponse(book);

    res.status(200).json({ success: true, data: formattedBook });
  } catch (error) {
    console.error('Book fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch book' });
  }
});

// POST a new book
router.post('/', async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let authorId;
    const authorData = req.body.author;

    if (typeof authorData === 'string') {
      // Author ID provided
      if (!mongoose.Types.ObjectId.isValid(authorData)) {
        return res.status(400).json({ success: false, message: 'Invalid author ID' });
      }
      
      const existingAuthor = await Author.findById(authorData);
      if (!existingAuthor) {
        return res.status(400).json({ success: false, message: 'Author not found' });
      }
      
      authorId = authorData;
    } else {
      // Author object provided
      const existingAuthor = await Author.findOne({ name: authorData.name });
      
      if (existingAuthor) {
        authorId = existingAuthor._id;
      } else {
        const newAuthor = new Author({
          name: authorData.name,
          bio: authorData.bio,
        });
        const savedAuthor = await newAuthor.save();
        authorId = savedAuthor._id;
      }
    }

    // Generate slug or use provided one
    const slug = req.body.slug || 
      slugify(req.body.title, { lower: true, strict: true }) + 
      '-' + Math.random().toString(36).substring(2, 6);
    
    // Check for slug uniqueness
    const existingBook = await Book.findOne({ slug });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }

    // Create and save the new book
    const newBook = new Book({
      ...req.body,
      author: authorId,
      slug,
    });
    
    await newBook.save();
    
    const populatedBook = await Book.findById(newBook._id)
      .populate('author', 'name about bio')
      .lean();
    
    res.status(201).json({
      success: true,
      data: formatBookResponse(populatedBook),
    });
  } catch (error) {
    console.error('Book creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create book' });
  }
});

// POST a review for a book by slug
router.post('/:slug/reviews', async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const book = await Book.findOne({ slug: req.params.slug });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = book.reviews.find(
      (r) => r.user_id.toString() === req.body.user_id
    );
    
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'User has already reviewed this book' 
      });
    }

    // Add the new review
    book.reviews.push({
      ...req.body,
      created_at: new Date(),
    });
    
    book.reviews_number = book.reviews.length;
    await book.save();
    
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name about bio')
      .lean();
    
    res.status(201).json({
      success: true,
      data: formatBookResponse(populatedBook),
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

module.exports = router;