const Cart = require("../models/Cart");

// Add item to cart (increment)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cartItem = await Cart.findOne({
      userId: req.user.id,
      productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.json(cartItem);
    }

    cartItem = new Cart({
      userId: req.user.id,
      productId,
      quantity,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// View cart items
exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user.id,
    }).populate("productId");

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

// Remove item completely
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};

// ✅ DECREMENT QUANTITY (NEW, CORRECT FOR YOUR SCHEMA)
exports.decrementCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log("DECREMENT called");
    console.log("productId from frontend:", productId);

    const cartItem = await Cart.findOne({
      userId: req.user.id,
      productId,
    });

    console.log("cartItem found:", cartItem);

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
      await cartItem.deleteOne();
      return res.json({ message: "Item removed from cart" });
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    console.error("Decrement error:", error);
    res.status(500).json({ message: "Failed to decrement item" });
  }
};