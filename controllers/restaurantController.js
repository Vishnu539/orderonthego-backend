const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

/* ADD RESTAURANT */
exports.addRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Failed to add restaurant" });
  }
};

/* GET RESTAURANTS */
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isApproved: true });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

/* LOGIN RESTAURANT */
exports.loginRestaurant = async (req, res) => {
  try {
    console.log("🔥 RESTAURANT LOGIN HIT", req.body);

    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found" });
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({ message: "Restaurant not approved" });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: restaurant._id, role: "restaurant" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: "restaurant" });
  } catch (err) {
    console.error("Restaurant login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};