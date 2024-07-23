// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const TaskController = require('../../controllers/overview/taskController');

router.route('/')
  .get( TaskController.getTasks)
  .post(TaskController.createTask);

router.route('/:id')
  .put( TaskController.updateTask)
  .delete(TaskController.deleteTask)
  .get( TaskController.getTasksByStatus);

module.exports = router;