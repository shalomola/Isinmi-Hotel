const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    available: { type: Boolean, default: true },
    images: [{ url: String, public_id: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

module.exports = Room;
