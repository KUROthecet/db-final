const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const { parse } = require("dotenv");
const jwt = require('jsonwebtoken');

module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findManagerByEmail(email);

        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 3) {
            return res.status(403).json({ error: 'You do not have permission to login here' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '3h',
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict"
        });

        res.json({ message: 'Login successful', user: {
          id: user.id,
          role: user.role,
          email: user.email,
          fullname: user.fullname,
        } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });
  res.json({ message: "Logged out" });
}

module.exports.getProfile = async (req, res) => {
    try {
        const id  = parseInt(req.params.id);
        const manager = await Account.findManagerById(id);
        res.json(manager);
    } catch (err) {
        onsole.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }
        const result = await Account.updateManager(req.body, userId);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result);
    } catch (err) {
        onsole.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.changePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const {currentPassword, newPassword} = req.body;
  if (req.user.id != userId) {
    return res.status(403).json({ error: "You can only change your own password" });
  }

  const result = await Account.getPassword(userId);
  if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
  }

  const hashedPassword = result.password;

  const match = await bcrypt.compare(currentPassword, hashedPassword);
  if (!match) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await Account.changePassword(userId, newHashedPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password failed:", err);
    res.status(500).json({ error: "Server error" });
  }
}