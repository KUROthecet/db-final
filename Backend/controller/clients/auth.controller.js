const Account = require("../../model/accountUser.model");
const pool = require('../../config/pool'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- ĐĂNG NHẬP KHÁCH HÀNG ---
module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm tài khoản
        const user = await Account.findByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Kiểm tra quyền: Chỉ khách hàng (Role 1) mới được login tại đây
        if (user.role !== 1) {
            return res.status(403).json({ error: 'Please login via Employee/Manager Portal' });
        }

        // So khớp mật khẩu
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        // Tạo JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' }
        );

        // Lưu Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set true nếu dùng HTTPS
            sameSite: "strict"
        });

        res.json({ 
            message: 'Login successful', 
            user: {
                id: user.id,
                role: user.role,
                email: user.email,
                fullname: user.fullname,
            } 
        });
    } catch (err) {
        console.error("Signin Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}

// --- ĐĂNG KÝ KHÁCH HÀNG ---
module.exports.signup = async (req, res) => {
    const client = await pool.connect(); 
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Kiểm tra email tồn tại
        const existing = await Account.findByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        await client.query('BEGIN'); // Bắt đầu Transaction

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Tạo tài khoản (useraccount)
        const newAccount = await Account.signUp({ email, password: hashedPassword }, client);
        
        // 2. Tạo hồ sơ khách hàng (customer)
        await Account.addCus({ id: newAccount.id, name: name }, client);

        await client.query('COMMIT'); // Hoàn tất
        
        return res.status(201).json({
            message: 'Signup successful',
            user: { email, fullname: name }
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Hủy nếu lỗi
        console.error("Signup Error:", err);
        res.status(500).json({ error: 'Server error during signup' });
    } finally {
        client.release(); 
    }
}

// --- CẬP NHẬT THÔNG TIN KHÁCH HÀNG ---
module.exports.updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Bảo mật: Chỉ chủ sở hữu được cập nhật
        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized update" });
        }

        // Chuẩn bị dữ liệu để khớp với Model
        const updateData = {
            id: userId,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            dob: req.body.dob,
            name: req.body.fullName || req.body.fullname // Chấp nhận cả 2 định dạng từ Frontend
        };

        // Gọi hàm update đã được refactor trong Model
        const result = await Account.update(updateData);

        // TRẢ VỀ DỮ LIỆU MỚI: Rất quan trọng để Frontend (AuthContext) cập nhật giao diện ngay
        res.json(result); 
    } catch (err) {
        console.error("Update User Error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

// --- LẤY THÔNG TIN CHI TIẾT ---
module.exports.userProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const user = await Account.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        res.json(user);
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}

// --- ĐĂNG XUẤT ---
module.exports.logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });
    res.json({ message: "Logged out" });
}

// --- ĐỔI MẬT KHẨU ---
module.exports.changePassword = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;

        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const result = await Account.getPassword(userId);
        if (!result) return res.status(404).json({ error: "User not found" });
        
        // Kiểm tra mật khẩu cũ
        const match = await bcrypt.compare(currentPassword, result.password);
        if (!match) return res.status(400).json({ error: "Incorrect current password" });
        
        // Hash và lưu mật khẩu mới
        const hashed = await bcrypt.hash(newPassword, 10);
        await Account.changePassword(userId, hashed);

        res.json({ message: "Password updated successfully" });
    } catch (e) {
        console.error("Change Password Error:", e);
        res.status(500).json({ error: "Server error" });
    }
}