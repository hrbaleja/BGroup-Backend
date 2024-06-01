// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.route('/')
  .get(protect, taskController.getTasks)
  .post(protect, taskController.createTask);

router.route('/:id')
  .put(protect, taskController.updateTask)
  .delete(protect, taskController.deleteTask)
  .get(protect, taskController.getTasksByStatus);

module.exports = router;