const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Orders = require("../models/Orders");
const Product = require("../models/Product");

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

/* =======================
   APPROVE RESTAURANT
======================= */
exports.approveRestaurant = async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  restaurant.isApproved = true;
  await restaurant.save();

  res.json({ message: "Restaurant approved" });
};

/* =======================
   DELETE RESTAURANT ❗
   Requires email confirmation
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

    // Delete all products of this restaurant
    await Product.deleteMany({ restaurantId: restaurant._id });

    // Delete restaurant
    await Restaurant.findByIdAndDelete(id);

    res.json({ message: "Restaurant deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete restaurant" });
  }
};
