const User = require("../models/User"); // requring user

// redering the singIN page
module.exports.signIn = function (req, res) {
  return res.render("sign_in");
};

// creating the session, basically for logging In
module.exports.createSession = async function (req, res) {
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

// Adding employe, it is same as signUp , but it will redirect you to the addEmplyee page, where as
// that will redirect you to the sing-in page
module.exports.addEmployee = async function (req, res) {
  try {
    if (req.body.password != req.body.confirmPassword) {
      // Display flash messages
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

      return res.redirect("/admin/view-employee");
    }
    return res.redirect("back");
  } catch (error) {
    // Handle the error appropriately
    console.error("Error in addEmployee:", error);
    req.flash("error", "An error occurred while adding the employee.");
    return res.redirect("back");
  }
};

module.exports.updateEmployee = async function (req, res) {
  try {
    const userId = req.body._id;
    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirmPassword;

    if (newPassword !== confirmNewPassword) {
      // Display flash messages
      req.flash("error", "Password should be equal to Confirm Password");
      return res.redirect("back");
    }

    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
    };

    if (newPassword) {
      updatedFields.password = newPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!user) {
      // User not found
      req.flash("error", "Employee not found");
      return res.redirect("back");
    }

    // Redirect to the appropriate route after update
    return res.redirect("/admin/view-employee");
  } catch (error) {
    // Handle errors appropriately
    console.error("Error updating user:", error);
    req.flash("error", "An error occurred while updating user");
    return res.redirect("back");
  }
};

// THis function is used for making the new Admin, it is admin specific, fucntion
module.exports.makeEmployeeAdmin = async function (req, res) {
  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      req.flash("error", "This user does not exits");
      return res.redirect("back");
    }
    user.isAdmin = true;
    user.save();
    req.flash("success", "Successfully made Admin");
    return res.redirect("back");
  } catch (error) {
    console.log("Error", error);
    req.flash("error", "Something went wrong.");
    return res.redirect("back");
  }
};
