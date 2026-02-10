const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  approveRestaurant,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* =======================
   TEST
======================= */
router.get("/ping", (req, res) => {
  res.json({ message: "admin routes alive" });
});

/* =======================
   AUTH
======================= */
router.post("/login", adminLogin);

/* =======================
   DASHBOARD DATA (ADMIN ONLY)
======================= */
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.get(
  "/restaurants",
  authMiddleware,
  roleMiddleware("admin"),
  getAllRestaurants
);

router.put(
  "/restaurants/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveRestaurant
);

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

module.exports = router;
