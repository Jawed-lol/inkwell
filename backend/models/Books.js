const mongoose = require('mongoose');

// Author Schema
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  about: { type: String, required: true, trim: true },
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  created_at: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  description: { type: String, required: true, trim: true },
  page_count: { type: Number, required: true, min: 1 },
  publication_year: { type: Number, required: true, min: 1000, max: new Date().getFullYear() },
  genre: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  urlPath: { type: String, required: true, trim: true },
  synopsis: { type: String, required: true, trim: true },
  publisher: { type: String, required: true, trim: true },
  language: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  reviews_number: { type: Number, default: 0 },
  reviews: [reviewSchema],
});

module.exports = {
  Book: mongoose.model('Book', bookSchema),
  Author: mongoose.model('Author', authorSchema),
};