const mongoose = require('mongoose');
const slugify = require('slugify');

// Author Schema
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, required: true, trim: true },
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  created_at: { type: Date, default: Date.now },
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  description: { type: String, required: true, trim: true },
  pages_number: { type: Number, required: true, min: 1 },
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
  slug: { type: String, required: true, unique: true, trim: true, index: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
});

// Pre-save middleware to generate unique slug
bookSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.model('Book').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

module.exports = {
  Book: mongoose.model('Book', bookSchema),
  Author: mongoose.model('Author', authorSchema),
};