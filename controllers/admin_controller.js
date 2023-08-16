const Users = require("../models/User");

// This function is for assigning Work, and sending some data to it.
module.exports.assignWork = async function (req, res) {
  let employe = await Users.find({});

  return res.render("admin", {
    title: "ERS | Assign Work",
    employe: employe,
  });
};

// This function will show the list of employee woking in the company.
module.exports.showEmployeeList = async function (req, res) {
  try {
    let employeList = await Users.find({});
    return res.render("employee",{employeList});
  } catch (error) {
    // Handle the error appropriately
    console.error("Error in showEmployeeList:", error);
    req.flash("error", "An error occurred while fetching the employee list.");
    return res.redirect("back");
  }
};

// This function will set the reviewer and reviewer.
module.exports.setReviewrAndReviewe = async function (req, res) {
  try {
    // first checking if the req is made correct or not.
    if (!req.isAuthenticated()) {
      // flash messages
      req.flash("success", "Please Login !");
      // console.log("Please logIn");
      return res.redirect("/users/sign-in");
    } else {
      let employee = await Users.findById(req.user.id);

      if (employee.isAdmin == false) {
        // flash Messages
        req.flash("error", "Opps ! Not Authorized ");
        // console.log('User is not admin');
        return res.redirect("/users/sign-in");
      } else if (req.body.sender == req.body.reciver) {
        // flash messages
        // console.log("sender === reciver")
        req.flash("error", "Sender and reciver should not be same !");
        return res.redirect("back");
      }
      // After checking all the authentication , part the main part start from here.
      else {
        let sender = await Users.findById(req.body.sender);
        let reciver = await Users.findById(req.body.reciver);
        //console.log(sender + " " + reciver);
        sender.userToReview.push(reciver);
        sender.save();
        reciver.reviewRecivedFrom.push(sender);
        reciver.save();
        // flash Messages
        req.flash("success", "Task Assigned !");
        return res.redirect("back");
      }
    }
  } catch (err) {
    console.log("Errror in setting up the user " + err);
  }
};

// This function is for deleting the employee
module.exports.deleteEmployee = async function (req, res) {
  try {
   
    // Deleting the user.
    await Users.deleteOne({ _id: req.params.id });
    // flash Messages
    req.flash("success", "User Deleted!");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};

module.exports.getEmployeeAdditionForm = function (req, res) {
  return res.render("addEmployee");
};

module.exports.getUpdateForm = async function (req, res) {
  try {
    // Deleting the user.
    let employee = await Users.findById(req.params.id);

    if (!employee) {
      req.flash("error", "Employee does not exits.");
      return res.redirect("back");
    }
    // flash Messages
    req.flash("success", "User Deleted!");
    return res.render("employee_update_form", { oldEmployeeDetails: employee });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong.");
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

    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
      await Users.create({
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

    const user = await Users.findByIdAndUpdate(userId, updatedFields, {
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
    let user = await Users.findById(req.params.id);

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
