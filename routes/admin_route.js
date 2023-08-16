// requring express
const express = require('express');
// making router 
const router = express.Router();
// requiring passprt, for chking the authrization
const passport = require('passport');
// requring adminController file, to call the fucntion, when requied
const adminController = require('../controllers/admin_controller');

// It will assign the work to the employeess
router.get('/assignWork' , passport.checkAuthenticationAsAdmin , adminController.assignWork);

// THis is help to view the employee
router.get('/view-employee' , passport.checkAuthenticationAsAdmin , adminController.showEmployeeList);
// It will help to set the reviews, 
router.post('/map-performance-reviewer-reviewee' , passport.checkAuthenticationAsAdmin , adminController.mapReviewerAndReviewee);
// This router will make new Admin
// It will delete the employee
router.get('/deleteEmployee/:id', passport.checkAuthenticationAsAdmin , adminController.deleteEmployee);

// only admin can update other employee while rest cannot
router.get('/employee/update/:id', passport.checkAuthenticationAsAdmin , adminController.getUpdateForm);
// it will get employee addition form
router.get('/employee/add-page' , passport.checkAuthenticationAsAdmin , adminController.getEmployeeAdditionForm);

// all the empoyee
router.post('/employee/add',passport.checkAuthenticationAsAdmin, adminController.addEmployee);

router.post('/employee/update',passport.checkAuthenticationAsAdmin, adminController.updateEmployee);

router.get('/make-admin/:id',passport.checkAuthenticationAsAdmin, adminController.makeEmployeeAdmin);


module.exports = router;