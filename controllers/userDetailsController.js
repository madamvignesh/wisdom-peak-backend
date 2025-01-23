const { open } = require('sqlite');
const initializeDb = require('../models/userModel');


const getAllUsers = async (req, res) => {
  const db = await initializeDb();
  const { search, company } = req.body; // Extract the 'search' query parameter

  try {
    let query = `SELECT * FROM customers`;
    let conditions = [];
    let params = [];
    if (search) {
        conditions.push(`(name LIKE ? OR email LIKE ? OR phone LIKE ?)`);
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    if (company) {
        conditions.push(`company = ?`);
        params.push(company);
    }
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    const users = await db.all(query, params);

    if (users.length === 0) {
        return res.status(404).json({ message: 'No customers found' });
    }

    return res.json(users);
  } catch (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ error: 'Internal server error' });
  }
};


const getUserDetails = async (req, res) => {
  const {current_id}= req.auth;
  const db = await initializeDb();    
  try {
    const query = `SELECT * FROM customers WHERE user_id = ?`;
    const userDetails = await db.all(query, [current_id]);

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    return res.json(userDetails);
  } catch (err) {
    console.error('Error fetching user details:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllUserData = async (req, res) => {
  const {current_id}= req.auth;
  const db = await initializeDb();

  try {
    const query = `SELECT * FROM customers INNER JOIN users ON customers.user_id = users.user_id WHERE customers.user_id = ?`;
    const userDetails = await db.all(query, [current_id]);

    if(!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }
    res.json(userDetails);
  } catch (err) {
    console.error('Error fetching user details:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    getUserDetails,
    getAllUsers,
    getAllUserData,
};
