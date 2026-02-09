const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Orders = require("../models/Orders");

/* =======================
   ADMIN LOGIN
======================= */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 support login via email OR username
    const admin = await Admin.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: "admin" });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* =======================
   DASHBOARD DATA
======================= */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.getAllRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Orders.find()
    .populate("userId", "username email")
    .populate("items.productId", "name price");
  res.json(orders);
};