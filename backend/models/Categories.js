const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  price: { type: Number, default: 0 },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
  image: {
    url: String,
    public_id: String,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
