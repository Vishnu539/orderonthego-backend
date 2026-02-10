const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  approveRestaurant,
  deleteRestaurant,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* AUTH */
router.post("/login", adminLogin);

/* DASHBOARD DATA */
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

router.delete(
  "/restaurants/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteRestaurant
);

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

module.exports = router;
