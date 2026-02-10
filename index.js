const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log("userRoutes:", typeof userRoutes);
console.log("cartRoutes:", typeof cartRoutes);
console.log("restaurantRoutes:", typeof restaurantRoutes);
console.log("productRoutes:", typeof productRoutes);
console.log("orderRoutes:", typeof orderRoutes);
console.log("adminRoutes:", typeof adminRoutes);
console.log("restaurantDashboardRoutes:", typeof restaurantDashboardRoutes);
console.log("restaurantAuthRoutes:", typeof restaurantAuthRoutes);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantDashboardRoutes = require("./routes/restaurantDashboardRoutes");
const restaurantAuthRoutes = require("./routes/restaurantAuthRoutes");

app.use("/api/restaurant", restaurantAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant-dashboard", restaurantDashboardRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});


