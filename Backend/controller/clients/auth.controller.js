
const Account = require("../../model/accountUser.model");
const pool = require('../../config/pool'); // Import pool to get client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findByEmail(email);

        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }

        // Logic check role strictness removed here to allow flexible login 
        // OR enforce it strictly based on route. 
        // For /auth/signin (Customer), we expect role 1.
        if (req.baseUrl.includes('employee') && user.role !== 2) return res.status(403).json({error: "Access denied"});
        if (req.baseUrl.includes('manager') && user.role !== 3) return res.status(403).json({error: "Access denied"});
        
        // Client login allows only customers
        if (!req.baseUrl.includes('employee') && !req.baseUrl.includes('manager') && user.role !== 1) {
             return res.status(403).json({ error: 'Please login via Employee Portal' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Set true in production
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

module.exports.signup = async(req, res) => {
    const client = await pool.connect(); // GET DEDICATED CLIENT
    try {
        const {name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password and name are required' });
        }

        const existing = await Account.findByEmail(email);
        if (existing) {
            client.release();
            return res.status(400).json({ error: 'User already exists' });
        }

        await client.query('BEGIN'); // Start Transaction

        const hashedPassword = await bcrypt.hash(password, 10);

        // Pass client to model methods to ensure they run in the transaction
        const accountData = { email, password: hashedPassword };
        const newAccount = await Account.signUp(accountData, client);
        
        const customerData = { id: newAccount.id, name: name };
        await Account.addCus(customerData, client);

        await client.query('COMMIT'); // Commit Transaction
        
        return res.status(201).json({
            message: 'Signup successful',
            user: { email, fullname: name }
        });

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error("Signup Error:", err);
        res.status(500).json({ error: 'Server error during signup' });
    } finally {
        client.release(); // Release client back to pool
    }
}

module.exports.updateUser = async(req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  const data = {
    name: req.body.fullName || req.body.name, // Support both formats
    email: req.body.email,
    id: userId,
    phone: req.body.phone,
    address: req.body.address,
    dob: req.body.dob,
  }

  try {
    const result = await Account.update(data);
    res.json(result); 
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports.userProfile = async(req, res) => {
  const userId = parseInt(req.params.id);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  const user = await Account.findById(userId);
  if(!user) return res.status(404).json({error: "User not found"});
  
  res.json(user);
}

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });
  res.json({ message: "Logged out" });
}

module.exports.changePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const {currentPassword, newPassword} = req.body;
  
  try {
      const result = await Account.getPassword(userId);
      if(!result) return res.status(404).json({error: "User not found"});
      
      const match = await bcrypt.compare(currentPassword, result.password);
      if(!match) return res.status(400).json({error: "Incorrect password"});
      
      const hashed = await bcrypt.hash(newPassword, 10);
      await Account.changePassword(userId, hashed);
      res.json({message: "Password updated"});
  } catch(e) {
      console.error(e);
      res.status(500).json({error: "Server error"});
  }
}
