const express = require("express");
const router = express.Router();

const {
  addRestaurant,
  getRestaurants,
  loginRestaurant,
} = require("../controllers/restaurantController");

router.post("/add", addRestaurant);
router.post("/login", loginRestaurant);
router.get("/", getRestaurants);

module.exports = router;