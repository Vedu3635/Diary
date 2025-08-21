// backend/controllers/taskController.js
const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  // console.log(req);
  try {
    // const { userId } = req.user;
    // const tasks = await Task.find({ userId: req.user });
    const tasks = await Task.find({ userId: req.user.userId });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, dueDate, status, priority, category } = req.body;
  try {
    const task = new Task({
      userId: req.user.userId,
      title,
      description,
      dueDate,
      status,
      priority,
      category,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, dueDate, status, priority, category } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, dueDate, status, priority, category },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
