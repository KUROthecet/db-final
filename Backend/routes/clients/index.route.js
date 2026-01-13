const homeRoute = require("./home.route");
const authRoute = require("./auth.route");
const orderRoute = require("./orders.route");
const productRoute = require("./product.route");

module.exports = (app) => {
    app.use('/', homeRoute);

    app.use('/auth', authRoute);

    app.use('/api/orders', orderRoute);

    app.use("/menu", productRoute);
}