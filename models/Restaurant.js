const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    isApproved: { type: Boolean, default: false },

    // ✅ ADD THIS
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
