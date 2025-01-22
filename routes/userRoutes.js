const express = require('express');
const { addUser, updateUser, deleteUser, addUserDetails } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/add', addUser);
router.post('/add/details', addUserDetails);  
router.post('/update/:id', authenticateToken, updateUser);
router.delete('/delete/:id', authenticateToken, deleteUser);


module.exports = router;
