const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/employee.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.get("/", verifyToken, authorize(3), controller.getEmployees);

router.post("/add", verifyToken, authorize(3), controller.addEmployee);

router.delete("/delete/:id", verifyToken, authorize(3), controller.deleteEmployee);

router.get("/details/:id", verifyToken, authorize(3), controller.getEmployeeDetails);

router.put("/edit", verifyToken, authorize(3), controller.editEmployee);

module.exports = router;