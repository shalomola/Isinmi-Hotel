const express = require('express');
const router = express.Router();

const {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom
} = require('../controllers/roomsControllers');

const { protect, adminOnly } = require('../middleware/authMiddleware');


// Public
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Admin only
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;