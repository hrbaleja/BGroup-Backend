const express = require('express');
const router = express.Router();


const { protect } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.route('/tasks')
  .get(protect, taskController.getTasks)
  .post(protect, taskController.createTask);

router.route('/tasks/:id')
  .put(protect, taskController.updateTask)
  .delete(protect, taskController.deleteTask);


module.exports = router;