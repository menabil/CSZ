require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoDBConfig = require("./config/mongoDBConfig");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const seedInitialData = require("./utils/seeder");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB and seed initial data
mongoDBConfig().then(() => {
  seedInitialData();
});

// Root & Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    name: "CSZ Store E-Commerce API",
    status: "Healthy",
    version: "1.0.0",
    roles: ["user", "moderator", "admin"],
    endpoints: {
      auth: "/api/auth",
      users: "/api/users (Admin only)",
      products: "/api/products (Public read; Moderator/Admin write)",
      orders: "/api/orders (Public/User create; Admin view all)",
      admin: "/api/admin (Admin dashboard overview)",
    },
  });
});

// Register Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
