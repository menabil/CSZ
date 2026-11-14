const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Public routes for product viewing
router.get("/", getProducts);
router.get("/:id", getProductById);

// Restricted routes: Moderator & Admin can add, update, manage products ("modarator product add korte parbe")
router.post("/", protect, authorize("admin", "moderator"), createProduct);
router.put("/:id", protect, authorize("admin", "moderator"), updateProduct);
router.patch("/:id/stock", protect, authorize("admin", "moderator"), updateProductStock);
router.delete("/:id", protect, authorize("admin", "moderator"), deleteProduct);

module.exports = router;
