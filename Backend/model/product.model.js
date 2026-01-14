const pool = require('../config/pool');

class Product {
    static async getAllProducts() {
        const sql = `
            SELECT c.name as category_name, c.slug as category_slug, p.id, p.name, p.images, p.price 
            FROM product p
            INNER JOIN category c ON p.category_id = c.id 
            ORDER BY c.name, p.name`;
        const { rows } = await pool.query(sql);
        
        // Dùng reduce thay vì vòng lặp lồng nhau truyền thống
        return rows.reduce((acc, row) => {
            let cat = acc.find(c => c.category === row.category_name);
            if (!cat) {
                cat = { category: row.category_name, slug: row.category_slug, items: [] };
                acc.push(cat);
            }
            cat.items.push({
                id: row.id,
                name: row.name,
                image: row.images,
                price: row.price
            });
            return acc;
        }, []);
    }

    static async getStock() {
        const sql = `
            SELECT p.id, p.name, p.price, p.stock, c.name AS category, p.description, p.images, p.status, p.ingredients, p.nutrition_info 
            FROM product p JOIN category c ON p.category_id = c.id
            ORDER BY p.id ASC`;
        const res = await pool.query(sql);
        return res.rows;
    }

    static async getMenu() {
        const { rows } = await pool.query(`
            SELECT p.*, c.name AS category 
            FROM product p JOIN category c ON p.category_id = c.id
            ORDER BY p.name`);
        return rows;
    }

    static async searchByName(keyword) {
        const sql = `
            SELECT p.*, c.name AS category FROM product p
            JOIN category c ON p.category_id = c.id
            WHERE p.name ~* $1 ORDER BY p.name`; // Dùng Regex ~* thay cho ILIKE
        const res = await pool.query(sql, [keyword]);
        return res.rows;
    }

    static async addProduct(data) {
        const client = await pool.connect();
        try {
            let catRes = await client.query(`SELECT id FROM category WHERE name = $1`, [data.category]);
            let catId;
            if (catRes.rowCount === 0) {
                const newCat = await client.query(`INSERT INTO category (name, slug) VALUES ($1, $2) RETURNING id`, [data.category, data.slug]);
                catId = newCat.rows[0].id;
            } else {
                catId = catRes.rows[0].id;
            }

            const sql = `INSERT INTO product (name, category_id, price, provide_id, images, id, stock, description, status, ingredients, nutrition_info) 
                         VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10)`;
            await client.query(sql, [data.productName, catId, data.price, data.image, data.sku, data.count, data.description, data.status, data.ingredients, data.nutritionInfo]);
        } finally {
            client.release();
        }
    }

    static async deleteProduct(id) {
        const { rows } = await pool.query(`DELETE FROM product WHERE id = $1 RETURNING category_id`, [id]);
        if (rows.length > 0) {
            const catId = rows[0].category_id;
            const check = await pool.query(`SELECT 1 FROM product WHERE category_id = $1 LIMIT 1`, [catId]);
            if (check.rowCount === 0) await pool.query(`DELETE FROM category WHERE id = $1`, [catId]);
        }
    }

    static async getProductDetails(id) {
        const res = await pool.query(
            `SELECT p.*, c.name AS category FROM product p JOIN category c ON p.category_id = c.id WHERE p.id = $1`, [id]
        );
        return res.rows[0];
    }

    static async updateProduct(d) {
        const sql = `
            UPDATE product SET name = $1, price = $2, description = $3, stock = $4, status = $5, images = $6, ingredients = $7, nutrition_info = $8
            WHERE id = $9 RETURNING *`;
        const vals = [d.productName, d.price, d.description, d.count, d.status, d.image, d.ingredients, d.nutritionInfo, d.sku];
        const res = await pool.query(sql, vals);
        return res.rows[0];
    }
}

module.exports = Product;
