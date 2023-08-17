const User = require("../models/User");
const Review = require("../models/Review");

module.exports.home = async function (req, res) {
  try {
    // Fetch the user details using the user ID from the request
    const user = await User.findById(req.user.id)
      .populate({
        path: "usersWithPendingReviews",
        populate: {
          path: "reviewedTo", // Populate the 'reviewedTo' field in 'usersWithPendingReviews'
          model: "User",     // Use the 'User' model for populating 'reviewedTo'
        },
      })
      .populate({
        path: "givenReviews",
        populate: {
          path: "reviewedTo", // Populate the 'reviewedTo' field in 'givenReviews'
          model: "User",     // Use the 'User' model for populating 'reviewedTo'
        },
      })
      .exec();

    // Fetch the list of all reviews with their related reviewer and reviewedTo information
    const reviewList = await Review.find().populate('reviewedTo').populate('reviewer');

    // Render the 'home' view, passing the user and review data to the template
    return res.render("home", {
      user: user,
      reviewList: reviewList
    });
  } catch (err) {
    // If an error occurs during the above steps, handle the error gracefully
    console.error(err);
    req.flash("error", "Something went wrong!"); // Display a flash message indicating an error
    return res.redirect("back"); // Redirect the user back to the previous page
  }
};
