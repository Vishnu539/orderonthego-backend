const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Orders = require("../models/Orders");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

/* =======================
   ADMIN LOGIN
======================= */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* =======================
   DASHBOARD DATA
======================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("userId", "username email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 }); // 🔥 newest first

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

/* =======================
   APPROVE RESTAURANT
======================= */
exports.approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.isApproved = true;
    await restaurant.save();

    res.json({ message: "Restaurant approved" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to approve restaurant",
      error: err.message,
    });
  }
};

/* =======================
   DELETE RESTAURANT
======================= */
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.email !== email) {
      return res.status(400).json({
        message: "Email confirmation does not match restaurant email",
      });
    }

    await Product.deleteMany({ restaurantId: restaurant._id });
    await Restaurant.findByIdAndDelete(id);

    res.json({ message: "Restaurant deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete restaurant" });
  }
};

/* =======================
   DELETE USER
======================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email !== email) {
      return res.status(400).json({
        message: "Email confirmation does not match user email",
      });
    }

    await Orders.deleteMany({ userId: user._id });
    await Cart.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
