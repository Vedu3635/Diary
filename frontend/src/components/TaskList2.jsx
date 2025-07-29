import React from "react";
import {
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  User,
} from "lucide-react";

const TaskList2 = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  theme,
}) => {
  const getPriorityColor = (priority) => {
    const colors = {
      low:
        theme === "dark"
          ? "bg-green-900/20 text-green-400"
          : "bg-green-100 text-green-800",
      medium:
        theme === "dark"
          ? "bg-yellow-900/20 text-yellow-400"
          : "bg-yellow-100 text-yellow-800",
      high:
        theme === "dark"
          ? "bg-orange-900/20 text-orange-400"
          : "bg-orange-100 text-orange-800",
      urgent:
        theme === "dark"
          ? "bg-red-900/20 text-red-400"
          : "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      "To Do":
        theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700",
      "In Progress":
        theme === "dark"
          ? "bg-blue-900/20 text-blue-400"
          : "bg-blue-100 text-blue-800",
      Completed:
        theme === "dark"
          ? "bg-green-900/20 text-green-400"
          : "bg-green-100 text-green-800",
    };
    return colors[status] || colors["To Do"];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (tasks.length === 0) {
    return (
      <div
        className={`text-center py-12 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p>Create your first task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleStatus(task._id)}
                className={`${
                  theme === "dark"
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-500 hover:text-blue-600"
                } transition-colors`}
              >
                {task.status === "Completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <h3
                className={`font-semibold ${
                  task.status === "Completed" ? "line-through" : ""
                } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {task.title}
              </h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  onEditTask(task);
                }}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:bg-gray-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteTask(task._id)}
                className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:bg-red-900 hover:text-red-400"
                    : "text-gray-500 hover:bg-red-100 hover:text-red-600"
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`text-sm mb-3 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {task.category && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  theme === "dark"
                    ? "bg-purple-900/20 text-purple-400"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {task.category}
              </span>
            )}
          </div>

          <div
            className={`space-y-1 text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList2;
