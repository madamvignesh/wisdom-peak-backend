const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const initializeDb = require('../models/userModel');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = await initializeDb();

  const userQuery = `SELECT * FROM users WHERE username = ?;`;
  const user = await db.get(userQuery, [username]);

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({username: username }, 'MY_SECRET_TOKEN');
  res.json({ jwtToken: token,user_id: user.user_id,});
};

module.exports = { loginUser };
