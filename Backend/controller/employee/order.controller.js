const Order = require('../../model/order.model');

module.exports.getAllOrders = async (req, res) => {
    try {
        if(req.body.filterType === 'order_date') {
            const orders = await Order.getAllOrdersByDate(req.body.date);
            res.json(orders);
        }else{
            const orders = await Order.getAllOrdersByReceiveDate(req.body.date);
            res.json(orders);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.getOrderDetail = async (req, res) => {
    try {
        const detail = await Order.getOrderDetail(req.body.orderId);
        res.json(detail);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Interal Server Error'});
    }
}

module.exports.createOrder = async (req, res) => {
    try {
        await Order.createOrder(req.body);
        res.status(201).json({ message: 'Order created successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.updateOrderStatus({orderId, newStatus: status});
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(error.status).json({ error: error.message });
    }
}

module.exports.updateInternalNote = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id, req.body.internal_note);
        await Order.updateInternalNote(id, req.body.internal_note);
        res.status(200).json({ message: 'Internal note updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(error.status).json({ error: error.message });
    }
}