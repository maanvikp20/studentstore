// Required Modules
const express = require('express');
const router = express.Router();

// Controllers and Middleware
const { register, login } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Export the router
module.exports = router;