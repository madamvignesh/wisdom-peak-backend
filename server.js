const express = require('express');
const { open } = require('sqlite');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'wisdompeakusersdata.db');
let db = null, current_id = null, current_name = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8081, () => {
      console.log(`Server Running at http://localhost:8081/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers['authorization'];
  console.log(authHeader);
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send('Invalid JWT Token');
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401);
        response.send('Invalid JWT Token');
      } else {
        next();
      }
    });
  }
};

app.post('/login/', async (request, response) => {
  const { name, password } = request.body;
  const getuserDetails = `
    SELECT * FROM users WHERE name = '${name}'`;
  const user = await db.get(getuserDetails);

  if (user === undefined) {
    response.status(400);
    response.send('Invalid user');
  } else {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid === true) {
      const payload = {
        name: name,
      };
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send('Invalid password');
    }
  }
});

app.get('/:id', authenticateToken, async (request, response) => {
  const { id } = request.params;
  let query = `
    SELECT * FROM usersdetails WHERE id == ?;
  `;
  try {
    const users = await db.get(query, [id]);
    response.json(users);
  } catch (error) {
    response.status(500).json(error);
  }
});

app.get('/', authenticateToken, async (request, response) => {
  let query = `
    SELECT * FROM usersdetails;
  `;
  try {
    const users = await db.all(query);
    response.json(users);
  } catch (error) {
    response.status(500).json(error);
  }
});

app.post('/add', async (request, response) => {
  const { name, password } = request.body;
  const id = uuidv4();
  try {
    const password_hash = await bcrypt.hash(password, 12);
    const usersQuery = `
      INSERT INTO users (id, name, password)
      VALUES (?, ?, ?)
    `;
    await db.run(usersQuery, [id, name, password_hash]);
    current_id = id;
    current_name = name;
    response.json({ message: "Move /add/details step" });
  } catch (error) {
    console.error("Error adding user:", error);
    response.status(500).json(error);
  }
});

app.post('/add/details', async (request, response) => {
  const { email, phone, company } = request.body;
  try {
    if (!current_id || !current_name) {
      return response.status(400).json({ error: "User ID or name not found. Complete the '/add' step first." });
    }
    const userDetailsQuery = `
      INSERT INTO usersdetails (id, name, email, phone, company)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(userDetailsQuery, [current_id, current_name, email, phone, company]);
    current_id = null;
    current_name = null;
    response.json({ message: "User details added successfully to 'usersdetails' table!" });
  } catch (err) {
    console.error("Error adding user details:", err);
    response.status(500).json(err);
  }
});

app.post('/update/:id', authenticateToken, async (request, response) => {
  const { id } = request.params;
  const updated_at = new Date().toISOString();

  try {
    const updateQuery = `
      UPDATE usersdetails
      SET update_at = ?
      WHERE id = ?;
    `;
    await db.run(updateQuery, [updated_at, id]);

    response.json({ message: `User with ID ${id} updated successfully.` });
  } catch (error) {
    console.error("Error updating user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/delete/:id', authenticateToken, async (request, response) => {
  const { id } = request.params;

  try {
    let deleteQuery = `DELETE FROM usersdetails WHERE id = ?;`;
    await db.run(deleteQuery, [id]);
    deleteQuery = `DELETE FROM users WHERE id = ?;`;
    let result = await db.run(deleteQuery, [id]);

    if (result.changes > 0) {
      response.json({ message: `User with ID ${id} deleted successfully.` });
    } else {
      response.status(404).json({ error: `User with ID ${id} not found.` });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

