const { Book } = require('../models/Books');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Create or update a review for a book
 */
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!bookId || !rating) {
      return res.status(400).json({ success: false, message: 'Book ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if user has already reviewed this book
    const existingReviewIndex = book.reviews.findIndex(
      review => review.user_id.toString() === userId.toString()
    );

    let reviewData;
    
    if (existingReviewIndex !== -1) {
      // Update existing review
      reviewData = book.reviews[existingReviewIndex];
      reviewData.rating = rating;
      reviewData.comment = comment;
      reviewData.created_at = new Date();
    } else {
      // Get user info for new review
      const user = await User.findById(userId).select('firstName lastName');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous';
      
      // Create new review
      reviewData = {
        user_id: userId,
        user_name: userName,
        rating,
        comment,
        created_at: new Date()
      };
      
      book.reviews.push(reviewData);
    }

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: reviewData
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all reviews for a specific book
 */
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ success: false, message: 'Invalid book ID format' });
    }

    const book = await Book.findById(bookId).select('reviews');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Sort reviews by date (newest first)
    const sortedReviews = [...book.reviews].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    res.status(200).json({
      success: true,
      count: sortedReviews.length,
      reviews: sortedReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews' 
    });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(bookId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete review' 
    });
  }
};

/**
 * Get all reviews by the current user
 */
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find books with reviews by this user and only select necessary fields
    const books = await Book.find(
      { 'reviews.user_id': userId },
      { 
        _id: 1, 
        title: 1, 
        slug: 1, 
        urlPath: 1,
        'reviews.$': 1 
      }
    ).lean();
    
    // Transform the data for the response
    const userReviews = books.map(book => {
      const review = book.reviews[0]; // The projection returns only the matching review
      
      return {
        reviewId: review._id,
        bookId: book._id,
        bookTitle: book.title,
        bookSlug: book.slug,
        bookCover: book.urlPath,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at
      };
    });
    
    // Sort by date (newest first)
    userReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.status(200).json({
      success: true,
      count: userReviews.length,
      reviews: userReviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your reviews' 
    });
  }
};