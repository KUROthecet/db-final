const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; // from verifyToken middleware
    const publicId = `avatars/user_${userId}`;

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            overwrite: true,
            invalidate: true,
            folder: "avatars",
            transformation: [
              { width: 300, height: 300, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

    const result = await uploadFromBuffer();

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};