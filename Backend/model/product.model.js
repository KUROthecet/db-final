const pool = require('../config/pool');

class Product {
    static async getAllProducts() {
        // Hàm này thường dùng cho trang chủ khách hàng
        const query = `
            SELECT c.name AS cat_name, c.slug, p.id, p.name, p.images, p.price FROM category c
            JOIN product p ON c.id = p.category_id ORDER BY c.name`;
        const cat = await pool.query(query);
        let res = [];
        for (let i = 0; i < cat.rows.length; i++) {
            if (i == 0 || cat.rows[i].cat_name != cat.rows[i - 1].cat_name) {
                let currCat = { category: cat.rows[i].cat_name, slug: cat.rows[i].slug };
                let items = [];
                for (let j = i; j < cat.rows.length; j++) {
                    if (cat.rows[j].cat_name == cat.rows[i].cat_name) {
                        items.push({
                            id: cat.rows[j].id,
                            name: cat.rows[j].name,
                            image: cat.rows[j].images, // Đã map images -> image
                            price: cat.rows[j].price,
                        });
                        i = j;
                    } else break;
                }
                currCat.items = items;
                res.push(currCat);
            }
        }
        return res;
    }

    static async getStock() {
        // Hàm này dùng cho tab STOCK của nhân viên
        // QUAN TRỌNG: Đổi p.images thành p.images AS image
        const query = `
            SELECT p.id, p.name, p.price, p.stock, c.name as category, 
                   p.description, p.images AS image, p.status, 
                   p.ingredients, p.nutrition_info 
            FROM product p
            JOIN category c ON p.category_id = c.id
            ORDER BY p.id;`
        const res = await pool.query(query);
        return res.rows;
    }

    static async getMenu() {
        // Hàm này dùng cho tab POS của nhân viên
        // QUAN TRỌNG: Đổi p.images thành p.images AS image
        const query = `
            SELECT p.id, p.name, p.price, p.stock, c.name as category, 
                   p.description, p.images AS image, p.status 
            FROM product p
            JOIN category c ON p.category_id = c.id
            ORDER BY p.name`;
        const res = await pool.query(query);
        return res.rows;
    }

    static async searchByName(keyword) {
        // Đổi p.images thành p.images AS image
        const query = `
            SELECT p.id, p.name, p.price, p.stock, c.name as category, 
                   p.description, p.images AS image, p.status 
            FROM product p
            JOIN category c ON p.category_id = c.id
            WHERE p.name ILIKE $1
            ORDER BY p.name`;
        const res = await pool.query(query, [`%${keyword}%`]);
        return res.rows;
    }

    static async getProductDetails(id) {
        // Đổi p.images thành p.images AS image
        const query = `
            SELECT p.name, p.description, p.images AS image, p.id, p.price, 
                   c.name AS category, p.stock, p.status, p.ingredients, p.nutrition_info
            FROM product p
            JOIN category c ON p.category_id = c.id
            WHERE p.id = $1`;
        const res = await pool.query(query, [id]);
        return res.rows[0];
    }

    // Các hàm add/delete/update giữ nguyên...
    static async addProduct(data) {
        try {
            let cat_id = await pool.query(`SELECT id FROM category WHERE name = $1`, [data.category]);
            if(cat_id.rows.length === 0 ) {
                cat_id = await pool.query(`INSERT INTO category (name, slug) VALUES ($1, $2) RETURNING id`, [data.category, data.slug]); 
            }
            const query = `INSERT INTO product (name, category_id, price, provide_id, images, id, stock, description, status, ingredients, nutrition_info) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
            const values = [data.productName, cat_id.rows[0].id, data.price, 1, data.image, data.sku, data.count, data.description, data.status, data.ingredients, data.nutritionInfo];
            await pool.query(query, values);
        } catch (error) { throw error; }
    }

    static async deleteProduct(id) {
        try {
            const category = await pool.query(`SELECT category_id FROM product WHERE id = $1`, [id]);
            await pool.query(`DELETE FROM product WHERE id = $1`, [id]);
            const items = await pool.query(`SELECT COUNT(*) FROM product WHERE category_id = $1`, [category.rows[0].category_id]);
            if(Number(items.rows[0].count) == 0){
                await pool.query(`DELETE FROM category WHERE id = $1`, [category.rows[0].category_id]);
            }
        } catch (error) { throw error; }
    }

    static async updateProduct(data) {
        try {
            const query = `UPDATE product
                            SET name = $1, price = $2, description = $3, stock = $4, status = $5, images = $6, ingredients = $7, nutrition_info = $8
                            WHERE id = $9`;
            const values = [data.productName, data.price, data.description, data.count, data.status, data.image, data.ingredients, data.nutritionInfo, data.sku];
            await pool.query(query, values);
        } catch (error) { throw error; }
    }
}

module.exports = Product;
