const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const initializeDb = require('../models/userModel');
const toGetUser = require('../models/userModel');


const addUser = async (req, res) => {
  const { username, password, premium } = req.body;
  const db = await initializeDb()

  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const user = await db.get(query, [username]);

    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const password_hash = await bcrypt.hash(password, 12);

    const usersQuery = `INSERT INTO users (username, password, premium) VALUES (?, ?, ?)`;
    await db.run(usersQuery, [username, password_hash, premium]);
    return res.json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const addUserDetails = async (req, res) => {
  const { user_id } = req.params;

  const { email, phone, company, name } = req.body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const db = await initializeDb();
  
  try {

    const userDetailsQuery = `
      INSERT INTO customers (user_id, email, phone, company, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.run(userDetailsQuery, [
      user_id, email, phone, company, name, created_at, updated_at,
    ]);

    return res.json({ message: 'User details added successfully' });
  } catch (err) {
    console.error('Error adding user details:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updated_at = new Date().toISOString();
    const db = await initializeDb();
  
    try {
      const userQuery = `SELECT * FROM customers WHERE id = ?`;
      const user = await db.get(userQuery, [id]);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const updateQuery = `
      UPDATE customers
      SET updated_at = ?
      WHERE id = ?;
    `;
  
      await db.run(updateQuery, [updated_at, id]);
      return res.json({ message: 'User Status Updated successfully' });
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
  const db = await initializeDb();
  const {user_id,del_user_id} = req.params;
  try {
    let query =`SELECT * FROM users WHERE user_id = ?`;
    const request = await db.get(query, [user_id]);
    if(request.premium === 0){
      return res.status(401).json({error: 'Unauthorized access'});
    }


    const userQuery = `SELECT * FROM users WHERE user_id = ?`;
    const user = await db.get(userQuery, [del_user_id]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let deleteQuery = `DELETE FROM users WHERE user_id = ?`;
    await db.run(deleteQuery, [del_user_id]);

    return res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCustomer = async (req, res) => {
  const db = await initializeDb();
  const { user_id, id } = req.params;
  let query =`SELECT * FROM users WHERE user_id = ?`;
  const request = await db.get(query, [user_id]);
  if(request.premium === 0){
    return res.status(401).json({error: 'Unauthorized access'});
  }
  const deleteQuery = `
    DELETE FROM customers
    WHERE id = ?;
  `;

  const result = await db.run(deleteQuery, [id]);
  if (result.changes > 0) {
    return res.json({ message: 'Customer deleted successfully' });
  } else {
    return res.status(404).json({ error: 'No matching customer found or user is not premium' });
  }
}

module.exports = {
  addUser,
  addUserDetails,
  updateUser,
  deleteUser,
  deleteCustomer,
};
