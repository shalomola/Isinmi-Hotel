const Category = require("../models/Categories");
const Feature = require("../models/Features");

exports.createCategory = async (req, res) => {
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin)
    return res.status(403).json({ message: "Admin access required" });

  const { name, description, price, features, image } = req.body || {};

  if (!name)
    return res.status(400).json({ message: "Please provide a category name" });

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0)
    return res.status(400).json({ message: "Please provide a valid price per night" });

  try {
    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    if (features) {
      if (!Array.isArray(features)) {
        return res
          .status(400)
          .json({ message: "features must be an array of Feature IDs" });
      }
      const validCount = await Feature.countDocuments({
        _id: { $in: features },
      });
      if (validCount !== features.length) {
        return res
          .status(400)
          .json({ message: "One or more feature IDs are invalid" });
      }
    }

    const category = await Category.create({
      name,
      description: description !== undefined ? description : undefined,
      price: Number(price),
      features: features || [],
      image,
    });
    await category.populate("features");
    res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("features");
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "features",
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin)
    return res.status(403).json({ message: "Admin access required" });

  const { name, description, price, features, image } = req.body || {};

  try {
    if (name) {
      const exists = await Category.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (exists)
        return res
          .status(400)
          .json({ message: "Another category with that name already exists" });
    }

    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0))
      return res.status(400).json({ message: "Price must be a non-negative number" });

    if (features) {
      if (!Array.isArray(features)) {
        return res
          .status(400)
          .json({ message: "features must be an array of Feature IDs" });
      }
      const validCount = await Feature.countDocuments({
        _id: { $in: features },
      });
      if (validCount !== features.length) {
        return res
          .status(400)
          .json({ message: "One or more feature IDs are invalid" });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (features !== undefined) updates.features = features;
    if (image !== undefined) updates.image = image;

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    }).populate("features");

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const isAdmin = req.user && (req.user.isSuperAdmin || req.user.isAdmin);
  if (!isAdmin)
    return res.status(403).json({ message: "Admin access required" });

  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
