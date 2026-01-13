const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/employee/order.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/", verifyToken, authorize(2), controller.getAllOrders);

router.post("/detail", verifyToken, authorize(2), controller.getOrderDetail);

router.post("/create", verifyToken, authorize(2), controller.createOrder);

router.post("/update-status", verifyToken, authorize(2), controller.updateOrderStatus);

router.put("/:id/internal-note", verifyToken, authorize(2), controller.updateInternalNote);

module.exports = router;