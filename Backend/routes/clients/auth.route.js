const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/clients/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

router.post("/signup", controller.signup);

router.post("/logout", controller.logout);

router.put("/:id", verifyToken, authorize(1), controller.updateUser);

router.get("/:id", verifyToken, authorize(1), controller.userProfile);

router.put("/change-password/:id", verifyToken, authorize(1), controller.changePassword);

module.exports = router;