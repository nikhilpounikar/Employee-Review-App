// Requiring the express framework
const express = require("express");

// Requiring the router from the express framework
const router = express.Router();

// Requiring passport for authorization and authentication
const passport = require("passport");

// Requiring the userController file to call functions when needed
const userController = require("../controllers/user_controller");

// Route to render the sign-in and sign-up pages
router.get("/sign-in", userController.signIn);
router.get("/sign-up", userController.signUp);

// Route to create a new session for a user and check authorization
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userController.login
);

// Route to create a new user
router.post("/create", userController.createUser);

// Route to log out the current user
router.get("/sign-out", userController.logOut);

// Route to render the forget password page and update the forgotten password
router.get("/forgot-password", userController.forgetPasswordPage);
router.post("/update-password", userController.updatePassword);

// Route to log in as an admin for a specific user
router.post(
  "/login-as-admin/:id",
  passport.checkAuthentication,
  userController.loginAsAdmin
);

// Exporting the router for use in other parts of the application
module.exports = router;
