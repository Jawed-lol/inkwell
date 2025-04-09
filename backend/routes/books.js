const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { Book, Author } = require('../models/Books');

// Joi Validation Schemas (unchanged)
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.alternatives()
    .try(
      Joi.string().hex().length(24),
      Joi.object({
        name: Joi.string().required(),
        about: Joi.string().required(),
      })
    )
    .required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  page_count: Joi.number().integer().min(1).required(),
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  price: Joi.number().min(0).required(),
  urlPath: Joi.string().required(),
  isbn: Joi.string().required(),
  language: Joi.string().required(),
  publisher: Joi.string().required(),
  synopsis: Joi.string().required(),
});

const reviewSchema = Joi.object({
  user_id: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
});

// GET 4 random books (moved to top to avoid conflict with /:id)
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
          _id: { $toString: '$_id' },
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
    console.error('Error fetching random books:', error);
    res.status(500).json({ message: 'Server error' });
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

    const formattedBooks = books.map(book => ({
      ...book,
      author: book.author.name,
      author_bio: book.author.about,
    }));

    const totalBooks = await Book.countDocuments();
    res.status(200).json({
      success: true,
      data: formattedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Books fetch error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET a single book by ID (with ObjectId validation)
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid book ID' });
  }
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name about')
      .lean();
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    const formattedBook = {
      ...book,
      author: book.author.name,
      author_bio: book.author.about,
    };
    res.status(200).json({ success: true, data: formattedBook });
  } catch (error) {
    console.error('Book fetch error:', error.message);
    res.status(500).json({ success: false, error: error.message });
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
      const existingAuthor = await Author.findById(authorData);
      if (!existingAuthor) {
        return res.status(400).json({ success: false, message: 'Author not found' });
      }
      authorId = authorData;
    } else {
      const newAuthor = new Author({
        name: authorData.name,
        about: authorData.about,
      });
      await newAuthor.save();
      authorId = newAuthor._id;
    }

    const newBook = new Book({
      ...req.body,
      author: authorId,
    });
    await newBook.save();
    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    console.error('Book creation error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a review for a book
router.post('/:id/reviews', async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.reviews.push({
      ...req.body,
      created_at: new Date(),
    });
    book.reviews_number += 1;
    await book.save();
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error('Review creation error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;