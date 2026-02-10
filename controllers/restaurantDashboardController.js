// server/controllers/restaurantDashboardController.js
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
const Orders = require("../models/Orders");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Restaurant register
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
    res.status(500).json({ message: "Register failed", error: err });
  }
};

// Restaurant login
exports.loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const rest = await Restaurant.findOne({ email });
    if (!rest) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!rest.isApproved) {
      return res.status(403).json({ message: "Restaurant not approved" });
    }

    const isMatch = await bcrypt.compare(password, rest.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: rest._id.toString(), role: "restaurant" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      restaurant: { id: rest._id, name: rest.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description,
      restaurantId: req.restaurant.id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.restaurant.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.restaurantId.toString() !== restaurantId) {
      return res.status(403).json({ message: "Not your product" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.restaurant.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.restaurantId.toString() !== restaurantId) {
      return res.status(403).json({ message: "Not your product" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    console.log("🔍 AUTH RESTAURANT:", req.restaurant);

    const restaurantId = req.restaurant.id;
    console.log("🔍 USING restaurantId:", restaurantId);

    const products = await Product.find({ restaurantId });
    console.log("🔍 PRODUCTS FOUND:", products.length);

    res.json(products);
  } catch (err) {
    console.error("❌ ERROR IN getMyProducts:", err);
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

// Get restaurant orders
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;

    const products = await Product.find({ restaurantId }).select("_id");
    const productIds = products.map((p) => p._id);

    const orders = await Orders.find({
      "items.productId": { $in: productIds },
    }).populate("items.productId");

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch restaurant orders", error: err });
  }

};


