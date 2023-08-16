const express = require("express"); // requiring express
// requring the router form express
const router = express.Router();
// requiring passport, for authorization ,and authentication
const passport = require("passport");

// requiring userController
const userController = require("../controllers/user_controller");

// It will render the singin page, and singUp page
router.get("/sign-in", userController.signIn);
router.get("/sign-up",userController.signUp);

// It will create new seeion for the particular user, and also it chaeck the authorization
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userController.login
);

// It will create the new user
router.post("/create", userController.createUser);

// It will logOut form the current user
router.get("/sign-out", userController.logOut);

// Help to render the forget password page, and change the forget passwrod
router.get("/forgot-password", userController.forgetPasswordPage);
router.post("/update-password", userController.updatePassword);

//
router.post(
  "/login-as-admin/:id",
  passport.checkAuthentication,
  userController.loginAsAdmin
);
module.exports = router;
