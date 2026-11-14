const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All user management routes require Admin authorization ("admin shob kisu dekte parbe")
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.get("/stats/summary", getUserStats);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.put("/:id/status", toggleUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
