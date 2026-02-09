const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  filterProducts,
  getProductsByRestaurant,
} = require("../controllers/productController");

router.post("/add", addProduct);

// User / public
router.get("/", getProducts);
router.get("/filter", filterProducts);

// Restaurant-specific
router.get("/restaurant/:restaurantId", getProductsByRestaurant);

module.exports = router;