require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoDBConfig = require("./config/mongoDBConfig");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const seedInitialData = require("./utils/seeder");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration: allow frontend communication
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate Limiter for Authentication to prevent Brute-Force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

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
    security: "Active (Helmet, RateLimit, JWT, Bcrypt)",
    roles: ["user", "moderator", "admin"],
    endpoints: {
      auth: "/api/auth",
      users: "/api/users (Admin only)",
      products: "/api/products (Public read; Moderator/Admin write)",
      orders: "/api/orders (Public/User create; Admin view all)",
      admin: "/api/admin (Admin dashboard overview)",
      upload: "/api/upload (Cloudinary image upload for Moderator/Admin)",
    },
  });
});

// Register Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running securely on port: ${port}`);
});
