const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const restaurantAuth = require("../middleware/restaurantAuth");
const ctrl = require("../controllers/restaurantDashboardController");

// ✅ REGISTER WITH IMAGE
router.post(
  "/register",
  upload.single("image"),
  ctrl.registerRestaurantAccount
);

router.post("/login", ctrl.loginRestaurant);

// PRODUCTS
router.post(
  "/menu/add",
  restaurantAuth,
  upload.single("image"),
  ctrl.addProduct
);

router.put("/menu/:id", restaurantAuth, ctrl.updateProduct);
router.delete("/menu/:id", restaurantAuth, ctrl.deleteProduct);
router.get("/menu", restaurantAuth, ctrl.getMyProducts);

// ORDERS
router.get("/orders", restaurantAuth, ctrl.getRestaurantOrders);

module.exports = router;
