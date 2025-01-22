const { open } = require('sqlite');
const initializeDb = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const db = await initializeDb();
  
    try {
      const query = `SELECT * FROM usersdetails;`;
      const users = await db.all(query);
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      return res.json(users);
    } catch (err) {
      console.error('Error fetching all users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserDetails = async (req, res) => {
    const { id } = req.params;
    const db = await initializeDb();    
    try {
      const query = `SELECT * FROM users WHERE id = ?`;
      const userDetails = await db.get(query, [id]);
  
      if (!userDetails) {
        return res.status(404).json({ message: 'User details not found' });
      }
  
      return res.json(userDetails);
    } catch (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    getUserDetails,
    getAllUsers,
};
