const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }); // Filter by user
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

const createNewTask = async (req, res) => {
  if (!req?.body?.title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const result = await Task.create({
      title: req.body.title,
      desc: req.body.desc,
      completed: req.body.completed || false,
      dueDate: req.body.dueDate || undefined,
      priority: req.body.priority || 'low',
      user: req.user._id, // From auth middleware
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id; // Get ID from URL parameter
  const userId = req.user._id; // User ID from auth middleware
  const { title, desc, completed, dueDate, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId }, // Find task by ID AND verify ownership
      { title, desc, completed, dueDate, priority },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: 'Task not found or you do not have permission',
      });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user._id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found or you do not have permission',
      });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getAllTasks, createNewTask, updateTask, deleteTask };
