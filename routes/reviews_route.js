const express = require('express'); // Require the Express framework
const router = express.Router(); // Create a router instance
const reviewController = require('../controllers/review_controller'); // Require the review controller module
const passport = require('passport'); // Require the Passport library for authentication

// Route to add a new review
router.post('/add/:id', reviewController.newReview);

// Route to get the review form for adding a new review
router.get('/add/:id', reviewController.getReviewForm);

// Route to get the review update form (requires admin authentication)
router.get('/update/:id', passport.checkAuthenticationAsAdmin, reviewController.getReviewUpdateForm);

// Route to update a review (requires admin authentication)
router.post('/update', passport.checkAuthenticationAsAdmin, reviewController.updateReview);

module.exports = router; // Export the router module
