const User = require("../models/User"); // requring user

// redering the singIN page
module.exports.signIn = function (req, res) {
  return res.render("sign_in");
};

// creating the session, basically for logging In
module.exports.login = async function (req, res) {
  // console.log(req.body);
  req.flash("success", "You are logged In");
  return res.redirect("/");
};

// This function is used for rendering the signUp page

module.exports.signUp = function (req, res) {
  return res.render("sign_up");
};

// This fucntion is for creating the new user
module.exports.createUser = async function (req, res) {
  if (req.body.password != req.body.confirmPassword) {
    //disply flash messages
    req.flash("error", "Password should be equal to Confirm Password");
    return res.redirect("back");
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: false,
    });

    return res.redirect("/");
  }
  req.flash("error", "User Already exits try login.");
  return res.redirect("back");
};

// This fucniton is used for logging Out
module.exports.logOut = function (req, res, done) {
  return req.logout((err) => {
    if (err) {
      return done(err);
    }
    req.flash("success", "Logged Out Sucessfully !");
    return res.redirect("/users/sign-in");
  });
};

// forrget password page
module.exports.forgetPasswordPage = function (req, res) {
  return res.render("forget_password");
};

// this will update the existing password, with the newly created password.
module.exports.updatePassword = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "User does not exist. Please register");
      return res.redirect("/users/signUp");
    }

    if (req.body.password == req.body.confirmPassword) {
      req.flash("success", "Password Changed :)");
      user.password = req.body.password;
      await user.updateOne({ password: req.body.password });
      return res.redirect("/users/sign-in");
    }

    return res.redirect("back");
  } catch (error) {
    // Handle the error appropriately
    console.error("Error in updatePassword:", error);
    req.flash("error", "An error occurred while updating the password.");
    return res.redirect("back");
  }
};


