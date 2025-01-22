const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid JWT Token' });
  }

  jwt.verify(token, 'MY_SECRET_TOKEN', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid JWT Token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
