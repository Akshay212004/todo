const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { idRule, createTaskRules, updateTaskRules } = require('../middleware/validators');

const router = express.Router();

// Every task route requires a valid JWT.
router.use(protect);

router.route('/').post(createTaskRules, createTask).get(getTasks);
router.route('/:id').put(updateTaskRules, updateTask).delete(idRule, deleteTask);
router.patch('/:id/complete', idRule, completeTask);

module.exports = router;
