const express = require("express");
const router = express.Router();
const {
  registerRestaurant,
  loginRestaurant,
} = require("../controllers/restaurantAuthController");

// Register restaurant
router.post("/register", registerRestaurant);

// Login restaurant
router.post("/login", loginRestaurant);

module.exports = router;
