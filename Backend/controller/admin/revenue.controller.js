const Revenue = require("../../model/revenue.model");

module.exports.getRevenueOrders = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: "date is required" });
        }
        const report = await Revenue.getGeneralRevenue(date);
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.getWeeklyRevenue = async (req, res) => {
    try {
        const {startOfWeek, date} = req.query;
        if (!date) {
            return res.status(400).json({ message: "date is required" });
        }
        
        const revenue = await Revenue.getWeeklyRevenue(startOfWeek, date);
        res.json(revenue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}