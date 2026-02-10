// server/controllers/restaurantDashboardController.js
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
const Orders = require("../models/Orders");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

/* =========================
   RESTAURANT REGISTER
========================= */
exports.registerRestaurantAccount = async (req, res) => {
  try {
    const { name, address, email, password } = req.body;

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
    });

    await rest.save();
    res.status(201).json({
      message: "Restaurant registered. Await admin approval.",
    });
  } catch (err) {
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
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   ADD PRODUCT (WITH IMAGE)
========================= */
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      restaurantId: req.restaurant.id,
      image: req.file.path, // ✅ CLOUDINARY URL
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.restaurantId.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: "Not your product" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.restaurantId.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: "Not your product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* =========================
   GET MY PRODUCTS
========================= */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      restaurantId: req.restaurant.id,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =========================
   GET ORDERS
========================= */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const products = await Product.find({
      restaurantId: req.restaurant.id,
    }).select("_id");

    const orders = await Orders.find({
      "items.productId": { $in: products.map((p) => p._id) },
    }).populate("items.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

