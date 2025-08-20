// backend/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  category: { type: String },
  recurrenceRule: { type: String },
  createdAt: { type: Date, default: Date.now },
});
// Indexes for performance
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, recurrenceRule: 1 });

module.exports = mongoose.model("Task", taskSchema);
