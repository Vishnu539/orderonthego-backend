const Product = require("../models/Product");

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      restaurantId,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error });
  }
};

// Get all products (used by users)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("restaurantId");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// Get products for a specific restaurant
exports.getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const products = await Product.find({ restaurantId });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch restaurant products", error });
  }
};

// Filter products
exports.filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter products", error });
  }
};