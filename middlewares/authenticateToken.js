const jwt = require('jsonwebtoken');
let current_user_id = null;
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'MY_SECRET_TOKEN');
    current_user_id = decoded.user_id;
    console.log('decoded: ', decoded);
    // req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken

