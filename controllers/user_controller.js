const User = require("../models/User"); // Requiring the User model

// Rendering the sign-in page
module.exports.signIn = function (req, res) {
  return res.render("sign_in"); // Render the sign-in page view
};

// Creating a session for logging in
module.exports.login = async function (req, res) {
  // console.log(req.body);
  req.flash("success", "You are logged In"); // Display a success flash message
  return res.redirect("/"); // Redirect to the home page
};

// Rendering the sign-up page
module.exports.signUp = function (req, res) {
  return res.render("sign_up"); // Render the sign-up page view
};

// Creating a new user
module.exports.createUser = async function (req, res) {
  if (req.body.password != req.body.confirmPassword) {
    // If passwords don't match
    req.flash("error", "Password should be equal to Confirm Password"); // Display an error flash message
    return res.redirect("back"); // Redirect back to the previous page
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: false,
    });

    return res.redirect("/"); // Redirect to the home page
  }
  req.flash("error", "User Already exists. Try logging in."); // Display an error flash message
  return res.redirect("back"); // Redirect back to the previous page
};

// Logging out
module.exports.logOut = function (req, res, done) {
  return req.logout((err) => {
    if (err) {
      return done(err);
    }
    req.flash("success", "Logged Out Successfully !"); // Display a success flash message
    return res.redirect("/users/sign-in"); // Redirect to the sign-in page
  });
};

// Forget password page
module.exports.forgetPasswordPage = function (req, res) {
  return res.render("forget_password"); // Render the forget password page view
};

// Updating the existing password
module.exports.updatePassword = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "User does not exist. Please register"); // Display an error flash message
      return res.redirect("/users/signUp"); // Redirect to the sign-up page
    }

    if (req.body.password == req.body.confirmPassword) {
      req.flash("success", "Password Changed :)"); // Display a success flash message
      user.password = req.body.password;
      await user.updateOne({ password: req.body.password });
      return res.redirect("/users/sign-in"); // Redirect to the sign-in page
    }

    return res.redirect("back"); // Redirect back to the previous page
  } catch (error) {
    // Handle the error appropriately
    console.error("Error in updatePassword:", error);
    req.flash("error", "An error occurred while updating the password."); // Display an error flash message
    return res.redirect("back"); // Redirect back to the previous page
  }
};

// Logging in as an admin
module.exports.loginAsAdmin = async function (req, res) {
  try {

    let user = User.findById(req.params.id);

    if (!user) {
      req.flash("error", "User does not exist. Please register before advancing."); // Display an error flash message
      return res.redirect("back"); // Redirect back to the previous page
    }

    if (user.isAdmin) {
      req.flash("success", "Successfully logged in."); // Display a success flash message
      return res.redirect("/"); // Redirect to the home page
    }

    if (req.body.adminPassCode != "Admin@123") {
      req.flash("error", "You have entered the wrong passcode"); // Display an error flash message
    }

    user.isAdmin = true;
    await user.save();

    req.flash("success", "Successfully logged in."); // Display a success flash message
    return res.redirect("/"); // Redirect to the home page

  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    req.flash("error", "Something went wrong!"); // Display an error flash message
    return res.redirect("back"); // Redirect back to the previous page
  }
};
