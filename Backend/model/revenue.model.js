const pool = require('../config/pool');

class Revenue {
    static async getGeneralRevenue(date) {
        try {
            const q1 = `SELECT COUNT(id) AS total_orders, COALESCE(SUM(total_amount), 0) AS total_revenue
                        FROM orders
                        WHERE orderdate = $1 AND status = 'completed'`;
            const general = await pool.query(q1, [date]);
            const q2 = `SELECT COALESCE(SUM(ol.quantity), 0) AS total_items
                        FROM orderline ol
                        JOIN orders o ON o.id = ol.order_id
                        WHERE o.orderdate = $1 AND o.status = 'completed';`
            const items = await pool.query(q2, [date]);
            const q3 = `SELECT p.name, SUM(ol.quantity) AS sold_quantity FROM orderline ol
                        JOIN orders o ON o.id = ol.order_id
                        JOIN product p ON p.id = ol.prod_id
                        WHERE o.orderdate = $1 AND o.status = 'completed'
                        GROUP BY p.id, p.name
                        ORDER BY sold_quantity DESC
                        LIMIT 5`;
            const top_items = await pool.query(q3, [date]);
            return {
                total_revenue: general.rows[0].total_revenue,
                total_orders: general.rows[0].total_orders,
                total_items: items.rows[0].total_items,
                top: top_items.rows,
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getWeeklyRevenue(startOfWeek, date) {
        try {
            const query = `WITH days AS (
                                SELECT generate_series(
                                    $1::date,
                                    $2::date,
                                    interval '1 day'
                                )::date AS day
                            )
                            SELECT d.day, COALESCE(SUM(o.total_amount), 0) AS revenue
                            FROM days d
                            LEFT JOIN orders o
                            ON o.orderdate = d.day
                            WHERE status = 'completed' OR status IS NULL
                            GROUP BY d.day
                            ORDER BY d.day`;
            const values = [startOfWeek, date];
            const res = await pool.query(query, values);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Revenue;