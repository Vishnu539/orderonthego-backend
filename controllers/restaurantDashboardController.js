// server/controllers/restaurantDashboardController.js
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
const Orders = require("../models/Orders");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   RESTAURANT REGISTER (WITH IMAGE)
========================= */
exports.registerRestaurantAccount = async (req, res) => {
  try {
    const { name, address, email, password } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Restaurant image is required" });
    }

    const existing = await Restaurant.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const rest = new Restaurant({
      name,
      address,
      email,
      password: hashed,
      isApproved: false,
      image: req.file.path, // ✅ Cloudinary URL
    });

    await rest.save();

    res.status(201).json({
      message: "Restaurant registered. Await admin approval.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed" });
  }
};

/* =========================
   RESTAURANT LOGIN
========================= */
exports.loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rest = await Restaurant.findOne({ email });
    if (!rest) return res.status(400).json({ message: "Invalid credentials" });
    if (!rest.isApproved)
      return res.status(403).json({ message: "Restaurant not approved" });

    const isMatch = await bcrypt.compare(password, rest.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: rest._id.toString(), role: "restaurant" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      restaurant: { id: rest._id, name: rest.name },
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};
