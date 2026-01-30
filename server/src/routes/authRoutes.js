// Required Modules
const express = require('express');
const router = express.Router();

// Controllers and Middleware
const { register, login } = require('../controllers/authController');

// Public routes
router.post('/register', register); // Changed from '/' to '/register' for clarity
router.post('/login', login);

// Export the router
module.exports = router;