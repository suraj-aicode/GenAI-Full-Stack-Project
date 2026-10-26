const express = require('express');
const authController = require('../controllers/auth.controller');
const tokenBlacklistModel = require('../models/blacklist.model');
const authUserMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
/** 
* @route   POST /api/auth/register
* @descrption  Register new user with username, email and password
* @access  Public
*/
router.post('/register', authController.registerUserController);

/** 
* @route   POST /api/auth/login
* @descrption  Login a registered user with email and password
* @access  Public
*/
router.post('/login', authController.loginUserController);

/** 
* @route   POST /api/auth/logout
* @descrption  clear token from user cookies and add token to blacklist
* @access  Public
*/
router.post('/logout', authController.logoutUserController);

/** 
 @route   GET /api/auth/get-me
 @descrption  Get the profile of the logged-in user
 @access  Private
*/

router.get('/get-me', authUserMiddleware, authController.getMeController);



module.exports = router;