// Requiring the express framework
const express = require('express');

// Creating a router instance
const router = express.Router();

// Requiring passport for authentication
const passport = require('passport');

// Requiring the adminController file to call functions when needed
const adminController = require('../controllers/admin_controller');

// Route to assign work to employees
router.get('/assignWork', passport.checkAuthenticationAsAdmin, adminController.assignWork);

// Route to view the list of employees (restricted to admin only)
router.get('/view-employee', passport.checkAuthenticationAsAdmin, adminController.showEmployeeList);

// Route to map performance reviewers and reviewees (restricted to admin only)
router.post('/map-performance-reviewer-reviewee', passport.checkAuthenticationAsAdmin, adminController.mapReviewerAndReviewee);

// Route to delete an employee (restricted to admin only)
router.get('/deleteEmployee/:id', passport.checkAuthenticationAsAdmin, adminController.deleteEmployee);

// Route to get the update form for an employee (restricted to admin only)
router.get('/employee/update/:id', passport.checkAuthenticationAsAdmin, adminController.getUpdateForm);

// Route to get the employee addition form (restricted to admin only)
router.get('/employee/add-page', passport.checkAuthenticationAsAdmin, adminController.getEmployeeAdditionForm);

// Route to add a new employee (restricted to admin only)
router.post('/employee/add', passport.checkAuthenticationAsAdmin, adminController.addEmployee);

// Route to update employee details (restricted to admin only)
router.post('/employee/update', passport.checkAuthenticationAsAdmin, adminController.updateEmployee);

// Route to make an employee an admin (restricted to admin only)
router.get('/make-admin/:id', passport.checkAuthenticationAsAdmin, adminController.makeEmployeeAdmin);

// Exporting the router for use in other parts of the application
module.exports = router;
