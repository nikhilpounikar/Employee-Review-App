const express = require('express'); // requiring the express
const router = express.Router(); // routere
// requring the reviewController file 
const reviewController = require('../controllers/review_controller');
const passport = require('passport')
// setting up the new review
router.post('/add/:id' , reviewController.newReview);

router.get('/add/:id' , reviewController.getReviewForm);

// setting up the new review
router.get('/update/:id' , passport.checkAuthenticationAsAdmin ,reviewController.getReviewUpdateForm);

router.post('/update' , passport.checkAuthenticationAsAdmin ,reviewController.updateReview);

module.exports = router;