const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', verifyToken, authController.getProfile);

// POST /api/auth/logout - Logout user (protected)
router.post('/logout', verifyToken, authController.logout);

module.exports = router;