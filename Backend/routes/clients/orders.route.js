const express = require('express');
const router = express.Router();

const controller = require("../../controller/clients/order.controller");
const verifyToken = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/", verifyToken, authorize(1), controller.saveOrder);

router.get("/history/:id", verifyToken, authorize(1), controller.orderHistory);

router.get("/track/:id", verifyToken, authorize(1), controller.trackOrder);

module.exports = router;