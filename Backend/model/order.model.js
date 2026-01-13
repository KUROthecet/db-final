
const pool = require('../config/pool');

class Order {
    static async createOrder(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Added 'ordertime' explicitly set to NOW() to ensure sorting works correctly
            const query = `INSERT INTO orders
                        (id, customer_id, total_amount, payment, receive_time, receive_date, note, receive_address, receiver, receive_phone, status, orderdate, ordertime)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, NOW()) RETURNING id`;
            
            const values = [
                data.id, 
                data.cus_id, 
                data.prices.total, 
                data.payment, 
                data.time.slot, 
                data.time.date, 
                data.customer.note, 
                data.address, 
                data.receiver.name, 
                data.receiver.phone,
                data.orderDate || new Date().toISOString().split('T')[0] 
            ];
            
            const res = await client.query(query, values);

            if(data.employee_id) {
                const q = await client.query(`SELECT id FROM employee WHERE user_id = $1`, [data.employee_id]);
                if(q.rows.length > 0) {
                    await client.query(`UPDATE orders SET employee_id = $1 WHERE id = $2`, [q.rows[0].id, res.rows[0].id]);
                }
            }
            
            for(let item of data.items){
                let queryItem = `INSERT INTO orderline(order_id, prod_id, quantity, orderdate)
                                VALUES ($1, $2, $3, $4)`;
                // item.id comes from frontend cart item
                let valuesItem = [data.id, item.id, item.quantity || item.qty, data.orderDate || new Date()];
                await client.query(queryItem, valuesItem);
            }

            await client.query('COMMIT');
            return res.rows[0];
        } catch (error){
            await client.query('ROLLBACK');
            console.error("Create Order Failed:", error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getOrder(userId){
        try {
            const query = `
                SELECT 
                    o.id, 
                    o.orderdate, 
                    o.status, 
                    o.total_amount,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'productName', p.name,
                                'quantity', ol.quantity,
                                'price', p.price,
                                'image', p.images
                            )
                        ) FILTER (WHERE ol.order_id IS NOT NULL), 
                        '[]'
                    ) as items
                FROM orders o
                LEFT JOIN orderline ol ON o.id = ol.order_id
                LEFT JOIN product p ON ol.prod_id = p.id
                WHERE o.customer_id = $1
                GROUP BY o.id
                ORDER BY o.ordertime DESC
            `;
            const values = [userId];
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findOrder(orderId) {
        try {
            const query = `SELECT * FROM orders WHERE id = $1`;
            const res = await pool.query(query, [orderId]);
            
            if (res.rows.length === 0) return null;
            
            const order = res.rows[0];

            const itemsQuery = `
                SELECT p.name as "productName", ol.quantity, p.price, p.images as image
                FROM orderline ol
                JOIN product p ON ol.prod_id = p.id
                WHERE ol.order_id = $1
            `;
            const itemsRes = await pool.query(itemsQuery, [orderId]);
            order.items = itemsRes.rows;

            return order;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getAllOrdersByDate(data){
        try {
            const query = `
                SELECT 
                    o.id,
                    COALESCE(c.fullname, o.receiver) AS fullname,
                    o.receive_phone, 
                    o.ordertime, 
                    o.orderdate,
                    o.total_amount, 
                    o.status,
                    o.receive_date, 
                    o.receive_time, 
                    o.receive_address, 
                    o.receiver,
                    COALESCE(u.phone, o.receive_phone) AS phone,
                    o.payment, 
                    o.note, 
                    o.employee_note,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'productName', p.name,
                                'quantity', ol.quantity,
                                'price', p.price
                            )
                        ) FILTER (WHERE ol.order_id IS NOT NULL), 
                        '[]'
                    ) as items
                FROM orders o
                LEFT JOIN customer c ON o.customer_id = c.user_id
                LEFT JOIN useraccount u ON c.user_id = u.id
                LEFT JOIN orderline ol ON o.id = ol.order_id
                LEFT JOIN product p ON ol.prod_id = p.id
                WHERE o.orderdate = $1
                GROUP BY o.id, c.fullname, u.phone
                ORDER BY o.ordertime DESC;
            `
            const value = [data]
            const res = await pool.query(query, value);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getAllOrdersByReceiveDate(data){
        try {
            const query = `
                SELECT 
                    o.id,
                    COALESCE(c.fullname, o.receiver) AS fullname,
                    o.receive_phone, 
                    o.ordertime, 
                    o.orderdate,
                    o.total_amount, 
                    o.status,
                    o.receive_date, 
                    o.receive_time, 
                    o.receive_address, 
                    o.receiver,
                    COALESCE(u.phone, o.receive_phone) AS phone,
                    o.payment, 
                    o.note, 
                    o.employee_note,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'productName', p.name,
                                'quantity', ol.quantity,
                                'price', p.price
                            )
                        ) FILTER (WHERE ol.order_id IS NOT NULL), 
                        '[]'
                    ) as items
                FROM orders o
                LEFT JOIN customer c ON o.customer_id = c.user_id
                LEFT JOIN useraccount u ON c.user_id = u.id
                LEFT JOIN orderline ol ON o.id = ol.order_id
                LEFT JOIN product p ON ol.prod_id = p.id
                WHERE o.receive_date = $1
                GROUP BY o.id, c.fullname, u.phone
                ORDER BY o.receive_time ASC;
            `
            const value = [data]
            const res = await pool.query(query, value);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getOrderDetail(orderId) {
        try {
            const query = `SELECT prod_id, quantity, p.price, p.name as "productName", p.images as image 
                           FROM orderline o
                           JOIN product p ON o.prod_id = p.id
                           WHERE o.order_id = $1;`
            const values = [orderId];
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // --- CRITICAL UPDATE: TRANSACTION FOR STOCK MANAGEMENT ---
    static async updateOrderStatus({ orderId, newStatus }) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Lock order row
            const { rows: orderRows } = await client.query(
                `SELECT status FROM orders WHERE id = $1 FOR UPDATE`,
                [orderId]
            );

            if (orderRows.length === 0) {
                throw { status: 404, message: 'Order not found' };
            }

            const oldStatus = orderRows[0].status;

            // Define allowed transitions
            const allowedTransitions = {
                pending: ["confirmed", "cancelled"],
                confirmed: ["delivering", "cancelled"],
                delivering: ["completed", "cancelled"],
                completed: [],
                cancelled: []
            };

            if (!allowedTransitions[oldStatus].includes(newStatus)) {
                throw { status: 400, message: `Cannot change status from ${oldStatus} to ${newStatus}` };
            }

            // Logic 1: PENDING -> CONFIRMED (Deduct Stock)
            if (oldStatus === "pending" && newStatus === "confirmed") {
                const { rows: items } = await client.query(
                    `SELECT prod_id, quantity FROM orderline WHERE order_id = $1`,
                    [orderId]
                );

                for (const item of items) {
                    const { rows: productRows } = await client.query(
                        `SELECT stock FROM product WHERE id = $1 FOR UPDATE`,
                        [item.prod_id]
                    );

                    if (productRows.length === 0 || productRows[0].stock < item.quantity) {
                        throw { status: 409, message: `Product ID ${item.prod_id} is out of stock` };
                    }

                    await client.query(
                        `UPDATE product SET stock = stock - $1 WHERE id = $2`,
                        [item.quantity, item.prod_id]
                    );
                }
            }

            // Logic 2: CONFIRMED -> CANCELLED (Restock/Refund Stock)
            if (oldStatus === "confirmed" && newStatus === "cancelled") {
                const { rows: items } = await client.query(
                    `SELECT prod_id, quantity FROM orderline WHERE order_id = $1`,
                    [orderId]
                );

                for (const item of items) {
                    await client.query(
                        `UPDATE product SET stock = stock + $1 WHERE id = $2`,
                        [item.quantity, item.prod_id]
                    );
                }
            }

            // Update status
            await client.query(
                `UPDATE orders SET status = $1 WHERE id = $2`,
                [newStatus, orderId]
            );

            await client.query("COMMIT");
            return { success: true };
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(err);
            throw err;
        } finally {
            client.release();
        }
    }

    static async updateInternalNote(id, internal_note) {
        try {
            await pool.query(`UPDATE orders SET employee_note = $1 WHERE id = $2`, [internal_note, id]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Order;
