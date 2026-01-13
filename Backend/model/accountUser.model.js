
const pool = require('../config/pool');

class Account {
    // Helper helper to support dependency injection of the db client
    static async query(text, params, client = pool) {
        return client.query(text, params);
    }

    static async findByEmail(email) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE email = $1', [email]);
            if (result.rows.length === 0) return null;
            
            // Check roles to query correct profile table
            let user = null;
            if (result.rows[0].role_id === 1) {
                 user = await pool.query('SELECT * FROM customer WHERE user_id = $1', [result.rows[0].id]);
            } else if (result.rows[0].role_id === 2) {
                 user = await pool.query('SELECT * FROM employee WHERE user_id = $1', [result.rows[0].id]);
            } else if (result.rows[0].role_id === 3) {
                 user = await pool.query('SELECT * FROM manager WHERE user_id = $1', [result.rows[0].id]);
            }

            if (!user || user.rows.length === 0) return null;
            
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                password: result.rows[0].password,
                role: result.rows[0].role_id,
            }
        } catch(error) {
            console.error('Error cannot find email:', error);
            throw error;
        }
    }

    // Specific finders kept for compatibility
    static async findEmployeeByEmail(email) { return this.findByEmail(email); }
    static async findManagerByEmail(email) { return this.findByEmail(email); }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            if (result.rows.length === 0) return null;
            
            const user = await pool.query('SELECT * FROM customer WHERE user_id = $1', [result.rows[0].id]);
            
            // Even if customer profile missing (rare), return account info with role
            const profile = user.rows.length > 0 ? user.rows[0] : {};

            return {
                id: result.rows[0].id,
                fullname: profile.fullname || 'Unknown',
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: profile.address,
                dob: profile.dob,
                role: result.rows[0].role_id, // CRITICAL: Frontend needs this to maintain session type
            }
        } catch(error) {
            console.error('Error cannot find id:', error);
            throw error;
        }
    }

    // UPDATED: Accepts client for transaction safety
    static async signUp(data, client = pool) {
        try {
            const query = `INSERT INTO useraccount 
                        (email, password, createdat, role_id)
                        VALUES ($1, $2, NOW(), $3) RETURNING id, email`;
            const values = [data.email, data.password, 1];
            // Use the passed client if available, otherwise use pool
            const res = await client.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // UPDATED: Accepts client for transaction safety
    static async addCus(data, client = pool) {
        try {
            const query = `INSERT INTO customer(user_id, fullname)
                        VALUES ($1, $2) RETURNING fullname`;
            const values = [data.id, data.name];
            // Use the passed client if available, otherwise use pool
            const res = await client.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async update(data) {
        try {
            const query = `
                        UPDATE useraccount
                        SET email = $1, phone = $2, updatedat = NOW()
                        WHERE id = $3
                        RETURNING id, email, phone;
                        `;
            const values = [data.email, data.phone, data.id];
            const result = await pool.query(query, values);
            
            const query2 = `
                        UPDATE customer
                        SET fullname = $1, address = $2
                        WHERE user_id = $3
                        RETURNING fullname, address;`;
            const values2 = [data.name, data.address, data.id];
            const user = await pool.query(query2, values2);
            
            if(data.dob && data.dob.length !== 0) {
                await pool.query(`UPDATE customer SET dob = $1 WHERE user_id = $2`,[data.dob, data.id]);
            }
            
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                fullname: user.rows[0].fullname,
                address: user.rows[0].address,
            };
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
    
    // ... (Giữ nguyên các hàm Employee/Manager update/find khác) ...
    
    static async findEmployeeById(id) {
        try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            const user = await pool.query('SELECT * FROM employee WHERE user_id = $1', [id]);
            if (user.rows.length === 0) return null;
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                loginEmail: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
                dob: user.rows[0].dob,
                hire_date: user.rows[0].hire_date,
                avatar: user.rows[0].avatar,
                department: user.rows[0].department,
                email: user.rows[0].email,
                role: result.rows[0].role_id
            }
        } catch(error) { throw error; }
    }

    static async getPassword(id) {
        const res = await pool.query('SELECT password FROM useraccount WHERE id = $1', [id]);
        return res.rows[0];
    }

    static async changePassword(id, newPass) {
        await pool.query('UPDATE useraccount SET password = $1, updatedat = NOW() WHERE id = $2', [newPass, id]);
    }
    
    static async findManagerById(id) {
         try {
            const result = await pool.query('SELECT * FROM useraccount WHERE id = $1', [id]);
            const user = await pool.query('SELECT * FROM manager WHERE user_id = $1', [id]);
            return {
                id: result.rows[0].id,
                fullname: user.rows[0].fullname,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: user.rows[0].address,
                dob: user.rows[0].dob,
                avatar: user.rows[0].avatar,
                department: user.rows[0].department,
                role: result.rows[0].role_id
            }
        } catch(error) { throw error; }
    }
}

module.exports = Account;
