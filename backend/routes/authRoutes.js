const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser
} = require('../controllers/authControllers');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/login', loginUser);

// Admin
router.post('/register', protect, adminOnly, registerUser);

module.exports = router;