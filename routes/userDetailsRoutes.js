const express = require('express');
const {getUserDetails, getAllUsers } = require('../controllers/userDetailsController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserDetails);




module.exports = router;
