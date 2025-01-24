# Wisdom Peak Backend

This repository contains the backend implementation for the **Wisdom Peak** project. The backend is designed to provide robust and scalable APIs to support the project's core functionalities.

---

## Features

- **API Endpoints:** RESTful API to manage various resources.
- **Database Integration:** Seamless connection with a database to store and retrieve information.
- **Authentication & Authorization:** Secure user authentication and role-based access control.
- **Error Handling:** Comprehensive error-handling mechanisms to ensure stability.

---

## Tech Stack

- **Programming Language:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) / [MySQL](https://www.mysql.com/) (specify based on usage)
- **Authentication:** [JWT](https://jwt.io/)

---

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/madamvignesh/wisdom-peak-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd wisdom-peak-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=3000
     DB_URI=<your-database-uri>
     JWT_SECRET=<your-jwt-secret>
     ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Access the server at `http://localhost:3000`.

---

## API Documentation

### Endpoints

#### Authentication
- `POST /login` - Authenticate and log in a user.

#### User Management
- `POST /add` - Add a new user.
- `GET /` - Get all users (requires authentication).
- `GET /users` - Get user data (requires authentication).
- `POST /addcustomer` - Add customer details (requires authentication).
- `POST /update/:id` - Update user details by ID (requires authentication).
- `DELETE /deleteuser/:user_id` - Delete a user by user ID (requires authentication).

#### Customer Management
- `GET /alldata` - Get all customer data (requires authentication).
- `GET /user` - Get specific user details (requires authentication).
- `DELETE /deletecustomer/:id` - Delete a customer by ID (requires authentication).

---

## Folder Structure

```
wisdom-peak-backend/

├── controllers/  # Request handlers
├── config/        # Assist to the Database
├── models/       # Database models
├── routes/       # API routes
├── middlewares/  # Custom middleware functions
├── utils/        # Utility functions
├── app.http       # Request Send Here
├── server.js         # Node js Code
├── wisdompeakusersdata.db         # Database
├── package.json      # Project configuration
└── README.md         # Project documentation
```

---

## Methods Overview

### User Management

#### Add User
```javascript
app.post('/add', addUser);
```
Adds a new user to the database. Ensures unique usernames and encrypts passwords using bcrypt.

#### Update User
```javascript
app.post('/update/:id', authenticateToken, updateUser);
```
Updates user details, including timestamps for modifications.

#### Delete User
```javascript
app.delete('/deleteuser/:user_id', authenticateToken, deleteUser);
```
Deletes a user and associated customer data from the database.

### Customer Management

#### Add Customer
```javascript
app.post('/addcustomer', authenticateToken, addUserDetails);
```
Adds customer details associated with a user.

#### Get All Customers
```javascript
app.get('/alldata', authenticateToken, getAllUserData);
```
Fetches all customer data linked to the current authenticated user.

#### Get Specific Customer Details
```javascript
app.get('/user', authenticateToken, getUserDetails);
```
Fetches customer details based on the authenticated user.

#### Delete Customer
```javascript
app.delete('/deletecustomer/:id', authenticateToken, deleteCustomer);
```
Deletes a specific customer record.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any inquiries, feel free to reach out:
- **Email:** madamvignesh
- **GitHub:** [madamvignesh](https://github.com/madamvignesh)
