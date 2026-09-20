const Task = require('../models/Task');
const { PRIORITIES, STATUSES } = require('../models/Task');
const { asyncHandler } = require('../middleware/errorHandler');

const notFound = (res) => {
  res.status(404);
  throw new Error('Task not found');
};

/** POST /api/tasks */
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  // userId always comes from the verified token, never from the request body.
  const task = await Task.create({
    title,
    description,
    deadline,
    priority,
    userId: req.user._id,
  });

  res.status(201).json({ task });
});

/** GET /api/tasks?status=Pending&priority=High  (both filters optional) */
exports.getTasks = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (PRIORITIES.includes(req.query.priority)) filter.priority = req.query.priority;

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json({ count: tasks.length, tasks });
});

/** PUT /api/tasks/:id  (partial updates allowed) */
exports.updateTask = asyncHandler(async (req, res) => {
  // Allow-list the fields so clients cannot change userId or createdAt.
  const updates = {};
  ['title', 'description', 'deadline', 'priority', 'status'].forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  // Filtering by userId as well as _id stops one user editing another user's task.
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) return notFound(res);
  res.json({ task });
});

/** DELETE /api/tasks/:id */
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) return notFound(res);
  res.json({ message: 'Task deleted', id: task._id });
});

/** PATCH /api/tasks/:id/complete */
exports.completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: 'Completed' },
    { new: true }
  );
  if (!task) return notFound(res);
  res.json({ task });
});
