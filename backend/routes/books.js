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
      about: Joi.string().required(),
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
      .populate('author', 'name about')
      .lean();

    const formattedBooks = books.map((book) => ({
      ...book,
      author: book.author.name,
      author_bio: book.author.about || '',
      slug: book.slug,
      rating: book.reviews.length > 0 ? Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length * 10) / 10 : 0,
    }));

    res.status(200).json({ success: true, data: formattedBooks });
  } catch (error) {
    console.error('Search books error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to search books' });
  }
});

// GET 4 random books
router.get('/random', async (req, res) => {
  try {
    const randomBooks = await Book.aggregate([
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          slug: 1,
          title: 1,
          author: '$author.name',
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
    console.error('Random books error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch random books' });
  }
});

// GET all books with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .populate('author', 'name about')
      .lean();

    const formattedBooks = books.map((book) => ({
      ...book,
      author: book.author.name,
      author_bio: book.author.about || '',
      slug: book.slug,
      rating: book.reviews.length > 0 ? Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length * 10) / 10 : 0,
    }));

    const totalBooks = await Book.countDocuments();
    res.status(200).json({
      success: true,
      data: formattedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Books fetch error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
});

// GET a single book by slug
router.get('/:slug', async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug })
      .populate('author', 'name about')
      .lean();
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    const formattedBook = {
      ...book,
      author: book.author.name,
      author_bio: book.author.about || '',
      slug: book.slug,
      rating: book.reviews.length > 0 ? Math.round(book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length * 10) / 10 : 0,
    };
    res.status(200).json({ success: true, data: formattedBook });
  } catch (error) {
    console.error('Book fetch error:', error.message, error.stack);
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
      if (!mongoose.Types.ObjectId.isValid(authorData)) {
        return res.status(400).json({ success: false, message: 'Invalid author ID' });
      }
      const existingAuthor = await Author.findById(authorData);
      if (!existingAuthor) {
        return res.status(400).json({ success: false, message: 'Author not found' });
      }
      authorId = authorData;
    } else {
      const existingAuthor = await Author.findOne({ name: authorData.name });
      if (existingAuthor) {
        authorId = existingAuthor._id;
      } else {
        const newAuthor = new Author({
          name: authorData.name,
          about: authorData.about,
        });
        await newAuthor.save();
        authorId = newAuthor._id;
      }
    }

    const slug = req.body.slug || slugify(req.body.title, { lower: true }) + '-' + Math.random().toString(36).slice(-4);
    const existingBook = await Book.findOne({ slug });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }

    const newBook = new Book({
      ...req.body,
      author: authorId,
      slug,
    });
    await newBook.save();
    const populatedBook = await Book.findById(newBook._id).populate('author', 'name about').lean();
    res.status(201).json({
      success: true,
      data: { ...populatedBook, author: populatedBook.author.name, author_bio: populatedBook.author.about || '' },
    });
  } catch (error) {
    console.error('Book creation error:', error.message, error.stack);
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

    const existingReview = book.reviews.find((r) => r.user_id.toString() === req.body.user_id);
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'User has already reviewed this book' });
    }

    book.reviews.push({
      ...req.body,
      created_at: new Date(),
    });
    book.reviews_number += 1;
    await book.save();
    const populatedBook = await Book.findById(book._id).populate('author', 'name about').lean();
    res.status(201).json({
      success: true,
      data: {
        ...populatedBook,
        author: populatedBook.author.name,
        author_bio: populatedBook.author.about || '',
        slug: book.slug,
      },
    });
  } catch (error) {
    console.error('Review creation error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

module.exports = router;