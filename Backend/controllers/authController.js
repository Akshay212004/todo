const User = require('../models/User');
const { signToken } = require('../config/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

// Shape returned by both register and login.
const authResponse = (user) => ({
  token: signToken(user._id),
  user: { _id: user._id, email: user.email, createdAt: user.createdAt },
});

/** POST /api/auth/register */
exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (await User.findOne({ email })) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Password hashing happens in the User model's pre-save hook.
  const user = await User.create({ email, password });
  res.status(201).json(authResponse(user));
});

/** POST /api/auth/login */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password is `select: false` in the schema, so request it explicitly here.
  const user = await User.findOne({ email }).select('+password');

  // Same message for "no such user" and "wrong password" so accounts cannot be enumerated.
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json(authResponse(user));
});
