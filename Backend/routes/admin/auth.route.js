const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

router.post("/logout", controller.logout);

router.get("/profile/:id", verifyToken, authorize(3), controller.getProfile);

router.put("/profile/:id", verifyToken, authorize(3), controller.updateProfile);

router.put("/change-password/:id", verifyToken, authorize(3), controller.changePassword);

module.exports = router;