const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const { protect, adminOnly } = require('../middleware/authMiddleware');


// ✅ Public routes (frontend needs these)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);


// 🔒 Admin-only routes
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);


module.exports = router;