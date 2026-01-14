const pool = require('../config/pool');

class Order {
    static async createOrder(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const orderSql = `
                INSERT INTO orders (id, customer_id, total_amount, payment, receive_time, receive_date, note, receive_address, receiver, receive_phone, status, orderdate, ordertime)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, CURRENT_TIMESTAMP) 
                RETURNING id`;
            
            const orderValues = [
                data.id, data.cus_id, data.prices.total, data.payment,
                data.time.slot, data.time.date, data.customer.note, data.address,
                data.receiver.name, data.receiver.phone,
                data.orderDate || new Date().toISOString().slice(0, 10)
            ];
            
            const { rows: orderRows } = await client.query(orderSql, orderValues);
            const orderId = orderRows[0].id;

            if (data.employee_id) {
                const emp = await client.query(`SELECT id FROM employee WHERE user_id = $1`, [data.employee_id]);
                if (emp.rowCount > 0) {
                    await client.query(`UPDATE orders SET employee_id = $1 WHERE id = $2`, [emp.rows[0].id, orderId]);
                }
            }
            
            const lineItems = data.items.map(item => {
                return client.query(
                    `INSERT INTO orderline(order_id, prod_id, quantity, orderdate) VALUES ($1, $2, $3, $4)`,
                    [orderId, item.id, item.quantity || item.qty, data.orderDate || new Date()]
                );
            });
            await Promise.all(lineItems);

            await client.query('COMMIT');
            return orderRows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async getOrder(userId) {
        const sql = `
            SELECT o.id, o.orderdate, o.status, o.total_amount,
            (SELECT COALESCE(json_agg(item_data), '[]') FROM (
                SELECT p.name as "productName", ol.quantity, p.price, p.images as image
                FROM orderline ol
                JOIN product p ON ol.prod_id = p.id
                WHERE ol.order_id = o.id
            ) item_data) as items
            FROM orders o
            WHERE o.customer_id = $1
            ORDER BY o.ordertime DESC`;
        const { rows } = await pool.query(sql, [userId]);
        return rows;
    }

    static async findOrder(orderId) {
        const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
        if (orderRes.rowCount === 0) return null;
        
        const itemRes = await pool.query(`
            SELECT p.name AS "productName", ol.quantity, p.price, p.images AS image
            FROM orderline ol JOIN product p ON ol.prod_id = p.id
            WHERE ol.order_id = $1`, [orderId]);
        
        return { ...orderRes.rows[0], items: itemRes.rows };
    }

    static async getAllOrdersByDate(date) {
        const sql = `
            SELECT o.*, COALESCE(c.fullname, o.receiver) as fullname, COALESCE(u.phone, o.receive_phone) as phone,
            JSON_AGG(JSON_BUILD_OBJECT('productName', p.name, 'quantity', ol.quantity, 'price', p.price)) as items
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.user_id
            LEFT JOIN useraccount u ON c.user_id = u.id
            JOIN orderline ol ON o.id = ol.order_id
            JOIN product p ON ol.prod_id = p.id
            WHERE o.orderdate = $1
            GROUP BY o.id, c.fullname, u.phone
            ORDER BY o.ordertime DESC`;
        const res = await pool.query(sql, [date]);
        return res.rows;
    }

    static async getAllOrdersByReceiveDate(date) {
        const sql = `
            SELECT o.*, COALESCE(c.fullname, o.receiver) as fullname, COALESCE(u.phone, o.receive_phone) as phone,
            JSON_AGG(JSON_BUILD_OBJECT('productName', p.name, 'quantity', ol.quantity, 'price', p.price)) as items
            FROM orders o
            LEFT JOIN customer c ON o.customer_id = c.user_id
            LEFT JOIN useraccount u ON c.user_id = u.id
            JOIN orderline ol ON o.id = ol.order_id
            JOIN product p ON ol.prod_id = p.id
            WHERE o.receive_date = $1
            GROUP BY o.id, c.fullname, u.phone
            ORDER BY o.receive_time ASC`;
        const res = await pool.query(sql, [date]);
        return res.rows;
    }

    static async getOrderDetail(orderId) {
        const res = await pool.query(`
            SELECT ol.prod_id, ol.quantity, p.price, p.name AS "productName", p.images AS image 
            FROM orderline ol INNER JOIN product p ON ol.prod_id = p.id
            WHERE ol.order_id = $1`, [orderId]);
        return res.rows;
    }

    static async updateOrderStatus({ orderId, newStatus }) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const { rows } = await client.query(`SELECT status FROM orders WHERE id = $1 FOR UPDATE`, [orderId]);
            if (!rows.length) throw { status: 404, message: 'Order missing' };

            const currentStatus = rows[0].status;
            const workflow = {
                pending: ["confirmed", "cancelled"],
                confirmed: ["delivering", "cancelled"],
                delivering: ["completed", "cancelled"],
                completed: [],
                cancelled: []
            };

            if (!workflow[currentStatus].includes(newStatus)) {
                throw { status: 400, message: `Invalid transition: ${currentStatus} -> ${newStatus}` };
            }

            // Xử lý kho
            if (currentStatus === "pending" && newStatus === "confirmed") {
                const items = await client.query(`SELECT prod_id, quantity FROM orderline WHERE order_id = $1`, [orderId]);
                for (const item of items.rows) {
                    const stockCheck = await client.query(`SELECT stock FROM product WHERE id = $1 FOR UPDATE`, [item.prod_id]);
                    if (stockCheck.rows[0].stock < item.quantity) throw { status: 409, message: `Insufficient stock for ${item.prod_id}` };
                    await client.query(`UPDATE product SET stock = stock - $1 WHERE id = $2`, [item.quantity, item.prod_id]);
                }
            } else if (currentStatus === "confirmed" && newStatus === "cancelled") {
                const items = await client.query(`SELECT prod_id, quantity FROM orderline WHERE order_id = $1`, [orderId]);
                for (const item of items.rows) {
                    await client.query(`UPDATE product SET stock = stock + $1 WHERE id = $2`, [item.quantity, item.prod_id]);
                }
            }

            await client.query(`UPDATE orders SET status = $1 WHERE id = $2`, [newStatus, orderId]);
            await client.query("COMMIT");
            return { success: true };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async updateInternalNote(id, note) {
        return pool.query(`UPDATE orders SET employee_note = $1 WHERE id = $2`, [note, id]);
    }
}

module.exports = Order;
