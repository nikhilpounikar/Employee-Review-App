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
        return res.redirect('/');
    } catch (err) {
        console.log('error', err);
        req.flash('error' , "Something went wrong");
        return res.redirect('back');
   }
}

module.exports.getReviewUpdateForm = async function(req,res){

    try {
       let review = await Review.findById(req.params.id);
       return res.render('update_review_form',{
        'review':review
       });
    } catch (err) {
        console.log('error', err);
        req.flash('error' , "Something went wrong");
        return res.redirect('back');
   }
    
}


module.exports.getReviewForm = async function(req,res){

    try {
       let user = await User.findById(req.params.id);
       return res.render('add_review_form',{
        'userWithPendingReview':user
       });
    } catch (err) {
        console.log('error', err);
        req.flash('error' , "Something went wrong");
        return res.redirect('back');
   }
    
}



module.exports.updateReview = async (req, res) => {
    try {
      const { content, rating } = req.body;

      if(!content){
        req.flash('error','You need to add some content');
        return res.redirect('back');
      }
  
      // Assuming you have the review ID and want to update it
      const reviewId = req.body.id;
  
      const updatedReview = await Review.findById(reviewId);

      if(!updatedReview){
        req.flash('error','Review not available');
        return res.redirect('back');
      }

      updatedReview.content = content;
      updatedReview.rating = rating;
      await updatedReview.save();
      req.flash('success','Review Updated Successfully');
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      req.flash('error','Somthing Went Wrong');
      return res.redirect('back');
    }
  };