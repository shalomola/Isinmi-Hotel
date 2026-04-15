const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
        // Set when a staff member books on behalf of a guest
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null         // null = customer booked themselves
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        guestName: {
            type: String,
            required: true
        },

        guestEmail: {
            type: String,
            required: true
        },

        checkInDate: {
            type: Date,
            required: true
        },

        checkOutDate: {
            type: Date,
            required: true
        },

        numOfGuests: {
            type: Number,
            required: true,
            default: 1
        },

        pricePerNight: {
            type: Number
        },

        daysOfStay: {
            type: Number
        },

        totalPrice: {
            type: Number
        },

        paymentInfo: {
            paymentId: { type: String },
            method: { type: String },
            status: { type: String }
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        paidAt: {
            type: Date
        },

        // Single consistent status field
        bookingStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending'
        },

        specialRequests: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);