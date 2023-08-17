const Users = require("../models/User");

// Render the 'Assign Work' page with employee list
module.exports.assignWork = async function (req, res) {
  let employe = await Users.find({});
  return res.render("admin", {
    title: "ERS | Assign Work",
    employe: employe,
  });
};

// Render the 'Employee List' page
module.exports.showEmployeeList = async function (req, res) {
  try {
    // Fetch all employees
    let employeList = await Users.find({});
    return res.render("employee", { employeList });
  } catch (error) {
    // Handle error while fetching employee list
    console.error("Error in showEmployeeList:", error);
    req.flash("error", "An error occurred while fetching the employee list.");
    return res.redirect("back");
  }
};

// Map a reviewer and reviewee
module.exports.mapReviewerAndReviewee = async function (req, res) {
  try {
    // Find the reviewer user
    let user = await Users.findById(req.body.reviewer);
    
    if (req.body.reviewer == req.body.reviewee) {
      // Display error message if reviewer and reviewee are the same
      req.flash("error", "Reviewer and Reviewee cannot be the same.");
      return res.redirect("back");
    } else {
      // Add reviewee to the reviewer's pending reviews
      user.usersWithPendingReviews.push(req.body.reviewee);
      await user.save();
      // Display success message
      req.flash("success", "Mapping Successful");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in mapping users: " + err);
  }
};

// Delete an employee
module.exports.deleteEmployee = async function (req, res) {
  try {
    // Delete the user based on the provided ID
    await Users.deleteOne({ _id: req.params.id });
    // Display success message
    req.flash("success", "User Deleted!");
    return res.redirect("back");
  } catch (err) {
    // Handle error while deleting employee
    console.log(err);
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};

// Render the 'Add Employee' form
module.exports.getEmployeeAdditionForm = function (req, res) {
  return res.render("addEmployee");
};

// Render the 'Update Employee' form
module.exports.getUpdateForm = async function (req, res) {
  try {
    // Find the employee based on the provided ID
    let employee = await Users.findById(req.params.id);
    if (!employee) {
      // Display error if employee doesn't exist
      req.flash("error", "Employee does not exist.");
      return res.redirect("back");
    }
    // Display success message and render the update form
    req.flash("success", "Employee Details Fetched!");
    return res.render("employee_update_form", { oldEmployeeDetails: employee });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong.");
    return res.redirect("back");
  }
};

// Add an employee
module.exports.addEmployee = async function (req, res) {
  try {
    if (req.body.password != req.body.confirmPassword) {
      // Display error message if password and confirm password don't match
      req.flash("error", "Password should be equal to Confirm Password");
      return res.redirect("back");
    }

    // Check if user with given email already exists
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
      // Create a new user
      await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
      });

      return res.redirect("/admin/view-employee");
    }
    // Redirect back if user with email already exists
    return res.redirect("back");
  } catch (error) {
    // Handle error while adding employee
    console.error("Error in addEmployee:", error);
    req.flash("error", "An error occurred while adding the employee.");
    return res.redirect("back");
  }
};

// Update employee details
module.exports.updateEmployee = async function (req, res) {
  try {
    const userId = req.body._id;
    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirmPassword;

    if (newPassword !== confirmNewPassword) {
      // Display error message if password and confirm password don't match
      req.flash("error", "Password should be equal to Confirm Password");
      return res.redirect("back");
    }

    // Define updated fields based on user input
    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
    };

    if (newPassword) {
      updatedFields.password = newPassword;
    }

    // Find and update the user
    const user = await Users.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!user) {
      // Display error message if user doesn't exist
      req.flash("error", "Employee not found");
      return res.redirect("back");
    }

    // Redirect to employee list after successful update
    return res.redirect("/admin/view-employee");
  } catch (error) {
    // Handle error while updating employee
    console.error("Error updating user:", error);
    req.flash("error", "An error occurred while updating user");
    return res.redirect("back");
  }
};

// Make an employee an admin
module.exports.makeEmployeeAdmin = async function (req, res) {
  try {
    // Find the user based on the provided ID
    let user = await Users.findById(req.params.id);

    if (!user) {
      // Display error message if user doesn't exist
      req.flash("error", "This user does not exist");
      return res.redirect("back");
    }
    // Update user's isAdmin field and save
    user.isAdmin = true;
    user.save();
    req.flash("success", "Successfully made Admin");
    return res.redirect("back");
  } catch (error) {
    console.log("Error", error);
    req.flash("error", "Something went wrong.");
    return res.redirect("back");
  }}
