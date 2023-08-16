const User = require('../models/User');
const Review = require('../models/Review');

module.exports.home = async function(req, res) {
    try {
       
        // Fetching the logged-in user and their submitted reviews
        let user = await User.findById(req.user.id)
                         .populate('usersWithPendingReviews')
                         .populate('givenReviews');
        //let review = await Review.find({ reviewer: req.user.id }).populate('reviewedTo');

        // fetching given reviews to other employees
        //let givenReviews = await Review.find({ reviewer: req.user.id }).populate('reviewedTo');

        // Fetching recipient user information and creating an array
        // getting pending reviews
        //let recipients = await User.find({_id:{$in:user.userToReview}});
        //let pendingReviews = await User.find({_id:{$in:user.userToReview}});
        // for (let i = 0; i < user.userToReview.length; i++) {
        //     let recipientUser = await User.findById(user.userToReview[i]);
        //     if (recipientUser) {
        //         recipients.push(recipientUser);
        //     }
        // }

        // Creating an array of review information for rendering
        // let reviews = [];
        // for (let i = 0; i < review.length; i++) {
        //     let reviewUser = await User.findById(review[i].reviewedTo);
        //     if (reviewUser) {
        //         let currReview = {
        //             name: reviewUser.name,
        //             content: review[i].content
        //         };
        //         reviews.push(currReview);
        //     }
        // }

        

        // Render the home page with the fetched data
        // return res.render('home', {
        //     recipients: recipients,
        //     reviews: reviews,
        //     user: user
        // });

        return res.render('home', {
            user: user
        });

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
    }
};
