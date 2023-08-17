// include User and Review Schema //
const User = require('../models/User')
const Review = require('../models/Review')

// create riview controller fumction //
module.exports.newReview = async (req, res) => {

    try {


        if(req.body.newReview == undefined || req.body.newReview == "" ){
            req.flash('error' , "Please add some content");
            return res.redirect('back');
        }
        // first find recieoient //
        let employeeToReviewBeGiven = await User.findById(req.params.id);
        if (!employeeToReviewBeGiven) {
            req.flash('error' , "Reviewee does not exits");
            return res.redirect('back');
        }


        let reviewer = await User.findById(req.body.reviewer);

        if(!reviewer){
            req.flash('error' , "Reviewer does not exits");
            return res.redirect('back');
        }

        employeeToReviewBeGiven.reviewRecivedFrom.push(req.body.reviewer);
        await employeeToReviewBeGiven.save();

      
        let index = reviewer.usersWithPendingReviews.indexOf(req.params.id);
        console.log(index);
        reviewer.usersWithPendingReviews.splice(index,1);

        

      

        const new_review = await Review.create({
            reviewer : reviewer._id,
            reviewedTo: req.params.id,
            content: req.body.newReview,
            rating:req.body.rating
        });
        reviewer.givenReviews.push(new_review._id);
        await reviewer.save();
        req.flash('success' , "Your review has been captured.");
        return res.redirect('back');
    } catch (err) {
        console.log('error', err);
        req.flash('error' , "Something went wrong");
        return res.redirect('back');
   }
}