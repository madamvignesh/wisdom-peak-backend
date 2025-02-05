const express = require('express');
const cors = require('cors');
const {getUserDetails, getAllUsers, getAllUserData, getUsersData } = require('./controllers/userDetailsController');
const { loginUser } = require('./controllers/authController');
const { addUser, updateUser, deleteUser, addUserDetails, deleteCustomer } = require('./controllers/userController');
const authenticateToken = require('./middlewares/authenticateToken');


// const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes');
// const userDetailsRoutes = require('./routes/userDetailsRoutes');
const initializeDb = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    let db = await initializeDb();
    console.log('Connected to Database');

    app.post('/login', loginUser);
    app.post('/add', addUser);
    app.get('/', authenticateToken, getAllUsers);
    app.get('/alldata', authenticateToken, getAllUserData);
    app.get('/user', authenticateToken, getUserDetails);
    app.get('/users',authenticateToken, getUsersData)

    app.post('/addcustomer',authenticateToken, addUserDetails);  
    app.post('/update/:id', authenticateToken, updateUser);
    app.delete('/deletecustomer/:id', authenticateToken, deleteCustomer);
    app.delete('/deleteuser/:user_id', authenticateToken, deleteUser)

    app.listen(8081, async () => {
      const query = `
        SELECT name FROM sqlite_master WHERE type='table';
      `;
      const user = await db.all(query);
      console.log(user);

      console.log('Server running on http://localhost:8081/');
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

startServer();