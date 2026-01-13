const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Helper: upload buffer to Cloudinary
 */
const uploadFromBuffer = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Upload / Replace avatar (employee / manager)
 * One user = one avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; // from auth middleware
    const publicId = `avatars/user_${userId}`;

    const result = await uploadFromBuffer(req.file.buffer, {
      public_id: publicId,
      folder: "avatars",
      overwrite: true,
      invalidate: true,
      transformation: [
        { width: 300, height: 300, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    return res.status(500).json({ message: "Upload avatar failed" });
  }
};

/**
 * Upload / Replace product image
 * One product = one main image
 */
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const productId = req.params.productId; // or req.body.productId
    const publicId = `products/product_${productId}`;

    const result = await uploadFromBuffer(req.file.buffer, {
      public_id: publicId,
      folder: "products",
      overwrite: true,
      invalidate: true,
      quality: "auto",
      fetch_format: "auto",
    });

    return res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Product image upload error:", err);
    return res.status(500).json({ message: "Upload product image failed" });
  }
};