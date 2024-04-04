const express = require('express');
const router = express.Router();
const { signup, signin, getuser, logout } = require('../controllers/authController'); // Import the signup controller
const jwtAuth = require('../middleware/jwtAuth');

// Define a route for signup
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/user',jwtAuth, getuser)
router.get('/logout',jwtAuth, logout)

module.exports = router;
