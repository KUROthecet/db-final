const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng nhập dành cho Nhân viên
module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findEmployeeByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Kiểm tra quyền hạn: Role 2 mới được vào Employee Portal
        if (user.role !== 2) {
            return res.status(403).json({ error: 'Access denied. Staff only.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
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
        console.error("Employee Signin Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Đăng xuất
module.exports.logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });
    res.json({ message: "Logged out" });
}

// Cập nhật Profile Nhân viên
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }

        // Gọi hàm update từ Model và nhận về dữ liệu mới
        const updatedUser = await Account.update({
            ...req.body,
            id: userId,
            name: req.body.fullName || req.body.fullname
        });

        // QUAN TRỌNG: Trả về object User mới để Frontend không bị mất dữ liệu State
        res.json(updatedUser);
    } catch (err) {
        console.error("Employee Update Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

// Lấy thông tin chi tiết nhân viên
module.exports.userProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const result = await Account.findEmployeeById(userId);
        if (!result) return res.status(404).json({ error: "User not found" });

        res.json(result);
    } catch (err) {
        console.error("Get employee profile error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

// Đổi mật khẩu Nhân viên
module.exports.changePassword = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;

        if (req.user.id != userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const user = await Account.getPassword(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await Account.changePassword(userId, hashed);
        
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Employee Change Password Error:", err);
        res.status(500).json({ error: "Server error" });
    }
}