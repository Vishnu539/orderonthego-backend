const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* =======================
   TEST
======================= */
router.get("/ping", (req, res) => {
  res.json({ message: "admin routes alive" });
});

// TEMP: Seed admin (REMOVE AFTER USE)
router.post("/seed-admin", async (req, res) => {
  try {
    const email = "admin@test.com";
    const password = "admin123";

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    res.json({
      message: "Admin seeded successfully",
      email,
      password,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

router.get("/seed-admin", async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      username: "admin",
      email: "admin@test.com",
      password: hashed
    });

    await admin.save();

    res.json({
      message: "Admin seeded successfully",
      credentials: {
        username: "admin",
        password: "admin123"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

