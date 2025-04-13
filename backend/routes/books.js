const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { Book, Author } = require('../models/Books');

// Joi Validation Schemas
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.alternatives().try(
    Joi.string().hex().length(24), // Author ID for existing authors
    Joi.object({
      name: Joi.string().required(),
      about: Joi.string().required(),
    })
  ).required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  pages_number: Joi.number().integer().min(1).required(), // Use pages_number to match Mongoose schema
  publication_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  price: Joi.number().min(0).required(),
  urlPath: Joi.string().required(),
  isbn: Joi.string().required(),
  language: Joi.string().required(),
  publisher: Joi.string().required(),
  synopsis: Joi.string().required(),
  slug: Joi.string().optional(), // Slug is generated server-side
});

const reviewSchema = Joi.object({
  user_id: Joi.string().required(),
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
    const authors = await Author.find({
      name: { $regex: q, $options: 'i' },
    }).lean();

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
    }));

    res.status(200).json({ success: true, data: formattedBooks });
  } catch (error) {
    console.error('Search books error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
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
          slug: 1, // Use slug instead of _id
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

    const formattedBooks = books.map((book) => ({
      ...book,
      author: book.author.name,
      author_bio: book.author.about || '',
      slug: book.slug,
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
    res.status(201).json({ success: true, data: { ...newBook.toObject(), slug: newBook.slug } });
  } catch (error) {
    console.error('Book creation error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST a review for a book by slug
router.post('/:slug/reviews', async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const book = await Book.findOne({ slug: req.params.slug });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    book.reviews.push({
      ...req.body,
      created_at: new Date(),
    });
    book.reviews_number += 1;
    await book.save();
    res.status(201).json({ success: true, data: { ...book.toObject(), slug: book.slug } });
  } catch (error) {
    console.error('Review creation error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;