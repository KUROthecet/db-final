const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/revenue.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.get("/", verifyToken, authorize(3), controller.getRevenueOrders);

router.get("/weekly", verifyToken, authorize(3), controller.getWeeklyRevenue);

module.exports = router;