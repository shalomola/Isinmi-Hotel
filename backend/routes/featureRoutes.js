const express = require('express');
const router = express.Router();

const {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature
} = require('../controllers/featureControllers');

const { protect, adminOnly } = require('../middleware/authMiddleware');


// ✅ Public routes (frontend can access)
router.get('/', getAllFeatures);
router.get('/:id', getFeatureById);


// 🔒 Admin-only routes
router.post('/', protect, adminOnly, createFeature);
router.put('/:id', protect, adminOnly, updateFeature);
router.delete('/:id', protect, adminOnly, deleteFeature);


module.exports = router;