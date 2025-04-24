const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  if (!tasks) return res.status(204).json({ message: 'No task found' });
  res.json(tasks);
};

const createNewTask = async (req, res) => {
  if (!req.body.title)
    return res.status(400).json({ message: 'Title is required' });
  try {
    const result = await Task.create({
      title: req.body.title,
      desc: req.body.desc,
      completed: req.body.completed,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createNewTask, getAllTasks };
