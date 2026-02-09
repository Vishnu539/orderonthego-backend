// server/routes/restaurantDashboardRoutes.js
const express = require("express");
const router = express.Router();
const restCtrl = require("../controllers/restaurantDashboardController");
const restaurantAuth = require("../middleware/restaurantAuth");

// Public restaurant register & login
router.post("/register", restCtrl.registerRestaurantAccount);
router.post("/login", restCtrl.loginRestaurant);

// Protected restaurant dashboard endpoints
router.post("/menu/add", restaurantAuth, restCtrl.addProduct);
router.put("/menu/:id", restaurantAuth, restCtrl.updateProduct);
router.delete("/menu/:id", restaurantAuth, restCtrl.deleteProduct);
router.get("/menu", restaurantAuth, restCtrl.getMyProducts);

router.get("/orders", restaurantAuth, restCtrl.getRestaurantOrders);

module.exports = router;