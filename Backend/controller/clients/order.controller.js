const Order = require('../../model/order.model');

module.exports.saveOrder = async (req, res) => {
    try {
        const data = req.body;
        await Order.createOrder(data);
        res.status(201).json({ message: 'Order created successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.orderHistory = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const result = await Order.getOrder(userId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports.trackOrder = async (req, res) => {
    try {
        // 1. Lấy ID và loại bỏ khoảng trắng thừa, loại bỏ dấu # nếu người dùng nhập vào
        let orderId = req.params.id.trim();
        if (orderId.startsWith('#')) {
            orderId = orderId.substring(1);
        }

        const result = await Order.findOrder(orderId);

        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // 2. Sửa lỗi so sánh kiểu dữ liệu (Ép cả 2 về Number để tránh lỗi String vs Integer)
        if (Number(result.customer_id) !== Number(req.user.id)) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}