
const express = require('express');
const router = express.Router();
const controller = require("../../controller/clients/product.controller");

router.get("/", controller.getMenu);
router.get("/search", controller.search);
router.get("/:id", controller.getProductDetail); // New public route

module.exports = router;
