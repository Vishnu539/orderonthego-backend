const Orders = require("../models/Orders");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* ---------------- PLACE ORDER ---------------- */
exports.placeOrder = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    const cartItems = await Cart.find({ userId: req.user.id }).populate(
      "productId"
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Group items by restaurantId
    const groupedByRestaurant = {};

    for (const item of cartItems) {
      const restaurantId = item.productId.restaurantId.toString();

      if (!groupedByRestaurant[restaurantId]) {
        groupedByRestaurant[restaurantId] = [];
      }

      groupedByRestaurant[restaurantId].push(item);
    }

    const createdOrders = [];

    // Create one order per restaurant
    for (const restaurantId in groupedByRestaurant) {
      const restaurantItems = groupedByRestaurant[restaurantId];

      let totalAmount = 0;

      const items = restaurantItems.map((item) => {
        const price = item.productId.price;
        totalAmount += price * item.quantity;

        return {
          productId: item.productId._id,
          quantity: item.quantity,
          price,
        };
      });

      const order = new Orders({
        userId: req.user.id,
        restaurantId,
        items,
        totalAmount,
        address,
        paymentMethod,
        status: "pending",
      });

      await order.save();
      createdOrders.push(order);
    }

    // Clear cart after creating all orders
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json({
      message: "Order(s) placed successfully",
      orders: createdOrders,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

/* ---------------- USER ORDERS ---------------- */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/* ---------------- RESTAURANT ORDERS ---------------- */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Orders.find({
      restaurantId: req.restaurant.id,
    })
      .populate("items.productId")
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurant orders",
      error,
    });
  }
};

/* ---------------- RESTAURANT UPDATE ORDER STATUS ---------------- */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure restaurant owns this order
    if (order.restaurantId.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }

};

