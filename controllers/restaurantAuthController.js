const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");

/* ---------------- REGISTER RESTAURANT ---------------- */
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Restaurant.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Restaurant already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = new Restaurant({
      name,
      email,
      password: hashedPassword,
      address,
      isApproved: false, // admin must approve
    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant registered successfully. Await admin approval.",
    });
  } catch (error) {
    console.error("RESTAURANT REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------------- LOGIN RESTAURANT ---------------- */
exports.loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!restaurant.isApproved) {
      return res
        .status(403)
        .json({ message: "Restaurant not approved by admin" });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      restaurantId: restaurant._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
