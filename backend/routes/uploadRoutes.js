const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { uploadProductImage } = require("../controllers/uploadController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Product image upload: only Moderator and Admin ("modarator product add korte parbe")
router.post(
  "/",
  protect,
  authorize("admin", "moderator"),
  upload.single("image"),
  uploadProductImage
);

module.exports = router;
