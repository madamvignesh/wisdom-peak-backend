const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const initializeDb = require('../models/userModel');

let current_id = null,current_username = null;

const addUser = async (req, res) => {
  const { username, password } = req.body;
  const db = await initializeDb()

  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const user = await db.get(query, [username]);

    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 12);

    const usersQuery = `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`;
    await db.run(usersQuery, [id, username, password_hash]);
    current_id = id;
    current_username = username;
    return res.json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const addUserDetails = async (req, res) => {
  const { email, phone, company, name } = req.body;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const db = await initializeDb();
  try {

    const query = `SELECT * FROM usersdetails WHERE id = ?`;
    const user = await db.get(query, [current_id]);

    if (user) {
      return res.status(400).json({ message: 'User details already exist' });
    }

    const userDetailsQuery = `
      INSERT INTO usersdetails (id, username, email, phone, company, name, created_at, update_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.run(userDetailsQuery, [
      current_id, current_username, email, phone, company, name, created_at, updated_at,
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
        const updateQuery = `
        UPDATE usersdetails
        SET update_at = ?
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
    const { id } = req.params;
    const db = await initializeDb();
  
    try {
      const userQuery = `SELECT * FROM users WHERE id = ?`;
      const user = await db.get(userQuery, [id]);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let deleteQuery = `DELETE FROM users WHERE id = ?`;
      await db.run(deleteQuery, [id]);
      deleteQuery = `DELETE FROM usersdetails WHERE id = ?`;
      await db.run(deleteQuery, [id]);
      return res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {
  addUser,
  addUserDetails,
  updateUser,
  deleteUser,
};
