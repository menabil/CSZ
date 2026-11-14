const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Upload product image to Cloudinary
// @route   POST /api/upload
// @access  Private / Moderator or Admin
const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded. Please attach an image.",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "csz-products"
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary",
      url: result.url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProductImage,
};
