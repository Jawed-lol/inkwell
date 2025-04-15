const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
// Change this line to use the correct middleware file name
const protect = require('../middleware/auth');

// Create a new review (requires authentication)
router.post('/', protect, reviewController.createReview);

// Get all reviews for a book (public)
router.get('/book/:bookId', reviewController.getBookReviews);

// Get all reviews by the logged-in user (requires authentication)
router.get('/user', protect, reviewController.getUserReviews);

// Delete a review (requires authentication)
router.delete('/:bookId/:reviewId', protect, reviewController.deleteReview);

module.exports = router;