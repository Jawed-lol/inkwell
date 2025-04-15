const { Book } = require('../models/Books');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!bookId || !rating) {
      return res.status(400).json({ message: 'Book ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already reviewed this book
    const existingReviewIndex = book.reviews.findIndex(
      review => review.user_id.toString() === userId.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      book.reviews[existingReviewIndex].rating = rating;
      book.reviews[existingReviewIndex].comment = comment;
      book.reviews[existingReviewIndex].created_at = new Date();
    } else {
      // Add new review
      // Inside the createReview function
      console.log('User ID from token:', userId);
      const user = await User.findById(userId);
      console.log('Found user:', user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userName = `${user.firstName} ${user.lastName}`;
      
      book.reviews.push({
        user_id: userId,
        user_name: userName,
        rating,
        comment,
        created_at: new Date()
      });
    }

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: existingReviewIndex !== -1 
        ? book.reviews[existingReviewIndex]
        : book.reviews[book.reviews.length - 1]
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all reviews for a book
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      count: book.reviews.length,
      reviews: book.reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Find the review
    const reviewIndex = book.reviews.findIndex(
      review => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if the user is the owner of the review
    if (book.reviews[reviewIndex].user_id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    // Remove the review
    book.reviews.splice(reviewIndex, 1);
    await book.save();

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const books = await Book.find({ 'reviews.user_id': userId });
    
    const userReviews = [];
    
    books.forEach(book => {
      const bookReviews = book.reviews.filter(
        review => review.user_id.toString() === userId.toString()
      );
      
      bookReviews.forEach(review => {
        userReviews.push({
          reviewId: review._id,
          bookId: book._id,
          bookTitle: book.title,
          bookSlug: book.slug,
          bookCover: book.urlPath,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at
        });
      });
    });
    
    res.status(200).json({
      success: true,
      count: userReviews.length,
      reviews: userReviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};