// server/seeds/seed.js
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");

/* -------------------- DB CONNECT -------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected (seeding)");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

/* -------------------- RESTAURANT DATA -------------------- */
const restaurantsData = [
  { name: "Spice Hub", address: "Bangalore", email: "spicehub@gmail.com" },
  { name: "Urban Biryani", address: "Hyderabad", email: "urbanbiryani@gmail.com" },
  { name: "Burger Junction", address: "Chennai", email: "burgerjunction@gmail.com" },
  { name: "Pizza Palace", address: "Mumbai", email: "pizzapalace@gmail.com" },
  { name: "Green Bowl", address: "Pune", email: "greenbowl@gmail.com" },
  { name: "Tandoori Tales", address: "Delhi", email: "tandooritales@gmail.com" },
  { name: "Wok Express", address: "Kolkata", email: "wokexpress@gmail.com" },
  { name: "South Feast", address: "Coimbatore", email: "southfeast@gmail.com" },
  { name: "Cafe Delight", address: "Mysore", email: "cafedelight@gmail.com" },
  { name: "Street Bites", address: "Indore", email: "streetbites@gmail.com" },
];

/* -------------------- PRODUCT BASE -------------------- */
const foodTemplates = [
  { name: "Chicken Biryani", price: 220, category: "Biryani" },
  { name: "Veg Biryani", price: 180, category: "Biryani" },
  { name: "Paneer Butter Masala", price: 210, category: "Curry" },
  { name: "Butter Naan", price: 40, category: "Bread" },
  { name: "Cheese Burger", price: 150, category: "Fast Food" },
  { name: "Veg Burger", price: 120, category: "Fast Food" },
  { name: "Margherita Pizza", price: 250, category: "Pizza" },
  { name: "Farmhouse Pizza", price: 280, category: "Pizza" },
  { name: "Veg Fried Rice", price: 160, category: "Rice" },
  { name: "Chicken Fried Rice", price: 190, category: "Rice" },
];

/* -------------------- SEED LOGIC -------------------- */
const seedDatabase = async () => {
  try {
    await connectDB();

    const insertedRestaurants = [];

    // Ensure NO duplicate restaurant names or emails
    for (const r of restaurantsData) {
      let restaurant = await Restaurant.findOne({
        $or: [{ email: r.email }, { name: r.name }],
      });

      if (!restaurant) {
        restaurant = await Restaurant.create({
          ...r,
          isApproved: true,
        });
      }

      insertedRestaurants.push(restaurant);
    }

    console.log(`Restaurants ready: ${insertedRestaurants.length}`);

    // Create products
    const products = [];

    insertedRestaurants.forEach((restaurant) => {
      foodTemplates.forEach((food) => {
        products.push({
          name: food.name,
          price: food.price,
          description: `${food.name} from ${restaurant.name}`,
          category: food.category,
          restaurantId: restaurant._id,
          discount: Math.floor(Math.random() * 20),
        });
      });
    });

    await Product.insertMany(products, { ordered: false });

    console.log(`Products inserted: ${products.length}`);
    console.log("Database seeding completed successfully");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();