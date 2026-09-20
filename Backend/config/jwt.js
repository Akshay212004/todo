const jwt = require('jsonwebtoken');

/**
 * JWT helpers. The token payload only carries the user id; everything else
 * is looked up from the database on each request (see middleware/auth.js).
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
