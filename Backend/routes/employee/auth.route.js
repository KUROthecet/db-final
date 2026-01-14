const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/employee/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

router.post("/logout", controller.logout);

router.put("/profile/:id", verifyToken, authorize(2), controller.updateProfile);

router.get("/profile/:id", verifyToken, authorize(2), controller.userProfile);

router.put("/change-password/:id", verifyToken, authorize(2), controller.changePassword);

module.exports = router;