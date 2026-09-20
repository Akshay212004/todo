const { body, param, validationResult } = require('express-validator');
const { PRIORITIES, STATUSES } = require('../models/Task');

/** Turns express-validator results into a single 400 response. */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({ message: errors[0].message, errors });
};

const email = body('email')
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage('Please provide a valid email address');

const registerRules = [
  email,
  // bcrypt only uses the first 72 bytes, so cap the length.
  body('password')
    .isLength({ min: 6, max: 72 })
    .withMessage('Password must be between 6 and 72 characters'),
  validate,
];

const loginRules = [
  email,
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const idRule = [param('id').isMongoId().withMessage('Invalid task id'), validate];

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('deadline')
    .notEmpty().withMessage('Deadline is required')
    .isISO8601().withMessage('Deadline must be a valid date'),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage('Priority must be Low, Medium or High'),
  validate,
];

// Same fields as create, but every one is optional (partial update).
const updateTaskRules = [
  ...idRule,
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('deadline')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid date'),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage('Priority must be Low, Medium or High'),
  body('status')
    .optional()
    .isIn(STATUSES).withMessage('Status must be Pending or Completed'),
  validate,
];

module.exports = { registerRules, loginRules, idRule, createTaskRules, updateTaskRules };
