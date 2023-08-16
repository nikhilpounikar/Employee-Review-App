const User = require('../models/User');
const Review = require('../models/Review');

module.exports.home = async function(req, res) {
    try {
       
        // Fetching the logged-in user and their submitted reviews
        let user = await User.findById(req.user.id);
        let review = await Review.find({ reviewer: req.user.id });

        // Fetching recipient user information and creating an array
        let recipients = [];
        for (let i = 0; i < user.userToReview.length; i++) {
            let recipientUser = await User.findById(user.userToReview[i]);
            if (recipientUser) {
                recipients.push(recipientUser);
            }
        }

        // Creating an array of review information for rendering
        let reviews = [];
        for (let i = 0; i < review.length; i++) {
            let reviewUser = await User.findById(review[i].reviewed);
            if (reviewUser) {
                let currReview = {
                    name: reviewUser.name,
                    content: review[i].content
                };
                reviews.push(currReview);
            }
        }

        // Render the home page with the fetched data
        return res.render('home', {
            recipients: recipients,
            reviews: reviews,
            user: user
        });

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
    }
};
