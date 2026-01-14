const pool = require('../config/pool');

class Account {
    static async query(text, params, client = pool) {
        return client.query(text, params);
    }

    // --- HÀM TÌM KIẾM ---
    static async findByEmail(email) {
        const { rows } = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
        if (!rows.length) return null;
        
        const acc = rows[0];
        const tableMap = { 1: 'customer', 2: 'employee', 3: 'manager' };
        const profile = await pool.query(`SELECT * FROM ${tableMap[acc.role_id]} WHERE user_id = $1`, [acc.id]);
        
        return profile.rows.length ? {
            id: acc.id,
            fullname: profile.rows[0].fullname,
            email: acc.email,
            password: acc.password,
            role: acc.role_id
        } : null;
    }

    static async findEmployeeByEmail(email) { return this.findByEmail(email); }
    static async findManagerByEmail(email) { return this.findByEmail(email); }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT u.*, c.fullname, c.address, c.dob FROM useraccount u 
             LEFT JOIN customer c ON u.id = c.user_id WHERE u.id = $1`, [id]);
        return rows[0] ? { ...rows[0], role: rows[0].role_id } : null;
    }

    // --- HÀM CẬP NHẬT ---
    static async update(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Cập nhật thông tin chung trong useraccount
            const accRes = await client.query(
                `UPDATE useraccount SET email = $1, phone = $2, updatedat = NOW() WHERE id = $3 RETURNING role_id`,
                [data.email, data.phone, data.id]
            );

            if (accRes.rowCount === 0) throw new Error("User not found");
            const roleId = accRes.rows[0].role_id;
            
            // Xác định bảng đích dựa trên Role
            const tableMap = { 1: 'customer', 2: 'employee', 3: 'manager' };
            const targetTable = tableMap[roleId];

            // 2. Cập nhật thông tin riêng trong bảng Profile tương ứng
            // Sử dụng COALESCE để giữ lại giá trị cũ nếu giá trị mới không được gửi lên
            const profileSql = `
                UPDATE ${targetTable} 
                SET fullname = $1, address = $2, dob = COALESCE($3, dob)
                WHERE user_id = $4 
                RETURNING *`;
            
            const profRes = await client.query(profileSql, [
                data.name || data.fullname, 
                data.address, 
                data.dob || null, 
                data.id
            ]);

            await client.query('COMMIT');

            // Trả về Object đầy đủ để Frontend (AuthContext) cập nhật State ngay lập tức
            return {
                id: data.id,
                email: data.email,
                phone: data.phone,
                fullName: profRes.rows[0].fullname, // Map về fullName 
                address: profRes.rows[0].address,
                dob: profRes.rows[0].dob,
                role: roleId
            };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    // Alias để tương thích với các Controller gọi hàm cũ
    static async updateManager(data, id) { return this.update({ ...data, id }); }
    static async updateEmployee(data, id) { return this.update({ ...data, id }); }

    // --- CÁC HÀM KHÁC ---
    static async signUp(data, client = pool) {
        const res = await client.query(
            `INSERT INTO useraccount (email, password, createdat, role_id) VALUES ($1, $2, NOW(), 1) RETURNING id, email`,
            [data.email, data.password]);
        return res.rows[0];
    }

    static async addCus(data, client = pool) {
        const res = await client.query(`INSERT INTO customer(user_id, fullname) VALUES ($1, $2) RETURNING fullname`, [data.id, data.name]);
        return res.rows[0];
    }

    static async getPassword(id) {
        const { rows } = await pool.query('SELECT password FROM useraccount WHERE id = $1', [id]);
        return rows[0];
    }

    static async changePassword(id, newPass) {
        await pool.query('UPDATE useraccount SET password = $1, updatedat = NOW() WHERE id = $2', [newPass, id]);
    }

    static async findManagerById(id) {
        const { rows } = await pool.query(
            `SELECT u.id, m.fullname, u.email, u.phone, m.address, m.dob, m.avatar, m.department, u.role_id as role 
             FROM useraccount u JOIN manager m ON u.id = m.user_id WHERE u.id = $1`, [id]);
        return rows[0];
    }

    static async findEmployeeById(id) {
        const { rows } = await pool.query(
            `SELECT u.id, e.fullname, u.email as "loginEmail", u.phone, e.address, e.dob, e.hire_date, e.avatar, e.department, e.email, u.role_id as role
             FROM useraccount u JOIN employee e ON u.id = e.user_id WHERE u.id = $1`, [id]);
        return rows[0];
    }
}

module.exports = Account;