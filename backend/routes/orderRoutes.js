const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorize, optionalAuth } = require("../middlewares/authMiddleware");

// Place order (guest or authenticated user)
router.post("/", optionalAuth, createOrder);

// Customer view their own orders
router.get("/my-orders", protect, getMyOrders);

// Admin view all customer orders ("admin shob kisu dekte parbe")
router.get("/", protect, authorize("admin"), getAllOrders);

// Single order view (Owner or Admin)
router.get("/:id", protect, getOrderById);

// Admin update order status or delete order
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
