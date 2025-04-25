const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');

router
  .route('/')
  .get(tasksController.getAllTasks)
  .post(tasksController.createNewTask);

router
  .route('/:id')
  .put(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
