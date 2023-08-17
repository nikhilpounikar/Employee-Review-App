// Include User and Review Schema
const User = require('../models/User')
const Review = require('../models/Review')

// Create review controller function for adding a new review
module.exports.newReview = async (req, res) => {
    try {
        // Check if the review content is empty
        if (req.body.newReview == undefined || req.body.newReview == "") {
            req.flash('error', "Please add some content");
            return res.redirect('back');
        }

        // Find the recipient of the review
        let employeeToReviewBeGiven = await User.findById(req.params.id);
        if (!employeeToReviewBeGiven) {
            req.flash('error', "Reviewee does not exist");
            return res.redirect('back');
        }

        // Find the reviewer
        let reviewer = await User.findById(req.body.reviewer);
        if (!reviewer) {
            req.flash('error', "Reviewer does not exist");
            return res.redirect('back');
        }

        // Add the reviewer's ID to the review recipient's reviewRecivedFrom list
        employeeToReviewBeGiven.reviewRecivedFrom.push(req.body.reviewer);
        await employeeToReviewBeGiven.save();

        // Remove the review recipient from the reviewer's usersWithPendingReviews list
        let index = reviewer.usersWithPendingReviews.indexOf(req.params.id);
        reviewer.usersWithPendingReviews.splice(index, 1);

        // Create a new review
        const new_review = await Review.create({
            reviewer: reviewer._id,
            reviewedTo: req.params.id,
            content: req.body.newReview,
            rating: req.body.rating
        });

        // Add the new review's ID to the reviewer's givenReviews list
        reviewer.givenReviews.push(new_review._id);
        await reviewer.save();

        req.flash('success', "Your review has been captured.");
        return res.redirect('/');
    } catch (err) {
        console.log('error', err);
        req.flash('error', "Something went wrong");
        return res.redirect('back');
    }
}

// Controller function to get the review update form
module.exports.getReviewUpdateForm = async function (req, res) {
    try {
        let review = await Review.findById(req.params.id);
        return res.render('update_review_form', {
            'review': review
        });
    } catch (err) {
        console.log('error', err);
        req.flash('error', "Something went wrong");
        return res.redirect('back');
    }
}

// Controller function to get the review form
module.exports.getReviewForm = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        return res.render('add_review_form', {
            'userWithPendingReview': user
        });
    } catch (err) {
        console.log('error', err);
        req.flash('error', "Something went wrong");
        return res.redirect('back');
    }
}

// Controller function to update a review
module.exports.updateReview = async (req, res) => {
    try {
        const { content, rating } = req.body;

        // Check if the content is empty
        if (!content) {
            req.flash('error', 'You need to add some content');
            return res.redirect('back');
        }

        // Find the review by ID for updating
        const reviewId = req.body.id;
        const updatedReview = await Review.findById(reviewId);

        if (!updatedReview) {
            req.flash('error', 'Review not available');
            return res.redirect('back');
        }

        // Update review content and rating
        updatedReview.content = content;
        updatedReview.rating = rating;
        await updatedReview.save();

        req.flash('success', 'Review Updated Successfully');
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('back');
    }
};
