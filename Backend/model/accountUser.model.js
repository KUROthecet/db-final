const pool = require('../config/pool');

class Account {
    static async query(text, params, client = pool) {
        return client.query(text, params);
    }

    static async findByEmail(email) {
        try {
            const { rows } = await pool.query('SELECT * FROM useraccount WHERE email = $1 LIMIT 1', [email]);
            if (rows.length === 0) return null;

            const account = rows[0];
            const roleMap = { 1: 'customer', 2: 'employee', 3: 'manager' };
            const tableName = roleMap[account.role_id];

            if (!tableName) return null;

            const profile = await pool.query(`SELECT * FROM ${tableName} WHERE user_id = $1`, [account.id]);
            if (profile.rows.length === 0) return null;

            const { fullname } = profile.rows[0];
            return {
                id: account.id,
                fullname,
                email: account.email,
                password: account.password,
                role: account.role_id,
            };
        } catch (err) {
            console.error('[AccountModel] FindEmail Error:', err.message);
            throw err;
        }
    }

    static async findEmployeeByEmail(email) { return this.findByEmail(email); }
    static async findManagerByEmail(email) { return this.findByEmail(email); }

    static async findById(id) {
        try {
            const accRes = await pool.query('SELECT id, email, phone, role_id FROM useraccount WHERE id = $1', [id]);
            if (accRes.rowCount === 0) return null;

            const cusRes = await pool.query('SELECT fullname, address, dob FROM customer WHERE user_id = $1', [id]);
            const profile = cusRes.rows[0] || {};

            return {
                id: accRes.rows[0].id,
                fullname: profile.fullname || 'Unknown',
                email: accRes.rows[0].email,
                phone: accRes.rows[0].phone,
                address: profile.address,
                dob: profile.dob,
                role: accRes.rows[0].role_id,
            };
        } catch (err) {
            throw new Error(`FindByID Failed: ${err.message}`);
        }
    }

    static async signUp(data, client = pool) {
        const sql = `INSERT INTO useraccount (email, password, createdat, role_id) 
                     VALUES ($1, $2, CURRENT_TIMESTAMP, 1) RETURNING id, email`;
        const { rows } = await client.query(sql, [data.email, data.password]);
        return rows[0];
    }

    static async addCus(data, client = pool) {
        const sql = `INSERT INTO customer(user_id, fullname) VALUES ($1, $2) RETURNING fullname`;
        const { rows } = await client.query(sql, [data.id, data.name]);
        return rows[0];
    }

    static async update(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const updAcc = await client.query(
                `UPDATE useraccount SET email = $1, phone = $2, updatedat = NOW() WHERE id = $3 RETURNING *`,
                [data.email, data.phone, data.id]
            );

            const updCus = await client.query(
                `UPDATE customer SET fullname = $1, address = $2 WHERE user_id = $3 RETURNING *`,
                [data.name, data.address, data.id]
            );

            if (data.dob?.length > 0) {
                await client.query(`UPDATE customer SET dob = $1 WHERE user_id = $2`, [data.dob, data.id]);
            }

            await client.query('COMMIT');
            return {
                id: updAcc.rows[0].id,
                email: updAcc.rows[0].email,
                phone: updAcc.rows[0].phone,
                fullname: updCus.rows[0].fullname,
                address: updCus.rows[0].address,
            };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    static async findEmployeeById(id) {
        const sql = `
            SELECT u.id, e.fullname, u.email as "loginEmail", u.phone, e.address, 
                   e.dob, e.hire_date, e.avatar, e.department, e.email, u.role_id as role
            FROM useraccount u
            INNER JOIN employee e ON u.id = e.user_id
            WHERE u.id = $1`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0] || null;
    }

    static async getPassword(id) {
        const { rows } = await pool.query('SELECT password FROM useraccount WHERE id = $1', [id]);
        return rows[0];
    }

    static async changePassword(id, newPass) {
        return pool.query('UPDATE useraccount SET password = $1, updatedat = NOW() WHERE id = $2', [newPass, id]);
    }

    static async findManagerById(id) {
        const res = await pool.query(
            `SELECT u.id, m.fullname, u.email, u.phone, m.address, m.dob, m.avatar, m.department, u.role_id as role 
             FROM useraccount u JOIN manager m ON u.id = m.user_id WHERE u.id = $1`, [id]
        );
        return res.rows[0];
    }
}

module.exports = Account;
