const express = require("express");
const upload = require("../../middleware/upload.middleware");
const controller = require("../../controller/employee/upload.controller");
const verifyToken = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");

const router = express.Router();

router.post("/avatar", verifyToken, authorize(2), upload.single("avatar"), controller.uploadAvatar);

module.exports = router;