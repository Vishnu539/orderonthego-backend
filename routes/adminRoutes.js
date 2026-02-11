const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  approveRestaurant,
  deleteRestaurant,
  deleteUser,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* AUTH */
router.post("/login", adminLogin);

/* USERS */
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

/* RESTAURANTS */
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

/* ORDERS */
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAllOrders
);

module.exports = router;
