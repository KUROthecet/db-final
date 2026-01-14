const employeeRoute = require("./employee.route");
const productRoute = require("./product.route");
const authRoute = require("./auth.route");
const revenueRoute = require("./revenue.route");
const uploadRoute = require("./upload.route");

module.exports = (app) => {
    app.use('/manager/revenue', revenueRoute);

    app.use('/manager/auth', authRoute);

    app.use("/manager/employees", employeeRoute);

    app.use("/manager/products", productRoute);

    app.use("/manager/upload", uploadRoute);
}