const Room = require("../models/Rooms");
const Category = require("../models/Categories");

// ✅ Create Room
exports.createRoom = async (req, res) => {
  // admin check
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const { name, category, available, images } = req.body || {};

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Please provide room name and category" });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const room = await Room.create({
      name,
      available: available !== undefined ? available : true,
      images: images || [],
      category: cat._id,
    });

    await room.populate("category");

    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({
      message: "Error creating room",
      error: error.message,
    });
  }
};

// ✅ Get All Rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("category");
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};

// ✅ Get Single Room
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("category");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching room",
      error: error.message,
    });
  }
};

// ✅ Update Room
exports.updateRoom = async (req, res) => {
  // admin check
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const { name, category, available, images } = req.body || {};

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (category !== undefined) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ message: "Invalid category ID" });
      room.category = cat._id;
    }

    if (name !== undefined) room.name = name;
    if (available !== undefined) room.available = available;
    if (images !== undefined) room.images = images; // overwrite or merge as needed

    await room.save();
    await room.populate("category");

    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({
      message: "Error updating room",
      error: error.message,
    });
  }
};

// ✅ Delete Room
exports.deleteRoom = async (req, res) => {
  // admin check
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await room.deleteOne();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting room",
      error: error.message,
    });
  }
};
