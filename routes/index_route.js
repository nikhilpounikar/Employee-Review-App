// Requiring the express framework
const express = require('express');

// Creating a router instance
const router = express.Router();

// Requiring the homeController file to call functions when needed
const homeController = require('../controllers/home_controller');

// Requiring passport for authentication
const passport = require('passport');

// Logging a message to indicate that the router is loaded
console.log('Router is loaded: {200}');

// Initial route that decides the further routing

// This route will redirect you to the home page
router.get('/', passport.checkAuthentication, homeController.home);

// All requests with the suffix '/users' will be handled by the users_route file
router.use('/users', require('./users_route'));

// All requests with the suffix '/admin' will be handled by the admin_route file
router.use('/admin', require('./admin_route'));

// All requests with the suffix '/reviews' will be handled by the reviews_route file
router.use('/reviews', require('./reviews_route'));

// Exporting the router for use in other parts of the application
module.exports = router;
