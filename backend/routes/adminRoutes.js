const express = require("express");
const router = express.Router();
const { getDashboardOverview } = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All admin routes require Admin authorization ("admin shob kisu dekte parbe")
router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardOverview);

module.exports = router;
