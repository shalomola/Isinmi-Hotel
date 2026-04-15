const express = require('express');
const router = express.Router();

const {
    registerUser,
    getAllUsers,
    updateUser,
    updateUserProfile
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middleware/authMiddleware');