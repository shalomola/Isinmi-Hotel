const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  getBookingsByRoom,
  getBookingsByGuest,
  checkCategoryAvailability,
  confirmBooking 
} = require("../controllers/bookingControllers");

const { protect, adminOnly, optionalProtect } = require("../middleware/authMiddleware");

// Public — no auth needed, guest clicks this from their email
router.get('/confirm/:id', confirmBooking);

// Public (guest booking)
router.post("/", optionalProtect, createBooking);

// Admin only
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);
router.delete("/:id", protect, adminOnly, cancelBooking);

// Public/mixed access — place before '/:id' to avoid route conflicts
router.get("/room/:roomId", getBookingsByRoom);
router.get("/guest/search", getBookingsByGuest);

// Protected single booking (admin or owner check inside controller)
router.get("/:id", protect, getBookingById);

router.get("/category/:categoryId/availability", checkCategoryAvailability);

module.exports = router;
