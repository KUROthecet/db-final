const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload.middleware");
const controller = require("../../controller/admin/upload.controller");
const verifyToken = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");

router.post("/avatar", verifyToken, authorize(3), upload.single("image"), controller.uploadAvatar);

router.post("/product", verifyToken, authorize(3), upload.single("image"), controller.uploadProductImage);

module.exports = router;