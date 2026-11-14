const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * Upload an image buffer to Cloudinary
 * If API credentials are not set, falls back to an encoded Data URI so uploads never fail during dev/testing.
 */
const uploadToCloudinary = (fileBuffer, mimetype, folder = "csz-products") => {
  return new Promise((resolve, reject) => {
    // If real Cloudinary credentials are provided, stream upload to Cloudinary CDN
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          format: "webp",
          transformation: [{ width: 800, height: 600, crop: "limit" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Smart Fallback when API keys are not yet configured in .env:
      // Return a base64 Data URI that renders directly in any browser and persists cleanly.
      const base64Data = fileBuffer.toString("base64");
      const dataUri = `data:${mimetype || "image/png"};base64,${base64Data}`;
      resolve({
        url: dataUri,
        public_id: `mock_${Date.now()}`,
        format: mimetype ? mimetype.split("/")[1] : "png",
      });
    }
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
