// seeder.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'pane_e_amore', // <--- ĐIỀN TRỰC TIẾP TÊN DB VÀO ĐÂY
  password: process.env.DB_PASSWORD || '123e',
  port: process.env.DB_PORT || 5432,
});


const runSeeder = async () => {
  const password = '123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  try {
    console.log('🚀 Đang khởi tạo dữ liệu mẫu...');

    // 1. Dọn dẹp dữ liệu cũ để tránh xung đột
    await pool.query('DELETE FROM manager');
    await pool.query('DELETE FROM employee');
    await pool.query('DELETE FROM customer');
    await pool.query('DELETE FROM useraccount');

    // 2. TẠO TÀI KHOẢN ADMIN (Role: 3)
    const adminUser = await pool.query(
      'INSERT INTO useraccount (email, password, role_id, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      ['admin@bakery.com', hash, 3, '0911111111']
    );
    const adminId = adminUser.rows[0].id;
    await pool.query(
      'INSERT INTO manager (user_id, fullname, email, department) VALUES ($1, $2, $3, $4)',
      [adminId, 'Hệ Thống Admin', 'admin@bakery.com', 'Management']
    );
    console.log('✅ Đã tạo Admin (ID:', adminId, ')');

    // 3. TẠO TÀI KHOẢN NHÂN VIÊN (Role: 2)
    const staffUser = await pool.query(
      'INSERT INTO useraccount (email, password, role_id, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      ['staff@bakery.com', hash, 2, '0922222222']
    );
    const staffUid = staffUser.rows[0].id;
    // Lưu ý: employee.id là mã NV nhập tay (ví dụ 2001)
    await pool.query(
      'INSERT INTO employee (id, user_id, fullname, email, department, manager_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [2001, staffUid, 'Nhân Viên Demo', 'staff@bakery.com', 'Service', adminId]
    );
    console.log('✅ Đã tạo Staff (UID:', staffUid, ')');

    // 4. TẠO TÀI KHOẢN KHÁCH HÀNG (Role: 1)
    const clientUser = await pool.query(
      'INSERT INTO useraccount (email, password, role_id, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      ['client@bakery.com', hash, 1, '0933333333']
    );
    const clientUid = clientUser.rows[0].id;
    await pool.query(
      'INSERT INTO customer (user_id, fullname, address) VALUES ($1, $2, $3)',
      [clientUid, 'Khách Hàng Thân Thiết', 'Số 1 Đại Cồ Việt, Hà Nội']
    );
    console.log('✅ Đã tạo Client (UID:', clientUid, ')');

    console.log('--- HOÀN TẤT! Hãy restart Backend và đăng nhập với pass 123 ---');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi Seeder:', error.message);
    process.exit(1);
  }
};

runSeeder();