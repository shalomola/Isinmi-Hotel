const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    getProfile,
    updateProfile,
} = require('../controllers/userControllers');

const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

// logged-in User
router.get('/profile', protect, getProfile);
router.put('/updateProfile', protect, updateProfile);

// Admin routes
router.post('/', protect, adminOnly, createUser);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);


module.exports = router;