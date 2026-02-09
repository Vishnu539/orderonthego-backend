const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  decrementCartItem,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove/:id", authMiddleware, removeFromCart);

// ✅ new decrement route
router.post("/decrement", authMiddleware, decrementCartItem);

module.exports = router;