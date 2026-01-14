const pool = require('../config/pool');

class Employee {
    static async getEmployees() {
        const sql = `SELECT e.fullname, e.id, u.email, u.phone, e.department 
                     FROM employee AS e 
                     LEFT JOIN useraccount AS u ON e.user_id = u.id`;
        const result = await pool.query(sql);
        return result.rows;
    }

    static async addEmployee(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const userSql = `INSERT INTO useraccount(email, phone, password, role_id) VALUES ($1, $2, $3, 2) RETURNING id`;
            const userRes = await client.query(userSql, [data.loginEmail, data.phoneNumber, data.password]);
            const newUid = userRes.rows[0].id;

            const empSql = `INSERT INTO employee(user_id, fullname, gender, avatar, address, department, id, manager_id) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, 1)`;
            await client.query(empSql, [newUid, data.fullName, data.gender, data.avatar, data.address, data.department, data.empId]);

            if (data.dob) {
                await client.query(`UPDATE employee SET dob = $1 WHERE user_id = $2`, [data.dob, newUid]);
            }
            
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async deleteEmployee(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { rows } = await client.query(`SELECT user_id FROM employee WHERE id = $1`, [id]);
            if (rows.length > 0) {
                await client.query(`DELETE FROM employee WHERE id = $1`, [id]);
                await client.query(`DELETE FROM useraccount WHERE id = $1`, [rows[0].user_id]);
            }
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async getEmployeeDetails(id) {
        const queryStr = `
            SELECT e.fullname, e.id, u.phone, u.email AS "loginEmail", e.email, 
                   e.address, e.hire_date, e.dob, e.gender, e.avatar, e.department
            FROM employee e
            INNER JOIN useraccount u ON e.user_id = u.id
            WHERE e.id = $1`;
        const res = await pool.query(queryStr, [id]);
        return res.rows[0];
    }

    static async editEmployee(payload) {
        const sql = `UPDATE employee SET department = $1, avatar = $2 WHERE id = $3`;
        return pool.query(sql, [payload.department, payload.avatar, payload.empId]);
    }
}

module.exports = Employee;