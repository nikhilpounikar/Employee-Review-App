const User = require("../models/User");
const Review = require("../models/Review");

module.exports.home = async function (req, res) {
  try {
    const user = await User.findById(req.user.id)
      .populate("usersWithPendingReviews")
      .populate({
        path: "givenReviews",
        populate: {
          path: "reviewedTo",
          model: "User", 
        },
      })
      .exec();
   
    return res.render("home", {
      user: user,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};
