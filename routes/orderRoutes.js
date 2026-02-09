const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const restaurantAuth = require("../middleware/restaurantAuth");

// User routes
router.post("/place", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrders);

// Restaurant route
router.patch(
  "/:orderId/status",
  restaurantAuth,
  updateOrderStatus
);

module.exports = router;