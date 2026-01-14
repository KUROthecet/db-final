const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng nhập dành cho Admin (Manager)
module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findManagerByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Kiểm tra quyền hạn: Role 3 mới được vào Admin
        if (user.role !== 3) {
            return res.status(403).json({ error: 'You do not have permission to login here' });
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
            secure: false, // Đổi thành true nếu chạy HTTPS
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
        console.error("Admin Signin Error:", err);
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

// Lấy thông tin cá nhân Admin
module.exports.getProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const manager = await Account.findManagerById(id);
        if (!manager) return res.status(404).json({ error: "Manager not found" });
        res.json(manager);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Cập nhật thông tin Admin
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Kiểm tra quyền: Chỉ được sửa chính mình
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }

        // Gọi hàm update thông minh từ Model
        const updatedData = await Account.update({
            ...req.body,
            id: userId,
            name: req.body.fullName || req.body.fullname
        });

        // Trả về dữ liệu đã cập nhật để Frontend (AuthContext) đồng bộ hóa State
        res.json(updatedData);
    } catch (err) {
        console.error("Admin Update Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Đổi mật khẩu Admin
module.exports.changePassword = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;

        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const user = await Account.getPassword(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const hashedPass = await bcrypt.hash(newPassword, 10);
        await Account.changePassword(userId, hashedPass);
        
        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Admin Change Pass Error:", err);
        res.status(500).json({ error: "Server error" });
    }
}