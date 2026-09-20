const User = require('../models/User');
const { verifyToken } = require('../config/jwt');
const { asyncHandler } = require('./errorHandler');

/**
 * Protects a route. Expects the header:  Authorization: Bearer <jwt>
 * On success the authenticated user is available as req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401);
    throw new Error('Not authorised: token missing');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    res.status(401);
    throw new Error('Not authorised: token invalid or expired');
  }

  // Confirm the account still exists (e.g. it was not deleted after the token was issued).
  const user = await User.findById(decoded.id).select('_id email');
  if (!user) {
    res.status(401);
    throw new Error('Not authorised: user no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
