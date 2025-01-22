const jwt = require('jsonwebtoken');

const generateJWT = (payload) => {
  return jwt.sign(payload, 'MY_SECRET_TOKEN', { expiresIn: '1h' });
};

module.exports = generateJWT;
