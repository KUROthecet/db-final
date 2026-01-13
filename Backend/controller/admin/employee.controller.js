const Employee = require("../../model/employee.model");
const bcrypt = require('bcrypt');

module.exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.getEmployees();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.addEmployee = async (req, res) => {
    try {
        req.body.gender = req.body.gender ? req.body.gender.toLowerCase() : 'other';
        // Removed manual empId conversion as DB uses SERIAL
        req.body.password = await bcrypt.hash('123', 10); // Default password or from req.body if provided
        
        await Employee.addEmployee(req.body);
        res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteEmployee = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Employee.deleteEmployee(id);
        res.status(200).json({message: "Employee deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

module.exports.editEmployee = async (req, res) => {
    try {
        await Employee.editEmployee(req.body);
        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.getEmployeeDetails = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const employee = await Employee.getEmployeeDetails(id);
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}