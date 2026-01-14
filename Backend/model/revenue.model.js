const pool = require('../config/pool');

class Revenue {
    static async getGeneralRevenue(targetDate) {
        try {
            const queries = [
                pool.query(`SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_rev 
                            FROM orders WHERE orderdate = $1 AND status = 'completed'`, [targetDate]),
                
                pool.query(`SELECT COALESCE(SUM(ol.quantity), 0) as total_qty 
                            FROM orderline ol JOIN orders o ON o.id = ol.order_id 
                            WHERE o.orderdate = $1 AND o.status = 'completed'`, [targetDate]),
                
                pool.query(`SELECT p.name, SUM(ol.quantity) as sold 
                            FROM orderline ol JOIN orders o ON o.id = ol.order_id JOIN product p ON p.id = ol.prod_id 
                            WHERE o.orderdate = $1 AND o.status = 'completed'
                            GROUP BY p.id, p.name ORDER BY sold DESC LIMIT 5`, [targetDate])
            ];

            const [revRes, qtyRes, topRes] = await Promise.all(queries);

            return {
                total_revenue: revRes.rows[0].total_rev,
                total_orders: revRes.rows[0].total_orders,
                total_items: qtyRes.rows[0].total_qty,
                top: topRes.rows.map(r => ({ name: r.name, sold_quantity: r.sold }))
            };
        } catch (err) {
            throw err;
        }
    }

    static async getWeeklyRevenue(start, end) {
        const sql = `
            SELECT series.day, COALESCE(SUM(o.total_amount), 0) as revenue
            FROM generate_series($1::date, $2::date, '1 day'::interval) as series(day)
            LEFT JOIN orders o ON o.orderdate = series.day AND o.status = 'completed'
            GROUP BY series.day
            ORDER BY series.day ASC`;
        const { rows } = await pool.query(sql, [start, end]);
        return rows;
    }
}

module.exports = Revenue;