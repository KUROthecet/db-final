const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/employee/product.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.get("/", verifyToken, authorize(2), controller.getStock);

module.exports = router;