const Booking = require("../models/Bookings");
const Room = require("../models/Room");
const Category = require("../models/Categories");

const { sendBookingConfirmationEmail, sendBookingConfirmedEmail } = require("../utils/sendEmail");

exports.createBooking = async (req, res) => {
  try {
    const {
      categoryId,
      guestName,
      guestEmail,
      checkInDate,
      checkOutDate,
      numOfGuests,
      specialRequests,
    } = req.body || {};

    if (
      !categoryId ||
      !guestName ||
      !guestEmail ||
      !checkInDate ||
      !checkOutDate
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate check-in and check-out dates
    if (checkIn >= checkOut) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    // Get number of days (ensure at least 1)
    const numOfDays = Math.max(
      1,
      Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
    );
    // console.log(`Number of days: ${numOfDays}`);

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find all rooms in the category
    const roomsInCategory = await Room.find({ category: categoryId });
    if (!roomsInCategory.length) {
      return res
        .status(404)
        .json({ message: `No rooms found under '${category.name}'` });
    }
    // console.log(
    //   `Found ${roomsInCategory.length} rooms in category '${category.name}'`,
    // );

    const roomIds = roomsInCategory.map((r) => r._id);

    const bookedRoomIds = await Booking.distinct("room", {
      room: { $in: roomIds },
      bookingStatus: { $in: ["confirmed", "pending"] },
      $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
    });

    const availableRooms = roomsInCategory.filter(
      (r) => !bookedRoomIds.some((id) => id.equals(r._id)),
    );
    // console.log(
    //   `Available rooms in category '${category.name}':`,
    //   availableRooms.map((r) => r.name),
    // );

    if (!availableRooms.length) {
      return res.status(400).json({
        message: `No available rooms in '${category.name}' for the selected dates`,
      });
    }

    const assignedRoom = availableRooms[0];

    // console.log(
    //   `Assigning room ${assignedRoom.name} to booking for ${guestName}`,
    // );
    const bookedBy = req.user ? req.user.id : null;

    // Price lives on the category, not the room
    const pricePerNight = category.price ?? 0;

    const totalPrice = pricePerNight * numOfDays;

    const booking = await Booking.create({
      room: assignedRoom._id,
      bookedBy,
      guestName,
      guestEmail,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numOfGuests: numOfGuests || 1,
      daysOfStay: numOfDays, // persist numOfDays
      pricePerNight,
      totalPrice,
      specialRequests,
      bookingStatus: "pending", // starts as pending until guest confirms
    });
    // console.log(`Created booking ${booking._id} for ${guestName}`);

    // ✅ Send confirmation email to guest (include numOfDays)
    await sendBookingConfirmationEmail({
      guestName,
      guestEmail,
      booking,
      assignedRoom: {
        roomNumber: assignedRoom.name,
        pricePerNight: pricePerNight,
      },
      daysOfStay: numOfDays,
      category: category.name,
    });

    res.status(201).json({
      message:
        "Booking request created. A confirmation email has been sent to the guest.",
      booking,
      assignedRoom: {
        roomNumber: assignedRoom.name,
        category: category.name,
        pricePerNight,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

exports.checkCategoryAvailability = async (req, res) => {
  try {
    const { category, checkInDate, checkOutDate } = req.query;

    if (!category || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ message: "Category and dates are required" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const roomsInCategory = await Room.find({ category });

    if (!roomsInCategory.length) {
      return res
        .status(404)
        .json({ message: `No rooms found under '${category}'` });
    }

    const roomIds = roomsInCategory.map((r) => r._id);

    const bookedRoomIds = await Booking.distinct("room", {
      room: { $in: roomIds },
      bookingStatus: { $in: ["confirmed", "pending"] },
      $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
    });

    const availableCount = roomsInCategory.filter(
      (r) => !bookedRoomIds.some((id) => id.equals(r._id)),
    ).length;

    res.status(200).json({
      category,
      totalRooms: roomsInCategory.length,
      availableRooms: availableCount,
      isAvailable: availableCount > 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking availability", error: error.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");

    if (!booking) {
      return res.status(404).json({ status: "not_found", message: "We could not find a booking linked to this confirmation." });
    }

    if (booking.bookingStatus === "confirmed") {
      return res.status(200).json({
        status: "already_confirmed",
        message: "This booking has already been confirmed.",
        guestName: booking.guestName,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        roomName: booking.room?.name ?? null,
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ status: "cancelled", message: "This booking has been cancelled and can no longer be confirmed." });
    }

    booking.bookingStatus = "confirmed";
    await booking.save();

    // Send confirmed receipt email to guest
    try {
      await sendBookingConfirmedEmail({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        booking,
        roomName: booking.room?.name ?? "your room",
      });
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr.message);
    }

    return res.status(200).json({
      status: "confirmed",
      message: "Your booking has been confirmed!",
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      roomName: booking.room?.name ?? null,
      totalPrice: booking.totalPrice,
      daysOfStay: booking.daysOfStay,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred while confirming your booking. Please contact the hotel directly." });
  }
};

// kept for reference — no longer used
const renderPage = (title, message, color) => `
    <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; display: flex; justify-content: center;
                       align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                .card { background: white; padding: 40px; border-radius: 10px; text-align: center;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.1); max-width: 480px; }
                h1 { color: ${color}; }
                p { color: #555; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>${title}</h1>
                <p>${message}</p>
            </div>
        </body>
    </html>
`;

exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0; // 0 = no limit

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("room")
      .populate("bookedBy", "name email");

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room")
      .populate("bookedBy", "name email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guestName, guestEmail } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (guestName) booking.guestName = guestName;
    if (guestEmail) booking.guestEmail = guestEmail;

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkIn >= checkOut) {
        return res.status(400).json({ message: "Invalid date range" });
      }

      const overlappingBooking = await Booking.findOne({
        room: booking.room,
        _id: { $ne: booking._id },
        bookingStatus: "confirmed", // fixed: was 'status'
        $or: [
          { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
        ],
      });

      if (overlappingBooking) {
        return res
          .status(400)
          .json({ message: "Room already booked for selected dates" });
      }

      booking.checkInDate = checkIn;
      booking.checkOutDate = checkOut;
    }

    await booking.save();
    res.status(200).json({ booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.bookingStatus = "cancelled"; // fixed: was booking.status

    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};

exports.getBookingsByRoom = async (req, res) => {
  try {
    const bookings = await Booking.find({
      room: req.params.roomId,
      bookingStatus: "confirmed", // fixed: was status
    });

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching room bookings", error: error.message });
  }
};

exports.getBookingsByGuest = async (req, res) => {
  try {
    const { guestName } = req.query;
    if (!guestName)
      return res.status(400).json({ message: "Guest name is required" });

    const bookings = await Booking.find({
      guestName: { $regex: guestName, $options: "i" },
    }).populate("room");

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching guest bookings", error: error.message });
  }
};
